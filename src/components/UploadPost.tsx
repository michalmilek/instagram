"use client";

import { ChangeEvent, useContext, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
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
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import * as Yup from "yup";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { AuthContext } from "@/firebase/AuthContext";
import { getAllPosts, getUserByUID } from "@/services/firebaseMethods";
import { useQuery } from "@tanstack/react-query";
import { UserData } from "@/types";
import { v4 as uuidv4 } from "uuid";

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
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const uploadedFile = event.target.files[0];
      const generatedFileName = `${uuidv4()}_${uploadedFile.name}`;
      setFile(uploadedFile);
      setFileName(generatedFileName);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreviewURL(reader.result as string);
        }
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const handleCancel = () => {
    if (file && fileName) {
      // Delete the file from storage
      const storageRef = ref(storage);
      const fileRef = ref(storageRef, fileName);
      deleteObject(fileRef)
        .then(() => {
          console.log("File deleted from storage.");
        })
        .catch((error) => {
          console.error("Error deleting file from storage:", error);
        });
    }

    setFile(null);
    setPreviewURL(null);
    setFileName(null);
    onClose();
    reset({ description: "" });
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

      if (file && fileName) {
        const storageRef = ref(storage);
        const fileRef = ref(storageRef, fileName);
        const userRef = doc(db, "users", currentUser.uid); // Referencja do dokumentu "users/user-id"

        await uploadBytes(fileRef, file);
        console.log("File uploaded!");
        // Możesz wykonać dodatkowe operacje, jeśli potrzebujesz
        const docRef = await addDoc(collection(db, "posts"), {
          description: data.description,
          imageURL: await getDownloadURL(fileRef),
          user: userRef,
          createdAt: serverTimestamp(),
        });

        const postId = docRef.id;
        await updateDoc(docRef, { postId });
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
        fontSize={{ base: "sm", lg: "md" }}
        className="bg-gray-300"
        variant="solid"
        onClick={onOpen}>
        Add Post
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}>
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

              {previewURL && (
                <Box mb={4}>
                  <Image
                    src={previewURL}
                    alt="Preview"
                    width="200"
                  />
                </Box>
              )}

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
                  mr={3}
                  isDisabled={!file}>
                  {uploading ? "Uploading..." : "Add"}
                </Button>
                <Button
                  onClick={handleCancel}
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