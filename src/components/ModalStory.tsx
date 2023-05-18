"use client";

import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";

const StoryModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const getRandomVideoId = () => {
    // Losowy identyfikator wideo z YouTube
    const videoIds = ["video1", "video2", "video3"];
    const randomIndex = Math.floor(Math.random() * videoIds.length);
    return videoIds[randomIndex];
  };

  const videoId = getRandomVideoId();

  return (
    <>
      <button onClick={handleOpenModal}>Otwórz modal</button>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <video
              src={`https://www.youtube.com/embed/${videoId}`}
              width="100%"
              height="auto"
              controls
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StoryModal;
