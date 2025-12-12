"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { enToBnNumber } from "../../modules/calculatefunctions";
import { useGlobalContext } from "../../context/Store";
import Image from "next/image";
const GPGroupWiseResultPrint = () => {
  const { yourStateObject } = useGlobalContext();
  const data = yourStateObject?.data;
  const [img, setImg] = useState("");
  const navigate = useRouter();
  const [allData, setAllData] = useState(data);
  const [gender, setGender] = useState(yourStateObject?.gender);
  const [group, setGroup] = useState(yourStateObject?.group);
  const [gp, setGp] = useState(yourStateObject?.gp);
  const [bengGroupName, setBengGroupName] = useState("");
  const [benGender, setBenGender] = useState("");
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
    document.title = `${teacherdetails.gp} GP Sports ${group} Result Sheet`;
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // const img=`../../images/${gender} ${group?.split("-")[1]}.png`
    setImg(require(`../../images/${gender} ${group?.split("-")[1]}.png`));

    // eslint-disable-next-line
  }, [gender, group]);

  useEffect(() => {
    if (group === "GROUP-A") {
      setBengGroupName(`'ক' বিভাগ`);
    } else if (group === "GROUP-B") {
      setBengGroupName("'খ' বিভাগ");
    } else if (group === "GROUP-C") {
      setBengGroupName("'গ' বিভাগ");
    }
    if (gender === "BOYS") {
      setBenGender("বালক");
    } else if (gender === "GIRLS") {
      setBenGender("বালিকা");
    }
    // eslint-disable-next-line
  }, [allData]);
  return (
    <div className="container my-1 bg-white">
      <div className="noprint my-1">
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
      <table className="table table-bordered boder-black border-4">
        <thead>
          <tr>
            <th colSpan={5}>
              <h3 className="text-center ben text-black">
                {gp} গ্রাম পঞ্চায়েত বার্ষিক ক্রীড়া প্রতিযোগিতা, রেজাল্ট শিট{" "}
                {enToBnNumber(new Date().getFullYear())}
              </h3>
            </th>
          </tr>
        </thead>
        {group === "GROUP-A" ? (
          <tbody>
            <tr>
              <th colSpan={4} style={{ borderRight: 0 }}></th>
              <th style={{ borderLeft: 0 }}>
                <h4 className="text-center ben text-white bg-black p-2 rounded-2">
                  {benGender} {bengGroupName}
                </h4>
              </th>
            </tr>
            <tr>
              <th className="ben" colSpan={5}>
                {benGender} {bengGroupName} ৭৫ মিটার দৌড়
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {allData
              ?.filter(
                (el) =>
                  el?.event1 === "75 METER RUN" || el?.event2 === "75 METER RUN"
              )
              .sort((a, b) => a?.position1?.localeCompare(b?.position1))
              .map((el, ind) => (
                <tr key={ind}>
                  <td>
                    {el?.event1 === "75 METER RUN"
                      ? el?.position1
                      : el?.position2}
                  </td>
                  <td>{el?.name}</td>
                  <td>{el?.chestNo}</td>
                  <td>{el?.gurdiansName}</td>
                  <td>{el?.school}</td>
                </tr>
              ))}
            <tr>
              <th className="ben" colSpan={5}>
                {benGender} {bengGroupName} দীর্ঘ লম্ফন
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {allData
              ?.filter(
                (el) => el?.event1 === "LONG JUMP" || el?.event2 === "LONG JUMP"
              )
              .sort((a, b) => a?.position1?.localeCompare(b?.position1))
              .map((el, ind) => (
                <tr key={ind}>
                  <td>
                    {el?.event1 === "LONG JUMP" ? el?.position1 : el?.position2}
                  </td>
                  <td>{el?.name}</td>
                  <td>{el?.chestNo}</td>
                  <td>{el?.gurdiansName}</td>
                  <td>{el?.school}</td>
                </tr>
              ))}
            <tr>
              <th className="ben" colSpan={5}>
                {benGender} {bengGroupName} আলু দৌড় (SHUTTLE RACE)
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {allData
              ?.filter(
                (el) =>
                  el?.event1 === "SHUTTLE RACE" || el?.event2 === "SHUTTLE RACE"
              )
              .sort((a, b) => a?.position1?.localeCompare(b?.position1))
              .map((el, ind) => (
                <tr key={ind}>
                  <td>
                    {el?.event1 === "SHUTTLE RACE"
                      ? el?.position1
                      : el?.position2}
                  </td>
                  <td>{el?.name}</td>
                  <td>{el?.chestNo}</td>
                  <td>{el?.gurdiansName}</td>
                  <td>{el?.school}</td>
                </tr>
              ))}
            <tr>
              <th className="ben" colSpan={5}>
                {benGender} {bengGroupName} যোগা
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {allData
              ?.filter((el) => el?.event1 === "YOGA" || el?.event2 === "YOGA")
              .sort((a, b) => a?.position1?.localeCompare(b?.position1))
              .map((el, ind) => (
                <tr key={ind}>
                  <td>
                    {el?.event1 === "YOGA" ? el?.position1 : el?.position2}
                  </td>
                  <td>{el?.name}</td>
                  <td>{el?.chestNo}</td>
                  <td>{el?.gurdiansName}</td>
                  <td>{el?.school}</td>
                </tr>
              ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <th colSpan={4} style={{ borderRight: 0 }}></th>
              <th style={{ borderLeft: 0 }}>
                <h4 className="text-center ben text-white bg-black p-2 rounded-2">
                  {benGender} {bengGroupName}
                </h4>
              </th>
            </tr>
            <tr>
              <th className="ben" colSpan={5}>
                {benGender} {bengGroupName} ১০০ মিটার দৌড়
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {allData
              ?.filter(
                (el) =>
                  el?.event1 === "100 METER RUN" ||
                  el?.event2 === "100 METER RUN"
              )
              .sort((a, b) => a?.position1?.localeCompare(b?.position1))
              .map((el, ind) => (
                <tr key={ind}>
                  <td>
                    {el?.event1 === "100 METER RUN"
                      ? el?.position1
                      : el?.position2}
                  </td>
                  <td>{el?.name}</td>
                  <td>{el?.chestNo}</td>
                  <td>{el?.gurdiansName}</td>
                  <td>{el?.school}</td>
                </tr>
              ))}
            <tr>
              <th className="ben" colSpan={5}>
                {benGender} {bengGroupName} ২০০ মিটার দৌড়
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {allData
              ?.filter(
                (el) =>
                  el?.event1 === "200 METER RUN" ||
                  el?.event2 === "200 METER RUN"
              )
              .sort((a, b) => a?.position1?.localeCompare(b?.position1))
              .map((el, ind) => (
                <tr key={ind}>
                  <td>
                    {el?.event1 === "200 METER RUN"
                      ? el?.position1
                      : el?.position2}
                  </td>
                  <td>{el?.name}</td>
                  <td>{el?.chestNo}</td>
                  <td>{el?.gurdiansName}</td>
                  <td>{el?.school}</td>
                </tr>
              ))}
            <tr>
              <th className="ben" colSpan={5}>
                {benGender} {bengGroupName} দীর্ঘ লম্ফন
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {allData
              ?.filter(
                (el) => el?.event1 === "LONG JUMP" || el?.event2 === "LONG JUMP"
              )
              .sort((a, b) => a?.position1?.localeCompare(b?.position1))
              .map((el, ind) => (
                <tr key={ind}>
                  <td>
                    {el?.event1 === "LONG JUMP" ? el?.position1 : el?.position2}
                  </td>
                  <td>{el?.name}</td>
                  <td>{el?.chestNo}</td>
                  <td>{el?.gurdiansName}</td>
                  <td>{el?.school}</td>
                </tr>
              ))}
            <tr>
              <th className="ben" colSpan={5}>
                {benGender} {bengGroupName} উচ্চ লম্ফন
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {allData
              ?.filter(
                (el) => el?.event1 === "HIGH JUMP" || el?.event2 === "HIGH JUMP"
              )
              .sort((a, b) => a?.position1?.localeCompare(b?.position1))
              .map((el, ind) => (
                <tr key={ind}>
                  <td>
                    {el?.event1 === "HIGH JUMP" ? el?.position1 : el?.position2}
                  </td>
                  <td>{el?.name}</td>
                  <td>{el?.chestNo}</td>
                  <td>{el?.gurdiansName}</td>
                  <td>{el?.school}</td>
                </tr>
              ))}

            <tr>
              <th className="ben" colSpan={5}>
                {benGender} {bengGroupName} যোগা
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {allData
              ?.filter((el) => el?.event1 === "YOGA" || el?.event2 === "YOGA")
              .sort((a, b) => a?.position1?.localeCompare(b?.position1))
              .map((el, ind) => (
                <tr key={ind}>
                  <td>
                    {el?.event1 === "YOGA" ? el?.position1 : el?.position2}
                  </td>
                  <td>{el?.name}</td>
                  <td>{el?.chestNo}</td>
                  <td>{el?.gurdiansName}</td>
                  <td>{el?.school}</td>
                </tr>
              ))}
            <tr>
              <th className="ben" colSpan={5}>
                {benGender} {bengGroupName} জিম্‌নাস্টিক্‌স
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {allData
              ?.filter(
                (el) =>
                  el?.event1 === "GYMNASTICS" || el?.event2 === "GYMNASTICS"
              )
              .sort((a, b) => a?.position1?.localeCompare(b?.position1))
              .map((el, ind) => (
                <tr key={ind}>
                  <td>
                    {el?.event1 === "GYMNASTICS"
                      ? el?.position1
                      : el?.position2}
                  </td>
                  <td>{el?.name}</td>
                  <td>{el?.chestNo}</td>
                  <td>{el?.gurdiansName}</td>
                  <td>{el?.school}</td>
                </tr>
              ))}
            {group === "GROUP-C" && (
              <>
                <tr>
                  <th className="ben" colSpan={5}>
                    {benGender} {bengGroupName} ফুটবল ছোঁড়া
                  </th>
                </tr>
                <tr>
                  <th>RANK</th>
                  <th>NAME</th>
                  <th>CHEST NO.</th>
                  <th>GURDIAN'S NAME</th>
                  <th>SCHOOL</th>
                </tr>
                {allData
                  ?.filter(
                    (el) =>
                      el?.event1 === "FOOTBALL THROWING" ||
                      el?.event2 === "FOOTBALL THROWING"
                  )
                  .sort((a, b) => a?.position1?.localeCompare(b?.position1))
                  .map((el, ind) => (
                    <tr key={ind}>
                      <td>
                        {el?.event1 === "FOOTBALL THROWING"
                          ? el?.position1
                          : el?.position2}
                      </td>
                      <td>{el?.name}</td>
                      <td>{el?.chestNo}</td>
                      <td>{el?.gurdiansName}</td>
                      <td>{el?.school}</td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        )}
      </table>
      <Image
        src={img}
        alt="LOGO"
        width={0}
        height={0}
        className="position-absolute top-50 start-50 translate-middle"
        style={{ opacity: 0.4, width: 420, height: "auto" }}
      />
    </div>
  );
};

export default GPGroupWiseResultPrint;
