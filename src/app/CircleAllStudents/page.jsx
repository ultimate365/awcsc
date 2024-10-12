"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { firestore } from "../../context/FirbaseContext";
import { doc, updateDoc } from "firebase/firestore";
import Loader from "../../components/Loader";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { getSubmitDateInput } from "../../modules/calculatefunctions";
import { bengEventNames, events } from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import axios from "axios";
const CircleAllStudents = () => {
  const { stateObject, setYourStateObject, setMyStateObject } =
    useGlobalContext();
  const data = stateObject?.data?.sort((a, b) => a?.gp.localeCompare(b?.gp));
  const gpData = stateObject?.gp;
  const navigate = useRouter();
  const [allData, setAllData] = useState(data);
  const [filteredData, setFilteredData] = useState(data);
  const [showChestNoDiv, setShowChestNoDiv] = useState(false);
  const [startingChestNo, setStartingChestNo] = useState(1);
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);
  let teacherdetails;
  let details = getCookie("tid");

  if (details) {
    teacherdetails = decryptObjData("tid");
  }

  let gender;
  let group;
  let eventName;
  const [inpgender, setInpGender] = useState("");
  const [inpGroup, setInpGroup] = useState("");
  const [inpeventBengName, setInpEventBengName] = useState("");
  const [genderSelected, setGenderSelected] = useState(false);
  const [inpGrSelected, setInpGrSelected] = useState(false);
  const [eventSelected, setEventSelected] = useState(false);

  const [engGenderName, setEngGenderName] = useState("");
  const [engGroupName, setEngGroupName] = useState("");
  const [engEventName, setEngEventName] = useState("");

  useEffect(() => {
    if (teacherdetails.circle !== "admin") {
      if (teacherdetails.circleAssistant !== "admin") {
        navigate.push("/login");
      }
    }
    gender = document.getElementById("gender");
    group = document.getElementById("group");
    eventName = document.getElementById("eventName");
    // eslint-disable-next-line
  }, []);

  const allotChestNumber = async () => {
    setLoader(true);
    data
      .sort((a, b) => a?.gp.localeCompare(b?.gp))
      .map(async (el, ind) => {
        const chestNo = parseInt(startingChestNo) + ind;
        const docRef = doc(firestore, "allGPFirsts", el?.id);
        await axios.post("/api/updateallGPFirsts", { id: el?.id, chestNo });
        await updateDoc(docRef, {
          chestNo,
        })
          .then(async () => {
            console.log(`Participant ${el?.name} Alloted Chest No ${chestNo}`);
          })
          .catch((e) => {
            console.log(e);
            setLoader(false);
          });
      });
    setTimeout(() => {
      setLoader(false);
      navigate.back();
    }, 6000);
  };

  const columns = [
    {
      name: "Sl",
      selector: (row, index) => data.findIndex((i) => i.id === row?.id) + 1,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Chest No.",
      selector: (row, index) => row.chestNo,
      sortable: +true,
      wrap: +true,
      center: +true,
    },

    {
      name: "Participants Name",
      selector: (row) => row.name,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Date of Birth",
      selector: (row) => getSubmitDateInput(row.birthday),
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Class",
      selector: (row) => row.sclass,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "School Name",
      selector: (row) => row.school,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "GP Name",
      selector: (row) => row.gp,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: +true,
      wrap: +true,
      center: +true,
    },

    {
      name: "Group",
      selector: (row) => row.group,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Event 1",
      selector: (row) => row.event1,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Event 2",
      selector: (row) => row.event2,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
  ];
  useEffect(() => {
    const result = allData?.filter((el) => {
      return el?.name.toLowerCase().match(search.toLowerCase());
    });
    setFilteredData(result);
    // eslint-disable-next-line
  }, [search]);
  useEffect(() => {
    // eslint-disable-next-line
  }, [startingChestNo]);
  return (
    <div className="container-fluid timesfont my-4 bg-white">
      {showChestNoDiv ? (
        <div className="my-4 row justify-content-center align-items-center mx-auto">
          <div className="mb-3 col-md-3">
            <label className="form-label">Enter Starting Chest No.</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Starting Chest No."
              value={startingChestNo}
              onChange={(e) => {
                setStartingChestNo(e.target.value);
              }}
              maxLength={3}
              required
            />
          </div>
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-success m-1 col-md-1 btn-sm"
              onClick={() => {
                if (startingChestNo > 0) {
                  allotChestNumber();
                } else {
                  console.log("first");
                  toast.error("Please Enter A Valid Number", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                }
              }}
            >
              Submit
            </button>
          </div>
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-warning m-1 col-md-1 btn-sm"
              onClick={() => {
                setShowChestNoDiv(false);
                setStartingChestNo(1);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-info m-1 col-md-1 btn-sm"
          onClick={async () => {
            setShowChestNoDiv(true);
          }}
        >
          Allot Chest Number
        </button>
      )}

      <div className="container my-3 mx-auto">
        <h3 className="text-center text-primary">
          Display / Print Event Sheets
        </h3>
        <div className="my-4 row">
          <div className="mb-3 col-md-3">
            <label className="form-label">Select Gender *</label>
            <select
              className="form-select ben"
              id="gender"
              defaultValue={""}
              onChange={(e) => {
                if (group) {
                  group.value = "";
                }
                if (eventName) {
                  eventName.value = "";
                }
                setGenderSelected(true);
                setInpGender(e.target.value.split("_")[0]);
                setEngGenderName(e.target.value.split("_")[1]);
              }}
              aria-label="Default select example"
            >
              <option value="">Select Gender</option>
              <option value="বালক_BOYS">বালক</option>
              <option value="বালিকা_GIRLS">বালিকা</option>
            </select>
          </div>
          {genderSelected && (
            <div className="mb-3 col-md-3">
              <label className="form-label">Select Group *</label>
              <select
                className="form-select ben"
                defaultValue={""}
                id="group"
                onChange={(e) => {
                  if (eventName) {
                    eventName.value = "";
                  }
                  setInpGrSelected(true);
                  setInpGroup(e.target.value.split("_")[0]);
                  setEngGroupName(e.target.value.split("_")[1]);
                }}
                aria-label="Default select example"
              >
                <option value="">Select Group</option>
                <option value="'ক' বিভাগ_GROUP-A">'ক' বিভাগ</option>
                <option value="'খ' বিভাগ_GROUP-B">'খ' বিভাগ</option>
                <option value="'গ' বিভাগ_GROUP-C">'গ' বিভাগ</option>
              </select>
            </div>
          )}
          {inpGrSelected && (
            <div className="mb-3 col-md-3">
              <label className="form-label">Select Event Name *</label>
              <select
                className="form-select ben"
                defaultValue={""}
                id="eventName"
                onChange={(e) => {
                  setEventSelected(true);
                  setInpEventBengName(e.target.value.split("_")[0]);
                  setEngEventName(e.target.value.split("_")[1]);
                }}
                aria-label="Default select example"
              >
                <option value="">Select Event Name</option>
                {inpGroup === "'ক' বিভাগ"
                  ? bengEventNames.groupA?.map((el, ind) => (
                      <option value={el + "_" + events.groupA[ind]} key={ind}>
                        {el}
                      </option>
                    ))
                  : inpGroup === "'খ' বিভাগ"
                  ? bengEventNames.groupB?.map((el, ind) => (
                      <option value={el + "_" + events.groupB[ind]} key={ind}>
                        {el}
                      </option>
                    ))
                  : inpGroup === "'গ' বিভাগ"
                  ? bengEventNames.groupC.map((el, ind) => (
                      <option value={el + "_" + events.groupC[ind]} key={ind}>
                        {el}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
          )}
        </div>
        {eventSelected && (
          <>
            <button
              type="button"
              className="btn btn-primary m-1 btn-sm"
              onClick={async () => {
                setYourStateObject({
                  data: filteredData
                    .filter((el) => el?.gender === engGenderName)
                    .filter((el) => el?.group === engGroupName)
                    .filter(
                      (el) =>
                        el?.event1 === engEventName ||
                        el?.event2 === engEventName
                    ),
                  school: gpData,
                  eventName: `${inpgender} ${inpGroup}- ${inpeventBengName}`,
                  gender: engGenderName,
                  group: engGroupName,
                });
                navigate.push(`/CircleSportsEventWiseName`);
              }}
            >
              {`Go To => ${inpgender} ${inpGroup}- ${inpeventBengName}`}
            </button>
            <button
              type="button"
              className="btn btn-danger m-1 btn-sm"
              onClick={async () => {
                setInpGender("");
                setInpGroup("");
                setInpEventBengName("");
                setGenderSelected(false);
                setInpGrSelected(false);
                setEventSelected(false);
                gender.value = "";
                group.value = "";
                eventName.value = "";
              }}
            >
              Reset
            </button>
          </>
        )}
      </div>
      <div className="container my-3 mx-auto">
        <h3 className="text-center text-primary">Enter Result</h3>
        <button
          type="button"
          className="btn btn-success m-1 btn-sm"
          onClick={async () => {
            setMyStateObject({
              data: filteredData,
              gp: gpData,
            });
            navigate.push(`/CircleResultSection`);
          }}
        >
          Go To Circle Sports Result Section
        </button>
      </div>
      <div className="my-4">
        <h3 className="text-center text-primary">
          Displaying Amta West Circle Sports All GP's Participants
        </h3>

        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          fixedHeader
          subHeader
          subHeaderComponent={
            <input
              type="text"
              placeholder="Search"
              className="w-25 form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          }
          subHeaderAlign="right"
        />
      </div>
      {loader && <Loader />}
    </div>
  );
};

export default CircleAllStudents;
