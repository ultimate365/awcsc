"use client";
import React, { useEffect } from "react";
import watermarkImage from "../images/AWCSC.png";
import Image from "next/image";
import useWindowSize from "@rooks/use-window-size";
const Watermark = () => {
  const { innerWidth } = useWindowSize();
  const calWidth = (w) => (innerWidth * w) / 100;

  useEffect(() => {
    console.log(calWidth(2));
    console.log(innerWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Image
        src={watermarkImage}
        width={calWidth(20)}
        height={calWidth(20)}
        alt="Watermark"
        className="watermark"
      />
    </>
  );
};
export default Watermark;
