"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  enToBnNumber,
  getSubmitDateInput,
} from "../../modules/calculatefunctions";
import { gpNames } from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";

export default function PrintTreeList() {
  const { yourStateObject } = useGlobalContext();
  const { data } = yourStateObject;
  const navigate = useRouter();
  let teacherdetails;
  let details = getCookie("tid");

  if (details) {
    teacherdetails = decryptObjData("tid");
  }

  useEffect(() => {
    if (teacherdetails.circle !== "admin") {
      if (teacherdetails.circleAssistant !== "admin") {
        navigate.push("/login");
      }
    }
    document.title = `Amta West Circle Sports ${new Date().getFullYear()} All Student List`;
    // eslint-disable-next-line
  }, []);
  return (
    <div className="container-fluid ben text-center">
      <div className="noprint">
        <button
          type="button"
          className="btn btn-warning m-1 col-md-1 btn-sm"
          onClick={() => navigate.back()}
        >
          Go Back
        </button>
        <button
          type="button"
          className="btn btn-info m-1 col-md-1 btn-sm"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>
      <h3 className="text-center m-2 text-black">
        আমতা পশ্চিম চক্র বার্ষিক ক্রীড়া প্রতিযোগীতা,-{" "}
        {enToBnNumber(new Date().getFullYear())}
      </h3>
      <table
        className="table table-bordered border-black mx-auto"
        style={{
          width: "100%",
        }}
      >
        <thead>
          <tr>
            <th>ক্রমিক নং</th>
            <th>চেস্ট নং</th>
            <th>বিদ্যালয়ের নাম</th>
            <th>গ্রাম পঞ্চায়েত</th>
            <th>প্রতিযোগীর নাম</th>
            <th>পিতার / অভিভাবকের নাম</th>
            <th>জন্মতারিখ</th>
            <th>শ্রেনী</th>
            <th>বিভাগ</th>
            <th>প্রতিযোগিতার নাম</th>
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 &&
            data?.map((el, index) => (
              <tr key={index} className="nobreak">
                <td className="timesNewRoman">{index + 1}</td>
                <td className="timesNewRoman">{el?.chestNo}</td>
                <td className="timesNewRoman" style={{ fontSize: 12 }}>
                  {el?.school}
                </td>
                <td className="timesNewRoman">{el?.gp}</td>
                {/* <td>{el?.school?.split(" ").map((e, i) => `${e.slice(0, 1)}. `)}</td> */}
                <td className="timesNewRoman">{el?.name}</td>
                <td className="timesNewRoman">{el?.gurdiansName}</td>
                <td className="timesNewRoman">
                  {getSubmitDateInput(el?.birthday)}
                </td>
                <td className="timesNewRoman">{el?.sclass}</td>
                <td
                  className="timesNewRoman"
                  style={{ verticalAlign: "center", fontSize: 12 }}
                >
                  {el?.group}, ({el?.gender})
                </td>
                <td className="timesNewRoman">
                  {el?.event1}
                  {el?.event2 !== "" ? `, ${el?.event2}` : ""}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
