"use client";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import DataTable from "react-data-table-component";
import { firestore } from "../../context/FirbaseContext";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Loader from "../../components/Loader";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { getSubmitDateInput } from "../../modules/calculatefunctions";
import { bengEventNames, events } from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import SCHOOLS from "../../helpers/schools.json";
const GPAllStudents = () => {
  const { yourStateObject, setMyStateObject, setStateObject } =
    useGlobalContext();
  const searchParams = useSearchParams();
  const gp = searchParams.get("gp");
  const [data, setData] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const navigate = useRouter();
  const [allData, setAllData] = useState(data);
  const [filteredData, setFilteredData] = useState(data);
  const [showChestNoDiv, setShowChestNoDiv] = useState(false);
  const [startingChestNo, setStartingChestNo] = useState(101);
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);

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
  const [dldGrSelected, setDldGrSelected] = useState(false);
  const [dldInpGroup, setDldInpGroup] = useState("");
  const [dldEventName, setDldEventName] = useState("");
  const [dldEventSelected, setDldEventSelected] = useState(false);
  useEffect(() => {
    gender = document.getElementById("gender");
    group = document.getElementById("group");
    eventName = document.getElementById("eventName");
    // eslint-disable-next-line
  }, []);

  const allotChestNumber = async () => {
    setLoader(true);
    const actions = data
      .filter((el) => el?.gp === gp)
      .sort((a, b) => {
        if (a.gender < b.gender) return -1;
        if (a.gender > b.gender) return 1;
        if (a.event1rank < b.event1rank) return -1;
        if (a.event1rank > b.event1rank) return 1;
        return 0;
      })
      .map(async (el, ind) => {
        const chestNo = parseInt(startingChestNo) + ind;
        const docRef = doc(firestore, "gpSportsStudentData", el?.id);
        const x = allData.filter((item) => item.id === el?.id)[0];
        x.chestNo = chestNo;
        let y = allData.filter((item) => item.id !== el?.id);
        y = [...y, x];
        setData(y);
        setAllData(y);
        setFilteredData(y);
        await updateDoc(docRef, {
          chestNo: chestNo,
        })
          .then(async () => {
            console.log(`Participant ${el?.name} Alloted Chest No ${chestNo}`);
          })
          .catch((e) => {
            console.log(e);
            setLoader(false);
          });
      });
    Promise.all(actions).then(() => {
      setLoader(false);
    });
  };
  const removeChestNumber = async () => {
    setLoader(true);
    const actions = data
      .filter((el) => el?.gp === gp)
      .map(async (el, ind) => {
        const chestNo = "";
        const docRef = doc(firestore, "gpSportsStudentData", el?.id);
        const x = allData.filter((item) => item.id === el?.id)[0];
        x.chestNo = chestNo;
        let y = allData.filter((item) => item.id !== el?.id);
        y = [...y, x];
        setData(y);
        setAllData(y);
        setFilteredData(y);
        await updateDoc(docRef, {
          chestNo: chestNo,
        })
          .then(async () => {
            console.log(`Participant ${el?.name} Chest No Removed`);
          })
          .catch((e) => {
            console.log(e);
            setLoader(false);
          });
      });
    Promise.all(actions).then(() => {
      setLoader(false);
    });
  };
  const getData = async () => {
    try {
      setLoader(true);
      const q = query(
        collection(firestore, "gpSportsStudentData"),
        where("gp", "==", gp)
      );
      const querySnapshot = await getDocs(q);
      const studentData = querySnapshot.docs.map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        ...doc.data(),
        // id: doc.id,
      }));
      const data = studentData.sort((a, b) => {
        if (a.gender < b.gender) return -1;
        if (a.gender > b.gender) return 1;
        if (a.event1rank < b.event1rank) return -1;
        if (a.event1rank > b.event1rank) return 1;
        return 0;
      });
      setData(data?.filter((el) => el?.gp === gp));
      setAllData(data?.filter((el) => el?.gp === gp));
      setFilteredData(data?.filter((el) => el?.gp === gp));
      setSchoolData(SCHOOLS.filter((el) => el.gp === gp));
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log("Error getting documents: ", error);
    }
  };
  const columns = [
    {
      name: "Sl",
      selector: (row, index) => allData.findIndex((i) => i.id === row?.id) + 1,
      sortable: +true,
      center: +true,
    },
    {
      name: "Chest No.",
      selector: (row, index) => row.chestNo,
      sortable: +true,
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
    getData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {}, [startingChestNo, allData, filteredData]);
  return (
    <Suspense fallback={<Loader />}>
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
                    //eslint-disable-next-line
                    let message = confirm(
                      `Are You Sure To Allot all Chest Numbers?`
                    );
                    message
                      ? allotChestNumber()
                      : toast.error("Chest Numbers Not Alloted");
                  } else {
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
              <div>
                <button
                  type="button"
                  className="btn btn-danger m-1 btn-sm"
                  onClick={async () => {
                    //eslint-disable-next-line
                    let message = confirm(
                      `Are You Sure To Remove all Chest Numbers?`
                    );
                    message
                      ? removeChestNumber()
                      : toast.error("Chest Numbers Not Removed");
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="mb-3">
              <button
                type="button"
                className="btn btn-warning m-1 col-md-1 btn-sm"
                onClick={() => {
                  setShowChestNoDiv(false);
                  setStartingChestNo(101);
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
            style={{ width: "auto" }}
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
                  setInpGender(e.target.value?.split("_")[0] || "");
                  setEngGenderName(e.target.value?.split("_")[1] || "");
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
                    setInpGroup(e.target.value?.split("_")[0] || "");
                    setEngGroupName(e.target.value?.split("_")[1] || "");
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
                    setInpEventBengName(e.target.value?.split("_")[0] || "");
                    setEngEventName(e.target.value?.split("_")[1] || "");
                  }}
                  aria-label="Default select example"
                >
                  <option value="">Select Event Name</option>
                  {inpGroup === "'ক' বিভাগ"
                    ? bengEventNames.groupA.map((el, ind) => (
                        <option value={el + "_" + events.groupA[ind]} key={ind}>
                          {el}
                        </option>
                      ))
                    : inpGroup === "'খ' বিভাগ"
                    ? bengEventNames.groupB.map((el, ind) => (
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
                  setMyStateObject({
                    data: filteredData
                      .filter((el) => el?.gender === engGenderName)
                      .filter((el) => el?.group === engGroupName)
                      .filter(
                        (el) =>
                          el?.event1 === engEventName ||
                          el?.event2 === engEventName
                      ),
                    school: schoolData,
                    eventName: `${inpgender} ${inpGroup}- ${inpeventBengName}`,
                    gender: engGenderName,
                    group: engGroupName,
                    engEventName: engEventName,
                  });
                  navigate.push(`/GPSportsEventWiseName`);
                }}
              >
                {`Go To => ${inpgender} ${inpGroup}- ${inpeventBengName}`}
              </button>
              <button
                type="button"
                className="btn btn-danger m-1 btn-sm"
                onClick={async () => {
                  gender = document.getElementById("gender");
                  group = document.getElementById("group");
                  eventName = document.getElementById("eventName");
                  setInpGender("");
                  setInpGroup("");
                  setInpEventBengName("");
                  setGenderSelected(false);
                  setInpGrSelected(false);
                  setEventSelected(false);
                  if (gender) gender.value = "";
                  if (group) group.value = "";
                  if (eventName) eventName.value = "";
                }}
              >
                Reset
              </button>
            </>
          )}
        </div>
        <div className="container my-3 mx-auto">
          <h3 className="text-center text-primary">Download Event Sheets</h3>
          <div className="row">
            <div className="mb-3 col-md-3">
              <label className="form-label">Select Group *</label>
              <select
                className="form-select ben"
                defaultValue={""}
                id="group"
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
                    setDldEventSelected(true);
                    setDldEventName(e.target.value);
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
              <div>
                <button
                  type="button"
                  className="btn btn-primary m-1 "
                  onClick={async () => {
                    setMyStateObject({
                      data: filteredData
                        .filter((el) => el?.group === dldInpGroup)
                        .filter(
                          (el) =>
                            el?.event1 === dldEventName ||
                            el?.event2 === dldEventName
                        ),
                      school: schoolData,
                      group: dldInpGroup,
                      engEventName: dldEventName,
                      gp: gp,
                    });
                    navigate.push(`/GPDownloadEventSheets`);
                  }}
                >
                  {`Go To Download=> ${dldInpGroup}- ${dldEventName} Event Sheet`}
                </button>
                <button
                  type="button"
                  className="btn btn-danger m-1 btn-sm"
                  onClick={async () => {
                    group = document.getElementById("group");
                    eventName = document.getElementById("eventName");
                    setDldInpGroup("");
                    setDldEventName("");
                    setDldGrSelected(false);
                    setDldEventSelected(false);
                    if (group) group.value = "";
                    if (eventName) eventName.value = "";
                  }}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="container my-3 mx-auto">
          <h3 className="text-center text-primary">Enter Result</h3>
          <button
            type="button"
            className="btn p-2 btn-success m-1 btn-sm"
            onClick={async () => {
              setStateObject({
                data: filteredData,
                school: schoolData,
              });
              navigate.push(`/GPResultSection`);
            }}
          >
            Go To GP Result Section
          </button>
        </div>
        <div className="my-4">
          <h3 className="text-center text-primary">
            Displaying {gp} GP Sports All School's Participants
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
                onChange={(e) => {
                  setSearch(e.target.value);
                  const result = allData?.filter((el) =>
                    el?.name?.toLowerCase().match(e.target.value.toLowerCase())
                  );
                  setFilteredData(result);
                }}
              />
            }
            subHeaderAlign="right"
          />
          {filteredData?.length > 0 && (
            <button
              type="button"
              className="btn p-2 btn-success m-1 btn-sm"
              onClick={async () => {
                setStateObject({
                  data: filteredData,
                  gp: gp,
                });
                navigate.push(`/GPPrintTreeList`);
              }}
            >
              Go To Print Tree List
            </button>
          )}
          {filteredData?.length > 0 && (
            <button
              type="button"
              className="btn p-2 btn-dark m-1 btn-sm"
              onClick={async () => {
                setStateObject({
                  data: filteredData,
                  gp: gp,
                });
                navigate.push(`/GPOfficeChestNoSheet`);
              }}
            >
              Go To Print GP Office Chest No Sheet
            </button>
          )}
        </div>
        {loader && <Loader />}
      </div>
    </Suspense>
  );
};

export default GPAllStudents;
