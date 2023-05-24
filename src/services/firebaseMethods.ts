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
  updateDoc,
  where,
} from "@firebase/firestore";
import {
  Comment,
  Notification,
  Post,
  PostWithUserReference,
  UserData,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { User } from "firebase/auth";

export const getUserByUID = async (uid: string): Promise<UserData | null> => {
  const userDocRef = doc(collection(db, "users"), uid);
  const userDocSnapshot = await getDoc(userDocRef);

  if (userDocSnapshot.exists()) {
    const userData = userDocSnapshot.data();
    return userData as UserData;
  } else {
    return null;
  }
};

export const useUserByUID = (uid: string) => {
  return useQuery(["user", uid], () => getUserByUID(uid));
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

export const useComments = (postId: string) => {
  return useQuery(["comments", postId], () => getAllComments(postId));
};

export const addLike = async (postId: string, userId: string) => {
  const postRef = doc(db, "posts", postId);
  const postSnapshot = await getDoc(postRef);
  const postData = postSnapshot.data() as PostWithUserReference;
  const postUserRef = postData.user as DocumentReference;
  const postUserDataSnapshot = await getDoc(postUserRef);

  if (postUserDataSnapshot.exists()) {
    const postUserData = postUserDataSnapshot.data() as UserData;

    const likesCollectionRef = collection(postRef, "likes");

    const likeDocRef = doc(likesCollectionRef, userId);
    const likeData = {
      timestamp: serverTimestamp(),
    };

    await setDoc(likeDocRef, likeData);

    // Dodawanie dokumentu do kolekcji "notifications"
    const notificationsCollectionRef = collection(db, "notifications");
    const userRef = doc(db, "users", userId);
    const notificationDocRef = doc(notificationsCollectionRef);
    const notificationData = {
      id: notificationDocRef.id,
      author: postUserData.uid,
      postId: postRef,
      userId: userRef,
      seen: false,
      timestamp: serverTimestamp(),
    };

    await setDoc(notificationDocRef, notificationData);
  } else {
    console.log("Dokument użytkownika nie istnieje");
  }
};

export const removeLike = async (postId: string, userId: string) => {
  const likeDocRef = doc(db, "posts", postId, "likes", userId);
  await deleteDoc(likeDocRef);

  const userRef = doc(db, "users", userId);
  const postRef = doc(db, "posts", postId);

  const userSnapshot = await getDoc(userRef);
  const userData = userSnapshot.data() as UserData;
  const postSnapshot = await getDoc(postRef);
  const postData = postSnapshot.data() as Post;

  const notificationsCollectionRef = collection(db, "notifications");
  const notificationsQuery = query(
    notificationsCollectionRef,
    where("userId", "==", userRef),
    where("postId", "==", postRef)
  );

  const notificationsSnapshot = await getDocs(notificationsQuery);
  notificationsSnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });
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

export const getPostById = async (postId: string): Promise<Post | null> => {
  const postRef = doc(db, "posts", postId);
  const docSnapshot = await getDoc(postRef);

  if (docSnapshot.exists()) {
    const post = docSnapshot.data() as Post;
    const userRef = post.user;
    const userSnapshot = await getDoc(userRef as any);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as UserData;

      const postWithUserData = {
        ...post,
        user: {
          uid: userData.uid,
          profileAvatar: userData.profileAvatar,
          username: userData.username,
        },
        id: postId,
      };

      return postWithUserData;
    }
  }

  return null;
};

export const usePostById = (postId: string) => {
  return useQuery<Post | null, Error>(["post", postId], () =>
    getPostById(postId)
  );
};

export const getNotificationsByUserId = async (userId: string) => {
  const notificationsCollectionRef = collection(db, "notifications");
  const notificationsQuery = query(
    notificationsCollectionRef,
    where("userId", "==", userId)
  );

  const notificationsSnapshot = await getDocs(notificationsQuery);
  const notifications: Notification[] = [];

  notificationsSnapshot.forEach((doc) => {
    const notification = doc.data() as Notification;
    notifications.push(notification);
  });

  return notifications;
};

export const getNotificationByAuthor = async (authorId: string) => {
  const notificationsCollectionRef = collection(db, "notifications");
  const querySnapshot = await getDocs(notificationsCollectionRef);

  const matchingNotifications = [];

  for (const notificationDoc of querySnapshot.docs) {
    const notificationData = notificationDoc.data();

    if (notificationData.author === authorId) {
      const postIdPath = notificationData.postId.path;
      const userIdPath = notificationData.userId.path;

      const postIdRef = doc(db, postIdPath);
      console.log("🚀 ~ postIdRef:", postIdRef);
      const userIdRef = doc(db, userIdPath);
      console.log("🚀 ~ userIdRef:", userIdRef);

      const [postSnapshot, userSnapshot] = await Promise.all([
        getDoc(postIdRef),
        getDoc(userIdRef),
      ]);

      const post = postSnapshot.data();
      const user = userSnapshot.data();

      const notification = {
        ...notificationData,
        postId: post,
        userId: user,
      };

      matchingNotifications.push(notification);
    }
  }

  return matchingNotifications;
};

export const useNotificationsByAuthor = (authorId: string) => {
  return useQuery(["notifications", authorId], () =>
    getNotificationByAuthor(authorId)
  );
};

export const markNotificationAsSeen = async (notificationId: string) => {
  const notificationRef = doc(db, "notifications", notificationId);
  const notificationSnapshot = await getDoc(notificationRef);

  if (notificationSnapshot.exists()) {
    await updateDoc(notificationRef, { seen: true });
  } else {
  }
};

export const markNotificationAsUnseen = async (notificationId: string) => {
  const notificationRef = doc(db, "notifications", notificationId);
  const notificationSnapshot = await getDoc(notificationRef);

  if (notificationSnapshot.exists()) {
    await updateDoc(notificationRef, { seen: false });
    console.log("Status notyfikacji został zaktualizowany.");
  } else {
    console.log("Notyfikacja o podanym ID nie istnieje.");
  }
};