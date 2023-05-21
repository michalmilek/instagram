import { db } from "@/firebase/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "@firebase/firestore";
import { Comment } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const getUserByUID = async (uid: string) => {
  const userDocRef = doc(collection(db, "users"), uid);
  const userDocSnapshot = await getDoc(userDocRef);

  if (userDocSnapshot.exists()) {
    const userData = userDocSnapshot.data();
    return userData;
  } else {
    return null;
  }
};

export const getAllPosts = async () => {
  const postsCollectionRef = collection(db, "posts");
  const querySnapshot = await getDocs(postsCollectionRef);

  const posts = querySnapshot.docs.map((doc) => {
    const post = doc.data();
    const postId = doc.id;
    return { ...post, id: postId };
  });

  return posts;
};

interface CommentData {
  text: string;
  username: string;
  user_uid: string;
  profileAvatar: string;
  timestamp?: Timestamp;
}

export const addComment = async (postId: string, commentData: CommentData) => {
  const postRef = doc(db, "posts", postId);
  const commentsCollectionRef = collection(postRef, "comments");

  const commentWithTimestamp = {
    ...commentData,
    timestamp: serverTimestamp(),
  };

  await addDoc(commentsCollectionRef, commentWithTimestamp);
};

export const getAllComments = async (postId: string) => {
  const postRef = doc(db, "posts", postId);
  const commentsCollectionRef = collection(postRef, "comments");
  const querySnapshot = await getDocs(commentsCollectionRef);

  const comments = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const sortedComments = (comments as Comment[]).sort((a, b) => {
    const dateA = (a.timestamp as Timestamp).toDate().getTime();
    const dateB = (b.timestamp as Timestamp).toDate().getTime();

    return dateB - dateA;
  });

  return sortedComments;
};

export const addLike = async (postId: string, userId: string) => {
  const postRef = doc(db, "posts", postId);
  const likesCollectionRef = collection(postRef, "likes");

  const likeDocRef = doc(likesCollectionRef, userId);
  const likeData = {
    timestamp: serverTimestamp(),
  };

  await setDoc(likeDocRef, likeData);
};

export const removeLike = async (postId: string, userId: string) => {
  const likeDocRef = doc(db, "posts", postId, "likes", userId);
  await deleteDoc(likeDocRef);
};

export const getLikesCount = async (postId: string) => {
  const likesCollectionRef = collection(db, "posts", postId, "likes");
  const querySnapshot = await getDocs(likesCollectionRef);
  const likesCount = querySnapshot.size;

  return likesCount;
};

export const isUserLikedPost = async (postId: string, userUid: string) => {
  const likeDocRef = doc(db, "posts", postId, "likes", userUid);
  const likeDocSnapshot = await getDoc(likeDocRef);
  const isLiked = likeDocSnapshot.exists();

  return isLiked;
};

export const useIsUserLikedPost = (postId: string, userUid: string) => {
  return useQuery(["isUserLikedPost", postId, userUid], () =>
    isUserLikedPost(postId, userUid)
  );
};

export const useLikesCount = (postId: string) => {
  return useQuery(["likesCount", postId], () => getLikesCount(postId));
};
