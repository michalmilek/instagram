"use client";

import Sidebar from "@/components/Sidebar";
import StoriesCarousel from "@/components/StoriesCarousel";
import Post from "@/components/Post";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/firebase/AuthContext";
import InstagramLogout from "@/components/InstagramLogout";

export default function Home() {
  //@ts-ignore
  const { currentUser } = useContext(AuthContext);

  const router = useRouter();

  if (!currentUser) {
    router.push("/login");

    return <div>User not logged in</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex items-center">
        <Sidebar />
        <div className="ml-[250px] mr-[400px] flex flex-col items-center gap-10">
          <StoriesCarousel />
          <div className="flex flex-col gap-6">
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
        </div>
        <InstagramLogout />
      </div>
    </main>
  );
}
