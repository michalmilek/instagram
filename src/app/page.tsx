"use client";

import Sidebar from "@/components/Sidebar";
import StoriesCarousel from "@/components/StoriesCarousel";
import Post from "@/components/Post";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "@/firebase/AuthContext";
import InstagramLogout from "@/components/InstagramLogout";
import * as firebase from "firebase/app";
import "@firebase/firestore";
import { collection, doc, getDoc, setDoc } from "@firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Button } from "@chakra-ui/react";
import ChooseUsername from "@/components/ChooseUsername";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "@/services/firebaseMethods";
import { PostData } from "@/types";

interface User {
  uid: string;
  username: string;
  email: string;
}

export default function Home() {
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: postsData,
    isLoading,
    isError,
    refetch: refetchPosts,
  } = useQuery(["posts"], () => getAllPosts());

  const handleRefetchPosts = () => {
    refetchPosts();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  console.log(currentUser.uid);

  if (!currentUser) {
    router.push("/login");

    return <div>User not logged in</div>;
  }

  const usersRef = collection(db, "users");
  async function checkIfUserExists(uid: string): Promise<boolean> {
    const userDocRef = doc(usersRef, uid);
    const userDocSnapshot = await getDoc(userDocRef);
    return userDocSnapshot.exists();
  }

  checkIfUserExists(currentUser.uid)
    .then((exists) => {
      if (exists) {
        return null;
      } else {
        openModal();
      }
    })
    .catch((error) => {
      console.error("Error while checking document:", error);
    });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex items-center">
        <Sidebar />
        <div className="ml-[250px] mr-[400px] flex flex-col items-center gap-10">
          <StoriesCarousel />
          <div className="flex flex-col gap-6">
            {(postsData as PostData[])?.map((post) => (
              <Post
                post={post}
                key={post.id}
              />
            ))}
          </div>
        </div>
        <InstagramLogout handleRefetchPosts={handleRefetchPosts} />
      </div>
      <ChooseUsername
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </main>
  );
}
