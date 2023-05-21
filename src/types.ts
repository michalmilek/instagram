import { Timestamp } from "@firebase/firestore";

export interface UserData {
  username: string;
  profileAvatar: string;
  uid: string;
}

export interface PostData {
  description: string;
  imageURL: string;
  profileAvatar: string;
  username: string;
  user_uid: string;
  id: string;
}

export interface Comment {
  id: string;
  user_uid: string;
  text: string;
  username: string;
  profileAvatar: string;
  timestamp: Timestamp;
}
