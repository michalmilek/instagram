"use client";

import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import ReactPlayer from "react-player/youtube";

interface Props {
  handleCloseModal: () => void;
  isOpen: boolean;
  handleOpenModal: () => void;
}

const StoryModal = ({ handleCloseModal, handleOpenModal, isOpen }: Props) => {
  const getRandomVideoId = () => {
    // Losowy identyfikator wideo z YouTube
    const videoIds = ["video1", "video2", "video3"];
    const randomIndex = Math.floor(Math.random() * videoIds.length);
    return videoIds[randomIndex];
  };

  const videoId = getRandomVideoId();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <ReactPlayer
              width={"100%"}
              controls
              url={`https://www.youtube.com/watch?v=DovVDv59Y7M`}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default StoryModal;
