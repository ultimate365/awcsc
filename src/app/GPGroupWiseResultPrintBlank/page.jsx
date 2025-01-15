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
          navigate.push("/login");
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
      setBengGroupName("বিভাগ 'ক'");
    } else if (group === "GROUP-B") {
      setBengGroupName("বিভাগ 'খ'");
    } else if (group === "GROUP-C") {
      setBengGroupName("বিভাগ 'গ'");
    }
    if (gender === "BOYS") {
      setBenGender("বালক");
    } else if (gender === "GIRLS") {
      setBenGender("বালিকা");
    }
    // eslint-disable-next-line
  }, []);
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
      <table className="table table-bordered boder-black border-4">
        <thead>
          <tr>
            <th colSpan={5}>
              <h3 className="text-center ben text-black">
                {gp} গ্রাম পঞ্চায়েত বার্ষিক ক্রীড়া প্রতিযোগীতা, রেজাল্ট শিট{" "}
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
                  {`${bengGroupName} ${benGender}`}
                </h4>
              </th>
            </tr>
            <tr>
              <th className="ben" colSpan={5}>
                বিভাগ 'ক' ৭৫ মিটার দৌড়
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
                <th style={{width:"10%"}}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{width:"10%"}}></th>
                <th style={{width:"30%"}}></th>
                <th style={{width:"20%"}}></th>
              </tr>
            ))}

            <tr>
              <th className="ben" colSpan={5}>
                বিভাগ 'ক' দীর্ঘ লম্ফন
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
                <th style={{width:"10%"}}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{width:"10%"}}></th>
                <th style={{width:"30%"}}></th>
                <th style={{width:"20%"}}></th>
              </tr>
            ))}
            <tr>
              <th className="ben" colSpan={5}>
                বিভাগ 'ক' আলু দৌড় (SHUTTLE RACE)
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
                <th style={{width:"10%"}}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{width:"10%"}}></th>
                <th style={{width:"30%"}}></th>
                <th style={{width:"20%"}}></th>
              </tr>
            ))}
            <tr>
              <th className="ben" colSpan={5}>
                বিভাগ 'ক' যোগা
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
                <th style={{width:"10%"}}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{width:"10%"}}></th>
                <th style={{width:"30%"}}></th>
                <th style={{width:"20%"}}></th>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
            <th colSpan={3} style={{ borderRight: 0 }}></th>
              <th colSpan={2} style={{ borderLeft: 0 }}>
                <h4 className="text-center ben text-white bg-black p-1 rounded-2">
                  {`${bengGroupName} ${benGender}`}
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
                <th style={{width:"10%"}}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{width:"10%"}}></th>
                <th style={{width:"30%"}}></th>
                <th style={{width:"20%"}}></th>
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
                <th style={{width:"10%"}}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{width:"10%"}}></th>
                <th style={{width:"30%"}}></th>
                <th style={{width:"20%"}}></th>
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
                <th style={{width:"10%"}}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{width:"10%"}}></th>
                <th style={{width:"30%"}}></th>
                <th style={{width:"20%"}}></th>
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
                <th style={{width:"10%"}}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{width:"10%"}}></th>
                <th style={{width:"30%"}}></th>
                <th style={{width:"20%"}}></th>
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
                <th style={{width:"10%"}}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{width:"10%"}}></th>
                <th style={{width:"30%"}}></th>
                <th style={{width:"20%"}}></th>
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
                <th style={{width:"10%"}}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{width:"10%"}}></th>
                <th style={{width:"30%"}}></th>
                <th style={{width:"20%"}}></th>
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
                <th style={{width:"10%"}}>
                  {i + 1 === 1 ? "FIRST" : i + 1 === 2 ? "SECOND" : "THIRD"}
                </th>
                <th style={{ width: "30%" }}></th>
                <th style={{width:"10%"}}></th>
                <th style={{width:"30%"}}></th>
                <th style={{width:"20%"}}></th>
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
