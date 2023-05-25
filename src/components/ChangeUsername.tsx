"use client";

import { useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { AuthContext } from "@/firebase/AuthContext";
import { updateUserProfileUsername } from "@/services/firebaseMethods";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

// Schema Yup do walidacji nazwy użytkownika
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .test(
      "is-username-available",
      "User with provided username already exists",
      async function (value) {
        if (!value) return true;

        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, where("username", "==", value));
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty;
      }
    ),
});

interface ChooseUsernameProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  username: string;
}

const ChangeUsername: React.FC<ChooseUsernameProps> = ({ isOpen, onClose }) => {
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateUserProfileUsername(currentUser.uid, data.username);
      onClose();
      reset();
    } catch (error) {
      console.error("Błąd podczas zapisywania danych:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose your username</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              isInvalid={!!errors.username}
              mb={4}>
              <FormLabel>Username:</FormLabel>
              <Input {...register("username")} />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              className="bg-blue-500"
              type="submit">
              Submit
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangeUsername;
