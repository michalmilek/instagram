"use client";

import React from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  console.log("🚀 ~ params:", id);

  return <div>test</div>;
};

export default Page;
