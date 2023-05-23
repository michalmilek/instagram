import { db } from "@/firebase/firebaseConfig";
import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "@firebase/firestore";
import { Comment, Post, PostWithUserReference, UserData } from "@/types";
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
  const q = query(postsCollectionRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  const posts = [];
  for (const doc of querySnapshot.docs) {
    const post = doc.data();
    const postId = doc.id;

    const userRef = post.user; // Referencja do dokumentu użytkownika
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();

    const postWithUserData = { ...post, id: postId, user: userData };
    posts.push(postWithUserData);
  }

  return posts;
};

export const getAllPostsByUserId = async (userId: string): Promise<Post[]> => {
  const userRef = doc(db, "users", userId);
  const q = query(
    collection(db, "posts"),
    where("user", "==", userRef),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);

  const posts: Post[] = [];
  for (const doc of querySnapshot.docs) {
    const post = doc.data() as Post;
    const postId = doc.id;

    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data() as UserData;

    const postWithUserData = { ...post, id: postId, user: userData };
    posts.push(postWithUserData);
  }

  return posts;
};

export const useAllPostsByUserId = (userId: string) => {
  return useQuery<Post[], Error>(["posts", userId], () =>
    getAllPostsByUserId(userId)
  );
};


export const addComment = async (
  postId: string,
  commentData: string,
  userId: string
) => {
  const postRef = doc(db, "posts", postId);
  const commentsCollectionRef = collection(postRef, "comments");
  const userRef = doc(db, "users", userId);

  const commentWithTimestamp = {
    text: commentData,
    user: userRef as DocumentReference,
    timestamp: serverTimestamp(),
  };

  await addDoc(commentsCollectionRef, commentWithTimestamp);
};

export const getAllComments = async (postId: string) => {
  const postRef = doc(db, "posts", postId);
  const commentsCollectionRef = collection(postRef, "comments");
  const querySnapshot = await getDocs(commentsCollectionRef);

  const comments = querySnapshot.docs.map(async (doc) => {
    const commentData = doc.data();
    const userRef = commentData.user as DocumentReference;
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data() as UserData;

    return {
      id: doc.id,
      ...commentData,
      user: userData,
    };
  });

  const sortedComments = await Promise.all(comments);

  (sortedComments as Comment[]).sort((a, b) => {
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

export const getUserByUsername = async (username: string) => {
  const usersCollectionRef = collection(db, "users");
  const querySnapshot = await getDocs(usersCollectionRef);
  const users = querySnapshot.docs
    .map((doc) => doc.data())
    .filter((user) => user.username.includes(username));

  return users;
};