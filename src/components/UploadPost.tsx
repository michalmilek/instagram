"use client";

import { ChangeEvent, useContext, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import UploadFile from "@/services/UploadFile";
import { storage, db } from "../firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as Yup from "yup";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "@/firebase/AuthContext";
import { getAllPosts, getUserByUID } from "@/services/firebaseMethods";
import { useQuery } from "@tanstack/react-query";
import { UserData } from "@/types";

interface FormData {
  description: string;
  image: File;
}

const schema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
  image: Yup.mixed().test("fileSize", "The file is too large", (value: any) => {
    if (!Array.isArray(value)) return true; // attachment is optional
    return value[0].size <= 2000000;
  }),
});

const UploadPost = ({
  handleRefetchPosts,
}: {
  handleRefetchPosts: () => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);
    }
  };

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery(["user", currentUser.uid], () => getUserByUID(currentUser.uid));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred while fetching user data.</div>;
  }

  const onSubmit = async (data: FormData) => {
    try {
      setUploading(true);
      // Process form data, e.g., send it to an API, etc.
      console.log(data);

      if (file) {
        const storageRef = ref(storage);
        const fileRef = ref(storageRef, file.name);
        const userRef = doc(db, "users", currentUser.uid); // Referencja do dokumentu "users/user-id"

        await uploadBytes(fileRef, file);
        console.log("File uploaded!");
        // Możesz wykonać dodatkowe operacje, jeśli potrzebujesz
        await addDoc(collection(db, "posts"), {
          description: data.description,
          imageURL: await getDownloadURL(fileRef),
          user: userRef,
          createdAt: serverTimestamp(),
        });
        console.log("Post created!");
      }

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      reset();
      onClose();
    } catch (error) {
      console.error("Error uploading post:", error);
    } finally {
      setUploading(false);
      handleRefetchPosts();
    }
  };

  return (
    <>
      <Button
        className="bg-gray-300"
        variant="solid"
        onClick={onOpen}>
        Add Post
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Post</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box mb={4}>
                <FormControl isInvalid={!!errors.description}>
                  <FormLabel>Description</FormLabel>
                  <Controller
                    name="description"
                    control={control}
                    defaultValue=""
                    render={({ field }) => <Textarea {...field} />}
                  />
                  <FormErrorMessage>
                    {errors.description?.message}
                  </FormErrorMessage>
                </FormControl>
              </Box>

              <Box mb={4}>
                <FormControl isInvalid={!!errors.image}>
                  <FormLabel>Image</FormLabel>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
                </FormControl>
              </Box>
              <ModalFooter>
                <Button
                  className="bg-blue-500"
                  type="submit"
                  colorScheme="blue"
                  isLoading={uploading}
                  mr={3}>
                  {uploading ? "Uploading..." : "Add"}
                </Button>
                <Button
                  onClick={onClose}
                  disabled={uploading}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UploadPost;
