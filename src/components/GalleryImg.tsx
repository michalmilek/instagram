import { AuthContext } from "@/firebase/AuthContext";
import {
  useComments,
  useIsUserLikedPost,
  useLikesCount,
} from "@/services/firebaseMethods";
import { Post } from "@/types";
import { Image } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import PostModal from "./PostModal";

const GalleryImg = ({ post }: { post: Post }) => {
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

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

  const { data: commentsData, refetch: refetchComments } = useComments(post.id);

  const { data: isLiked, refetch: refetchisLiked } = useIsUserLikedPost(
    post.id,
    currentUser.uid
  );

  const { data: likesCount, refetch: refetchLikesCount } = useLikesCount(
    post.id
  );

  return (
    <>
      <Image
        onClick={handleOpenPostModal}
        rounded="lg"
        cursor="pointer"
        className="hover:brightness-90 transition-all"
        boxShadow="2xl"
        src={post.imageURL}
        alt={post.description}
        boxSize="200px"
        objectFit="cover"
      />
      <PostModal
        commentsData={commentsData}
        handleClosePostModal={handleClosePostModal}
        isLiked={isLiked}
        refetchisLiked={refetchisLiked}
        isPostModalOpen={isPostModalOpen}
        likesCount={likesCount}
        refetchLikesCount={refetchLikesCount}
        post={post}
        refetchComments={refetchComments}
      />
    </>
  );
};

export default GalleryImg;
