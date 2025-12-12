"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  gpEngNames,
  BOYS_ALL_EVENTS,
  GIRLS_ALL_EVENTS,
} from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import CircleChestNoSheet from "../../pdf/CircleChestNoSheet";
import dynamic from "next/dynamic";
export default function CircleOfficeChestNoSheet() {
  const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    }
  );
  const { yourStateObject } = useGlobalContext();
  const { data } = yourStateObject;
  const navigate = useRouter();
  const [isBoys, setIsBoys] = useState(true);
  const BoysData = data?.filter((el) => el?.gender === "BOYS");
  const GirlsData = data?.filter((el) => el?.gender === "GIRLS");
  let teacherdetails;
  let details = getCookie("tid");

  if (details) {
    teacherdetails = decryptObjData("tid");
  }

  useEffect(() => {
    if (teacherdetails.circle !== "admin") {
      if (teacherdetails.circleAssistant !== "admin") {
        navigate.push("/Login");
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
      <div className="noprint my-3">
        <PDFDownloadLink
          document={
            <CircleChestNoSheet BoysData={BoysData} GirlsData={GirlsData} />
          }
          fileName={`Amta West Circle Sports ${new Date().getFullYear()} Eventwise All Chest No`}
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
      <div className="noprint my-3">
        <button
          type="button"
          className="btn btn-success m-1 col-md-1 btn-sm"
          onClick={() => setIsBoys(!isBoys)}
        >
          {isBoys ? "Girls List" : "Boys List"}
        </button>
      </div>
      <h4 className="my-1">
        Amta West Circle Sports {new Date().getFullYear()} Eventwise All Chest
        No.
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
                {gpEngNames.map((gpEngName, index) => (
                  <th style={{ fontSize: 10 }} key={index}>
                    {gpEngName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BOYS_ALL_EVENTS.map((e, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 13 }}>{e}</td>
                  {BoysData?.filter(
                    (el) =>
                      `${el?.gender} ${el?.group} ${el?.event1}` === e ||
                      `${el?.gender} ${el?.group} ${el?.event2}` === e
                  )?.map((b, index) => (
                    <td key={index}>{b?.chestNo}</td>
                  ))}
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
                {gpEngNames.map((gpEngName, index) => (
                  <th style={{ fontSize: 10 }}>{gpEngName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GIRLS_ALL_EVENTS.map((e, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 13 }}>{e}</td>
                  {GirlsData?.filter(
                    (el) =>
                      `${el?.gender} ${el?.group} ${el?.event1}` === e ||
                      `${el?.gender} ${el?.group} ${el?.event2}` === e
                  )?.map((b, index) => (
                    <td key={index}>{b?.chestNo}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
