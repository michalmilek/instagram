import { useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
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
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "@firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { AuthContext } from "@/firebase/AuthContext";

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

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  username: string;
}

const ChooseUsername: React.FC<UserModalProps> = ({ isOpen, onClose }) => {
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Wykonaj operacje po zatwierdzeniu formularza
      console.log("Wybrana nazwa użytkownika:", data.username);
      await setDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        username: watch("username"),
        profileAvatar:
          "https://firebasestorage.googleapis.com/v0/b/custominsta-ffac5.appspot.com/o/profilepic.png?alt=media&token=831cb33f-632b-4f8c-9e5b-3217d59860ed",
      });
      // Zakończ modal
      onClose();
    } catch (error) {
      console.error("Błąd podczas zapisywania danych:", error);
      // Obsłuż błąd - wyświetl komunikat dla użytkownika lub wykonaj odpowiednie działania
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

export default ChooseUsername;
