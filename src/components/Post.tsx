"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Image,
  Text,
  Input,
  Button,
} from "@chakra-ui/react";

const InstagramPost = () => {
  const [comment, setComment] = useState<any>("");
  const [comments, setComments] = useState<any>([]);

  const handleCommentChange = (e: any) => {
    setComment(e.target.value);
  };

  const handleAddComment = () => {
    if (comment) {
      setComments([...comments, comment]);
      setComment("");
    }
  };

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
      <Box p={4}>
        <Text fontWeight="bold">Comments:</Text>
        {comments.map((comment, index) => (
          <Text key={index}>{comment}</Text>
        ))}
      </Box>
      <Box p={4}>
        <Input
          placeholder="Add a comment"
          value={comment}
          onChange={handleCommentChange}
        />
        <Button
          mt={2}
          onClick={handleAddComment}>
          Add Comment
        </Button>
      </Box>
    </Box>
  );
};

export default InstagramPost;
