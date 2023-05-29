import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Timestamp,
} from "@firebase/firestore";

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

export interface Notification {
  id: string;
  author: string;
  postId: PostWithUserReference;
  seen: boolean;
  timestamp: Timestamp;
  userId: UserData;
}

export interface NotificationData {
  id: string;
  author: string;
  postId: Post;
  seen: boolean;
  timestamp: Timestamp;
  userId: UserData;
}

export interface NotificationData2 {
  author: string;
  id: string;
  postId: {
    createdAt: {
      seconds: number;
      nanoseconds: number;
    };
    description: string;
    user: {
      converter: null;
      _key: {
        path: {
          segments: string[];
          offset: number;
          len: number;
        };
      };
      type: string;
      firestore: {
        app: {
          _isDeleted: false;
          _options: {
            apiKey: string;
            authDomain: string;
            projectId: string;
            storageBucket: string;
            messagingSenderId: string;
            appId: string;
            measurementId: string;
          };
          _config: {
            name: string;
            automaticDataCollectionEnabled: false;
          };
          _name: string;
          _automaticDataCollectionEnabled: false;
          _container: {
            name: string;
            providers: {};
          };
        };
        databaseId: {
          projectId: string;
          database: string;
        };
        settings: {
          host: string;
          ssl: boolean;
          ignoreUndefinedProperties: false;
          cacheSizeBytes: number;
          experimentalForceLongPolling: false;
          experimentalAutoDetectLongPolling: true;
          experimentalLongPollingOptions: {};
          useFetchStreams: true;
        };
      };
    };
    postId: string;
    imageURL: string;
  };
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  seen: boolean;
  userId: {
    profileAvatar: string;
    uid: string;
    username: string;
  };
}


export interface StoryData {
  fileUrl: string;
  expirationDate: any;
  userId: any;
  storyId: string;
}