"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { enToBnNumber } from "../../modules/calculatefunctions";
import { circleBenName, circleEngName } from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import Image from "next/image";

const EventTable = ({ eventName, groupName }) => (
  <>
    <tr>
      <th className="ben" colSpan={6}>
        {groupName} {eventName}
      </th>
    </tr>
    <tr>
      <th>RANK</th>
      <th>NAME</th>
      <th>CHEST NO.</th>
      <th>GURDIAN'S NAME</th>
      <th>SCHOOL</th>
      <th>GP</th>
    </tr>
    {[1, 2, 3].map((i) => (
      <tr style={{ height: 40 }} key={i}>
        <th style={{ width: "10%" }}>
          {i === 1 ? "FIRST" : i === 2 ? "SECOND" : "THIRD"}
        </th>
        <th style={{ width: "30%" }}></th>
        <th style={{ width: "10%" }}></th>
        <th style={{ width: "20%" }}></th>
        <th style={{ width: "20%" }}></th>
        <th style={{ width: "10%" }}></th>
      </tr>
    ))}
  </>
);

const CircleGroupWiseResultPrint = () => {
  const { yourStateObject } = useGlobalContext();

  const navigate = useRouter();
  const { gender, group } = yourStateObject || {};
  let teacherdetails;
  let details = getCookie("tid");
  let schdetails = getCookie("schid");
  if (details) {
    teacherdetails = decryptObjData("tid");
  }
  if (schdetails) {
    schdetails = decryptObjData("schid");
  }

  const genderMap = { BOYS: "বালক", GIRLS: "বালিকা" };
  const groupMap = {
    "GROUP-A": "'ক' বিভাগ",
    "GROUP-B": "'খ' বিভাগ",
    "GROUP-C": "'গ' বিভাগ",
  };

  const benGender = genderMap[gender] || "";
  const bengGroupName =
    benGender && groupMap[group] ? `${benGender} ${groupMap[group]}` : "";

  const groupAEvents = [
    "৭৫ মিটার দৌড়",
    "দীর্ঘ লম্ফন",
    "আলু দৌড় (SHUTTLE RACE)",
    "যোগা",
  ];
  const otherGroupEvents = [
    "১০০ মিটার দৌড়",
    "২০০ মিটার দৌড়",
    "দীর্ঘ লম্ফন",
    "উচ্চ লম্ফন",
    "যোগা",
    "জিম্‌নাস্টিক্‌স",
  ];
  if (group === "GROUP-C") {
    otherGroupEvents.push("ফুটবল ছোঁড়া");
  }

  useEffect(() => {
    if (
      teacherdetails?.circle !== "admin" &&
      teacherdetails?.circleAssistant !== "admin"
    ) {
      navigate.push("/Login");
    }
    if (gender && group) {
      document.title = `${circleEngName} Annual Sports ${gender} ${group} Result Sheet`;
    }
    // eslint-disable-next-line
  }, [gender, group, navigate, teacherdetails]);

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
      <table
        className="table table-bordered boder-black border-4"
        style={{ border: 2, borderColor: "black" }}
      >
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
        <tbody>
          <tr>
            <th colSpan={4} style={{ borderRight: 0 }}></th>
            <th colSpan={2} style={{ borderLeft: 0 }}>
              <h4
                className="text-center ben text-white bg-black p-1 rounded-2"
                style={{ width: "100%" }}
              >
                {group === "GROUP-A" ? benGender : bengGroupName}
              </h4>
            </th>
          </tr>
          {(group === "GROUP-A" ? groupAEvents : otherGroupEvents).map(
            (event) => (
              <EventTable
                key={event}
                eventName={event}
                groupName={bengGroupName}
              />
            )
          )}
        </tbody>
      </table>
      {gender && group && (
        <Image
          src={require(`../../images/${gender} ${group.split("-")[1]}.png`)}
          alt="LOGO"
          width={0}
          height={0}
          className="position-absolute top-50 start-50 translate-middle"
          style={{ opacity: 0.4, width: 420, height: "auto" }}
        />
      )}
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
