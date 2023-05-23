"use client";

import { Post } from "@/types";
import { Box, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import GalleryImg from "./GalleryImg";

const Gallery = ({ posts }: { posts: Post[] }) => {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      gap={4}>
      {posts.map((post) => (
        <GalleryImg
          key={post.id}
          post={post}
        />
      ))}
    </Box>
  );
};

export default Gallery;
