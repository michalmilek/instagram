"use client";

import {
  Box,
  Flex,
  IconButton,
  Text,
  VStack,
  useBreakpointValue,
  Button,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import {
  FiHome,
  FiCompass,
  FiHeart,
  FiUser,
  FiSearch,
  FiMessageCircle,
  FiPlusCircle,
  FiMoreHorizontal,
} from "react-icons/fi";

type SidebarButton = {
  label: string;
  icon: IconType;
};

const sidebarButtons: SidebarButton[] = [
  { label: "Home", icon: FiHome },
  { label: "Search", icon: FiSearch },
  { label: "Explore", icon: FiCompass },
  { label: "Notification", icon: FiHeart },
  { label: "Profile", icon: FiUser },
  { label: "Messages", icon: FiMessageCircle },
  { label: "Create", icon: FiPlusCircle },
];

const Sidebar = () => {
  const showText = useBreakpointValue(
    { base: false, lg: true },
    { ssr: false }
  );

  const sidebarWidth = useBreakpointValue({
    base: "100px",
    md: "120px",
    lg: "180px",
    xl: "200px",
  });

  return (
    <Box
      borderRight="2px"
      pos="fixed"
      top="0"
      left={0}
      w={sidebarWidth}
      h="100vh"
      bg="gray.200"
      py="4"
      px="2"
      boxShadow="md">
      <Flex
        align="center"
        mb="8">
        <Text
          ml="2"
          fontSize="lg"
          fontWeight="bold"
          color="gray.600">
          MM Instagram
        </Text>
      </Flex>
      <VStack
        spacing="2"
        align="start">
        {sidebarButtons.map((button) => (
          <Button
            aria-label={button.label}
            key={button.label}
            leftIcon={<button.icon size="20" />}
            variant="ghost"
            w="100%"
            justifyContent="flex-start">
            {showText && button.label}
          </Button>
        ))}
      </VStack>
      <Button
        aria-label="More"
        mt="98%"
        size="lg"
        justifyContent="flex-start"
        leftIcon={<FiMoreHorizontal size="30" />}
        variant="ghost"
        w="100%">
        {showText && "More"}
      </Button>
    </Box>
  );
};

export default Sidebar;