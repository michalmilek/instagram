"use client";

import { usePostById } from "@/services/firebaseMethods";
import { Post as PostInterface } from "@/types";
import { Spinner } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import React from "react";
import Post from "../../../../components/Post";

const Page = () => {
  const { id } = useParams();

  const {
    data: postData,
    isLoading: isLoadingPost,
    isError: isErrorPost,
    refetch: refetchPost,
  } = usePostById(id);

  if (isLoadingPost) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="lg" />;
      </div>
    );
  }

  if (isErrorPost) {
    return <div>{isErrorPost}</div>;
  }

  if (postData)
    return (
      <>
        <Post post={postData} />
      </>
    );

  return null;
};

export default Page;
