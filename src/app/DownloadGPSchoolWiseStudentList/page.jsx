"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  enToBnNumber,
  getSubmitDateInput,
} from "../../modules/calculatefunctions";
import { gpNames } from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import { collection, getDocs, query, where } from "firebase/firestore";
import Loader from "@/components/Loader";
import { firestore } from "@/context/FirbaseContext";
import { toast, ToastContainer } from "react-toastify";
const GPSchoolWiseStudentList = () => {
  const searchParams = useSearchParams();
  const school = searchParams.get("school");
  const udise = searchParams.get("udise");
  const navigate = useRouter();
  const [allData, setAllData] = useState([]);
  const [thisGp, setThisGp] = useState("");
  const [boysData, setBoysData] = useState([]);
  const [boysGrAData, setBoysGrAData] = useState([]);
  const [boysGrBData, setBoysGrBData] = useState([]);
  const [boysGrCData, setBoysGrCData] = useState([]);
  const [girlsData, setGirlsData] = useState([]);
  const [girlsGrAData, setGirlsGrAData] = useState([]);
  const [girlsGrBData, setGirlsGrBData] = useState([]);
  const [girlsGrCData, setGirlsGrCData] = useState([]);
  const [girlsClicked, setGirlsClicked] = useState(false);
  const [loader, setLoader] = useState(false);

  const getData = async () => {
    try {
      setLoader(true);
      const q = query(
        collection(firestore, "gpSportsStudentData"),
        where("udise", "==", udise)
      );
      const querySnapshot = await getDocs(q);
      const studentData = querySnapshot.docs.map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        ...doc.data(),
        // id: doc.id,
      }));
      const data = studentData
        .filter((el) => el.school === school)
        .sort((a, b) => {
          if (a.gender < b.gender) return -1;
          if (a.gender > b.gender) return 1;
          if (a.event1rank < b.event1rank) return -1;
          if (a.event1rank > b.event1rank) return 1;
          return 0;
        });
      if (data.length > 0) {
        setAllData(data);
        setBoysData(data.filter((el) => el?.gender === "BOYS"));
        setBoysGrAData(
          data
            .filter((el) => el?.gender === "BOYS")
            .filter((el) => el?.group === "GROUP-A")
        );
        setBoysGrBData(
          data
            .filter((el) => el?.gender === "BOYS")
            .filter((el) => el?.group === "GROUP-B")
        );
        setBoysGrCData(
          data
            .filter((el) => el?.gender === "BOYS")
            .filter((el) => el?.group === "GROUP-C")
        );
        setGirlsData(data.filter((el) => el?.gender === "GIRLS"));
        setGirlsGrAData(
          data
            .filter((el) => el?.gender === "GIRLS")
            .filter((el) => el?.group === "GROUP-A")
        );
        setGirlsGrBData(
          data
            .filter((el) => el?.gender === "GIRLS")
            .filter((el) => el?.group === "GROUP-B")
        );
        setGirlsGrCData(
          data
            .filter((el) => el?.gender === "GIRLS")
            .filter((el) => el?.group === "GROUP-C")
        );
        setLoader(false);
      } else {
        setLoader(false);
        toast.error("No Data Found");
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {}, [
    allData,
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
    document.title = `${allData[0]?.school} Schools ${
      !girlsClicked ? "Boys Participants" : "Girls Participants"
    }`;
    setThisGp(
      gpNames.filter((el) => el?.englishName === allData[0]?.gp)[0]?.bengaliName
    );
  }, [thisGp, girlsClicked, allData]);
  return (
    <Suspense fallback={<Loader />}>
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
        {!girlsClicked ? (
          <div className="container-fluid my-2" style={{ zoom: 0.7 }}>
            <h3 className="text-center text-black my-2">
              {thisGp} গ্রাম-পঞ্চায়েত বার্ষিক ক্রীড়া প্রতিযোগিতা,-{" "}
              {enToBnNumber(new Date().getFullYear())}
            </h3>
            <div className="container-fluid row justify-content-between align-items-center my-2 p-1">
              <div className="col-md-5 justify-content-center align-items-center">
                <h6 className="text-center text-black m-0 p-0 border border-0 border-bottom-1">
                  বিদ্যালয়ের নামঃ {allData[0]?.school}
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
                    <th>বিদ্যালয়ের নাম</th>
                    <th>প্রতিযোগিতার নাম</th>
                  </tr>
                  <tr>
                    <th colSpan={9}>
                      বিভাগ 'ক' বালক (জন্মতারিখ{" "}
                      {`01-01-${new Date().getFullYear() - 7}`} বা তারপর)
                    </th>
                  </tr>
                  {boysGrAData
                    .sort((b, a) => b.event1rank - a.event1rank)
                    .map((el, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{el?.chestNo}</td>
                        <td>{el?.name}</td>
                        <td>{el?.gurdiansName}</td>
                        <td>{getSubmitDateInput(el?.birthday)}</td>
                        <td>{el?.sclass}</td>
                        <td>{el?.school}</td>
                        <td>
                          {el?.event1}
                          {el?.event2 !== "" ? `, ${el?.event2}` : ""}
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <th colSpan={9}>
                      বিভাগ 'খ' বালক (জন্মতারিখ{" "}
                      {`01-01-${new Date().getFullYear() - 9}`} বা তারপর)
                    </th>
                  </tr>
                  {boysGrBData
                    .sort((b, a) => b.event1rank - a.event1rank)
                    .map((el, index) => (
                      <tr key={index}>
                        <td>{boysGrAData?.length + (index + 1)}</td>
                        <td>{el?.chestNo}</td>
                        <td>{el?.name}</td>
                        <td>{el?.gurdiansName}</td>
                        <td>{getSubmitDateInput(el?.birthday)}</td>
                        <td>{el?.sclass}</td>
                        <td>{el?.school}</td>
                        <td>
                          {el?.event1}
                          {el?.event2 !== "" ? `, ${el?.event2}` : ""}
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <th colSpan={9}>
                      বিভাগ 'গ' বালক (জন্মতারিখ{" "}
                      {`01-01-${new Date().getFullYear() - 11}`} বা তারপর)
                    </th>
                  </tr>
                  {boysGrCData
                    .sort((b, a) => b.event1rank - a.event1rank)
                    .map((el, index) => (
                      <tr key={index}>
                        <td>
                          {boysGrAData?.length +
                            boysGrBData?.length +
                            (index + 1)}
                        </td>
                        <td>{el?.chestNo}</td>
                        <td>{el?.name}</td>
                        <td>{el?.gurdiansName}</td>
                        <td>{getSubmitDateInput(el?.birthday)}</td>
                        <td>{el?.sclass}</td>
                        <td>{el?.school}</td>
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
                  বিদ্যালয় প্রধানের সীলসহ স্বাক্ষর
                </h6>
                <h6 className="text-center text-black m-0 p-1">
                  ...............................................
                </h6>
              </div>
            </div>
            <h6 className="text-center text-black mx-auto p-1">
              গুরুত্বপূর্ণ নোট: * প্রতিযোগীর সমস্ত তথ্য ইংরাজী Capital Letter -এ
              পূরণ করবেন। ** সমস্ত প্রতিযোগীর জন্মপ্রমাণপত্রের/ জন্ম তারিখ
              প্রমাণকারী নথির জেরক্স কপি অবশ্যই এই কাগজটির সাথে সংযুক্ত করে
              দেবেন। *** গ্রাম-পঞ্চায়েত Sports Convenor -এর কাছে তালিকা জমা করার
              শেষ সময়ঃ
              {`   -01-${new Date().getFullYear()}`} বেলা ১২টা।
            </h6>
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
            <h3 className="text-center text-black my-2">
              {thisGp} গ্রাম-পঞ্চায়েত বার্ষিক ক্রীড়া প্রতিযোগিতা,-{" "}
              {enToBnNumber(new Date().getFullYear())}
            </h3>
            <div className="container-fluid row justify-content-between align-items-center my-2 p-1">
              <div className="col-md-5 justify-content-center align-items-center">
                <h6 className="text-center text-black m-0 p-0 border border-0 border-bottom-1">
                  বিদ্যালয়ের নামঃ {allData[0]?.school}
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
                  <th>বিদ্যালয়ের নাম</th>
                  <th>প্রতিযোগিতার নাম</th>
                </tr>
                <tr>
                  <th colSpan={9}>
                    বিভাগ 'ক' বালিকা (জন্মতারিখ{" "}
                    {`01-01-${new Date().getFullYear() - 7}`} বা তারপর)
                  </th>
                </tr>
                {girlsGrAData
                  .sort((b, a) => b.event1rank - a.event1rank)
                  .map((el, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{el?.chestNo}</td>
                      <td>{el?.name}</td>
                      <td>{el?.gurdiansName}</td>
                      <td>{getSubmitDateInput(el?.birthday)}</td>
                      <td>{el?.sclass}</td>
                      <td>{el?.school}</td>
                      <td>
                        {el?.event1}
                        {el?.event2 !== "" ? `, ${el?.event2}` : ""}
                      </td>
                    </tr>
                  ))}
                <tr>
                  <th colSpan={9}>
                    বিভাগ 'খ' বালিকা (জন্মতারিখ{" "}
                    {`01-01-${new Date().getFullYear() - 9}`} বা তারপর)
                  </th>
                </tr>
                {girlsGrBData
                  .sort((b, a) => b.event1rank - a.event1rank)
                  .map((el, index) => (
                    <tr key={index}>
                      <td>{girlsGrAData?.length + (index + 1)}</td>
                      <td>{el?.chestNo}</td>
                      <td>{el?.name}</td>
                      <td>{el?.gurdiansName}</td>
                      <td>{getSubmitDateInput(el?.birthday)}</td>
                      <td>{el?.sclass}</td>
                      <td>{el?.school}</td>
                      <td>
                        {el?.event1}
                        {el?.event2 !== "" ? `, ${el?.event2}` : ""}
                      </td>
                    </tr>
                  ))}
                <tr>
                  <th colSpan={9}>
                    বিভাগ 'গ' বালিকা (জন্মতারিখ{" "}
                    {`01-01-${new Date().getFullYear() - 11}`} বা তারপর)
                  </th>
                </tr>
                {girlsGrCData
                  .sort((b, a) => b.event1rank - a.event1rank)
                  .map((el, index) => (
                    <tr key={index}>
                      <td>
                        {girlsGrAData?.length +
                          girlsGrBData?.length +
                          (index + 1)}
                      </td>
                      <td>{el?.chestNo}</td>
                      <td>{el?.name}</td>
                      <td>{el?.gurdiansName}</td>
                      <td>{getSubmitDateInput(el?.birthday)}</td>
                      <td>{el?.sclass}</td>
                      <td>{el?.school}</td>
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
                  বিদ্যালয় প্রধানের সীলসহ স্বাক্ষর
                </h6>
                <h6 className="text-center text-black m-0 p-1">
                  ...............................................
                </h6>
              </div>
            </div>
            <h6 className="text-center text-black mx-auto p-1">
              গুরুত্বপূর্ণ নোট: * প্রতিযোগীর সমস্ত তথ্য ইংরাজী Capital Letter -এ
              পূরণ করবেন। ** সমস্ত প্রতিযোগীর জন্মপ্রমাণপত্রের/ জন্ম তারিখ
              প্রমাণকারী নথির জেরক্স কপি অবশ্যই এই কাগজটির সাথে সংযুক্ত করে
              দেবেন। *** গ্রাম-পঞ্চায়েত Sports Convenor -এর কাছে তালিকা জমা করার
              শেষ সময়ঃ
              {`   -01-${new Date().getFullYear()}`} বেলা ১২টা।
            </h6>
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
        {loader && <Loader />}
      </div>
    </Suspense>
  );
};

export default GPSchoolWiseStudentList;
