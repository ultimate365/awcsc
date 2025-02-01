"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { enToBnNumber } from "../../modules/calculatefunctions";
import { gpNames } from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import dynamic from "next/dynamic";
import CircleEventList from "../../pdf/CircleEventList";
export default function CircleDownloadEventSheets() {
  const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    }
  );
  const { myStateObject } = useGlobalContext();

  const navigate = useRouter();

  const { group, engEventName } = myStateObject;
  let teacherdetails;
  let details = getCookie("tid");
  let schdetails = getCookie("schid");
  if (details) {
    teacherdetails = decryptObjData("tid");
  }
  if (schdetails) {
    schdetails = decryptObjData("schid");
  }

  useEffect(() => {
    if (!details) {
      if (
        teacherdetails.circle !== "admin" ||
        teacherdetails.convenor !== "admin"
      ) {
        navigate.push("/logout");
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container-fluid my-5">
      <div className="noprint my-2">
        <button
          type="button"
          className="btn btn-warning my-4 btn-sm"
          onClick={() => navigate.push("/CircleAllStudents")}
        >
          Go Back
        </button>
      </div>
      <PDFDownloadLink
        document={<CircleEventList myData={myStateObject} />}
        fileName={`Circle Event Sheets of ${group}, ${engEventName}`}
        style={{
          textDecoration: "none",
          padding: "10px",
          color: "#fff",
          backgroundColor: "navy",
          border: "1px solid #4a4a4a",
          width: "40%",
          borderRadius: 10,
        }}
      >
        {({ blob, url, loading, error }) =>
          loading ? "Loading..." : "Download Event Sheet"
        }
      </PDFDownloadLink>
    </div>
  );
}
