"use client";

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
  Text,
  VStack,
  FormErrorMessage,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { app, auth } from "../../../firebase/firebaseConfig";
import { useContext, useState } from "react";
import { Link } from "@chakra-ui/next-js";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/firebase/AuthContext";

type RegisterFormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), "password"], "Passwords must match")
    .required("Confirm password is required"),
  acceptTerms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});

const Register = () => {
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);

  const router = useRouter();

  if (currentUser) {
    router.push("/");
  }

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });
  const [firebaseError, setFirebaseError] = useState("");

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      console.log(data);
      await createUserWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      const errorCode = (error as any).code;
      const errorMessage = (error as any).message;
      if (errorCode == "auth/email-already-in-use") {
        setFirebaseError("User with provided email already exists.");
      }
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      w={{ base: "300px", md: "600px", lg: "900px" }}
      mx="auto"
      mt={8}
      p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-lg text-center font-bold">REGISTER</h1>
        {firebaseError && (
          <Alert
            status="error"
            mb={4}>
            <AlertIcon />
            {firebaseError}
          </Alert>
        )}
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.email?.message}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Email"
              {...register("email")}
            />
            <Text color="red.500">{errors.email?.message}</Text>
          </FormControl>
          <FormControl isInvalid={!!errors.username?.message}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Username"
              {...register("username")}
            />
            <Text color="red.500">{errors.username?.message}</Text>
          </FormControl>
          <FormControl isInvalid={!!errors.password?.message}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            <Text color="red.500">{errors.password?.message}</Text>
          </FormControl>
          <FormControl isInvalid={!!errors.confirmPassword?.message}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
            />
            <Text color="red.500">{errors.confirmPassword?.message}</Text>
          </FormControl>
          <FormControl isInvalid={!!errors.acceptTerms?.message}>
            <Checkbox {...register("acceptTerms")}>
              Accept the terms and conditions
            </Checkbox>
            <Text color="red.500">{errors.acceptTerms?.message}</Text>
          </FormControl>
          <Button
            className="bg-blue-500"
            variant="solid"
            type="submit"
            colorScheme="blue">
            Register
          </Button>
        </VStack>
      </form>
      <Text
        mt={4}
        textAlign="center">
        Do you have an account yet?{" "}
        <Link
          color="blue.500"
          href="/login">
          Click to login
        </Link>
      </Text>
    </Box>
  );
};

export default Register;
