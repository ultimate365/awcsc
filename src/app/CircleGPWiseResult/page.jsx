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

  const getWinnersByPosition = (gpName, position) => {
    return stateArray?.filter(
      (el) =>
        el?.gp === gpName &&
        (el?.position1 === position || el?.position2 === position)
    );
  };

  const gpScores = gpEngNames
    .map((gpName) => {
      const firsts = getWinnersByPosition(gpName, "FIRST").length;
      const seconds = getWinnersByPosition(gpName, "SECOND").length;
      const thirds = getWinnersByPosition(gpName, "THIRD").length;
      const score = firsts * 3 + seconds * 2 + thirds * 1;
      return { gpName, score, firsts, seconds, thirds };
    })
    .sort((a, b) => b.score - a.score);

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
      <h4 className="text-center mt-3">গ্রাম পঞ্চায়েত ভিত্তিক অবস্থান</h4>
      <table
        className="table table-bordered border-black"
        style={{ verticalAlign: "middle", border: 2, borderColor: "black" }}
      >
        <thead>
          <tr>
            <th>অবস্থান</th>
            <th>গ্রাম পঞ্চায়েত</th>
            <th>প্রথম</th>
            <th>দ্বিতীয়</th>
            <th>তৃতীয়</th>
            <th>মোট পয়েন্ট</th>
          </tr>
        </thead>
        <tbody>
          {gpScores.map((gp, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{gp.gpName}</td>
              <td>{gp.firsts}</td>
              <td>{gp.seconds}</td>
              <td>{gp.thirds}</td>
              <td>{gp.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
                {getWinnersByPosition(gpEngName, "FIRST").length +
                  getWinnersByPosition(gpEngName, "SECOND").length +
                  getWinnersByPosition(gpEngName, "THIRD").length}
              </th>
              <th>
                {getWinnersByPosition(gpEngName, "FIRST").length}
                {getWinnersByPosition(gpEngName, "FIRST").map((s, r) => (
                  <p key={r}>
                    {`${r + 1}) ${s?.name}- ${s?.group}, ${s?.gender}, ${
                      s?.event1
                    }${s?.event2 ? `, ${s?.event2}` : ""}`}
                    {", "}
                    <br /> <span style={{ fontSize: 13 }}>{s?.school}</span>
                  </p>
                ))}
              </th>
              <th>
                {getWinnersByPosition(gpEngName, "SECOND").length}
                {getWinnersByPosition(gpEngName, "SECOND").map((s, r) => (
                  <p key={r}>
                    {`${r + 1}) ${s?.name}- ${s?.group}, ${s?.gender}, ${
                      s?.event1
                    }${s?.event2 ? `, ${s?.event2}` : ""}`}
                    {", "}
                    <br /> <span style={{ fontSize: 13 }}>{s?.school}</span>
                  </p>
                ))}
              </th>
              <th>
                {getWinnersByPosition(gpEngName, "THIRD").length}
                {getWinnersByPosition(gpEngName, "THIRD").map((s, r) => (
                  <p key={r}>
                    {`${r + 1}) ${s?.name}- ${s?.group}, ${s?.gender}, ${
                      s?.event1
                    }${s?.event2 ? `, ${s?.event2}` : ""}`}
                    {", "}
                    <br /> <span style={{ fontSize: 13 }}>{s?.school}</span>
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
