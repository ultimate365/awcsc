"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../../context/Store";
import { circleEngName, gpEngNames } from "../../modules/constants";
import GoldMedal from "../../images/gold_medal.png";
import SilverMedal from "../../images/silver_medal.png";
import BronzeMedal from "../../images/bronze_medal.png";
import Image from "next/image";
export default function Page() {
  const { stateArray } = useGlobalContext();
  const navigate = useRouter();
  useEffect(() => {
    document.title = `${circleEngName} GP Wise All Result At a Glance`;
    // eslint-disable-next-line
  }, []);
  return (
    <div className="container-fluid ben">
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
      <h3 className="text-center">
        {" "}
        একনজরে সমস্ত গ্রাম পঞ্চায়েতের অর্জিত পুরস্কার তালিকা
      </h3>
      <table
        className="table table-bordered border-black"
        style={{ verticalAlign: "middle", border: 2, borderColor: "black" }}
      >
        <thead>
          <tr>
            <th>ক্রমিক নং</th>
            <th>গ্রাম পঞ্চায়েত</th>
            <th>মোট পুরস্কার</th>
            <th suppressHydrationWarning>
              প্রথম পুরস্কার <br />
              <Image
                src={GoldMedal}
                alt="medal"
                width={50}
                height={80}
                style={{ height: "auto" }}
              />
            </th>
            <th suppressHydrationWarning>
              দ্বিতীয় পুরস্কার <br />
              <Image
                src={SilverMedal}
                alt="medal"
                width={50}
                height={80}
                style={{ height: "auto" }}
              />
            </th>
            <th suppressContentEditableWarning>
              তৃতীয় পুরস্কার <br />
              <Image
                src={BronzeMedal}
                alt="medal"
                width={50}
                height={80}
                style={{ height: "auto" }}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {gpEngNames?.map((gpEngName, i) => (
            <tr key={i} className="nobreak">
              <th>{i + 1}</th>
              <th suppressHydrationWarning>
                <p style={{ transform: "rotate(-90deg)" }}>{gpEngName}</p>
              </th>
              <th>
                {stateArray
                  ?.filter((el) => el?.gp === gpEngName)
                  ?.filter((el) => el?.position1 === "FIRST")?.length +
                  stateArray
                    ?.filter((el) => el?.gp === gpEngName)
                    ?.filter((el) => el?.position2 === "FIRST")?.length +
                  stateArray
                    ?.filter((el) => el?.gp === gpEngName)
                    ?.filter((el) => el?.position1 === "SECOND")?.length +
                  stateArray
                    ?.filter((el) => el?.gp === gpEngName)
                    ?.filter((el) => el?.position2 === "SECOND")?.length +
                  stateArray
                    ?.filter((el) => el?.gp === gpEngName)
                    ?.filter((el) => el?.position1 === "THIRD")?.length +
                  stateArray
                    ?.filter((el) => el?.gp === gpEngName)
                    ?.filter((el) => el?.position2 === "THIRD")?.length}
              </th>
              <th>
                {stateArray
                  ?.filter((el) => el?.gp === gpEngName)
                  ?.filter((el) => el?.position1 === "FIRST")?.length +
                  stateArray
                    ?.filter((el) => el?.gp === gpEngName)
                    ?.filter((el) => el?.position2 === "FIRST")?.length}
                {stateArray
                  ?.filter((el) => el?.gp === gpEngName)
                  ?.filter(
                    (el) =>
                      el?.position1 === "FIRST" || el?.position2 === "FIRST"
                  )
                  .map((s, r) => (
                    <p key={r}>
                      {`${r + 1}) ${s?.name}- ${s?.group}, ${s?.gender}, ${
                        s?.event1
                      }, ${s?.event2 ? `, ${s?.event2}` : ""}`}
                      {", "}
                      <br /> <p style={{ fontSize: 13 }}>{s?.school}</p>
                    </p>
                  ))}
              </th>
              <th>
                {stateArray
                  ?.filter((el) => el?.gp === gpEngName)
                  ?.filter((el) => el?.position1 === "SECOND")?.length +
                  stateArray
                    ?.filter((el) => el?.gp === gpEngName)
                    ?.filter((el) => el?.position2 === "SECOND")?.length}
                {stateArray
                  ?.filter((el) => el?.gp === gpEngName)
                  ?.filter(
                    (el) =>
                      el?.position1 === "SECOND" || el?.position2 === "SECOND"
                  )
                  .map((s, r) => (
                    <p key={r}>
                      {`${r + 1}) ${s?.name}- ${s?.group}, ${s?.gender}, ${
                        s?.event1
                      } ${s?.event2 ? `, ${s?.event2}` : ""}`}
                      {", "}
                      <br /> <p style={{ fontSize: 13 }}>{s?.school}</p>
                    </p>
                  ))}
              </th>
              <th>
                {stateArray
                  ?.filter((el) => el?.gp === gpEngName)
                  ?.filter((el) => el?.position1 === "THIRD")?.length +
                  stateArray
                    ?.filter((el) => el?.gp === gpEngName)
                    ?.filter((el) => el?.position2 === "THIRD")?.length}
                {stateArray
                  ?.filter((el) => el?.gp === gpEngName)
                  ?.filter(
                    (el) =>
                      el?.position1 === "THIRD" || el?.position2 === "THIRD"
                  )
                  .map((s, r) => (
                    <p key={r}>
                      {`${r + 1}) ${s?.name}- ${s?.group}, ${s?.gender}, ${
                        s?.event1
                      } ${s?.event2 ? `, ${s?.event2}` : ""}`}
                      {", "}
                      <br /> <p style={{ fontSize: 13 }}>{s?.school}</p>
                    </p>
                  ))}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
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
    </div>
  );
}
