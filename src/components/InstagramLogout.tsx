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
} from "firebase/firestore";

const InstagramLogout = () => {
  const toast = useToast();
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);

  const addDocumentToCollection = async (
    collectionName: string,
    documentData: DocumentData
  ): Promise<void> => {
    try {
      const collectionRef: CollectionReference<DocumentData> = collection(
        db,
        collectionName
      );
      const docRef = await addDoc(collectionRef, documentData);
      console.log("Document added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const renderSuggestedFriends = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Box
        key={index}
        display="flex"
        alignItems="center"
        my={2}>
        <Avatar
          size="sm"
          name={faker.person.firstName()}
          src={faker.image.avatar()}
        />
        <Text
          w={40}
          ml={2}>
          {faker.person.firstName()}
        </Text>
        <Button ml={4}>Follow</Button>
      </Box>
    ));
  };

  const handleLogout = (): void => {
    signOut(auth)
      .then(() => {
        // Wylogowanie zakończone powodzeniem
        // Wyświetlanie alertu z informacją o wylogowaniu
        showAlert("Zostałeś wylogowany.", "success");
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
      position="fixed"
      w="400px"
      top="0"
      h="100vh"
      right="20px">
      <VStack
        spacing={4}
        bg="white"
        boxShadow="md"
        p={4}
        pos="absolute"
        top="50%"
        right="0"
        transform="translateY(-50%)">
        <Button
          onClick={async () => {
            /*  await addDocumentToCollection("test", { test: "test" }); */
          }}
          variant="link">
          TEST
        </Button>
        <UploadPost />
        <Box
          display="flex"
          gap={4}
          alignItems="center"
          my={2}>
          <Avatar
            size="sm"
            name={currentUser.email}
            src={
              currentUser?.photoURL
                ? currentUser?.photoURL
                : faker.image.avatar()
            }
          />
          <Text ml={2}>{currentUser.email}</Text>
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
          <Text fontWeight="bold">Suggested Friends</Text>
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
