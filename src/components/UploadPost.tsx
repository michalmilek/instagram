"use client";

import { useState } from "react";
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

interface FormData {
  description: string;
  image: FileList;
}

const schema = object().shape({
  description: string().required("Description is required"),
  image: string().required("Image is required"),
});

const UploadPost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [uploading, setUploading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setUploading(true);
      // Process form data, e.g., send it to an API, etc.
      console.log(data);
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      reset();
      onClose();
    } catch (error) {
      console.error("Error uploading post:", error);
    } finally {
      setUploading(false);
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
                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="file"
                        onChange={(event) => field.onChange(event.target.files)}
                      />
                    )}
                  />
                  <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
                </FormControl>
              </Box>

              <ModalFooter>
                <Button
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
