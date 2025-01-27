"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  enToBnNumber,
  getSubmitDateInput,
} from "../../modules/calculatefunctions";
import {
  BUTTONCOLORS,
  gpEngNames,
  gpNames,
  events,
} from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";

export default function CircleOfficeChestNoSheet() {
  const { yourStateObject } = useGlobalContext();
  const { data } = yourStateObject;
  const [filteredData, setFilteredData] = useState(data);
  const BoysList = data?.filter((el) => el?.gender === "BOYS");
  const GirlsList = data?.filter((el) => el?.gender === "GIRLS");
  const GroupABoys = BoysList?.filter((p) => p?.group === "GROUP-A");
  const Boys75MRun = GroupABoys?.filter(
    (p) => p?.event1 === "75 METER RUN" || p?.event2 === "75 METER RUN"
  );
  const BoysLONGJUMP = GroupABoys?.filter(
    (p) => p?.event1 === "LONG JUMP" || p?.event2 === "LONG JUMP"
  );
  const navigate = useRouter();
  let teacherdetails;
  let details = getCookie("tid");

  if (details) {
    teacherdetails = decryptObjData("tid");
  }

  useEffect(() => {
    if (teacherdetails.circle !== "admin") {
      if (teacherdetails.circleAssistant !== "admin") {
        navigate.push("/login");
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
      <h4>
        Amta West Circle Sports {new Date().getFullYear()} Eventwise All Chest
        No.
      </h4>
      <h3>BOYS</h3>
      <table
        className="table table-bordered border-black mx-auto"
        style={{
          width: "100%",
          borderWidth: 2,
          borderColor: "black",
          verticalAlign: "middle",
        }}
      >
        <thead>
          <tr>
            <th>GROUP</th>
            <th>EVENT</th>
            {gpEngNames.map((gpEngName, index) => (
              <th key={index}>{gpEngName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A</td>
            <td>75 METER RUN</td>
            {Boys75MRun?.map((b, index) => (
              <td key={index}>{b?.chestNo}</td>
            ))}
          </tr>
          <tr>
            <td>A</td>
            <td>LONG JUMP</td>
            {BoysLONGJUMP?.map((b, index) => (
              <td key={index}>{b?.chestNo}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
