"use client";

import React from "react";
import { Box, Flex, Avatar, Image, Text } from "@chakra-ui/react";

const InstagramPost = () => {
  return (
    <Box
      maxW="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md">
      <Flex
        align="center"
        p={4}>
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
      <Image
        src="https://via.placeholder.com/500x300"
        alt="Post Image"
      />
      <Flex p={4}>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec
          accumsan lorem, non tincidunt odio. Nulla sed facilisis nisl, nec
          placerat ipsum.
        </Text>
      </Flex>
    </Box>
  );
};

export default InstagramPost;
