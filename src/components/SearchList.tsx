import { UserData } from "@/types";
import { Avatar, Flex, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

const SearchList = ({
  users,
  handleSetIsSearchOn,
}: {
  users: UserData[];
  handleSetIsSearchOn: () => void;
}) => {
  const router = useRouter();

  const trimmedList = users?.slice(0, 5);
  if (trimmedList.length === 0) {
    return null;
  }
  return (
    <VStack
      py={4}
      border="1px"
      borderColor="blackAlpha.700"
      minW="300px"
      borderRadius={5}
      className="z-[99999] bg-white"
      bgColor="white"
      position="absolute"
      top="100%"
      align="start"
      spacing={2}>
      {trimmedList.map((user) => (
        <Flex
          onClick={() => {
            router.push(`/profile/${user.uid}`);
          }}
          px={4}
          gap={6}
          w="full"
          cursor="pointer"
          className="hover:bg-slate-100 bg-white z-[99999]"
          bgColor="white"
          display="flex"
          alignItems="center"
          key={user.username}>
          <Avatar
            src={user.profileAvatar}
            name={user.username}
          />
          <Text>{user.username}</Text>
        </Flex>
      ))}
    </VStack>
  );
};

export default SearchList;
