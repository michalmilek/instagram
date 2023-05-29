"use client";
import React, { useContext, useRef, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  useBreakpointValue,
  IconButton,
} from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import StoryModal from "./ModalStory";
import { useAllStories, useUserByUID } from "@/services/firebaseMethods";
import { AuthContext } from "@/firebase/AuthContext";
import { AiOutlinePlus } from "react-icons/ai";
import UploadStory from "./UploadStory";

interface Story {
  username: string;
  avatar: string;
}

const generateRandomStories = (count: number): Story[] => {
  const stories: Story[] = [];
  for (let i = 0; i < count; i++) {
    const username = faker.internet.userName();
    const avatar = faker.internet.avatar();
    stories.push({ username, avatar });
  }
  return stories;
};

const StoriesCarousel: React.FC = () => {
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);
  const stories = generateRandomStories(30);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const carouselWidth = useBreakpointValue({
    base: "230px",
    md: "400px",
    lg: "600px",
    xl: "800px",
  });

  const { data: currentUserData } = useUserByUID(currentUser.uid);
  const { data: allStories } = useAllStories();

  return (
    <Box position="relative">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mb={2}>
        <Box
          cursor="pointer"
          position="absolute"
          top="30%"
          zIndex={5}
          left={0}
          translateY="-50%"
          p={2}
          _hover={{ bg: "gray.200" }}
          onClick={scrollLeft}>
          <BsChevronLeft
            className="cursor-pointer"
            size={24}
          />
        </Box>
        <Box
          cursor="pointer"
          zIndex={5}
          position="absolute"
          p={2}
          top="30%"
          right="0%"
          translateY="-50%"
          _hover={{ bg: "gray.200" }}
          onClick={scrollRight}>
          <BsChevronRight
            className="cursor-pointer"
            size={24}
          />
        </Box>
      </Flex>
      <Box
        border="1px"
        borderColor="gray.200"
        shadow="lg"
        className="scrollbar-hide"
        scrollBehavior="smooth"
        maxWidth={carouselWidth}
        py="2"
        px="10"
        ref={carouselRef}
        display="flex"
        overflowX="auto"
        whiteSpace="nowrap">
        <Flex
          zIndex={0}
          display="flex"
          direction="column"
          align="center"
          justify="center"
          px={2}>
          <div className="w-18 h-18 rounded-full relative border-2 border-blue-400">
            <Avatar
              className="relative hover:scale-110 transition-all cursor-pointer"
              size={{ base: "sm", lg: "lg" }}
              name={currentUserData?.username}
              src={currentUserData?.profileAvatar}
            />
            <UploadStory uid={currentUser.uid} />
          </div>
          <Text
            className="select-none cursor-text"
            maxW={{ base: "30px", lg: "80px" }}
            isTruncated
            mt={2}
            fontSize="xs"
            fontWeight="light">
            {currentUserData?.username}
          </Text>
        </Flex>
        {allStories?.map((story) => (
          <Flex
            onClick={handleOpenModal}
            zIndex={0}
            key={story.storyId}
            display="flex"
            direction="column"
            align="center"
            justify="center"
            px={2}>
            <div className="w-18 h-18 rounded-full  relative border-2 border-blue-400">
              <Avatar
                className="relative hover:scale-110 transition-all cursor-pointer"
                size={{ base: "sm", lg: "lg" }}
                name={story.userId.username}
                src={story.userId.profileAvatar}
              />
            </div>
            <Text
              className="select-none cursor-text"
              maxW={{ base: "30px", lg: "80px" }}
              isTruncated
              mt={2}
              fontSize="xs"
              fontWeight="light">
              {story.userId.username}
            </Text>
            <StoryModal
              videoLink={story.fileUrl}
              isOpen={isOpen}
              handleOpenModal={handleOpenModal}
              handleCloseModal={handleCloseModal}
            />
          </Flex>
        ))}
        {stories.map((story, index) => (
          <Flex
            onClick={handleOpenModal}
            zIndex={0}
            key={index}
            display="flex"
            direction="column"
            align="center"
            justify="center"
            px={2}>
            <div className="w-18 h-18 rounded-full  relative border-2 border-blue-400">
              <Avatar
                className="relative hover:scale-110 transition-all cursor-pointer"
                size={{ base: "sm", lg: "lg" }}
                name={story.username}
                src={story.avatar}
              />
            </div>
            <Text
              className="select-none cursor-text"
              maxW={{ base: "30px", lg: "80px" }}
              isTruncated
              mt={2}
              fontSize="xs"
              fontWeight="light">
              {story.username}
            </Text>
            <StoryModal
              isOpen={isOpen}
              handleOpenModal={handleOpenModal}
              handleCloseModal={handleCloseModal}
            />
          </Flex>
        ))}
      </Box>
    </Box>
  );
};

export default StoriesCarousel;
