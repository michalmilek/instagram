"use client";

import {
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
  Fragment,
} from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  VStack,
  useBreakpointValue,
  Button,
  Input,
  Badge,
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

import { debounce } from "lodash";
import {
  getUserByUsername,
  useNotificationsByAuthor,
} from "@/services/firebaseMethods";
import { NotificationData, UserData } from "@/types";
import SearchList from "./SearchList";
import Router from "next/router";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/firebase/AuthContext";
import MessageDropdown from "./MessageDropdown";

type SidebarButton = {
  label: string;
  icon: IconType;
  onClick?: () => void;
};

const Sidebar = () => {
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);
  const [isSearchOn, setIsSearchOn] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchValueRef = useRef<HTMLInputElement>(null);
  const [searchResults, setSearchResults] = useState<any>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isNotificationOpen, setIsNotifcationOpen] = useState(false);

  if (!currentUser) {
    return router.push("/login");
  }

  const handleIsNotificationOpen = (value: boolean) => {
    setIsNotifcationOpen(value);
  };

  const {
    data: notifications,
    isLoading,
    isError,
    error,
    refetch: refetchNotifications,
  } = useNotificationsByAuthor(currentUser.uid);

  console.log(notifications);

  const sidebarButtons: SidebarButton[] = [
    { label: "Home", icon: FiHome, onClick: () => router.push("/") },
    {
      label: "Search",
      icon: FiSearch,
      onClick: () => setIsSearchOn((prev) => !prev),
    },
    { label: "Explore", icon: FiCompass },
    {
      label: "Notification",
      icon: FiHeart,
      onClick: () => setIsNotifcationOpen((prev) => !prev),
    },
    {
      label: "Profile",
      icon: FiUser,
      onClick: () => router.push(`/profile/${currentUser.uid}`),
    },
    { label: "Messages", icon: FiMessageCircle },
    { label: "Create", icon: FiPlusCircle },
  ];

  useEffect(() => {
    if (isSearchOn) {
      searchValueRef.current?.focus();
    }
  }, [isSearchOn]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent<Document, MouseEvent>) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        handleSetIsSearchOn();
      }
    };

    document.addEventListener("click", handleClickOutside as any);

    return () => {
      document.removeEventListener("click", handleClickOutside as any);
    };
  }, []);

  const debouncedSearch = debounce(async (value: string) => {
    if (value === searchValueRef?.current?.value) {
      const users = await getUserByUsername(value);
      setSearchResults(users);
    }
  }, 500);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchValue(value);

    debouncedSearch(value);
  };

  const showText = useBreakpointValue(
    { base: false, lg: true },
    { ssr: false }
  );

  const sidebarWidth = useBreakpointValue({
    base: "70px",
    md: "80px",
    lg: "180px",
    xl: "200px",
  });

  const handleSetIsSearchOn = () => {
    setIsSearchOn(false);
  };

  return (
    <Box
      ref={boxRef}
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
          MM
        </Text>
      </Flex>
      <VStack
        spacing="2"
        align="start">
        {sidebarButtons.map((button) => (
          <Fragment key={button.label}>
            {button.label !== "Notification" && (
              <Button
                position="relative"
                onClick={button.onClick}
                aria-label={button.label}
                leftIcon={<button.icon size="20" />}
                variant="ghost"
                w="100%"
                justifyContent="flex-start">
                {showText && button.label}
              </Button>
            )}
            {button.label === "Notification" && notifications?.length !== 0 && (
              <MessageDropdown
                refetchNotifications={refetchNotifications}
                notifications={notifications}
                handleIsNotificationOpen={handleIsNotificationOpen}
                isNotificationOpen={isNotificationOpen}
              />
            )}
          </Fragment>
        ))}
      </VStack>
      {isSearchOn && (
        <Box
          zIndex={4}
          position="relative"
          mt="4">
          <Input
            ref={searchValueRef}
            aria-label="Search"
            bg="ButtonHighlight"
            variant="filled"
            placeholder="Search"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <SearchList
            handleSetIsSearchOn={handleSetIsSearchOn}
            users={searchResults}
          />
        </Box>
      )}
      <Button
        aria-label="More"
        mt="auto"
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