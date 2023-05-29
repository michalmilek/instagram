"use client";

import { useContext, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Slide,
  VStack,
  Avatar,
  Text,
  useToast,
  useBreakpointValue,
  Spinner,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { faker } from "@faker-js/faker";
import { AuthContext } from "@/firebase/AuthContext";
import { auth, db } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { Alert, AlertIcon } from "@chakra-ui/react";
import UploadPost from "./UploadPost";
import {
  collection,
  addDoc,
  DocumentData,
  CollectionReference,
  doc,
  getDoc,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { getUserByUID } from "@/services/firebaseMethods";
import { UserData } from "@/types";

const InstagramLogout = ({
  handleRefetchPosts,
}: {
  handleRefetchPosts: () => void;
}) => {
  const toast = useToast();
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);

  const logoutWidth = useBreakpointValue({
    base: "80px",
    md: "100px",
    lg: "200px",
    xl: "340px",
  });

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery(["user", currentUser.uid], () => getUserByUID(currentUser.uid));

  if (isLoading) {
    return <Spinner size="lg" />;
  }

  if (isError) {
    return <div>Error occurred while fetching user data.</div>;
  }

  const renderSuggestedFriends = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Box
        key={index}
        gap={{ base: 1, lg: 0 }}
        display="flex"
        flexDirection={{ base: "column", lg: "row" }}
        textAlign={{ base: "center", lg: "left" }}
        alignItems={{ base: "center", md: "center" }}
        my={2}>
        <Avatar
          size="sm"
          name={faker.person.firstName()}
          src={faker.image.avatar()}
          mr={{ base: 0, lg: 2 }}
          mb={{ base: 2, lg: 0 }}
        />
        <Text
          w={{ base: "100%", lg: "80px" }}
          fontSize={{ base: "xs", md: "sm" }}
          ml={{ base: 0, lg: 2 }}>
          {faker.person.firstName()}
        </Text>
        <Button
          fontSize={{ base: "xs", md: "sm" }}
          ml={{ base: 0, lg: 2 }}>
          Follow
        </Button>
      </Box>
    ));
  };

  const handleLogout = (): void => {
    signOut(auth)
      .then(() => {
        // Wylogowanie zakończone powodzeniem
        // Wyświetlanie alertu z informacją o wylogowaniu
        showAlert("Zostałeś wylogowany.", "success");
        window.location.reload();
      })
      .catch((error) => {
        // Wystąpił błąd podczas wylogowywania
        // Wyświetlanie alertu z informacją o błędzie
        showAlert("Wystąpił błąd podczas wylogowywania.", "error");
      });
  };

  const showAlert = (message: string, status: "success" | "error"): void => {
    switch (status) {
      case "success":
        toast({
          title: message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        break;
      case "error":
        toast({
          title: message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        break;
      default:
        break;
    }
  };
  return (
    <Box
      zIndex={2}
      position="fixed"
      w={logoutWidth}
      top="0"
      h="100vh"
      right="20px">
      <VStack
        w={logoutWidth}
        spacing={4}
        bg="white"
        boxShadow="md"
        p={4}
        pos="absolute"
        top="50%"
        right="0"
        transform="translateY(-50%)">
        <UploadPost handleRefetchPosts={handleRefetchPosts} />
        <Box
          display="flex"
          gap={4}
          alignItems="center"
          flexDirection={{ base: "column", xl: "row" }}
          my={2}>
          <Avatar
            size="sm"
            name={currentUser.email}
            src={(userData as UserData)?.profileAvatar}
          />
          <Text
            display={{ base: "none", lg: "block" }}
            ml={2}>
            {currentUser.email}
          </Text>
          <Button
            variant="link"
            color="gray.500"
            onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Box
          textAlign="center"
          py={2}
          borderBottomWidth="1px">
          <Text
            fontSize={{ base: "sm", lg: "md" }}
            fontWeight="bold">
            Suggested Friends
          </Text>
        </Box>
        <VStack
          align="flex-start"
          spacing={2}
          mt={2}>
          {renderSuggestedFriends()}
        </VStack>
      </VStack>
    </Box>
  );
};

export default InstagramLogout;
