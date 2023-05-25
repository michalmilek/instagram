"use client";

import React, { useContext, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Spinner,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { UserData } from "@/types";
import { FaCog } from "react-icons/fa";
import { AuthContext } from "@/firebase/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "@/firebase/firebaseConfig";
import { updateUserProfileAvatar } from "@/services/firebaseMethods";
import ChangeUsername from "./ChangeUsername";
interface ProfileHeaderProps {
  username: string;
  profileAvatar: string;
  userUid: string;
  handleRefetchProfile: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  profileAvatar,
  userUid,
  handleRefetchProfile,
}) => {
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);
  const [showSettings, setShowSettings] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  const handleMouseEnter = () => {
    setShowSettings(true);
  };

  const handleMouseLeave = () => {
    setShowSettings(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAvatar = async () => {
    if (avatarFile) {
      const uniqueFileName = `${uuidv4()}-${avatarFile.name}`;
      const avatarRef = ref(storage, uniqueFileName);
      await uploadBytes(avatarRef, avatarFile);
      const downloadUrl = await getDownloadURL(avatarRef);
      updateUserProfileAvatar(userUid, downloadUrl);
      setShowModal(false);
      handleRefetchProfile();
    }
  };

  return (
    <Flex
      alignItems="center"
      p={4}>
      <Box
        cursor="pointer"
        className={`${
          currentUser.uid === userUid && "hover:brightness-75"
        } transition-all duration-300`}
        position="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setShowModal(true)}>
        <Avatar
          size="lg"
          src={profileAvatar}
        />
        {showSettings && currentUser.uid === userUid && (
          <Tooltip
            label="Settings"
            placement="left">
            <Box
              as={FaCog}
              fontSize="3xl"
              color="gray.500"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="white"
              borderRadius="full"
              p={1}
              cursor="pointer"
            />
          </Tooltip>
        )}
      </Box>
      <Box
        display={"flex"}
        gap={2}
        alignItems="center"
        ml={4}>
        <Text
          fontSize="xl"
          fontWeight="bold">
          {username}
        </Text>
        {currentUser.uid === userUid && (
          <>
            <IconButton
              onClick={() => setShowUsernameModal(true)}
              cursor="pointer"
              className="hover:text-opacity-75 transition-all"
              aria-label="Change username"
              value={"Change username"}
              icon={<FaCog size={20} />}
            />
            <ChangeUsername
              isOpen={showUsernameModal}
              onClose={() => {
                setShowUsernameModal(false);
                handleRefetchProfile();
              }}
            />
          </>
        )}
      </Box>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Avatar</ModalHeader>
          <ModalBody>
            <Box
              display="flex"
              justifyContent="center">
              {previewUrl ? (
                <Avatar
                  size="xl"
                  src={previewUrl}
                />
              ) : (
                <Avatar size="xl" />
              )}
            </Box>
            <Input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              mt={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="bg-blue-500"
              colorScheme="blue"
              mr={3}
              onClick={handleUpdateAvatar}>
              Update
            </Button>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
  handleRefetchProfile,
}: {
  postLength: number;
  userData: UserData | null | undefined;
  handleRefetchProfile: () => void;
}) => {
  if (userData)
    return (
      <div>
        <ProfileHeader
          handleRefetchProfile={handleRefetchProfile}
          userUid={userData.uid}
          username={userData.username}
          profileAvatar={userData.profileAvatar}
        />
        <ProfileStats postCount={postLength} />
      </div>
    );

  return <Spinner size="lg" />;
};

export default UserProfile;
