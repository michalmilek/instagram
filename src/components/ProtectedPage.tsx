"use client";

import { AuthContext } from "@/firebase/AuthContext";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useContext } from "react";

const ProtectedPage = ({ children }: PropsWithChildren) => {
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  if (!currentUser) {
    router.push("/login");
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        User not logged in
      </div>
    );
  }

  return <div>{children}</div>;
};

export default ProtectedPage;
