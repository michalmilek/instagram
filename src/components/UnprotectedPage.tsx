"use client";

import { AuthContext } from "@/firebase/AuthContext";
import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useContext } from "react";

const UnprotectedPage = ({ children }: PropsWithChildren) => {
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  if (currentUser) {
    router.push("/");
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return <div>{children}</div>;
};

export default UnprotectedPage;
