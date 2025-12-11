"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { events } from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import dynamic from "next/dynamic";
import CircleEventList from "../../pdf/CircleEventList";
export default function CircleDownloadEventSheets() {
  const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    }
  );
  const { stateObject } = useGlobalContext();
  const data = stateObject?.data?.sort((a, b) => {
    if (a.gp < b.gp) return -1;
    if (a.gp > b.gp) return 1;
    if (a.gender < b.gender) return -1;
    if (a.gender > b.gender) return 1;
    if (a.event1rank < b.event1rank) return -1;
    if (a.event1rank > b.event1rank) return 1;
    return 0;
  });
  const navigate = useRouter();

  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const [dldGrSelected, setDldGrSelected] = useState(false);
  const [dldInpGroup, setDldInpGroup] = useState("");
  const [dldEventName, setDldEventName] = useState("");
  const [dldEventSelected, setDldEventSelected] = useState(false);
  const [eventObject, setEventObject] = useState({
    data: data,
    group: "",
    engEventName: "",
  });
  let groupInp;
  let eventName;
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
        navigate.push("/Logout");
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container-fluid my-5">
      <div className="noprint my-2">
        <button
          type="button"
          className="btn btn-warning my-4 btn-sm"
          onClick={() => navigate.push("/CircleAllStudents")}
        >
          Go Back
        </button>
      </div>
      <div className="my-4">
        <h3 className="text-center text-primary">Download Event Sheets</h3>
        <div
          className="row"
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div className="mb-3 col-md-3">
            <label className="form-label">Select Group *</label>
            <select
              className="form-select ben"
              defaultValue={""}
              id="groupInp"
              onChange={(e) => {
                eventName = document.getElementById("eventName");
                if (eventName) {
                  eventName.value = "";
                }
                setDldGrSelected(true);
                setDldInpGroup(e.target.value);
              }}
              aria-label="Default select example"
            >
              <option value="">Select Group</option>
              <option value="GROUP-A">'ক' বিভাগ</option>
              <option value="GROUP-B">'খ' বিভাগ</option>
              <option value="GROUP-C">'গ' বিভাগ</option>
            </select>
          </div>
          {dldGrSelected && (
            <div className="mb-3 col-md-3">
              <label className="form-label">Select Event Name *</label>
              <select
                className="form-select ben"
                defaultValue={""}
                id="eventName"
                onChange={(e) => {
                  const eventName = e.target.value;
                  setDldEventSelected(true);
                  setDldEventName(eventName);
                  const filteredData = data
                    ?.filter((el) => el?.group === dldInpGroup)
                    .filter(
                      (el) =>
                        el?.event1 === eventName || el?.event2 === eventName
                    );
                  setEventObject({
                    data: filteredData,
                    group: dldInpGroup,
                    engEventName: eventName,
                  });
                  setTimeout(() => {
                    setShowDownloadBtn(true);
                  }, 200);
                }}
                aria-label="Default select example"
              >
                <option value="">Select Event Name</option>
                {dldInpGroup === "GROUP-A"
                  ? events.groupA.map((el, ind) => (
                      <option value={el} key={ind}>
                        {el}
                      </option>
                    ))
                  : dldInpGroup === "GROUP-B"
                  ? events.groupB.map((el, ind) => (
                      <option value={el} key={ind}>
                        {el}
                      </option>
                    ))
                  : dldInpGroup === "GROUP-C"
                  ? events.groupC.map((el, ind) => (
                      <option value={el} key={ind}>
                        {el}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
          )}
          {dldEventSelected && (
            <div className="col-md-3">
              <button
                type="button"
                className="btn btn-danger m-1 btn-sm"
                onClick={async () => {
                  groupInp = document.getElementById("groupInp");
                  eventName = document.getElementById("eventName");
                  setDldInpGroup("");
                  setDldEventName("");
                  setDldGrSelected(false);
                  setDldEventSelected(false);
                  setShowDownloadBtn(false);
                  if (groupInp) groupInp.value = "";
                  if (eventName) eventName.value = "";
                }}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
      {showDownloadBtn && (
        <PDFDownloadLink
          document={<CircleEventList myData={eventObject} />}
          fileName={`Circle Event Sheets of ${dldInpGroup}, ${dldEventName}`}
          style={{
            textDecoration: "none",
            padding: "10px",
            color: "#fff",
            backgroundColor: "navy",
            border: "1px solid #4a4a4a",
            width: "40%",
            borderRadius: 10,
          }}
          onClick={() => {
            setTimeout(() => {
              groupInp = document.getElementById("groupInp");
              eventName = document.getElementById("eventName");
              setDldInpGroup("");
              setDldEventName("");
              setDldGrSelected(false);
              setDldEventSelected(false);
              setShowDownloadBtn(false);
              if (groupInp) groupInp.value = "";
              if (eventName) eventName.value = "";
            }, 500);
          }}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Loading..." : "Download Event Sheet"
          }
        </PDFDownloadLink>
      )}
    </div>
  );
}
