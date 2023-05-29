"use client";

import Login from "@/components/Login";
import { Box, Button } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, auth } from "../../../firebase/firebaseConfig";
import { AuthContext } from "@/firebase/AuthContext";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  //@ts-ignore
  const { currentUser, googleSignIn, facebookSignIn } = useContext(AuthContext);

  const router = useRouter();

  const handleLoginWithGoogle = async () => {
    try {
      await googleSignIn().then(() => router.push("/"));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginWithFacebook = async () => {
    try {
      await facebookSignIn();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Box
        w={{ base: "300px", md: "600px", lg: "900px" }}
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        boxShadow="md"
        mt={8}>
        <h1 className="text-center text-lg font-bold">LOGIN</h1>
        <Login />
        <Box
          className="mt-10"
          gap={4}
          display="flex"
          flexDirection="column"
          mt={4}>
          <Button
            className="bg-red-700"
            colorScheme="red"
            leftIcon={<FaGoogle />}
            onClick={handleLoginWithGoogle}>
            Login with Google
          </Button>
          <Button
            className="bg-blue-600"
            colorScheme="facebook"
            leftIcon={<FaFacebook />}
            mt={2}
            onClick={handleLoginWithFacebook}>
            Login with Facebook
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default LoginPage;
