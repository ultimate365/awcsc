"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { enToBnNumber } from "../../modules/calculatefunctions";
import { gpNames } from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
const GPSportsEventWiseName = () => {
  const { myStateObject } = useGlobalContext();
  const data = myStateObject?.data?.sort((a, b) =>
    a?.school.localeCompare(b?.school)
  );
  const schoolData = myStateObject?.school?.sort((a, b) =>
    a?.school.localeCompare(b?.school)
  );
  const navigate = useRouter();
  const [allData, setAllData] = useState(data);
  const [gpSchools, setGpSchools] = useState(schoolData);

  const [thisGp, setThisGp] = useState("");
  const { eventName, gender, group,engEventName } = myStateObject;
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
  useEffect(() => {
    setThisGp(
      gpNames.filter((el) => el.englishName === schoolData[0]?.gp)[0]
        ?.bengaliName
    );
    // eslint-disable-next-line
  }, [allData, gpSchools, thisGp]);
  useEffect(() => {}, []);
  return (
    <div className="container-fluid  my-4 bg-white">
      {feildSheetsClicked ? (
        <div className="container-fluid">
          <h3 className="text-center ben text-black">
            {thisGp} গ্রাম পঞ্চায়েত বার্ষিক ক্রীড়া প্রতিযোগিতা,{" "}
            {enToBnNumber(new Date().getFullYear())}
          </h3>

          {engEventName === "LONG JUMP" ||
          engEventName === "FOOTBALL THROWING" ||
          engEventName === "HIGH JUMP" ? (
            <>
              <h3 className="text-center ben text-black">{eventName}</h3>
              <table className="table table-bordered border-black">
                <thead>
                  <tr className="ben">
                    <th>চেস্ট নং</th>
                    <th>প্রতিযোগীর নাম</th>
                    <th>বিদ্যালয়ের নাম</th>
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
                        <td>{el.chestNo}</td>
                        <td>{el.name}</td>
                        <td>{el.school}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ) : engEventName === "HIGH JUMP" ? (
                      <tr key={ind} className="timesfont">
                        <td>{el.chestNo}</td>
                        <td>{el.name}</td>
                        <td>{el.school}</td>
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
                        <td>{el.chestNo}</td>
                        <td>{el.name}</td>
                        <td>{el.school}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </>
          ) : engEventName === "GYMNASTICS" ? (
            <>
              <h3 className="text-center ben text-black">{eventName}</h3>
              <table
                className="table table-bordered border-black align-middle"
                style={{ zoom: 0.6 }}
              >
                <thead>
                  <tr className="ben">
                    <td>চেস্ট নং</td>
                    <td>প্রতিযোগীর নাম</td>
                    <td>বিদ্যালয়ের নাম</td>
                    <td className="text-wrap">
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
                    )}
                    <td>Total</td>
                    <td>Position</td>
                  </tr>
                </thead>
                <tbody>
                  {allData?.map((el, ind) => (
                    <tr key={ind} className="timesfont">
                      <td>{el.chestNo}</td>
                      <td>{el.name}</td>
                      <td>{el.school}</td>
                      <td></td>
                      <td></td>
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

                  <tr>
                    <td colSpan={15}>
                      <div className="mt-4">
                        <div className="mt-4  justify-content-between align-items-end">
                          <h6 className="  text-end">SIGNATURE OF THE JUDGE</h6>
                        </div>
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
              <table className="container ben table table-bordered border-black">
                {group === "GROUP-A" ? (
                  <thead>
                    <tr>
                      <th colSpan={5}>বিভাগ 'ক'</th>
                    </tr>
                    <tr>
                      <th colSpan={5}>৭৫ মিটার দৌড়</th>
                    </tr>
                    <tr>
                      <th>বিভাগ 'ক' বালক</th>
                      <th>চেস্ট নং</th>
                      <th rowSpan={5}></th>
                      <th>বিভাগ 'ক' বালিকা</th>
                      <th>চেস্ট নং</th>
                    </tr>

                    <tr>
                      <th>1ST</th>
                      <th></th>

                      <th>1ST</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>2ND</th>
                      <th></th>

                      <th>2ND</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>3RD</th>
                      <th></th>

                      <th>3RD</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>4TH</th>
                      <th></th>

                      <th>4TH</th>
                      <th></th>
                    </tr>
                    <tr></tr>
                    <tr></tr>
                    <tr>
                      <th colSpan={5}>সাটল দৌড় (আলু দৌড়)</th>
                    </tr>

                    <tr>
                      <th>বিভাগ 'ক' বালক</th>
                      <th>চেস্ট নং</th>
                      <th rowSpan={5}></th>
                      <th>বিভাগ 'ক' বালিকা</th>
                      <th>চেস্ট নং</th>
                    </tr>

                    <tr>
                      <th>1ST</th>
                      <th></th>

                      <th>1ST</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>2ND</th>
                      <th></th>

                      <th>2ND</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>3RD</th>
                      <th></th>

                      <th>3RD</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>4TH</th>
                      <th></th>

                      <th>4TH</th>
                      <th></th>
                    </tr>
                  </thead>
                ) : group === "GROUP-B" ? (
                  <thead>
                    <tr>
                      <th colSpan={5}>বিভাগ 'খ'</th>
                    </tr>
                    <tr>
                      <th colSpan={5}>১০০ মিটার দৌড়</th>
                    </tr>
                    <tr>
                      <th>বিভাগ 'খ' বালক</th>
                      <th>চেস্ট নং</th>
                      <th rowSpan={5}></th>
                      <th>বিভাগ 'খ' বালিকা</th>
                      <th>চেস্ট নং</th>
                    </tr>

                    <tr>
                      <th>1ST</th>
                      <th></th>

                      <th>1ST</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>2ND</th>
                      <th></th>

                      <th>2ND</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>3RD</th>
                      <th></th>

                      <th>3RD</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>4TH</th>
                      <th></th>

                      <th>4TH</th>
                      <th></th>
                    </tr>
                    <tr></tr>
                    <tr></tr>
                    <tr>
                      <th colSpan={5}>২০০ মিটার দৌড়</th>
                    </tr>

                    <tr>
                      <th>বিভাগ 'খ' বালক</th>
                      <th>চেস্ট নং</th>
                      <th rowSpan={5}></th>
                      <th>বিভাগ 'খ' বালিকা</th>
                      <th>চেস্ট নং</th>
                    </tr>

                    <tr>
                      <th>1ST</th>
                      <th></th>

                      <th>1ST</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>2ND</th>
                      <th></th>

                      <th>2ND</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>3RD</th>
                      <th></th>

                      <th>3RD</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>4TH</th>
                      <th></th>

                      <th>4TH</th>
                      <th></th>
                    </tr>
                  </thead>
                ) : group === "GROUP-C" ? (
                  <thead>
                    <tr>
                      <th colSpan={5}>বিভাগ 'গ'</th>
                    </tr>
                    <tr>
                      <th colSpan={5}>১০০ মিটার দৌড়</th>
                    </tr>
                    <tr>
                      <th>বিভাগ 'গ' বালক</th>
                      <th>চেস্ট নং</th>
                      <th rowSpan={5}></th>
                      <th>বিভাগ 'গ' বালিকা</th>
                      <th>চেস্ট নং</th>
                    </tr>

                    <tr>
                      <th>1ST</th>
                      <th></th>

                      <th>1ST</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>2ND</th>
                      <th></th>

                      <th>2ND</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>3RD</th>
                      <th></th>

                      <th>3RD</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>4TH</th>
                      <th></th>

                      <th>4TH</th>
                      <th></th>
                    </tr>
                    <tr></tr>
                    <tr></tr>
                    <tr>
                      <th colSpan={5}>২০০ মিটার দৌড়</th>
                    </tr>

                    <tr>
                      <th>বিভাগ 'গ' বালক</th>
                      <th>চেস্ট নং</th>
                      <th rowSpan={5}></th>
                      <th>বিভাগ 'গ' বালিকা</th>
                      <th>চেস্ট নং</th>
                    </tr>

                    <tr>
                      <th>1ST</th>
                      <th></th>

                      <th>1ST</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>2ND</th>
                      <th></th>

                      <th>2ND</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>3RD</th>
                      <th></th>

                      <th>3RD</th>
                      <th></th>
                    </tr>
                    <tr>
                      <th>4TH</th>
                      <th></th>

                      <th>4TH</th>
                      <th></th>
                    </tr>
                  </thead>
                ) : null}
                <tbody>
                  <tr>
                    <td colSpan={5}>
                      <div className="mt-4">
                        <div className="mt-4 p-4 justify-content-between align-items-end">
                          <h6 className=" p-4 text-end">
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
              <h3 className="text-center ben text-black">{eventName}</h3>
              <table
                className="table table-bordered border-black"
                style={{ zoom: 0.8 }}
              >
                <thead>
                  <tr className="ben">
                    <th rowSpan={2}>চেস্ট নং</th>
                    <th rowSpan={2}>প্রতিযোগীর নাম</th>
                    <th rowSpan={2}>বিদ্যালয়ের নাম</th>
                    <th colSpan={6}>
                      GROUP 1 (২টি ধারন সময় ৩০ সেকেন্ড)(লটারি)
                    </th>
                    <th colSpan={6}>
                      GROUP 2 (১টি ধারন সময় ২০ সেকেন্ড)(লটারি)
                    </th>
                    <th colSpan={6}>GROUP 3 (১টি ধারন সময় ১০ সেকেন্ড)</th>
                    <th rowSpan={2}>নিজ ইচ্ছামতো (১টি)</th>
                    <th rowSpan={2}>TOTAL</th>
                    <th rowSpan={2}>স্থান</th>
                  </tr>

                  <tr className="ben">
                    <th>পদ্মাসন</th>
                    <th>অর্ধকূর্মাসন</th>
                    <th>পশ্চিমত্তাসন</th>
                    <th>সুপ্তবজ্রাসন</th>
                    <th>ভূমাসন</th>
                    <th>অর্ধমৎসেন্দ্রাসন</th>
                    <th>ভূজঙ্গাসন</th>
                    <th>উস্ট্রাসন</th>
                    <th>চক্রাসন</th>
                    <th>ধনুরাসন</th>
                    <th>গর্ভাসন</th>
                    <th>একপদশিরাসন</th>
                    <th>বৃক্ষাসন</th>
                    <th>উৎকটাসন</th>
                    <th>বীরভদ্রাসন</th>
                    <th>ত্রিকোণাসন</th>
                    <th>সর্বাঙ্গাসন</th>
                    <th>উথ্থানপদাসন</th>
                  </tr>
                </thead>
                <tbody>
                  {allData?.map((el, ind) => (
                    <tr key={ind} className="timesfont">
                      <td>{el.chestNo}</td>
                      <td>{el.name}</td>
                      <td>{el.school}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
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
                  <tr>
                    <td colSpan={24}>
                      <div className="mt-4">
                        <div className="mt-4 justify-content-between align-items-end">
                          <h6 className=" text-end">SIGNATURE OF THE JUDGE</h6>
                        </div>
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
            {thisGp} গ্রাম পঞ্চায়েত বার্ষিক ক্রীড়া প্রতিযোগিতা,{" "}
            {enToBnNumber(new Date().getFullYear())}
          </h3>
          <h3 className="text-center ben text-black">{eventName}</h3>
          <table className="table table-bordered border-black">
            <thead>
              <tr className="ben">
                <th>চেস্ট নং</th>
                <th>প্রতিযোগীর নাম</th>
                <th>বিদ্যালয়ের নাম</th>
              </tr>
            </thead>
            <tbody>
              {allData?.map((el, ind) => (
                <tr key={ind} className="timesfont">
                  <td>{el.chestNo}</td>
                  <td>{el.name}</td>
                  <td>{el.school}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

export default GPSportsEventWiseName;
