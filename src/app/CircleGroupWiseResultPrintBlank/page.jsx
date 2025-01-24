"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { enToBnNumber } from "../../modules/calculatefunctions";
import { circleBenName, circleEngName } from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import Image from "next/image";
const CircleGroupWiseResultPrint = () => {
  const { yourStateObject } = useGlobalContext();

  const data = yourStateObject?.data;
  const [img, setImg] = useState("");
  const navigate = useRouter();
  const [allData, setAllData] = useState(data);

  const [gender, setGender] = useState(yourStateObject?.gender);
  const [group, setGroup] = useState(yourStateObject?.group);

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
      if (teacherdetails.circleAssistant !== "admin") {
        navigate.push("/login");
      }
    }
    document.title = `${circleEngName} Annual Sports ${gender} ${group} Result Sheet`;
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (gender === "BOYS") {
      setBenGender("বালক");
      if (group === "GROUP-A") {
        setBengGroupName(`বালক 'ক' বিভাগ`);
      } else if (group === "GROUP-B") {
        setBengGroupName(`বালক 'খ' বিভাগ`);
      } else if (group === "GROUP-C") {
        setBengGroupName(`বালক 'গ' বিভাগ`);
      }
    } else if (gender === "GIRLS") {
      setBenGender("বালিকা");
      if (group === "GROUP-A") {
        setBengGroupName(`বালিকা 'ক' বিভাগ`);
      } else if (group === "GROUP-B") {
        setBengGroupName(`বালিকা 'খ' বিভাগ`);
      } else if (group === "GROUP-C") {
        setBengGroupName(`বালিকা 'গ' বিভাগ`);
      }
    }
    // eslint-disable-next-line
  }, [allData]);
  useEffect(() => {
    // const img=`../../images/${gender} ${group?.split("-")[1]}.png`
    setImg(require(`../../images/${gender} ${group?.split("-")[1]}.png`));

    // eslint-disable-next-line
  }, [gender, group]);
  return (
    <div className="container my-4 bg-white">
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
      <table className="table table-bordered boder-black border-4" style={{border:2,borderColor:"black"}}>
        <thead>
          <tr>
            <th colSpan={6}>
              <h3 className="text-center ben text-black">
                {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগিতা, রেজাল্ট শিট{" "}
                {enToBnNumber(new Date().getFullYear())}
              </h3>
            </th>
          </tr>
        </thead>
        {group === "GROUP-A" ? (
          <tbody>
            <tr>
              <th colSpan={3} style={{ borderRight: 0 }}></th>
              <th colSpan={2} style={{ borderLeft: 0 }}>
                <h4 className="text-center ben text-white bg-black p-1 rounded-2">
                  {bengGroupName}
                </h4>
              </th>
            </tr>
            <tr>
              <th className="ben" colSpan={5}>
                {bengGroupName} ৭৫ মিটার দৌড়
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {[1, 1, 1].map((el, i) => (
              <tr style={{ height: 40 }} key={i}>
                <th style={{ width: "10%" }}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "10%" }}></th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "20%" }}></th>
              </tr>
            ))}

            <tr>
              <th className="ben" colSpan={5}>
                {bengGroupName} দীর্ঘ লম্ফন
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {[1, 1, 1].map((el, i) => (
              <tr style={{ height: 40 }} key={i}>
                <th style={{ width: "10%" }}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "10%" }}></th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "20%" }}></th>
              </tr>
            ))}
            <tr>
              <th className="ben" colSpan={5}>
                {bengGroupName} আলু দৌড় (SHUTTLE RACE)
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {[1, 1, 1].map((el, i) => (
              <tr style={{ height: 40 }} key={i}>
                <th style={{ width: "10%" }}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "10%" }}></th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "20%" }}></th>
              </tr>
            ))}
            <tr>
              <th className="ben" colSpan={5}>
                {bengGroupName} যোগা
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {[1, 1, 1].map((el, i) => (
              <tr style={{ height: 40 }} key={i}>
                <th style={{ width: "10%" }}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "10%" }}></th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "20%" }}></th>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <th colSpan={3} style={{ borderRight: 0 }}></th>
              <th colSpan={2} style={{ borderLeft: 0 }}>
                <h4 className="text-center ben text-white bg-black p-1 rounded-2">
                  {bengGroupName}
                </h4>
              </th>
            </tr>
            <tr>
              <th className="ben" colSpan={5}>
                {bengGroupName} ১০০ মিটার দৌড়
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {[1, 1, 1].map((el, i) => (
              <tr style={{ height: 40 }} key={i}>
                <th style={{ width: "10%" }}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "10%" }}></th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "20%" }}></th>
              </tr>
            ))}
            <tr>
              <th className="ben" colSpan={5}>
                {bengGroupName} ২০০ মিটার দৌড়
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {[1, 1, 1].map((el, i) => (
              <tr style={{ height: 40 }} key={i}>
                <th style={{ width: "10%" }}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "10%" }}></th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "20%" }}></th>
              </tr>
            ))}
            <tr>
              <th className="ben" colSpan={5}>
                {bengGroupName} দীর্ঘ লম্ফন
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {[1, 1, 1].map((el, i) => (
              <tr style={{ height: 40 }} key={i}>
                <th style={{ width: "10%" }}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "10%" }}></th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "20%" }}></th>
              </tr>
            ))}
            <tr>
              <th className="ben" colSpan={5}>
                {bengGroupName} উচ্চ লম্ফন
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {[1, 1, 1].map((el, i) => (
              <tr style={{ height: 40 }} key={i}>
                <th style={{ width: "10%" }}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "10%" }}></th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "20%" }}></th>
              </tr>
            ))}

            <tr>
              <th className="ben" colSpan={5}>
                {bengGroupName} যোগা
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {[1, 1, 1].map((el, i) => (
              <tr style={{ height: 40 }} key={i}>
                <th style={{ width: "10%" }}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "10%" }}></th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "20%" }}></th>
              </tr>
            ))}
            <tr>
              <th className="ben" colSpan={5}>
                {bengGroupName} জিম্‌নাস্টিক্‌স
              </th>
            </tr>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>CHEST NO.</th>
              <th>GURDIAN'S NAME</th>
              <th>SCHOOL</th>
            </tr>
            {[1, 1, 1].map((el, i) => (
              <tr style={{ height: 40 }} key={i}>
                <th style={{ width: "10%" }}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "10%" }}></th>
                <th style={{ width: "30%" }}></th>
                <th style={{ width: "20%" }}></th>
              </tr>
            ))}
            {group === "GROUP-C" && (
              <>
                <tr>
                  <th className="ben" colSpan={5}>
                    {bengGroupName} ফুটবল ছোঁড়া
                  </th>
                </tr>
                <tr>
                  <th>RANK</th>
                  <th>NAME</th>
                  <th>CHEST NO.</th>
                  <th>GURDIAN'S NAME</th>
                  <th>SCHOOL</th>
                </tr>
                {[1, 1, 1].map((el, i) => (
                  <tr style={{ height: 40 }} key={i}>
                    <th style={{ width: "10%" }}>
                      {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                    </th>
                    <th style={{ width: "30%" }}></th>
                    <th style={{ width: "10%" }}></th>
                    <th style={{ width: "30%" }}></th>
                    <th style={{ width: "20%" }}></th>
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
    </div>
  );
};

export default CircleGroupWiseResultPrint;
