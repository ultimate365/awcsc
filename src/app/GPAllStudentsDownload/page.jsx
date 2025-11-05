"use client";
import React, { Suspense } from "react";
import Loader from "@/components/Loader";
import GPAllStudentsDownload from "./GPAllStudentsDownload";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <GPAllStudentsDownload />
    </Suspense>
  );
}
