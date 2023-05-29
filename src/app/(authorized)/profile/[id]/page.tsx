"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getAllPostsByUserId,
  useAllPostsByUserId,
  useUserByUID,
} from "@/services/firebaseMethods";
import { Box, Divider, Spinner, useBreakpointValue } from "@chakra-ui/react";
import Gallery from "@/components/Gallery";
import UserProfile from "@/components/UserProfile";

const Page = () => {
  const { id } = useParams();


  const { data: posts, isLoading, isError, error } = useAllPostsByUserId(id);
  const {
    data: userData,
    isLoading: userIsLoading,
    isError: userIsError,
    refetch: refetchProfile,
  } = useUserByUID(id);

  const handleRefetchProfile = () => {
    refetchProfile();
  };

  const sidebarWidth = useBreakpointValue({
    base: "70px",
    md: "80px",
    lg: "180px",
    xl: "200px",
  });

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="lg" />;
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <Box
      gap={10}
      display="flex"
      flexDirection="column"
      marginLeft={sidebarWidth}
      alignItems="center">
      <UserProfile
        handleRefetchProfile={handleRefetchProfile}
        userData={userData}
        postLength={posts.length || 0}
      />
      <Divider backgroundColor={"gray.500"} />
      <Gallery posts={posts} />
    </Box>
  );
};

export default Page;
