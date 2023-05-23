"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getAllPostsByUserId,
  useAllPostsByUserId,
} from "@/services/firebaseMethods";
import { Spinner } from "@chakra-ui/react";
import Gallery from "@/components/Gallery";

const Page = () => {
  const { id } = useParams();

  const { data: posts, isLoading, isError, error } = useAllPostsByUserId(id);
  console.log("🚀 ~ posts:", posts);

  if (isLoading) {
    return <Spinner size="lg" />;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div>
      <Gallery posts={posts} />
    </div>
  );
};

export default Page;
