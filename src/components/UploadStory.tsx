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
import { db, storage } from "@/firebase/firebaseConfig";
import {
  ref,
  SettableMetadata,
  updateMetadata,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { StoryData } from "@/types";

function UploadStory({ uid }: { uid: string }) {
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

      // Generowanie unikatowej nazwy pliku za pomocą UUID
      const fileName = `${uuidv4()}_${selectedFile.name}`;

      // Przesłanie pliku do Firebase Storage w folderze "stories"
      const fileRef = ref(storiesRef, fileName);
      uploadBytes(fileRef, selectedFile)
        .then((snapshot) => {
          console.log("Plik został przesłany do Firebase Storage.");

          // Ustawienie limitu czasu na 24 godziny
          const expirationDate = new Date();
          expirationDate.setHours(expirationDate.getHours() + 24);

          let storyId: string | undefined; // Zmienna do przechowywania storyId

          // Utworzenie dokumentu w kolekcji "stories" z linkiem do pliku
          getDownloadURL(fileRef)
            .then((fileUrl) => {
              const storyData = {
                fileUrl: fileUrl,
                expirationDate: serverTimestamp(),
                userId: doc(db, "users", uid), // Dodanie referencji do dokumentu z kolekcji "users"
              };

              addDoc(collection(db, "stories"), storyData)
                .then((docRef) => {
                  console.log("Dokument został dodany do kolekcji 'stories'.");
                  storyId = docRef.id; // Przypisanie ID dokumentu do zmiennej storyId

                  // Zaktualizuj dokument, aby zawierał pole storyId
                  const updatedData = { ...storyData, storyId: docRef.id };
                  return updateDoc(doc(db, "stories", docRef.id), updatedData);
                })
                .then(() => {
                  console.log("Dokument został zaktualizowany.");
                  onClose();
                })
                .catch((error) => {
                  console.log("Błąd podczas dodawania dokumentu:", error);
                });
            })
            .catch((error) => {
              console.log(
                "Błąd podczas pobierania URL do pobrania pliku:",
                error
              );
            });

          // Ustawienie czasu wygaśnięcia dla dokumentu po 24 godzinach
          setTimeout(() => {
            if (storyId) {
              deleteDoc(doc(db, "stories", storyId))
                .then(() => {
                  console.log("Dokument został usunięty po 24 godzinach.");
                })
                .catch((error) => {
                  console.log("Błąd podczas usuwania dokumentu:", error);
                });
            }
          }, 24 * 60 * 60 * 1000); // 24 godziny w milisekundach
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
          <ModalHeader>Upload video</ModalHeader>
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
              className="bg-blue-500"
              colorScheme="blue"
              mr={3}
              onClick={handleUpload}
              isDisabled={!selectedFile}>
              Upload
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UploadStory;
