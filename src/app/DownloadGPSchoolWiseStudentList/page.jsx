"use client";
import React, { Suspense } from "react";
import Loader from "@/components/Loader";
import DownloadGPSchoolWiseStudentList from "./DownloadGPSchoolWiseStudentList";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <DownloadGPSchoolWiseStudentList />
    </Suspense>
  );
}
