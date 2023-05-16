import React from "react";
import {
  Box,
  Flex,
  Avatar,
  Image,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";

const InstagramStoryModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex align="center">
            <Avatar
              name="John Doe"
              src="https://via.placeholder.com/48"
            />
            <Text
              ml={2}
              fontWeight="bold">
              John Doe
            </Text>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Image
            src="https://via.placeholder.com/500x800"
            alt="Story Image"
          />
          <Text mt={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec
            accumsan lorem, non tincidunt odio. Nulla sed facilisis nisl, nec
            placerat ipsum.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InstagramStoryModal;
