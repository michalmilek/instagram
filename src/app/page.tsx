"use client";

import Sidebar from "@/components/Sidebar";
import StoriesCarousel from "@/components/StoriesCarousel";
import Post from "@/components/Post";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex items-center">
        <Sidebar />
        <div className="ml-[250px] flex flex-col items-center gap-10">
          <StoriesCarousel />
          <div className="flex flex-col gap-6">
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
        </div>
      </div>
    </main>
  );
}
