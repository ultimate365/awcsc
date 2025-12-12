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
  const { stateObject } = useGlobalContext();
  const { data, gp } = stateObject;
  const navigate = useRouter();
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
    if (teacherdetails.circle !== "admin") {
      if (teacherdetails.convenor !== "admin") {
        if (teacherdetails.gpAssistant !== "admin") {
          navigate.push("/Login");
        }
      }
    }
    document.title = `${gp} GP Sports All Student List`;
    // eslint-disable-next-line
  }, []);
  return (
    <div className="container-fluid text-center">
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
      <h3 className="text-center m-2 text-black ben">
        {gpNames.filter((el) => el?.englishName === gp)[0]?.bengaliName}{" "}
        গ্রাম-পঞ্চায়েত বার্ষিক ক্রীড়া প্রতিযোগীতা,-{" "}
        {enToBnNumber(new Date().getFullYear())}
      </h3>
      <table className="table table-bordered border-black">
        <thead className="ben">
          <tr>
            <th>ক্রমিক নং</th>
            <th>চেস্ট নং</th>
            <th>বিদ্যালয়ের নাম</th>
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
                <td
                  className="timesNewRoman"
                  style={{ verticalAlign: "center", fontSize: 11 }}
                >
                  {index + 1}
                </td>
                <td
                  className="timesNewRoman"
                  style={{ verticalAlign: "center", fontSize: 11 }}
                >
                  {el?.chestNo}
                </td>
                <td
                  className="timesNewRoman"
                  style={{ verticalAlign: "center", fontSize: 11 }}
                >
                  {el?.school}
                </td>
                {/* <td style={{verticalAlign:"center",fontSize:11}}>{el?.school?.split(" ").map((e, i) => `${e.slice(0, 1)}. `)}</td> */}
                <td
                  className="timesNewRoman"
                  style={{ verticalAlign: "center", fontSize: 11 }}
                >
                  {el?.name}
                </td>
                <td
                  className="timesNewRoman"
                  style={{ verticalAlign: "center", fontSize: 11 }}
                >
                  {el?.gurdiansName}
                </td>
                <td
                  className="timesNewRoman"
                  style={{ verticalAlign: "center", fontSize: 11 }}
                >
                  {getSubmitDateInput(el?.birthday)}
                </td>
                <td
                  className="timesNewRoman"
                  style={{ verticalAlign: "center", fontSize: 11 }}
                >
                  {el?.sclass}
                </td>
                <td
                  className="timesNewRoman"
                  style={{ verticalAlign: "center", fontSize: 11 }}
                >
                  {el?.group}, ({el?.gender})
                </td>
                <td
                  className="timesNewRoman"
                  style={{ verticalAlign: "center", fontSize: 11 }}
                >
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
