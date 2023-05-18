"use client";

import { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { FirebaseError } from "firebase/app";
import useAlert from "@/utils/useAlert";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firebaseError, setFirebaseError] = useState("");
  const [position, setPosition] = useState<any>(null);
  const showAlert = useAlert();

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      (newPos) => setPosition(newPos),
      console.error
    );
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (credentials) => {
          console.log(credentials);
          showAlert("User logged in succesfully.", "success");
        }
      );
    } catch (error) {
      const errorCode = (error as FirebaseError).code;
      if (errorCode == "auth/user-not-found") {
        setFirebaseError("User with provided email doesnt exist.");
      }
      if (errorCode == "auth/wrong-password") {
        setFirebaseError("Wrong password.");
      }
    }
  };

  return (
    <Box
      mb={50}
      w="full"
      mx="auto"
      mt={8}
      p={4}>
      <FormControl>
        {firebaseError && (
          <Alert
            status="error"
            mb={4}>
            <AlertIcon />
            {firebaseError}
          </Alert>
        )}
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Flex
        justify="center"
        direction="column">
        <Button
          className="bg-blue-500"
          mt={4}
          colorScheme="blue"
          onClick={handleLogin}>
          Login
        </Button>
        <Text
          mt={5}
          textAlign="center">
          Don&apos;t have an account?{" "}
          <Link
            color="blue.400"
            colorScheme="blue"
            href="/register">
            Register now
          </Link>
        </Text>
      </Flex>
    </Box>
  );
};

export default LoginForm;
