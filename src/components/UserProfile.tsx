"use client";

import React from "react";
import { Box, Flex, Avatar, Text, Spinner } from "@chakra-ui/react";
import { UserData } from "@/types";

interface ProfileHeaderProps {
  username: string;
  profileAvatar: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  profileAvatar,
}) => {
  return (
    <Flex
      alignItems="center"
      p={4}>
      <Avatar
        size="lg"
        src={profileAvatar}
      />
      <Box ml={4}>
        <Text
          fontSize="xl"
          fontWeight="bold">
          {username}
        </Text>
        {/* Dodatkowe informacje o użytkowniku */}
        {/* np. opis profilu, liczba obserwujących, itp. */}
      </Box>
    </Flex>
  );
};

interface ProfileStatsProps {
  postCount: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ postCount }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={4}>
      <Box>
        <Text
          fontWeight="bold"
          fontSize="xl">
          Posts number
        </Text>
      </Box>
      <Box>
        <Text fontSize="xl">{postCount}</Text>
      </Box>
    </Box>
  );
};

const UserProfile = ({
  postLength,
  userData,
}: {
  postLength: number;
  userData: UserData | null | undefined;
}) => {
  if (userData)
    return (
      <div>
        <ProfileHeader
          username={userData.username}
          profileAvatar={userData.profileAvatar}
        />
        <ProfileStats postCount={postLength} />
        {/* Pozostała zawartość profilu */}
      </div>
    );

    return <Spinner size="lg" />;
};

export default UserProfile;
