"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../../context/FirbaseContext";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  birthday,
  BUTTONCOLORS,
  events,
  gpEngNames,
  maxdob,
  mindob,
  StdClass,
  eventRanks,
} from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import { v4 as uuid } from "uuid";
import SCHOOLS from "../../helpers/schools.json";

export default function GpSportsDirectNameEntry() {
  const { gpLockState, gpStudentState, setGpStudentState } = useGlobalContext();
  const navigate = useRouter();
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState({
    id: "",
    school: "",
    udise: "",
    gp: "",
    year: 2025,
    hoi: "",
  });
  let teacherdetails = {
    id: "",
    convenor: "",
    gp: "",
    school: "",
    circle: "",
    tname: "",
  };
  const [teacher, setTeacher] = useState({
    id: "",
    convenor: "",
    gp: "",
    school: "",
    circle: "",
    tname: "",
  });
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [inpGrSelected, setInpGrSelected] = useState(false);
  const [firstEventSelected, setFirstEventSelected] = useState(false);
  const [selectedGP, setSelectedGP] = useState("");
  const [editClicked, setEditClicked] = useState(false);
  const [lockData, setLockData] = useState([]);
  const [gpLockData, setGpLockData] = useState({});
  const [lockStatus, setLockStatus] = useState(false);
  let group;
  let event1;
  let event2;

  const getLockData = async (gpName) => {
    const data = gpLockState;
    setLockData(data);
    setLockStatus(data?.filter((el) => el?.gp === gpName)[0]?.edit);
    setGpLockData(data?.filter((el) => el?.gp === gpName)[0]);
  };

  const docId = uuid();
  const [inputField, setInputField] = useState({
    id: docId,
    name: "",
    gurdiansName: "",
    chestNo: "",
    birthday: birthday,
    studentId: "",
    sclass: "",
    school: "",
    gp: "",
    event1: "",
    event2: "",
    event1rank: "",
    event2rank: "",
    gender: "",
    group: "",
    udise: "",
  });

  const getAllParticipant = async () => {
    setLoader(true);
    const q = query(collection(firestore, "gpSportsStudentData"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs
      .map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        ...doc.data(),
        // id: doc.id,
      }))
      .sort((a, b) => {
        if (a.gp < b.gp) return -1;
        if (a.gp > b.gp) return 1;
        if (a.gender < b.gender) return -1;
        if (a.gender > b.gender) return 1;
        if (a.event1rank < b.event1rank) return -1;
        if (a.event1rank > b.event1rank) return 1;
        return 0;
      });
    setGpStudentState(data);
    setFilteredData(data);
    setLoader(false);
  };
  const columns = [
    {
      name: "Sl",
      selector: (row, index) =>
        gpStudentState.findIndex((i) => i.id === row?.id) + 1,
      sortable: true,
    },
    {
      name: "GP",
      selector: (row) => row.gp,
      sortable: true,
      wrap: true,
    },
    {
      name: "Participants Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "School Name",
      selector: (row) => row.school,
      sortable: true,
      wrap: true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: true,
      wrap: true,
    },
    {
      name: "Group",
      selector: (row) => row.group,
      sortable: true,
      wrap: true,
    },
    {
      name: "Event 1",
      selector: (row) => row.event1,
      wrap: true,
    },
    {
      name: "Event 2",
      selector: (row) => row.event2,
      wrap: true,
    },
    {
      name: "Actions",
      selector: (row) =>
        lockStatus ? (
          <div>
            <button
              type="button"
              className="btn btn-success m-1 btn-sm"
              onClick={() => {
                setInputField(row);
                setInpGrSelected(true);
                setEditClicked(true);
                setFirstEventSelected(true);
                setFilteredSchools(SCHOOLS.filter((s) => s.gp === row.gp));
                const fdS = SCHOOLS.filter((s) => s.udise === row.udise)[0];
                setSelectedSchool(fdS);
                setTimeout(() => {
                  let gender = document.getElementById("gender");
                  let group = document.getElementById("group");
                  let element1 = document.getElementById("event1");
                  let element2 = document.getElementById("event2");
                  let element3 = document.getElementById("stdClass");
                  let element4 = document.getElementById("school-select");
                  if (gender) {
                    gender.value = row.gender;
                    group.value = row.group;
                    element1.value = row.event1;
                    element2.value = row.event2;
                    element3.value = row.sclass;
                    if (element4) {
                      element4.value = JSON.stringify(fdS);
                    }
                  }
                }, 100);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-danger m-1 btn-sm"
              onClick={() => {
                //eslint-disable-next-line
                let message = confirm(
                  `Are You Sure To Delete Participant ${row.name}`
                );
                message
                  ? deleteParticipant(row)
                  : toast.error("Participant Not Deleted");
              }}
            >
              Delete
            </button>
          </div>
        ) : (
          <h6 className="text-center text-danger">Closed</h6>
        ),
      wrap: true,
    },
  ];
  const submitData = async () => {
    setLoader(true);
    const upLoadedResult = {
      id: inputField.id,
      name: inputField.name,
      gurdiansName: inputField.gurdiansName,
      chestNo: inputField.chestNo,
      birthday: inputField.birthday,
      studentId: inputField.studentId,
      sclass: inputField.sclass,
      school: inputField.school,
      gp: inputField.gp,
      event1:
        inputField.event2rank === "" || inputField.event2 === ""
          ? inputField.event1
          : inputField.event2rank === ""
          ? inputField.event1
          : inputField.event1rank < inputField.event2rank
          ? inputField.event1
          : inputField.event1rank > inputField.event2rank
          ? inputField.event2
          : inputField.event2,
      event2:
        inputField.event2 === ""
          ? ""
          : inputField.event2rank !== "" && inputField.event2 === ""
          ? ""
          : inputField.event1rank < inputField.event2rank
          ? inputField.event2
          : inputField.event1rank > inputField.event2rank
          ? inputField.event1
          : inputField.event1rank === ""
          ? inputField.event1
          : inputField.event2rank === ""
          ? ""
          : inputField.event1,
      event1rank:
        inputField.event2rank === "" || inputField.event2 === ""
          ? inputField.event1rank
          : inputField.event1rank < inputField.event2rank
          ? inputField.event1rank
          : inputField.event1rank > inputField.event2rank
          ? inputField.event2rank
          : inputField.event2rank,
      event2rank:
        inputField.event2rank === "" || inputField.event2 === ""
          ? ""
          : inputField.event1rank < inputField.event2rank
          ? inputField.event2rank
          : inputField.event1rank > inputField.event2rank
          ? inputField.event1rank
          : inputField.event1rank === ""
          ? inputField.event1rank
          : inputField.event2rank === ""
          ? ""
          : inputField.event1rank,
      gender: inputField.gender,
      group: inputField.group,
      udise: inputField.udise,
      entryBy: inputField.entryBy,
      updatedBy: teacher.id,
    };
    setGpStudentState([...gpStudentState, upLoadedResult]);
    await setDoc(
      doc(firestore, "gpSportsStudentData", inputField.id),
      upLoadedResult
    ).then(async () => {
      setLoader(false);
      setInputField({
        id: docId,
        name: "",
        gurdiansName: "",
        chestNo: "",
        birthday: birthday,
        studentId: "",
        sclass: "",
        school: selectedSchool.school,
        gp: selectedGP,
        event1: "",
        event2: "",
        event1rank: "",
        event2rank: "",
        gender: "",
        group: "",
        udise: "",
        entryBy: "",
        updatedBy: "",
      });
      setInpGrSelected(false);
      setFirstEventSelected(false);
      document.getElementById("gender").value = "";
      document.getElementById("group").value = "";
      document.getElementById("event1").value = "";
      document.getElementById("event2").value = "";
      document.getElementById("birthday").value = birthday;

      toast.success(
        `congratulation! Your Data Has Heen Saved to ${selectedGP} GP Sports Data`
      );
      setFilteredData([...filteredData, upLoadedResult]);
    });
  };
  const updateData = async () => {
    setLoader(true);

    const updatedResult = {
      id: inputField.id,
      name: inputField.name,
      gurdiansName: inputField.gurdiansName,
      chestNo: inputField.chestNo,
      birthday: inputField.birthday,
      studentId: inputField.studentId,
      sclass: inputField.sclass,
      school: inputField.school,
      gp: inputField.gp,
      event1:
        inputField.event2rank === "" || inputField.event2 === ""
          ? inputField.event1
          : inputField.event1rank < inputField.event2rank
          ? inputField.event1
          : inputField.event1rank > inputField.event2rank
          ? inputField.event2
          : inputField.event2,
      event2:
        inputField.event2 === ""
          ? ""
          : inputField.event2rank !== "" && inputField.event2 === ""
          ? ""
          : inputField.event1rank < inputField.event2rank
          ? inputField.event2
          : inputField.event1rank > inputField.event2rank
          ? inputField.event1
          : inputField.event1rank === ""
          ? inputField.event1
          : inputField.event2rank === ""
          ? ""
          : inputField.event1,
      event1rank:
        inputField.event2rank === "" || inputField.event2 === ""
          ? inputField.event1rank
          : inputField.event1rank < inputField.event2rank
          ? inputField.event1rank
          : inputField.event1rank > inputField.event2rank
          ? inputField.event2rank
          : inputField.event2rank,
      event2rank:
        inputField.event2rank === "" || inputField.event2 === ""
          ? ""
          : inputField.event1rank < inputField.event2rank
          ? inputField.event2rank
          : inputField.event1rank > inputField.event2rank
          ? inputField.event1rank
          : inputField.event1rank === ""
          ? inputField.event1rank
          : inputField.event2rank === ""
          ? ""
          : inputField.event1rank,
      gender: inputField.gender,
      group: inputField.group,
      udise: inputField.udise,
      entryBy: inputField.entryBy,
      updatedBy: teacher.id,
    };
    const newData = gpStudentState.map((item) =>
      item.id === inputField.id ? updatedResult : item
    );
    setGpStudentState(newData);
    setFilteredData(newData);
    await updateDoc(
      doc(firestore, "gpSportsStudentData", inputField.id),
      updatedResult
    ).then(async () => {
      setLoader(false);
      setInputField({
        id: docId,
        name: "",
        gurdiansName: "",
        chestNo: "",
        birthday: birthday,
        studentId: "",
        sclass: "",
        school: selectedSchool.school,
        gp: selectedGP,
        event1: "",
        event2: "",
        event1rank: "",
        event2rank: "",
        gender: "",
        group: "",
        udise: "",
        entryBy: "",
        updatedBy: "",
      });
      setInpGrSelected(false);
      setFirstEventSelected(false);
      setEditClicked(false);
      document.getElementById("gender").value = "";
      document.getElementById("group").value = "";
      document.getElementById("event1").value = "";
      document.getElementById("event2").value = "";
      document.getElementById("birthday").value = birthday;

      toast.success(
        `congratulation! Your Data Has Heen Saved to ${selectedGP} GP Sports Data`
      );
    });
  };
  const deleteParticipant = async (participant) => {
    setLoader(true);
    try {
      await deleteDoc(
        doc(firestore, "gpSportsStudentData", participant.id)
      ).then(() => {
        setLoader(false);
        setGpStudentState(
          gpStudentState.filter((item) => item.id !== participant.id)
        );
        setFilteredData(
          gpStudentState.filter((item) => item.id !== participant.id)
        );
        toast.success("Participant Deleted Successfully");
      });
    } catch (e) {
      setLoader(false);
      console.error(e);
      toast.error("Participant Deletable Error");
    }
  };

  let details = getCookie("tid");
  if (details) {
    teacherdetails = decryptObjData("tid");
  }
  useEffect(() => {
    setTeacher(teacherdetails);
    if (teacherdetails.circle !== "admin") {
      if (teacherdetails.convenor !== "admin") {
        if (teacherdetails.gpAssistant !== "admin") {
          navigate.push("/Login");
        }
      }
    }
    if (gpStudentState.length === 0) {
      getAllParticipant();
    } else {
      setFilteredData(gpStudentState);
    }

    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    //eslint-disable-next-line
  }, [inputField]);
  return (
    <div className="container text-center my-2">
      {loader && <Loader />}

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
              if (e.target.value !== "") {
                let x = gpStudentState.filter((el) => {
                  return el.name
                    .toLowerCase()
                    .match(e.target.value?.toLowerCase());
                });
                setFilteredData(x);
              } else {
                setFilteredData(gpStudentState);
              }
            }}
          />
        }
        subHeaderAlign="right"
      />
      <h3 className="text-primary my-3">
        GP Sports Students Direct Name Entry Section
      </h3>
      <div className="my-2">
        {gpEngNames.map((gpEngName, index) => (
          <button
            type="button"
            className={`btn m-1 ${gpEngName !== selectedGP ? "btn-sm" : ""}`}
            style={{
              backgroundColor: BUTTONCOLORS[index],
              color: "white",
            }}
            onClick={() => {
              setSelectedGP(gpEngName);
              getLockData(gpEngName);
              setFilteredSchools(SCHOOLS.filter((s) => s.gp === gpEngName));
              setSelectedSchool({
                id: "",
                school: "",
                udise: "",
                gp: "",
                year: 2025,
                hoi: "",
              });
            }}
            key={index}
          >
            {gpEngName}
          </button>
        ))}
      </div>
      {selectedGP && (
        <div>
          <div className="my-2">
            <h4 className="text-success">Selected GP is {selectedGP}</h4>
          </div>
          {selectedSchool.udise === "" ? (
            <div className="my-2 mx-auto">
              <div className="mb-3 col-md-6 mx-auto">
                <label className="form-label">Select School</label>
                <select
                  className="form-select"
                  defaultValue={""}
                  id="school-select"
                  onChange={(e) => {
                    const value = JSON.parse(e.target.value);
                    setSelectedSchool(value);
                    setInputField((prev) => ({
                      ...prev,
                      school: value.school,
                    }));
                  }}
                  aria-label="Default select example"
                >
                  <option value="">Select School</option>
                  {filteredSchools.map((s, i) => (
                    <option value={JSON.stringify(s)} key={i}>
                      {s?.school + " (" + s?.udise + ")"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div>
              <div>
                <div className="my-2">
                  <h4 className="text-primary">
                    Selected School is {selectedSchool.school} (
                    {selectedSchool.udise})
                  </h4>
                </div>
                <div className="container">
                  <p className="text-center text-danger">
                    (*) Marked Fields are Compulsary.
                  </p>
                  <div className="row align-items-end my-4">
                    <div className="mb-3 col-md-3">
                      <label className="form-label">Participant Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Participant Name"
                        value={inputField.name}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            name: e.target.value.toUpperCase(),
                            school: selectedSchool.school,
                            gp: selectedSchool.gp,
                            udise: selectedSchool.udise,
                            entryBy: teacher.tname,
                          });
                        }}
                        required
                      />
                    </div>
                    {inputField.name && (
                      <React.Fragment>
                        <div className="mb-3 col-md-3">
                          <label className="form-label">Gurdian's Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Gurdian's Name"
                            value={inputField.gurdiansName}
                            onChange={(e) => {
                              setInputField({
                                ...inputField,
                                gurdiansName: e.target.value.toUpperCase(),
                              });
                            }}
                            required
                          />
                        </div>
                        <div className="mb-3 col-md-3">
                          <label className="form-label">Gender *</label>
                          <select
                            className="form-select"
                            id="gender"
                            defaultValue={""}
                            onChange={(e) => {
                              setInpGrSelected(false);
                              setFirstEventSelected(false);
                              if (group) {
                                group.value = "";
                              }
                              if (event1) {
                                event1.value = "";
                                setInputField({
                                  ...inputField,
                                  event1: "",
                                  event1rank: "",
                                  event2: "",
                                  event2rank: "",
                                });
                              }

                              if (event2) {
                                event2.value = "";
                                setInputField({
                                  ...inputField,
                                  event1: "",
                                  event1rank: "",
                                  event2: "",
                                  event2rank: "",
                                });
                              }
                              setInputField({
                                ...inputField,
                                gender: e.target.value,
                              });
                            }}
                            aria-label="Default select example"
                          >
                            <option value="">Select Gender</option>
                            <option value="BOYS">BOYS</option>
                            <option value="GIRLS">GIRLS</option>
                          </select>
                        </div>
                        <div className="mb-3 col-md-3">
                          <label className="form-label">BSP Student ID</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="BSP Student ID"
                            value={inputField.studentId}
                            onChange={(e) => {
                              setInputField({
                                ...inputField,
                                studentId: e.target.value,
                              });
                            }}
                            maxLength={14}
                            required
                          />
                        </div>
                        <div className="mb-3 col-md-3">
                          <label className="form-label">Date Of Birth: *</label>

                          <input
                            type="date"
                            className="form-control"
                            id="birthday"
                            value={inputField.birthday}
                            onChange={(e) => {
                              setInputField({
                                ...inputField,
                                birthday: e.target.value,
                              });
                            }}
                            min={mindob}
                            max={maxdob}
                            required
                          />
                        </div>
                        <div className="mb-3 col-md-3">
                          <label className="form-label">CLASS *</label>

                          <select
                            className="form-select"
                            id="stdClass"
                            defaultValue={""}
                            onChange={(e) => {
                              if (group) {
                                group.value = "";
                              }
                              if (event1) {
                                event1.value = "";
                                setInputField({
                                  ...inputField,
                                  event1: "",
                                  event1rank: "",
                                  event2: "",
                                  event2rank: "",
                                });
                              }
                              if (event2) {
                                event2.value = "";
                                setInputField({
                                  ...inputField,
                                  event1: "",
                                  event1rank: "",
                                  event2: "",
                                  event2rank: "",
                                });
                              }
                              setInputField({
                                ...inputField,
                                sclass: e.target.value,
                              });
                              setInpGrSelected(false);
                              setFirstEventSelected(false);
                            }}
                            aria-label="Default select example"
                            required
                          >
                            <option value="">Select Class</option>
                            {StdClass.map((item, index) => {
                              return (
                                <option key={index} value={item.sclass}>
                                  {item.sclass}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="mb-3 col-md-3">
                          <label className="form-label">Select Group *</label>
                          <select
                            className="form-select"
                            defaultValue={""}
                            id="group"
                            onChange={(e) => {
                              if (event1) {
                                event1.value = "";
                                setInputField({
                                  ...inputField,
                                  event1: "",
                                  event1rank: "",
                                  event2: "",
                                  event2rank: "",
                                });
                              }
                              if (event2) {
                                event2.value = "";
                                setInputField({
                                  ...inputField,
                                  event1: "",
                                  event1rank: "",
                                  event2: "",
                                  event2rank: "",
                                });
                              }
                              setInpGrSelected(true);
                              setFirstEventSelected(false);
                              setInputField({
                                ...inputField,
                                group: e.target.value,
                              });
                            }}
                            aria-label="Default select example"
                          >
                            <option value="">Select Group</option>
                            <option value="GROUP-A">GROUP-A</option>
                            <option value="GROUP-B">GROUP-B</option>
                            <option value="GROUP-C">GROUP-C</option>
                          </select>
                        </div>
                        {inpGrSelected && (
                          <div className="mb-3 col-md-3">
                            <label className="form-label">
                              Select First Event Name *
                            </label>
                            <select
                              className="form-select"
                              id="event1"
                              defaultValue={""}
                              onChange={(e) => {
                                setFirstEventSelected(true);
                                const event1rank =
                                  eventRanks[inputField.gender]?.[
                                    inputField.group
                                  ]?.[e.target.value] || "";
                                setInputField({
                                  ...inputField,
                                  event1: e.target.value,
                                  event1rank: event1rank,
                                  event2: "",
                                  event2rank: "",
                                });
                              }}
                              aria-label="Default select example"
                            >
                              <option value="">Select First Event</option>
                              {inputField.group === "GROUP-A"
                                ? events.groupA.map((el, ind) => (
                                    <option value={el} key={ind}>
                                      {el}
                                    </option>
                                  ))
                                : inputField.group === "GROUP-B"
                                ? events.groupB.map((el, ind) => (
                                    <option value={el} key={ind}>
                                      {el}
                                    </option>
                                  ))
                                : inputField.group === "GROUP-C"
                                ? events.groupC.map((el, ind) => (
                                    <option value={el} key={ind}>
                                      {el}
                                    </option>
                                  ))
                                : ""}
                            </select>
                          </div>
                        )}
                        {firstEventSelected && (
                          <div className="mb-3 col-md-3">
                            <label className="form-label">
                              Select Second Event Name
                            </label>
                            <select
                              className="form-select"
                              defaultValue={""}
                              id="event2"
                              onChange={(e) => {
                                const event2rank =
                                  eventRanks[inputField.gender]?.[
                                    inputField.group
                                  ]?.[e.target.value] || "";
                                setInputField({
                                  ...inputField,
                                  event2: e.target.value,
                                  event2rank: event2rank,
                                });
                              }}
                              aria-label="Default select example"
                            >
                              <option value="">Select Second Event</option>
                              {getFilteredEvents(
                                inputField.group,
                                inputField.event1
                              ).map((el, ind) => (
                                <option value={el} key={ind}>
                                  {el}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {firstEventSelected && (
                          <div>
                            <button
                              type="button"
                              className="btn btn-success m-1 col-md-1 btn-sm"
                              onClick={() => {
                                if (
                                  gpStudentState.some((p) => {
                                    if (editClicked && p.id === inputField.id)
                                      return false;
                                    const hasEvent1 =
                                      p.event1 === inputField.event1 ||
                                      p.event2 === inputField.event1;
                                    const hasEvent2 =
                                      inputField.event2 &&
                                      (p.event1 === inputField.event2 ||
                                        p.event2 === inputField.event2);
                                    return (
                                      p.udise === inputField.udise &&
                                      p.gender === inputField.gender &&
                                      p.group === inputField.group &&
                                      (hasEvent1 || hasEvent2)
                                    );
                                  })
                                ) {
                                  toast.error(
                                    "A participant with the same school, gender, group, and event already exists.",
                                    {
                                      position: "top-right",
                                      autoClose: 2500,
                                    }
                                  );
                                  return;
                                }
                                if (
                                  inputField.name !== "" &&
                                  inputField.name !== undefined &&
                                  inputField.gurdiansName !== "" &&
                                  inputField.gurdiansName !== undefined &&
                                  inputField.birthday !== "" &&
                                  inputField.birthday !== undefined &&
                                  inputField.sclass !== "" &&
                                  inputField.sclass !== undefined &&
                                  inputField.school !== "" &&
                                  inputField.school !== undefined &&
                                  inputField.udise !== "" &&
                                  inputField.udise !== undefined &&
                                  inputField &&
                                  inputField.gp !== undefined &&
                                  inputField.gender !== "" &&
                                  inputField.gender !== undefined &&
                                  inputField.group !== "" &&
                                  inputField.group !== undefined &&
                                  inputField.event1 !== "" &&
                                  inputField.event1 !== undefined &&
                                  inputField.event1rank !== "" &&
                                  inputField.event1 !== undefined
                                ) {
                                  if (editClicked) {
                                    updateData();
                                  } else {
                                    submitData();
                                  }
                                } else {
                                  toast.error(
                                    "Please Select All Required Fields",
                                    {
                                      position: "top-right",
                                      autoClose: 1000,
                                      hideProgressBar: false,
                                      closeOnClick: true,
                                      pauseOnHover: true,
                                      draggable: true,
                                      progress: undefined,
                                      theme: "light",
                                    }
                                  );
                                }
                              }}
                            >
                              Submit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger m-1 col-md-1 btn-sm"
                              onClick={() => {
                                setInputField({
                                  id: docId,
                                  name: "",
                                  gurdiansName: "",
                                  chestNo: "",
                                  birthday: birthday,
                                  studentId: "",
                                  sclass: "",
                                  school: selectedSchool.school,
                                  gp: selectedSchool.gp,
                                  event1: "",
                                  event2: "",
                                  event1rank: "",
                                  event2rank: "",
                                  gender: "",
                                  group: "",
                                  udise: "",
                                });
                                setInpGrSelected(false);
                                setFirstEventSelected(false);
                                setEditClicked(false);
                                document.getElementById("gender").value = "";
                                document.getElementById("group").value = "";
                                document.getElementById("event1").value = "";
                                document.getElementById("event2").value = "";
                                document.getElementById("birthday").value =
                                  birthday;
                              }}
                            >
                              Reset
                            </button>
                          </div>
                        )}
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
