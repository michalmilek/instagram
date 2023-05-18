"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../firebase/firebaseConfig";
import { User } from "firebase/auth";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  FacebookAuthProvider,
} from "firebase/auth";

interface UserProviderData {
  providerId: string;
  uid: string;
  displayName: string | null;
  email: string;
  phoneNumber: string | null;
  photoURL: string | null;
}

interface UserStsTokenManager {
  refreshToken: string;
  accessToken: string;
  expirationTime: number;
}

interface UserInterface {
  uid: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  providerData: UserProviderData[];
  stsTokenManager: UserStsTokenManager;
  createdAt: string;
  lastLoginAt: string;
  apiKey: string;
  appName: string;
}

interface AuthContextProps {
  currentUser: User | null;
  googleSignIn: any;
  facebookSignIn: any;
}

// Tworzenie kontekstu
export const AuthContext = createContext<AuthContextProps | null>(null);

// Komponent dostawcy kontekstu
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subskrybuj zmiany stanu uwierzytelnienia użytkownika
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Oczyszczanie subskrypcji
    return () => unsubscribe();
  }, []);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const _user = result.user;
      })
      .catch((error) => {
        // Wystąpił błąd podczas logowania
        console.error("Google login error", error);
      });
  };

  const facebookSignIn = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Logowanie zakończone powodzeniem
        const _user = result.user;
        // Możesz podjąć dalsze działania po zalogowaniu, np. zaktualizować stan currentUser itp.
      })
      .catch((error) => {
        // Wystąpił błąd podczas logowania
        console.error("Facebook login error", error);
      });
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <AuthContext.Provider value={{ currentUser, googleSignIn, facebookSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};
