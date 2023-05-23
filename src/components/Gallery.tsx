"use client";

import { Post } from "@/types";
import { Box, Image } from "@chakra-ui/react";

const Gallery = ({ posts }: { posts: Post[] }) => {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      gap={4}>
      {posts.map((post) => (
        <Image
          key={post.id}
          src={post.imageURL}
          alt={post.description}
          boxSize="200px"
          objectFit="cover"
        />
      ))}
    </Box>
  );
};

export default Gallery;
