"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { enToBnNumber } from "../../modules/calculatefunctions";
import {
  gpNames,
  BOYS_ALL_EVENTS,
  GIRLS_ALL_EVENTS,
} from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import GPChestNoSheet from "../../pdf/GPChestNoSheet";
import dynamic from "next/dynamic";
export default function CircleOfficeChestNoSheet() {
  const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    }
  );
  const { stateObject, schoolState } = useGlobalContext();
  const { data, gp } = stateObject;
  const newData = data?.sort((a, b) => {
    if (a.gp < b.gp) return -1;
    if (a.gp > b.gp) return 1;
    if (a.gender < b.gender) return -1;
    if (a.gender > b.gender) return 1;
    if (a.school < b.school) return -1;
    if (a.school > b.school) return 1;
    if (a.event1rank < b.event1rank) return -1;
    if (a.event1rank > b.event1rank) return 1;
    return 0;
  });
  const navigate = useRouter();
  const [isBoys, setIsBoys] = useState(true);
  const BoysData = newData?.filter((el) => el?.gender === "BOYS");
  const GirlsData = newData?.filter((el) => el?.gender === "GIRLS");
  const GPSchools = schoolState
    ?.filter((el) => el?.gp === gp)
    .sort((a, b) => {
      if (a.school < b.school) return -1;
      if (a.school > b.school) return 1;
      return 0;
    });
  let teacherdetails;
  let details = getCookie("tid");

  if (details) {
    teacherdetails = decryptObjData("tid");
  }

  useEffect(() => {
    if (teacherdetails.circle !== "admin") {
      if (teacherdetails.circleAssistant !== "admin") {
        if (teacherdetails.convenor !== "admin") {
          if (teacherdetails.gpAssistant !== "admin") {
            navigate.push("/Login");
          }
        }
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
          onClick={() => navigate.push("/GPAllStudents")}
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
      <div className="noprint my-3">
        <PDFDownloadLink
          document={
            <GPChestNoSheet
              BoysData={BoysData}
              GirlsData={GirlsData}
              gp={gp}
              GPSchools={GPSchools}
            />
          }
          fileName={`${
            gpNames.filter((el) => el?.englishName === gp)[0]?.englishName
          } GP ANNUAL SPORTS -${new Date().getFullYear()}, Eventwise All Chest No`}
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
            loading ? "Loading..." : "Download All Chest No. Sheet"
          }
        </PDFDownloadLink>
      </div>
      <div className="noprint">
        <button
          type="button"
          className="btn btn-success m-1 col-md-1 btn-sm"
          onClick={() => setIsBoys(!isBoys)}
        >
          {isBoys ? "Girls List" : "Boys List"}
        </button>
      </div>
      <h4 className="my-1">
        {gpNames.filter((el) => el?.englishName === gp)[0]?.bengaliName} গ্রাম
        পঞ্চায়েত বার্ষিক ক্রীড়া প্রতিযোগিতা{" - "}
        {enToBnNumber(new Date().getFullYear())}, Eventwise All Chest No.
      </h4>
      {isBoys ? (
        <div>
          <h4>BOYS</h4>
          <table
            className="table table-bordered border-black mx-auto"
            style={{
              width: "100%",
              borderWidth: 2,
              borderColor: "black",
              verticalAlign: "middle",
            }}
          >
            <thead>
              <tr>
                <th>EVENT</th>
                {GPSchools.map((schoolName, index) => (
                  <th style={{ fontSize: 10 }} key={index}>
                    {schoolName?.school}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BOYS_ALL_EVENTS.map((e, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 10 }}>{e}</td>
                  {GPSchools?.map((b, index) => {
                    return (
                      <td key={index}>
                        {
                          BoysData?.filter(
                            (el) =>
                              (`${el?.gender} ${el?.group} ${el?.event1}` ===
                                e &&
                                el?.udise === b?.udise) ||
                              (`${el?.gender} ${el?.group} ${el?.event2}` ===
                                e &&
                                el?.udise === b?.udise)
                          )[0]?.chestNo
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h4>GIRLS</h4>
          <table
            className="table table-bordered border-black mx-auto"
            style={{
              width: "100%",
              borderWidth: 2,
              borderColor: "black",
              verticalAlign: "middle",
            }}
          >
            <thead>
              <tr>
                <th>EVENT</th>
                {GPSchools.map((schoolName, index) => (
                  <th style={{ fontSize: 10 }} key={index}>
                    {schoolName?.school}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GIRLS_ALL_EVENTS.map((e, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 10 }}>{e}</td>
                  {GPSchools?.map((b, index) => {
                    return (
                      <td key={index}>
                        {
                          GirlsData?.filter(
                            (el) =>
                              (`${el?.gender} ${el?.group} ${el?.event1}` ===
                                e &&
                                el?.udise === b?.udise) ||
                              (`${el?.gender} ${el?.group} ${el?.event2}` ===
                                e &&
                                el?.udise === b?.udise)
                          )[0]?.chestNo
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
