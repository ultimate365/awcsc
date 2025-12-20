"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  enToBnNumber,
  getSubmitDateInput,
} from "../../modules/calculatefunctions";
import { BUTTONCOLORS, gpEngNames, gpNames } from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import dynamic from "next/dynamic";
import PrintPDFCircleTree from "../../pdf/PrintPDFCircleTree";
export default function PrintTreeList() {
  const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    }
  );
  const { yourStateObject } = useGlobalContext();
  const { data } = yourStateObject;
  const [filteredData, setFilteredData] = useState(data);
  const navigate = useRouter();
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
      <div className="my-2 noprint">
        {gpEngNames.map((gpEngName, index) => (
          <button
            type="button"
            className={`btn m-1 ${
              data?.length !== filteredData?.length
                ? gpEngName !== filteredData[0]?.gp
                  ? "btn-sm"
                  : ""
                : ""
            }`}
            style={{
              backgroundColor: BUTTONCOLORS[index],
              color: "white",
            }}
            onClick={() => {
              setFilteredData(data.filter((s) => s?.gp === gpEngName));
            }}
            key={index}
          >
            {gpEngName}
          </button>
        ))}
        {data?.length !== filteredData?.length && (
          <button
            type="button"
            className="btn btn-primary m-1 col-md-1"
            style={{
              backgroundColor: BUTTONCOLORS[gpEngNames.length + 1],
              color: "white",
            }}
            onClick={() => setFilteredData(data)}
          >
            All
          </button>
        )}
      </div>
      <h3 className="text-center m-2 text-black">
        আমতা পশ্চিম চক্র বার্ষিক ক্রীড়া প্রতিযোগিতা,-{" "}
        {enToBnNumber(new Date().getFullYear())}
      </h3>
      {data?.length !== filteredData?.length && (
        <h5 className="text-center m-2 text-black">
          GP: {filteredData[0]?.gp}
        </h5>
      )}
      {filteredData?.length > 0 && (
        <div className="my-4">
          <PDFDownloadLink
            document={
              <PrintPDFCircleTree
                data={filteredData}
                title={`Amta West Circle Sports ${
                  data?.length !== filteredData?.length
                    ? `${filteredData[0]?.gp} GP`
                    : `All`
                } Student List`}
              />
            }
            fileName={`Amta West Circle Sports ${
              data?.length !== filteredData?.length
                ? `${filteredData[0]?.gp} GP`
                : `All`
            } Student List.pdf`}
            style={{
              textDecoration: "none",
              padding: "10px",
              color: "#fff",
              backgroundColor: "navy",
              border: "1px solid #4a4a4a",
              width: "40%",
              borderRadius: 10,
              margin: 20,
              textAlign: "center",
            }}
          >
            {({ blob, url, loading, error }) =>
              loading ? "Loading..." : "Download Tree List"
            }
          </PDFDownloadLink>
          {/* <PrintPDFCircleTree
            data={filteredData}
            title={`Amta West Circle Sports ${
              data?.length !== filteredData?.length
                ? `${filteredData[0]?.gp} GP`
                : `All`
            } Student List`}
          /> */}
        </div>
      )}
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
          {filteredData?.length > 0 &&
            filteredData?.map((el, index) => (
              <tr key={index} className="nobreak">
                <td className="timesNewRoman">{index + 1}</td>
                <td className="timesNewRoman">{el?.chestNo}</td>
                <td className="timesNewRoman">{el?.school}</td>
                <td className="timesNewRoman">{el?.gp}</td>
                <td className="timesNewRoman">{el?.name}</td>
                <td className="timesNewRoman">{el?.gurdiansName}</td>
                <td className="timesNewRoman">
                  {getSubmitDateInput(el?.birthday)}
                </td>
                <td className="timesNewRoman">{el?.sclass}</td>
                <td
                  className="timesNewRoman"
                  style={{ verticalAlign: "center" }}
                >
                  {el?.group}, ({el?.gender})
                </td>
                <td className="timesNewRoman">
                  {el?.event1}
                  {el?.event2 !== ""
                    ? `${el?.event1 ? ", " : ""} ${el?.event2}`
                    : ""}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
