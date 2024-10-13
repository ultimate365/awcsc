"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  enToBnNumber,
  getSubmitDateInput,
} from "../../modules/calculatefunctions";
import { circleBenName, circleEngName } from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
const GPSchoolWiseStudentList = () => {
  const navigate = useRouter();
  const { stateArray } = useGlobalContext();
  const data = stateArray;
  const [boysData, setBoysData] = useState(
    data?.filter((el) => el?.gender === "BOYS")
  );
  const [boysGrAData, setBoysGrAData] = useState(
    data
      .filter((el) => el?.gender === "BOYS")
      .filter((el) => el?.group === "GROUP-A")
  );
  const [boysGrBData, setBoysGrBData] = useState(
    data
      .filter((el) => el?.gender === "BOYS")
      .filter((el) => el?.group === "GROUP-B")
  );
  const [boysGrCData, setBoysGrCData] = useState(
    data
      .filter((el) => el?.gender === "BOYS")
      .filter((el) => el?.group === "GROUP-C")
  );
  const [girlsData, setGirlsData] = useState(
    data?.filter((el) => el?.gender === "GIRLS")
  );
  const [girlsGrAData, setGirlsGrAData] = useState(
    data
      .filter((el) => el?.gender === "GIRLS")
      .filter((el) => el?.group === "GROUP-A")
  );
  const [girlsGrBData, setGirlsGrBData] = useState(
    data
      .filter((el) => el?.gender === "GIRLS")
      .filter((el) => el?.group === "GROUP-B")
  );
  const [girlsGrCData, setGirlsGrCData] = useState(
    data
      .filter((el) => el?.gender === "GIRLS")
      .filter((el) => el?.group === "GROUP-C")
  );
  const [girlsClicked, setGirlsClicked] = useState(false);

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
      if (teacherdetails.circleAssistant !== "admin") {
        navigate.push("/login");
      }
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {}, [
    boysData,
    boysGrAData,
    boysGrBData,
    boysGrCData,
    girlsData,
    girlsGrAData,
    girlsGrBData,
    girlsGrCData,
  ]);
  useEffect(() => {
    document.title = `${circleEngName} ${
      !girlsClicked ? "Boys Participants" : "Girls Participants"
    }`;
    // eslint-disable-next-line
  }, [girlsClicked]);
  return (
    <div className="container-fluid ben mt-2 bg-white">
      <div className="noprint">
        <button
          type="button"
          className="btn btn-success m-1 col-md-1 btn-sm"
          onClick={() => setGirlsClicked(!girlsClicked)}
        >
          {girlsClicked ? "Boys List" : "Girls List"}
        </button>
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

      <div>
        {!girlsClicked ? (
          <div className="container-fluid my-2" style={{ zoom: 0.7 }}>
            <h3 className="text-center ben text-black">
              {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগীতা, রেজাল্ট শিট{" "}
              {enToBnNumber(new Date().getFullYear())}
            </h3>
            <div className="container-fluid row justify-content-between align-items-center my-2 p-1">
              <div className="col-md-5 justify-content-center align-items-center">
                <h6 className="text-center text-black m-0 p-0 border border-0 border-bottom-1">
                  চক্রের নামঃ {circleBenName}
                </h6>
              </div>
              <div className="col-md-2 justify-content-center align-items-center bg-black">
                <h6 className="text-center text-white m-0 p-1">BOYS</h6>
              </div>
            </div>
            <div className="container-fluid">
              {" "}
              <table className="table table-bordered border-black">
                <thead>
                  <tr>
                    <th>ক্রমিক নং</th>
                    <th>চেস্ট নং</th>
                    <th>প্রতিযোগীর নাম</th>
                    <th>পিতার / অভিভাবকের নাম</th>
                    <th>জন্মতারিখ</th>
                    <th>শ্রেনী</th>
                    <th>বিভাগ</th>
                    <th>প্রতিযোগিতার নাম</th>
                  </tr>
                  <tr>
                    <th colSpan={8}>
                      বিভাগ 'ক' বালক (জন্মতারিখ{" "}
                      {`01-01-${new Date().getFullYear() - 7}`} বা তারপর)
                    </th>
                  </tr>
                  {boysGrAData
                    ?.sort((b, a) => b?.event1rank - a?.event1rank)
                    .map((el, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{el?.chestNo}</td>
                        <td>{el?.name}</td>
                        <td>{el?.gurdiansName}</td>
                        <td>{getSubmitDateInput(el?.birthday)}</td>
                        <td>{el?.sclass}</td>
                        <td>{el?.group}</td>
                        <td>
                          {el?.event1}
                          {el?.event2 !== "" ? `, ${el?.event2}` : ""}
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <th colSpan={8}>
                      বিভাগ 'খ' বালক (জন্মতারিখ{" "}
                      {`01-01-${new Date().getFullYear() - 9}`} বা তারপর)
                    </th>
                  </tr>
                  {boysGrBData
                    ?.sort((b, a) => b?.event1rank - a?.event1rank)
                    .map((el, index) => (
                      <tr key={index}>
                        <td>{index + 4}</td>
                        <td>{el?.chestNo}</td>
                        <td>{el?.name}</td>
                        <td>{el?.gurdiansName}</td>
                        <td>{getSubmitDateInput(el?.birthday)}</td>
                        <td>{el?.sclass}</td>
                        <td>{el?.group}</td>
                        <td>
                          {el?.event1}
                          {el?.event2 !== "" ? `, ${el?.event2}` : ""}
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <th colSpan={8}>
                      বিভাগ 'গ' বালক (জন্মতারিখ{" "}
                      {`01-01-${new Date().getFullYear() - 11}`} বা তারপর)
                    </th>
                  </tr>
                  {boysGrCData
                    ?.sort((b, a) => b?.event1rank - a?.event1rank)
                    .map((el, index) => (
                      <tr key={index}>
                        <td>{index + 10}</td>
                        <td>{el?.chestNo}</td>
                        <td>{el?.name}</td>
                        <td>{el?.gurdiansName}</td>
                        <td>{getSubmitDateInput(el?.birthday)}</td>
                        <td>{el?.sclass}</td>
                        <td>{el?.group}</td>
                        <td>
                          {el?.event1}
                          {el?.event2 !== "" ? `, ${el?.event2}` : ""}
                        </td>
                      </tr>
                    ))}
                </thead>
              </table>
            </div>
            <div className="container-fluid row justify-content-between align-items-center my-2 p-1">
              <div className="col-md-2 justify-content-center align-items-center">
                <h6 className="text-center text-black m-0 p-0 border border-0 border-bottom-1">
                  তারিখঃ{" "}
                  {`${new Date().getDate()}-${
                    new Date().getMonth() + 1
                  }-${new Date().getFullYear()}`}
                </h6>
              </div>
              <div className="col-md-3 justify-content-center align-items-center">
                <h6 className="text-center text-black m-0 p-1">
                  চক্র আহ্বায়কের স্বাক্ষর
                </h6>
                <h6 className="text-center text-black m-0 p-1">
                  ...............................................
                </h6>
              </div>
            </div>
            {/* <h6 className="text-center text-black mx-auto p-1">
            গুরুত্বপূর্ণ নোট: * প্রতিযোগীর সমস্ত তথ্য ইংরাজী Capital Letter -এ
            পূরণ করবেন। ** সমস্ত প্রতিযোগীর জন্মপ্রমাণপত্রের/ জন্ম তারিখ
            প্রমাণকারী নথির জেরক্স কপি অবশ্যই এই কাগজটির সাথে সংযুক্ত করে দেবেন।
            *** গ্রাম-পঞ্চায়েত Sports Convenor -এর কাছে তালিকা জমা করার শেষ সময়ঃ
            {`   -01-${new Date().getFullYear()}`} বেলা ১২টা।
          </h6> */}
            <div className="noprint">
              <button
                type="button"
                className="btn btn-success m-1 col-md-1 btn-sm"
                onClick={() => setGirlsClicked(!girlsClicked)}
              >
                {girlsClicked ? "Boys List" : "Girls List"}
              </button>
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
          </div>
        ) : (
          <div className="container-fluid my-2" style={{ zoom: 0.7 }}>
            <h3 className="text-center ben text-black">
              {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগীতা, রেজাল্ট শিট{" "}
              {enToBnNumber(new Date().getFullYear())}
            </h3>
            <div className="container-fluid row justify-content-between align-items-center my-2 p-1">
              <div className="col-md-5 justify-content-center align-items-center">
                <h6 className="text-center text-black m-0 p-0 border border-0 border-bottom-1">
                  চক্রের নামঃ {circleBenName}
                </h6>
              </div>
              <div className="col-md-2 justify-content-center align-items-center bg-black">
                <h6 className="text-center text-white m-0 p-1">GIRLS</h6>
              </div>
            </div>
            <table className="table table-bordered border-black">
              <thead>
                <tr>
                  <th>ক্রমিক নং</th>
                  <th>চেস্ট নং</th>
                  <th>প্রতিযোগীর নাম</th>
                  <th>পিতার / অভিভাবকের নাম</th>
                  <th>জন্মতারিখ</th>
                  <th>শ্রেনী</th>
                  <th>বিভাগ</th>
                  <th>প্রতিযোগিতার নাম</th>
                </tr>
                <tr>
                  <th colSpan={8}>
                    বিভাগ 'ক' বালিকা (জন্মতারিখ{" "}
                    {`01-01-${new Date().getFullYear() - 7}`} বা তারপর)
                  </th>
                </tr>
                {girlsGrAData
                  ?.sort((b, a) => b?.event1rank - a?.event1rank)
                  .map((el, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{el?.chestNo}</td>
                      <td>{el?.name}</td>
                      <td>{el?.gurdiansName}</td>
                      <td>{getSubmitDateInput(el?.birthday)}</td>
                      <td>{el?.sclass}</td>
                      <td>{el?.group}</td>
                      <td>
                        {el?.event1}
                        {el?.event2 !== "" ? `, ${el?.event2}` : ""}
                      </td>
                    </tr>
                  ))}
                <tr>
                  <th colSpan={8}>
                    বিভাগ 'খ' বালিকা (জন্মতারিখ{" "}
                    {`01-01-${new Date().getFullYear() - 9}`} বা তারপর)
                  </th>
                </tr>
                {girlsGrBData
                  ?.sort((b, a) => b?.event1rank - a?.event1rank)
                  .map((el, index) => (
                    <tr key={index}>
                      <td>{index + 4}</td>
                      <td>{el?.chestNo}</td>
                      <td>{el?.name}</td>
                      <td>{el?.gurdiansName}</td>
                      <td>{getSubmitDateInput(el?.birthday)}</td>
                      <td>{el?.sclass}</td>
                      <td>{el?.group}</td>
                      <td>
                        {el?.event1}
                        {el?.event2 !== "" ? `, ${el?.event2}` : ""}
                      </td>
                    </tr>
                  ))}
                <tr>
                  <th colSpan={8}>
                    বিভাগ 'গ' বালিকা (জন্মতারিখ{" "}
                    {`01-01-${new Date().getFullYear() - 11}`} বা তারপর)
                  </th>
                </tr>
                {girlsGrCData
                  ?.sort((b, a) => b?.event1rank - a?.event1rank)
                  .map((el, index) => (
                    <tr key={index}>
                      <td>{index + 10}</td>
                      <td>{el?.chestNo}</td>
                      <td>{el?.name}</td>
                      <td>{el?.gurdiansName}</td>
                      <td>{getSubmitDateInput(el?.birthday)}</td>
                      <td>{el?.sclass}</td>
                      <td>{el?.group}</td>
                      <td>
                        {el?.event1}
                        {el?.event2 !== "" ? `, ${el?.event2}` : ""}
                      </td>
                    </tr>
                  ))}
              </thead>
            </table>
            <div className="container-fluid row justify-content-between align-items-center my-2 p-1">
              <div className="col-md-2 justify-content-center align-items-center">
                <h6 className="text-center text-black m-0 p-0 border border-0 border-bottom-1">
                  তারিখঃ{" "}
                  {`${new Date().getDate()}-${
                    new Date().getMonth() + 1
                  }-${new Date().getFullYear()}`}
                </h6>
              </div>
              <div className="col-md-3 justify-content-center align-items-center">
                <h6 className="text-center text-black m-0 p-1">
                  চক্র আহ্বায়কের স্বাক্ষর
                </h6>
                <h6 className="text-center text-black m-0 p-1">
                  ...............................................
                </h6>
              </div>
            </div>
            {/* <h6 className="text-center text-black mx-auto p-1">
            গুরুত্বপূর্ণ নোট: * প্রতিযোগীর সমস্ত তথ্য ইংরাজী Capital Letter -এ
            পূরণ করবেন। ** সমস্ত প্রতিযোগীর জন্মপ্রমাণপত্রের/ জন্ম তারিখ
            প্রমাণকারী নথির জেরক্স কপি অবশ্যই এই কাগজটির সাথে সংযুক্ত করে দেবেন।
            *** গ্রাম-পঞ্চায়েত Sports Convenor -এর কাছে তালিকা জমা করার শেষ সময়ঃ
            {`   -01-${new Date().getFullYear()}`} বেলা ১২টা।
          </h6> */}
            <div className="noprint">
              <button
                type="button"
                className="btn btn-success m-1 col-md-1 btn-sm"
                onClick={() => setGirlsClicked(!girlsClicked)}
              >
                {girlsClicked ? "Boys List" : "Girls List"}
              </button>
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
                onClick={() => {
                  if (typeof window !== undefined) {
                    window.print();
                  }
                }}
              >
                Print
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GPSchoolWiseStudentList;
