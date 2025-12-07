"use client";
import React, { Suspense } from "react";
import Loader from "@/components/Loader";
import AlternateLogin from "./AlternateLogin";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <AlternateLogin />
    </Suspense>
  );
}
