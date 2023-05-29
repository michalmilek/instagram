import { useState } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  IconButton,
  Avatar,
  Icon,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Notification, NotificationData, NotificationData2 } from "@/types";
import { useRouter } from "next/navigation";
import { FiHeart } from "react-icons/fi";
import { BsFillEnvelopeFill, BsFillEnvelopeOpenFill } from "react-icons/bs";
import {
  markNotificationAsSeen,
  markNotificationAsUnseen,
} from "@/services/firebaseMethods";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import { DocumentData } from "@firebase/firestore";

const MessageDropdown = ({
  notifications,
  handleIsNotificationOpen,
  isNotificationOpen,
  refetchNotifications,
}: {
  notifications: any;
  handleIsNotificationOpen: (value: boolean) => void;
  isNotificationOpen: boolean;
  refetchNotifications: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<
    QueryObserverResult<
      {
        postId: DocumentData | undefined;
        userId: DocumentData | undefined;
      }[],
      unknown
    >
  >;
}) => {
  const router = useRouter();

  const showText = useBreakpointValue(
    { base: false, lg: true },
    { ssr: false }
  );

  const filteredNotifications = notifications?.filter(
    (notification: any) => notification.seen === false
  );

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            w="full"
            variant="ghost"
            pr={9}
            isActive={isOpen}
            justifyContent="flex-start"
            as={Button}
            leftIcon={<FiHeart size={"20"} />}>
            {showText && "Notifications"}
            <Badge
              fontSize="md"
              position="absolute"
              top="0px"
              right="0px"
              colorScheme="red"
              borderRadius="full"
              px="2">
              {filteredNotifications?.length}
            </Badge>
          </MenuButton>
          <MenuList>
            {notifications?.map(
              (notification: NotificationData2, index: number) => (
                <MenuItem
                  className={`cursor-pointer ${
                    !notification.seen && "bg-slate-100"
                  } hover:bg-gray-200 transition-all`}
                  key={index}>
                  <Box
                    display={"flex"}
                    alignItems="center"
                    gap={2}
                    zIndex={1000}
                    minH={"20px"}
                    onClick={() =>
                      router.push(`/post/${notification.postId.postId}`)
                    }>
                    <Avatar src={notification.userId.profileAvatar} />
                    <Text fontWeight="bold">
                      {notification.userId.username}
                    </Text>
                    <Text>has liked your photo</Text>
                  </Box>
                  <IconButton
                    className="hover:bg-slate-400 p-[0.2px] ml-3 duration-500 transition-all rounded-full"
                    value={"Mark as readed/unreaded"}
                    cursor={"pointer"}
                    aria-label={`Readed: ${notification.seen}`}
                    onClick={() => {
                      if (notification.seen) {
                        markNotificationAsUnseen(notification.id);
                        refetchNotifications();
                      } else {
                        markNotificationAsSeen(notification.id);
                        refetchNotifications();
                      }
                    }}
                    icon={
                      notification.seen ? (
                        <BsFillEnvelopeOpenFill />
                      ) : (
                        <BsFillEnvelopeFill />
                      )
                    }
                    size="lg"
                  />
                </MenuItem>
              )
            )}
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default MessageDropdown;
