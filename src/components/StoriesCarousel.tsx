"use client";
import React, { useRef } from "react";
import { Box, Flex, Avatar, Text, useBreakpointValue } from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

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
  const stories = generateRandomStories(30);
  const carouselRef = useRef<HTMLDivElement>(null);

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
        {stories.map((story, index) => (
          <Flex
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
          </Flex>
        ))}
      </Box>
    </Box>
  );
};

export default StoriesCarousel;
