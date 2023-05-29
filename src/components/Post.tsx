"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  Flex,
  Avatar,
  Image,
  Text,
  Input,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { Comment, Post, UserData } from "@/types";
import {
  addComment,
  addLike,
  getAllComments,
  getUserByUID,
  removeLike,
  useIsUserLikedPost,
  useLikesCount,
} from "@/services/firebaseMethods";
import { AuthContext } from "@/firebase/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { serverTimestamp } from "@firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { formatDistanceToNowStrict } from "date-fns";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import PostModal from "./PostModal";

const InstagramPost = ({ post }: { post: Post }) => {
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);
  const [comment, setComment] = useState<string>("");
  const [isViewMore, setIsViewMore] = useState(false);
  const commentRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const handleRouteChange = useCallback(
    (url: string) => {
      if (url === "/post/modal") {
        setIsPostModalOpen(true);
      } else if (url === "/post") {
        setIsPostModalOpen(false);
        router.back();
      }
    },
    [router]
  );

  useEffect(() => {
    const handlePopstate = () => {
      if (window.location.pathname === `/post/${post.id}`) {
        setIsPostModalOpen(true);
      } else if (window.location.pathname === "/") {
        setIsPostModalOpen(false);
        window.history.back();
      }
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [post.id]);

  const handleOpenPostModal = () => {
    setIsPostModalOpen(true);
    const newUrl = `/post/${post.id}`;
    window.history.pushState(null, "", newUrl);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
    const newUrl = "/";
    window.history.pushState(null, "", newUrl);
  };

  const handleCommentChange = (e: any) => {
    setComment(e.target.value);
  };

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery(["user", currentUser.uid], () => getUserByUID(currentUser.uid));

  const { data: commentsData, refetch: refetchComments } = useQuery(
    ["comments", post.id],
    () => getAllComments(post.id)
  );

  const { data: isLiked, refetch: refetchisLiked } = useIsUserLikedPost(
    post.id,
    currentUser.uid
  );

  const { data: likesCount, refetch: refetchLikesCount } = useLikesCount(
    post.id
  );

  const visibleComments = isViewMore
    ? (commentsData as Comment[])
    : (commentsData as Comment[])?.slice(0, 3);

  return (
    <Box
      maxW="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md">
      <Flex
        align="center"
        p={4}>
        <Avatar
          cursor="pointer"
          onClick={() => router.push(`/profile/${post.user.uid}`)}
          size={{ base: "sm", lg: "md" }}
          name={post.user.username}
          src={post.user.profileAvatar}
        />
        <Text
          cursor="pointer"
          onClick={() => router.push(`/profile/${post.user.uid}`)}
          fontSize={{ base: "sm", lg: "md" }}
          ml={2}
          fontWeight="bold">
          {post.user.username}
        </Text>
      </Flex>
      <Image
        cursor="pointer"
        src={post.imageURL}
        alt="Post Image"
        onClick={handleOpenPostModal}
      />
      <Flex p={4}>
        <Text fontSize={{ base: "sm", lg: "md" }}>{post.description}</Text>
      </Flex>
      <Flex
        px={8}
        alignItems="center"
        mt={2}>
        <IconButton
          zIndex={0}
          className={` ${
            isLiked
              ? "bg-red-500 text-white border-transparent border transition-all"
              : "bg-white text-red-500 border-red-500 border transition-all "
          }`}
          aria-label="Like"
          icon={<FiHeart />}
          onClick={async () => {
            if (isLiked) {
              await removeLike(post.id, currentUser.uid);
              refetchisLiked();
              refetchLikesCount();
            } else {
              await addLike(post.id, currentUser.uid);
              refetchisLiked();
              refetchLikesCount();
            }
          }}
          size="sm"
          colorScheme="red"
          mr={2}
        />
        <IconButton
          onClick={() => {
            commentRef.current?.focus();
          }}
          className="bg-blue-500 z-0"
          aria-label="Comment"
          icon={<FiMessageCircle />}
          size="sm"
          colorScheme="blue"
        />
        <Text
          fontWeight={600}
          ml={2}
          fontSize="sm">
          {`${likesCount} likes`}
        </Text>
      </Flex>
      <Box p={4}>
        <Text
          fontSize={{ base: "sm", lg: "md" }}
          mb={8}
          fontWeight="bold">
          Comments:
        </Text>
        <Box
          maxH={250}
          display="flex"
          flexDirection="column"
          gap={2}
          overflowY="auto">
          {visibleComments?.map((comment) => {
            const date = new Date(comment.timestamp.toDate());
            const timeAgo = formatDistanceToNowStrict(date, {
              addSuffix: true,
            });

            return (
              <Box
                key={comment.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom="4">
                <Box
                  display="flex"
                  alignItems="center">
                  <Avatar
                    size="sm"
                    src={comment.user.profileAvatar}
                    marginRight="2"
                  />
                  <Box>
                    <Text
                      fontSize={{ base: "xs", lg: "sm" }}
                      fontWeight="bold"
                      marginBottom="1">
                      {comment.user.username}
                    </Text>
                    <Text fontSize={{ base: "xs", lg: "sm" }}>
                      {comment.text}
                    </Text>
                  </Box>
                </Box>
                <Text
                  pr={isViewMore ? 4 : 0}
                  fontSize={{ base: "sm", lg: "md" }}
                  color="gray.500">
                  {timeAgo}
                </Text>
              </Box>
            );
          })}
        </Box>
      </Box>
      {visibleComments?.length >= 4 && (
        <Button
          onClick={() => setIsViewMore((prev) => !prev)}
          fontSize={14}
          pl={8}
          variant="link"
          color="blue.500">
          {isViewMore ? "Collapse comments" : "View more..."}
        </Button>
      )}
      <Box p={4}>
        <Input
          fontSize={{ base: "sm", lg: "md" }}
          ref={commentRef}
          placeholder="Add a comment"
          value={comment}
          onChange={handleCommentChange}
        />
        <Button
          fontSize={{ base: "sm", lg: "md" }}
          mt={2}
          onClick={async () => {
            await addComment(post.id, comment, currentUser.uid);
            setComment("");

            refetchComments();
          }}>
          Add Comment
        </Button>
      </Box>
      <PostModal
        isLiked={isLiked}
        refetchisLiked={refetchisLiked}
        likesCount={likesCount}
        commentsData={commentsData}
        refetchComments={refetchComments}
        refetchLikesCount={refetchLikesCount}
        post={post}
        isPostModalOpen={isPostModalOpen}
        handleClosePostModal={handleClosePostModal}
      />
    </Box>
  );
};

export default InstagramPost;
