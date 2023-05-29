"use client";

import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import ReactPlayer from "react-player";

interface Props {
  handleCloseModal: () => void;
  isOpen: boolean;
  handleOpenModal: () => void;
  videoLink?: string;
}

const StoryModal = ({
  handleCloseModal,
  handleOpenModal,
  isOpen,
  videoLink,
}: Props) => {
  if (videoLink)
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
                url={videoLink}
                width="100%"
                controls
                volume={1}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );

  return null;
};

export default StoryModal;
