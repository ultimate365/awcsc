"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../../components/Loader";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { enToBnNumber } from "../../modules/calculatefunctions";
import {
  CIRCLE_SPORTS_DATE,
  circleBenName,
  gpNames,
} from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
const CircleSportsEventWiseName = () => {
  const { yourStateObject } = useGlobalContext();
  const data = yourStateObject?.data?.sort((a, b) =>
    a?.gp.localeCompare(b?.gp)
  );

  const navigate = useRouter();
  const [allData, setAllData] = useState(data);

  const [eventName, setEventName] = useState(yourStateObject?.eventName);
  const [gender, setGender] = useState(yourStateObject?.gender);
  const [group, setGroup] = useState(yourStateObject?.group);
  const [engEventName, setEngEventName] = useState(
    yourStateObject?.engEventName
  );
  const [loader, setLoader] = useState(false);
  const [feildSheetsClicked, setFeildSheetsClicked] = useState(false);
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
  useEffect(() => {
    document.title = `${eventName} ${
      feildSheetsClicked ? "FIELD SHEET" : "OFFICE SHEET"
    }`;
    // eslint-disable-next-line
  }, [eventName, feildSheetsClicked]);

  useEffect(() => {
    // eslint-disable-next-line
  }, [allData]);
  return (
    <div className="container-fluid  my-4 bg-white">
      {feildSheetsClicked ? (
        <div className="container-fluid">
          <h3 className="text-center ben text-black">
            {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগীতা,{" "}
            {enToBnNumber(new Date().getFullYear())}
          </h3>

          {engEventName === "LONG JUMP" ||
          engEventName === "FOOTBALL THROWING" ||
          engEventName === "HIGH JUMP" ? (
            <>
              <div className="my-3">
                <div className="row ben justify-content-between align-items-center w-100">
                  <div className="col-md-2">
                    <h5 className="text-start text-black">Sl No.: </h5>
                  </div>
                  <div className="col-md-4">
                    <h5 className="text-center text-black">
                      Date: {CIRCLE_SPORTS_DATE}
                    </h5>
                  </div>
                </div>
                <h5 className="text-start ben text-black ml-4">
                  Gender:- {gender}
                </h5>
                <h5 className="text-start ben text-black ml-4">
                  Event Name:- {engEventName}
                </h5>
                <h5 className="text-start ben text-black ml-4">
                  Age Group:- {group}
                </h5>
                <h5 className="text-start ben text-black ml-4">
                  Total Participants:- {allData?.length}
                </h5>
              </div>
              <div className="my-2">
                <h4 className="text-center ben text-black ml-4">{eventName}</h4>
                <h4 className="text-center ben text-black ml-4">
                  অংশগ্রহনকারী {gender === "BOYS" ? "প্রতিযোগী" : "প্রতিযোগীনি"}{" "}
                  গণ
                </h4>
              </div>
              <table className="table table-bordered border-black ben">
                <thead>
                  <tr className="ben">
                    <th>চেস্ট নং</th>
                    <th>প্রতিযোগীর নাম</th>
                    <th>গ্রাম-পঞ্চায়েতের নাম</th>
                    {engEventName === "LONG JUMP" ||
                    engEventName === "FOOTBALL THROWING" ? (
                      <>
                        <th>1ST</th>
                        <th>2ND</th>
                        <th>3RD</th>
                        <th>স্থান</th>
                      </>
                    ) : engEventName === "HIGH JUMP" ? (
                      <>
                        <th>1ST</th>
                        <th>2ND</th>
                        <th>3RD</th>
                        <th>4TH</th>
                        <th>5TH</th>
                        <th>6TH</th>
                        <th>স্থান</th>
                      </>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {allData?.map((el, ind) =>
                    engEventName === "LONG JUMP" ||
                    engEventName === "FOOTBALL THROWING" ? (
                      <tr key={ind} className="timesfont">
                        <td>{el?.chestNo}</td>
                        <td>{el?.name}</td>
                        <td>{el?.gp}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ) : engEventName === "HIGH JUMP" ? (
                      <tr key={ind} className="timesfont">
                        <td>{el?.chestNo}</td>
                        <td>{el?.name}</td>
                        <td>{el?.gp}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ) : (
                      <tr key={ind} className="timesfont">
                        <td>{el?.chestNo}</td>
                        <td>{el?.name}</td>
                        <td>{el?.gp}</td>
                        <td>{el?.school}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              <div className="my-2">
                <h3 className="text-center ben text-black ml-4">
                  Result (For use Finishing Judge)
                </h3>
              </div>
              <table className="ben table table-bordered border-black">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>চেস্ট নং</th>
                    <th>Time / Distance</th>
                  </tr>

                  <tr>
                    <th>1ST</th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>2ND</th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>3RD</th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>4TH</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3}>
                      <div className="mt-3">
                        <div className="mt-2 p-2 justify-content-between align-items-end">
                          <h6 className=" p-2 text-end">
                            SIGNATURE OF THE JUDGE
                          </h6>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : engEventName === "GYMNASTICS" ? (
            <>
              <div className="my-1">
                <div className="row ben justify-content-between align-items-center w-100">
                  <div className="col-md-2">
                    <h5 className="text-start text-black">Sl No.: </h5>
                  </div>
                  <div className="col-md-4">
                    <h5 className="text-center text-black">
                      Date: {CIRCLE_SPORTS_DATE}
                    </h5>
                  </div>
                </div>
                <h5 className="text-start ben text-black m-0 p-0">
                  Gender:- {gender}
                </h5>
                <h5 className="text-start ben text-black m-0 p-0">
                  Event Name:- {engEventName}
                </h5>
                <h5 className="text-start ben text-black m-0 p-0">
                  Age Group:- {group}
                </h5>
                <h5 className="text-start ben text-black m-0 p-0">
                  Total Participants:- {allData?.length}
                </h5>
              </div>
              <div className="my-1">
                <h4 className="text-center ben text-black m-0 p-0">
                  {eventName}
                </h4>
                <h4 className="text-center ben text-black m-0 p-0">
                  অংশগ্রহনকারী {gender === "BOYS" ? "প্রতিযোগী" : "প্রতিযোগীনি"}{" "}
                  গণ
                </h4>
              </div>
              <table className="table table-bordered border-black align-middle ben">
                <thead>
                  <tr className="ben">
                    <td>চেস্ট নং</td>
                    <td>প্রতিযোগীর নাম</td>
                    <td>গ্রাম-পঞ্চায়েতের নাম</td>
                    {/* <td className="text-wrap">
                      ১) কোণে দাঁড়ানো, ২-৩টি স্টেপে এক পায়ে হ্যান্ডস্প্রিং (B)
                      থেকে রাউন্ড অফ (A) ব্যাকফ্লিপ (C)
                    </td>
                    <td>
                      ২) তিন দিকে স্প্লিট সিটে বসা (বাম দিকে, সামনের দিকে এবং
                      ডান দিকে)
                    </td>
                    <td>
                      ৩) স্প্লিট সিট থেকে স্প্লিট প্রেস হ্যান্ডস্ট্যান্ড (২
                      সেকেন্ড ধরে রাখা)
                    </td>
                    <td>
                      ৪) হাত সোজা করে হ্যান্ডস্ট্যান্ড থেকে ফরওয়ার্ড রোল এবং
                      সোজা পায়ে দাঁড়ানো
                    </td>
                    <td>৫) টি ব্যালেন্স (২ সেকেন্ড ধরে রাখা)</td>
                    <td>
                      ৬) হাত এবং পা সোজা করে ব্যাকওয়ার্ড রোল থেকে প্রোন পজিসানে
                      আসা (২ সেকেন্ড ধরে রাখা)
                    </td>
                    {gender === "BOYS" ? (
                      <>
                        <td>৭) জাম্প করে ৩৬০° টার্ন করে সোজা দাঁড়ানো</td>
                        <td>
                          ৮) ২-৩টি স্টেপে দৌড়ে ডাইভ রোল অথবা ফ্লাই স্প্রিং
                        </td>

                        <td>
                          ৯) ২-৩টি স্টেপে দৌড়ে, হাঁটু মুড়ে ফরওয়ার্ড স্যাল্টো
                          (টাক পজিসান) অথবা রাউন্ড অফ থেকে হাঁটু মুড়ে
                          ব্যাকওয়ার্ড স্যাল্টো (টাক পজিসান)
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          ৭) বাম পা টো এর উপর সোজা রেখে ডান পা হাঁটু মুড়ে ৩৬০°
                          টার্ন করে দাঁড়ানো
                        </td>

                        <td>৮) ২-৩টি স্টেপে দৌড়ে দুটি ভিন্ন ধর্মী লিপ জাম্প</td>
                        <td>
                          ৯) ২-৩টি স্টেপে দৌড়ে, হাঁটু মুড়ে ফরওয়ার্ড স্যাল্টো
                          (টাক পজিসান) অথবা রাউন্ড অফ থেকে হাঁটু মুড়ে
                          ব্যাকওয়ার্ড স্যাল্টো (টাক পজিসান)
                        </td>
                      </>
                    )} */}
                    <td style={{ width: "8%" }}></td>
                    <td style={{ width: "8%" }}></td>
                    <td style={{ width: "8%" }}></td>
                    <td style={{ width: "8%" }}></td>
                    <td style={{ width: "8%" }}></td>
                    <td style={{ width: "8%" }}></td>
                    <td style={{ width: "8%" }}></td>
                    <td style={{ width: "8%" }}></td>
                    <td>Total</td>
                  </tr>
                </thead>
                <tbody>
                  {allData?.map((el, ind) => (
                    <tr key={ind} className="timesfont">
                      <td>{el?.chestNo}</td>
                      <td>{el?.name}</td>
                      <td>{el?.gp}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}

                  {/* <tr>
                    <td colSpan={15}>
                      <div className="mt-4">
                        <div className="mt-4  justify-content-between align-items-end">
                          <h6 className="  text-end">SIGNATURE OF THE JUDGE</h6>
                        </div>
                      </div>
                    </td>
                  </tr> */}
                </tbody>
              </table>
              <div className="my-2">
                <h5 className="text-center ben text-black">
                  Result (For use Finishing Judge)
                </h5>
              </div>
              <table className="ben table table-bordered border-black">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>চেস্ট নং</th>
                  </tr>

                  <tr>
                    <th>1ST</th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>2ND</th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>3RD</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3}>
                      <div className="justify-content-between align-items-end">
                        <h6 className="my-2 text-end">
                          SIGNATURE OF THE JUDGE
                        </h6>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : null}
          {engEventName === "75 METER RUN" ||
          engEventName === "SHUTTLE RACE" ||
          engEventName === "100 METER RUN" ||
          engEventName === "200 METER RUN" ? (
            <>
              <div className="my-1">
                <div className="row ben justify-content-between align-items-center w-100">
                  <div className="col-md-2">
                    <h5 className="text-start text-black">Sl No.: </h5>
                  </div>
                  <div className="col-md-4">
                    <h5 className="text-center text-black">
                      Date: {CIRCLE_SPORTS_DATE}
                    </h5>
                  </div>
                </div>
                <h5 className="text-start ben text-black m-0 p-0">
                  Gender:- {gender}
                </h5>
                <h5 className="text-start ben text-black m-0 p-0">
                  Event Name:- {engEventName}
                </h5>
                <h5 className="text-start ben text-black m-0 p-0">
                  Age Group:- {group}
                </h5>
                <h5 className="text-start ben text-black m-0 p-0">
                  Total Participants:- {allData?.length}
                </h5>
              </div>
              <div className="">
                <h5 className="text-center ben text-black m-0 p-0">
                  {eventName}
                </h5>
                <h5 className="text-center ben text-black m-0 p-0">
                  অংশগ্রহনকারী {gender === "BOYS" ? "প্রতিযোগী" : "প্রতিযোগীনি"}{" "}
                  গণ
                </h5>
              </div>
              <table className="table table-bordered border-black ben">
                <thead>
                  <tr className="ben">
                    <th>চেস্ট নং</th>
                    <th>প্রতিযোগীর নাম</th>
                    <th>গ্রাম-পঞ্চায়েতের নাম</th>
                    <th>বিদ্যালয়ের নাম</th>
                  </tr>
                </thead>
                <tbody>
                  {allData?.map((el, ind) => (
                    <tr key={ind} className="timesfont">
                      <td>{el?.chestNo}</td>
                      <td>{el?.name}</td>
                      <td>{el?.gp}</td>
                      <td>{el?.school}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="my-2">
                <h5 className="text-center ben text-black ml-4">
                  Result (For use Finishing Judge)
                </h5>
              </div>
              <table className="ben table table-bordered border-black">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>চেস্ট নং</th>
                    <th>Time / Distance</th>
                  </tr>

                  <tr>
                    <th>1ST</th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>2ND</th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>3RD</th>
                    <th></th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>4TH</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3}>
                      <div className="mt-2">
                        <div className="mt-2 p-2 justify-content-between align-items-end">
                          <h6 className=" p-2 text-end">
                            SIGNATURE OF THE JUDGE
                          </h6>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : null}
          {engEventName === "YOGA" && (
            <>
              <div className="my-1">
                <div className="row ben justify-content-between align-items-center w-100">
                  <div className="col-md-2">
                    <h5 className="text-start text-black">Sl No.: </h5>
                  </div>
                  <div className="col-md-4">
                    <h5 className="text-center text-black">
                      Date: {CIRCLE_SPORTS_DATE}
                    </h5>
                  </div>
                </div>
                <h5 className="text-start ben text-black m-0 p-0">
                  Gender:- {gender}
                </h5>
                <h5 className="text-start ben text-black m-0 p-0">
                  Event Name:- {engEventName}
                </h5>
                <h5 className="text-start ben text-black m-0 p-0">
                  Age Group:- {group}
                </h5>
                <h5 className="text-start ben text-black m-0 p-0">
                  Total Participants:- {allData?.length}
                </h5>
              </div>
              <div className="">
                <h5 className="text-center ben text-black m-0 p-0">
                  {eventName}
                </h5>
                <h5 className="text-center ben text-black m-0 p-0">
                  অংশগ্রহনকারী {gender === "BOYS" ? "প্রতিযোগী" : "প্রতিযোগীনি"}{" "}
                  গণ
                </h5>
              </div>
              <table
                className="table table-bordered border-black ben"
                style={{ zoom: 0.75 }}
              >
                <thead>
                  <tr className="ben">
                    <th>চেস্ট নং</th>
                    <th>প্রতিযোগীর নাম</th>
                    <th>গ্রাম পঞ্চায়েতের নাম</th>
                    {group === "GROUP-A" ? (
                      <>
                        <th colSpan={2}>GROUP 1 (২টি ধারন সময় ২০ সেকেন্ড)</th>
                        <th>GROUP 2 (১টি ধারন সময় ১৫ সেকেন্ড)</th>
                      </>
                    ) : (
                      <>
                        <th colSpan={2}>
                          GROUP 1 (২টি ধারন সময় ৩০ সেকেন্ড)(লটারি)
                        </th>
                        <th colSpan={2}>
                          GROUP 2 (১টি ধারন সময় ২০ সেকেন্ড)(লটারি)
                        </th>
                      </>
                    )}

                    <th>GROUP 3 (১টি ধারন সময় ১০ সেকেন্ড)</th>
                    <th>
                      নিজ ইচ্ছামতো <br /> (১টি ধারন সময় ১০ সেকেন্ড)
                    </th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody style={{ borderWidth: 1 }}>
                  {allData?.map((el, ind) => (
                    <tr key={ind} className="timesfont">
                      <td>{el?.chestNo}</td>
                      <td>{el?.name}</td>
                      <td>{el?.gp}</td>

                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="my-2">
                <h5 className="text-center ben text-black">
                  Result (For use Finishing Judge)
                </h5>
              </div>
              <table className="ben table table-bordered border-black">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>চেস্ট নং</th>
                  </tr>

                  <tr>
                    <th>1ST</th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>2ND</th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>3RD</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3}>
                      <div className="justify-content-between align-items-end">
                        <h6 className="my-2 text-end">
                          SIGNATURE OF THE JUDGE
                        </h6>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      ) : (
        <div className="container">
          <h3 className="text-center ben text-black">
            {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগীতা,{" "}
            {enToBnNumber(new Date().getFullYear())}
          </h3>
          <h3 className="text-center ben text-black">{eventName}</h3>
          <table className="table table-bordered border-black ben">
            <thead>
              <tr className="ben">
                <th>চেস্ট নং</th>
                <th>প্রতিযোগীর নাম</th>
                <th>গ্রাম-পঞ্চায়েতের নাম</th>
                <th>বিদ্যালয়ের নাম</th>
              </tr>
            </thead>
            <tbody>
              {allData?.map((el, ind) => (
                <tr key={ind} className="timesfont">
                  <td>{el?.chestNo}</td>
                  <td>{el?.name}</td>
                  <td>{el?.gp}</td>
                  <td>{el?.school}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loader && <Loader />}
      <div className="noprint my-2">
        <button
          type="button"
          className="btn btn-primary m-1 col-md-1 btn-sm"
          onClick={() => setFeildSheetsClicked(!feildSheetsClicked)}
        >
          {feildSheetsClicked ? "Office Sheet" : "Field Sheet"}
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
  );
};

export default CircleSportsEventWiseName;
