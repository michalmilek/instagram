import { DocumentReference, Timestamp } from "@firebase/firestore";

export interface UserData {
  username: string;
  profileAvatar: string;
  uid: string;
}

export interface Post {
  user: {
    uid: string;
    profileAvatar: string;
    username: string;
  };
  description: string;
  createdAt: Timestamp;
  imageURL: string;
  id: string;
}

export interface PostWithUserReference {
  user: DocumentReference | undefined;
  description: string;
  createdAt: Timestamp;
  imageURL: string;
  id: string;
}


export interface CommentData {}
export interface Comment {
  id: string;
  text: string;
  user: {
    uid: string;
    profileAvatar: string;
    username: string;
  };
  timestamp: Timestamp;
}


