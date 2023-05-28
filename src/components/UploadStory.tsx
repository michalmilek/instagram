import React, { useState, ChangeEvent } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { storage } from "@/firebase/firebaseConfig";
import {
  ref,
  SettableMetadata,
  updateMetadata,
  uploadBytes,
} from "firebase/storage";

function UploadStory() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const storageRef = ref(storage);
      const storiesRef = ref(storageRef, "stories");

      // Przesłanie pliku do Firebase Storage w folderze "stories"
      const fileRef = ref(storiesRef, selectedFile.name);
      uploadBytes(fileRef, selectedFile)
        .then((snapshot) => {
          console.log("Plik został przesłany do Firebase Storage.");

          // Ustawienie limitu czasu na 24 godziny
          const expirationDate = new Date();
          expirationDate.setHours(expirationDate.getHours() + 24);
          const metadata: SettableMetadata = {
            customMetadata: {
              timeCreated: expirationDate.getTime().toString(),
            },
          };

          // Ustawienie metadanych pliku
          updateMetadata(fileRef, metadata)
            .then(() => {
              console.log("Metadane pliku zostały zaktualizowane.");

              onClose();
            })
            .catch((error) => {
              console.log("Błąd podczas ustawiania metadanych pliku:", error);
            });
        })
        .catch((error) => {
          console.log(
            "Błąd podczas przesyłania pliku do Firebase Storage:",
            error
          );
        });
    }
  };
  return (
    <>
      <IconButton
        position={"absolute"}
        className="top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-sm bg-[#b7b6b699] text-white rounded-full hover:text-black transition-all"
        cursor="pointer"
        aria-label="Add story"
        as={AiOutlinePlus}
        onClick={onOpen}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Wyślij video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleUpload}
              isDisabled={!selectedFile}>
              Wyślij
            </Button>
            <Button onClick={onClose}>Anuluj</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UploadStory;
