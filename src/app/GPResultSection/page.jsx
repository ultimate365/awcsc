"use client";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import DataTable from "react-data-table-component";
import { firestore } from "../../context/FirbaseContext";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Loader from "../../components/Loader";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  createDownloadLink,
  DateValueToString,
  enToBnNumber,
} from "../../modules/calculatefunctions";
import { gpNames } from "../../modules/constants";
import { events } from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import axios from "axios";
const GPResultSection = () => {
  const {
    stateObject,
    setYourStateObject,
    circleLockState,
    GPResultState,
    setGPResultState,
    allGPFirstsState,
    setAllGPFirstsState,
  } = useGlobalContext();
  const data = stateObject?.data?.sort((a, b) =>
    a?.school.localeCompare(b?.school)
  );
  const schoolData = stateObject?.school?.sort((a, b) =>
    a?.school.localeCompare(b?.school)
  );
  const navigate = useRouter();
  const [allData, setAllData] = useState(data);
  const [gpSchools, setGpSchools] = useState(schoolData);

  const [thisGp, setThisGp] = useState("");
  const [loader, setLoader] = useState(false);
  const [thisGPCircleLockState, setThisGPCircleLockState] = useState(true);
  const [thisGPCircleLockData, setThisGPCircleLockData] = useState(true);
  let teacherdetails;
  let details = getCookie("tid");
  let schdetails = getCookie("schid");
  let gender;
  let group;
  let event1Name;
  let event2Name;
  let participant;
  let positionInp;
  let positionInp2;
  useEffect(() => {
    gender = document.getElementById("gender");
    group = document.getElementById("group");
    event1Name = document.getElementById("event1Name");
    event2Name = document.getElementById("event2Name");
    participant = document.getElementById("participant");
    positionInp = document.getElementById("position");
    positionInp2 = document.getElementById("position2");
    //eslint-disable-next-line
  }, []);
  const [genderSelected, setGenderSelected] = useState(false);
  const [inpGrSelected, setInpGrSelected] = useState(false);
  const [event1Selected, setEvent1Selected] = useState(false);
  const [event2Selected, setEvent2Selected] = useState(false);

  const [engGenderName, setEngGenderName] = useState("");
  const [engGroupName, setEngGroupName] = useState("");
  const [engEvent1Name, setEngEvent1Name] = useState("");
  const [engEvent2Name, setEngEvent2Name] = useState("");
  const [e1Rank, setE1Rank] = useState(0);
  const [e2Rank, setE2Rank] = useState(0);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [participantSelected, setParticipantSelected] = useState(false);
  const [position, setPosition] = useState("");
  const [position2, setPosition2] = useState("");
  const [positionSelected, setPositionSelected] = useState(false);
  const [position2Selected, setPosition2Selected] = useState(false);
  const [allResult, setAllResult] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [genderres, setGenderres] = useState("");
  const [groupres, setGroupres] = useState("");
  const [groupresSelected, setGroupresSelected] = useState(false);

  const [search, setSearch] = useState("");

  if (details) {
    teacherdetails = decryptObjData("tid");
  }
  if (schdetails) {
    schdetails = decryptObjData("schid");
  }

  const uploadResult = async () => {
    let student = JSON.parse(selectedParticipant);
    setLoader(true);
    const entry = {
      id: student.id,
      position1: position,
      position2: position2,
      name: student.name,
      gurdiansName: student.gurdiansName,
      chestNo: student.chestNo,
      birthday: student.birthday,
      studentId: student.studentId,
      sclass: student.sclass,
      school: student.school,
      gp: student.gp,
      event1: engEvent1Name,
      event2: engEvent2Name,
      event1rank: e1Rank,
      event2rank: e2Rank,
      gender: student.gender,
      group: student.group,
      udise: student.udise,
    };
    const newData = [...GPResultState, entry];
    setAllResult(newData);
    setFilteredData(newData);
    setGPResultState(newData);

    await axios.post(
      `/api/add${teacherdetails.gp.toLowerCase()}gpresult`,
      entry
    );
    await setDoc(
      doc(firestore, `${teacherdetails.gp.toLowerCase()}gpresult`, student.id),
      entry
    ).then(async () => {
      if (position === "FIRST" || position2 === "FIRST") {
        const entry2 = {
          id: student.id,
          position: position === "FIRST" ? position : position2,
          name: student.name,
          gurdiansName: student.gurdiansName,
          chestNo: "",
          gpchestNo: student.chestNo,
          birthday: student.birthday,
          studentId: student.studentId,
          sclass: student.sclass,
          school: student.school,
          gp: student.gp,
          event1: position === "FIRST" ? engEvent1Name : "",
          event2: position2 === "FIRST" ? engEvent2Name : "",
          event1rank: position === "FIRST" ? e1Rank : "",
          event2rank: position2 === "FIRST" ? e2Rank : "",
          gender: student.gender,
          group: student.group,
          udise: student.udise,
        };
        setAllGPFirstsState([...allGPFirstsState, entry2]);
        // await axios.post("/api/addallGPFirsts", entry2);
        await setDoc(doc(firestore, "allGPFirsts", student.id), entry2).then(
          async () => {
            setLoader(false);
            setTimeout(() => {
              navigate.back();
            }, 500);
            toast.success(
              `Student Sucessfully Registerd in the Circle Sports Name & ${teacherdetails.gp.toLowerCase()} GP Result Database`
            );
          }
        );
      } else {
        setLoader(false);
        setTimeout(() => {
          navigate.back();
        }, 500);
        toast.success(
          `Student Sucessfully Registed in the ${teacherdetails.gp.toLowerCase()} GP Result Database`
        );
      }
    });
    setEngGenderName("");
    setEngGroupName("");
    setEngEvent1Name("");
    setGenderSelected(false);
    setInpGrSelected(false);
    setParticipantSelected(false);
    setEvent1Selected(false);
    setPositionSelected(false);
    setEvent2Selected(false);
    setPosition2Selected(false);
    if (gender) {
      gender.value = "";
    }
    if (event1Name) {
      event1Name.value = "";
    }
  };
  const getAllResult = async () => {
    setLoader(true);
    try {
      const q = query(
        collection(firestore, `${teacherdetails.gp.toLowerCase()}gpresult`)
      );
      await getDocs(q).then((querySnapshot) => {
        const data = querySnapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => a.event1rank - b.event1rank);
        setLoader(false);
        setAllResult(data);
        setFilteredData(data);
        setGPResultState(data);
      });
    } catch (error) {
      await axios
        .post(`/api/find${teacherdetails.gp.toLowerCase()}gpresult`)
        .then((data) => {
          const res = data.data?.data?.sort(
            (a, b) => a?.event1rank - b?.event1rank
          );
          setAllResult(res);
          setFilteredData(res);
          setGPResultState(res);
          setLoader(false);
        })
        .catch((e) => {
          console.log(e);
          setLoader(false);
        });
      console.log(error);
    }
  };

  const handleParticipantChange = (e) => {
    const value = e.target.value;
    setSelectedParticipant(value);
    if (event1Name) {
      event1Name.value = "";
    }
    if (event2Name) {
      event2Name.value = "";
    }
    if (participant) {
      participant.value = "";
    }
    if (positionInp) {
      positionInp.value = "";
    }
    if (positionInp2) {
      positionInp2.value = "";
    }
    setParticipantSelected(true);
    setPositionSelected(false);
    console.log(value);
  };

  const delFromGPResult = async (id) => {
    setLoader(true);
    try {
      await axios.post(`/api/del${teacherdetails.gp.toLowerCase()}gpresult`, {
        id,
      });
      await axios.post(`/api/delallGPFirsts`, {
        id,
      });
      await deleteDoc(
        doc(firestore, `${teacherdetails.gp.toLowerCase()}gpresult`, id)
      );
      await deleteDoc(doc(firestore, `addallGPFirsts`, id));
      setLoader(false);
      toast.success(
        `Student Sucessfully Deleted from the ${teacherdetails.gp.toLowerCase()} GP Result Database`
      );
      const newData = GPResultState.filter((student) => student.id !== id);
      setAllResult(newData);
      setFilteredData(newData);
      setGPResultState(newData);
    } catch (error) {
      console.error("Error deleting gpresult data: ", error);
      setLoader(false);
      toast.error(
        "Failed to delete student from the GP Result Database, Please try again later."
      );
    }
  };

  const columns = [
    {
      name: "Sl",
      selector: (row, index) =>
        allResult.findIndex((i) => i.id === row?.id) + 1,
      sortable: +true,
      width: "6%",
    },
    {
      name: "Chest No.",
      selector: (row, index) => row?.chestNo,
      sortable: +true,
      width: "6%",
    },

    {
      name: "Participants Name",
      selector: (row) => row?.name,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "15%",
    },

    {
      name: "Class",
      selector: (row) => row?.sclass,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "5%",
    },
    {
      name: "School Name",
      selector: (row) => row?.school,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "15%",
    },
    {
      name: "Gender",
      selector: (row) => row?.gender,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "6%",
    },

    {
      name: "Group",
      selector: (row) => row?.group,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "6%",
    },
    {
      name: "Event 1",
      selector: (row) =>
        row?.event1 +
        ", " +
        (row?.position1 ? row?.position1 : "RANK NOT SUBMITTED"),
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Event 2",
      selector: (row) =>
        row?.event2 !== ""
          ? row?.event2 +
            ", " +
            (row?.position2 ? row?.position2 : "RANK NOT SUBMITTED")
          : "",
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Action",
      selector: (row) => (
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            if (
              window.confirm(`Are you sure you want to Delete ${row?.name}?`)
            ) {
              delFromGPResult(row?.id);
            }
          }}
        >
          Delete
        </button>
      ),
    },
  ];

  useEffect(() => {
    if (teacherdetails.circle !== "admin") {
      if (teacherdetails.convenor !== "admin") {
        if (teacherdetails.gpAssistant !== "admin") {
          navigate.push("/Login");
        }
      }
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (GPResultState.length === 0) {
      getAllResult();
    } else {
      setAllResult(GPResultState);
      setFilteredData(GPResultState);
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    setThisGPCircleLockState(
      circleLockState.filter((el) => el.gp === schoolData[0]?.gp)[0].edit
    );
    setThisGPCircleLockData(
      circleLockState.filter((el) => el.gp === schoolData[0]?.gp)[0]
    );
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setThisGp(
      gpNames?.filter((el) => el.englishName === schoolData[0]?.gp)[0]
        ?.bengaliName
    );
    // eslint-disable-next-line
  }, [allData, gpSchools, thisGp]);

  useEffect(() => {
    // eslint-disable-next-line
  }, [selectedParticipant, genderres, groupres, filteredData, allData]);
  return (
    <div className="container-fluid  my-4 bg-white">
      {GPResultState.length > 0 && (
        <button
          type="button"
          className="btn btn-primary m-2"
          onClick={() => {
            createDownloadLink(
              GPResultState,
              `${teacherdetails.gp.toLowerCase()}gpresult`
            );
          }}
        >
          Download {teacherdetails.gp} GP Result Data
        </button>
      )}
      <div className="my-4">
        <h3 className="text-center ben text-primary">
          {thisGp} গ্রাম পঞ্চায়েত বার্ষিক ক্রীড়া প্রতিযোগিতা,{" "}
          {enToBnNumber(new Date().getFullYear())} রেজাল্ট
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
                const result = allResult?.filter((el) => {
                  return el?.name
                    ?.toLowerCase()
                    .match(e.target.value.toLowerCase());
                });
                setFilteredData(result);
              }}
            />
          }
          subHeaderAlign="right"
        />
        <div className="my-4">
          <h3 className="text-center text-primary">Select to Print Result</h3>
          <div className="row justify-content-center align-items-center">
            <div className="mb-3 col-md-3">
              <label className="form-label">Select Gender *</label>
              <select
                className="form-select"
                id="genderres"
                defaultValue={""}
                onChange={(e) => setGenderres(e.target.value)}
                aria-label="Default select example"
              >
                <option value="">Select Gender</option>
                <option value="BOYS">BOYS</option>
                <option value="GIRLS">GIRLS</option>
              </select>
            </div>
            <div className="mb-3 col-md-3">
              <label className="form-label">Select Group *</label>
              <select
                className="form-select"
                defaultValue={""}
                id="groupres"
                onChange={(e) => {
                  setGroupres(e.target.value);
                  setGroupresSelected(true);
                }}
                aria-label="Default select example"
              >
                <option value="">Select Group</option>
                <option value="GROUP-A">GROUP-A</option>
                <option value="GROUP-B">GROUP-B</option>
                <option value="GROUP-C">GROUP-C</option>
              </select>
            </div>
            {groupresSelected && (
              <div className="mb-3 col-md-3">
                <button
                  type="button"
                  className="btn btn-success m-1 "
                  onClick={() => {
                    setYourStateObject({
                      data: allResult
                        .filter((el) => el.gender === genderres)
                        .filter((el) => el.group === groupres),
                      gp: thisGp,
                      gender: genderres,
                      group: groupres,
                    });
                    navigate.push(`/GPGroupWiseResultPrint`);
                  }}
                >
                  {`Go to ${genderres} ${groupres} => Result`}
                </button>
              </div>
            )}
            {groupresSelected && (
              <div className="mb-3 col-md-3">
                <button
                  type="button"
                  className="btn btn-success m-1 "
                  onClick={() => {
                    setYourStateObject({
                      data: allResult
                        .filter((el) => el.gender === genderres)
                        .filter((el) => el.group === groupres),
                      gp: thisGp,
                      gender: genderres,
                      group: groupres,
                    });
                    navigate.push(`/GPGroupWiseResultPrintBlank`);
                  }}
                >
                  {`Go to Blank ${genderres} ${groupres} => Result`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {!thisGPCircleLockState ? (
        <div>
          <div className="my-4 row">
            <h3 className="text-center text-primary">Submit Result</h3>
            <div className="mb-3 col-md-3">
              <label className="form-label">Select Gender *</label>
              <select
                className="form-select"
                id="gender"
                defaultValue={""}
                onChange={(e) => {
                  if (group) {
                    group.value = "";
                  }
                  if (event1Name) {
                    event1Name.value = "";
                  }
                  if (event2Name) {
                    event2Name.value = "";
                  }
                  if (participant) {
                    participant.value = "";
                  }
                  if (positionInp) {
                    positionInp.value = "";
                  }
                  if (positionInp2) {
                    positionInp2.value = "";
                  }
                  setGenderSelected(true);
                  setInpGrSelected(false);
                  setEvent1Selected(false);
                  setParticipantSelected(false);
                  setPositionSelected(false);
                  setEngGenderName(e.target.value);
                  if (engGroupName !== "" || engEvent1Name !== "") {
                    setEngGroupName("");
                    setEngEvent1Name("");
                  }
                }}
                aria-label="Default select example"
              >
                <option value="">Select Gender</option>
                <option value="BOYS">BOYS</option>
                <option value="GIRLS">GIRLS</option>
              </select>
            </div>
            {genderSelected && (
              <div className="mb-3 col-md-3">
                <label className="form-label">Select Group *</label>
                <select
                  className="form-select"
                  defaultValue={""}
                  id="group"
                  onChange={(e) => {
                    if (event1Name) {
                      event1Name.value = "";
                    }
                    if (event2Name) {
                      event2Name.value = "";
                    }
                    if (participant) {
                      participant.value = "";
                    }
                    if (positionInp) {
                      positionInp.value = "";
                    }
                    if (positionInp2) {
                      positionInp2.value = "";
                    }
                    setInpGrSelected(true);
                    setEngGroupName(e.target.value);
                    setEvent1Selected(false);
                    setParticipantSelected(false);
                    setPositionSelected(false);
                  }}
                  aria-label="Default select example"
                >
                  <option value="">Select Group</option>
                  <option value="GROUP-A">GROUP-A</option>
                  <option value="GROUP-B">GROUP-B</option>
                  <option value="GROUP-C">GROUP-C</option>
                </select>
              </div>
            )}
            {inpGrSelected && (
              <div className="mb-3 col-md-3">
                <label className="form-label">Select Participant *</label>
                <select
                  className="form-select"
                  value={selectedParticipant}
                  id="participant"
                  onChange={handleParticipantChange}
                  aria-label="Default select example"
                >
                  <option value="">Select Participant</option>
                  {allData
                    .filter((el) => el.gender === engGenderName)
                    .filter((el) => el.group === engGroupName)

                    .map((el, ind) => (
                      <option value={JSON.stringify(el)} key={ind}>
                        {el.name} ({el.chestNo})
                      </option>
                    ))}
                </select>
              </div>
            )}
            {participantSelected && (
              <div className="mb-3 col-md-3">
                <label className="form-label">Select First Event Name *</label>
                <select
                  className="form-select"
                  defaultValue={""}
                  id="event1Name"
                  onChange={(e) => {
                    let event1rank = 1;
                    if (engGenderName === "BOYS") {
                      if (engGroupName === "GROUP-A") {
                        if (e.target.value === "75 METER RUN") {
                          event1rank = 1;
                        } else if (e.target.value === "LONG JUMP") {
                          event1rank = 2;
                        } else if (e.target.value === "SHUTTLE RACE") {
                          event1rank = 3;
                        } else if (e.target.value === "YOGA") {
                          event1rank = 4;
                        }
                      } else if (engGroupName === "GROUP-B") {
                        if (e.target.value === "100 METER RUN") {
                          event1rank = 5;
                        } else if (e.target.value === "200 METER RUN") {
                          event1rank = 6;
                        } else if (e.target.value === "LONG JUMP") {
                          event1rank = 7;
                        } else if (e.target.value === "HIGH JUMP") {
                          event1rank = 8;
                        } else if (e.target.value === "YOGA") {
                          event1rank = 9;
                        } else if (e.target.value === "GYMNASTICS") {
                          event1rank = 10;
                        }
                      } else if (engGroupName === "GROUP-C") {
                        if (e.target.value === "100 METER RUN") {
                          event1rank = 11;
                        } else if (e.target.value === "200 METER RUN") {
                          event1rank = 12;
                        } else if (e.target.value === "LONG JUMP") {
                          event1rank = 13;
                        } else if (e.target.value === "HIGH JUMP") {
                          event1rank = 14;
                        } else if (e.target.value === "YOGA") {
                          event1rank = 15;
                        } else if (e.target.value === "GYMNASTICS") {
                          event1rank = 16;
                        } else if (e.target.value === "FOOTBALL THROWING") {
                          event1rank = 17;
                        }
                      }
                    } else {
                      if (engGroupName === "GROUP-A") {
                        if (e.target.value === "75 METER RUN") {
                          event1rank = 18;
                        } else if (e.target.value === "LONG JUMP") {
                          event1rank = 19;
                        } else if (e.target.value === "SHUTTLE RACE") {
                          event1rank = 20;
                        } else if (e.target.value === "YOGA") {
                          event1rank = 21;
                        }
                      } else if (engGroupName === "GROUP-B") {
                        if (e.target.value === "100 METER RUN") {
                          event1rank = 22;
                        } else if (e.target.value === "200 METER RUN") {
                          event1rank = 23;
                        } else if (e.target.value === "LONG JUMP") {
                          event1rank = 24;
                        } else if (e.target.value === "HIGH JUMP") {
                          event1rank = 25;
                        } else if (e.target.value === "YOGA") {
                          event1rank = 26;
                        } else if (e.target.value === "GYMNASTICS") {
                          event1rank = 27;
                        }
                      } else if (engGroupName === "GROUP-C") {
                        if (e.target.value === "100 METER RUN") {
                          event1rank = 28;
                        } else if (e.target.value === "200 METER RUN") {
                          event1rank = 29;
                        } else if (e.target.value === "LONG JUMP") {
                          event1rank = 30;
                        } else if (e.target.value === "HIGH JUMP") {
                          event1rank = 31;
                        } else if (e.target.value === "YOGA") {
                          event1rank = 32;
                        } else if (e.target.value === "GYMNASTICS") {
                          event1rank = 33;
                        } else if (e.target.value === "FOOTBALL THROWING") {
                          event1rank = 34;
                        }
                      }
                    }

                    if (event2Name) {
                      event2Name.value = "";
                    }

                    if (positionInp) {
                      positionInp.value = "";
                    }
                    if (positionInp2) {
                      positionInp2.value = "";
                    }
                    setEvent1Selected(true);
                    setEngEvent1Name(e.target.value);
                    setE1Rank(event1rank);
                    setPositionSelected(false);
                  }}
                  aria-label="Default select example"
                >
                  <option value="">Select First Event</option>
                  {engGroupName === "GROUP-A"
                    ? events.groupA
                        .filter(
                          (el) =>
                            el === JSON.parse(selectedParticipant).event1 ||
                            el === JSON.parse(selectedParticipant).event2
                        )
                        .map((el, ind) => (
                          <option value={el} key={ind}>
                            {el}
                          </option>
                        ))
                    : engGroupName === "GROUP-B"
                    ? events.groupB
                        .filter(
                          (el) =>
                            el === JSON.parse(selectedParticipant).event1 ||
                            el === JSON.parse(selectedParticipant).event2
                        )
                        .map((el, ind) => (
                          <option value={el} key={ind}>
                            {el}
                          </option>
                        ))
                    : engGroupName === "GROUP-C"
                    ? events.groupC
                        .filter(
                          (el) =>
                            el === JSON.parse(selectedParticipant).event1 ||
                            el === JSON.parse(selectedParticipant).event2
                        )
                        .map((el, ind) => (
                          <option value={el} key={ind}>
                            {el}
                          </option>
                        ))
                    : ""}
                </select>
              </div>
            )}
            {event1Selected && (
              <div className="mb-3 col-md-3">
                <label className="form-label">
                  Select First Event Position *
                </label>
                <select
                  className="form-select"
                  defaultValue={""}
                  id="position"
                  onChange={(e) => {
                    setPosition(e.target.value);
                    setPositionSelected(true);
                  }}
                  aria-label="Default select example"
                >
                  <option value="">Select Position</option>
                  <option value="FIRST">FIRST</option>
                  <option value="SECOND">SECOND</option>
                  <option value="THIRD">THIRD</option>
                </select>
              </div>
            )}
            {positionSelected && (
              <div className="mb-3 col-md-3">
                <label className="form-label">Select Second Event Name *</label>
                <select
                  className="form-select"
                  defaultValue={""}
                  id="event2Name"
                  onChange={(e) => {
                    let event2rank = 1;
                    if (engGenderName === "BOYS") {
                      if (engGroupName === "GROUP-A") {
                        if (e.target.value === "75 METER RUN") {
                          event2rank = 1;
                        } else if (e.target.value === "LONG JUMP") {
                          event2rank = 2;
                        } else if (e.target.value === "SHUTTLE RACE") {
                          event2rank = 3;
                        } else if (e.target.value === "YOGA") {
                          event2rank = 4;
                        }
                      } else if (engGroupName === "GROUP-B") {
                        if (e.target.value === "100 METER RUN") {
                          event2rank = 5;
                        } else if (e.target.value === "200 METER RUN") {
                          event2rank = 6;
                        } else if (e.target.value === "LONG JUMP") {
                          event2rank = 7;
                        } else if (e.target.value === "HIGH JUMP") {
                          event2rank = 8;
                        } else if (e.target.value === "YOGA") {
                          event2rank = 9;
                        } else if (e.target.value === "GYMNASTICS") {
                          event2rank = 10;
                        }
                      } else if (engGroupName === "GROUP-C") {
                        if (e.target.value === "100 METER RUN") {
                          event2rank = 11;
                        } else if (e.target.value === "200 METER RUN") {
                          event2rank = 12;
                        } else if (e.target.value === "LONG JUMP") {
                          event2rank = 13;
                        } else if (e.target.value === "HIGH JUMP") {
                          event2rank = 14;
                        } else if (e.target.value === "YOGA") {
                          event2rank = 15;
                        } else if (e.target.value === "GYMNASTICS") {
                          event2rank = 16;
                        } else if (e.target.value === "FOOTBALL THROWING") {
                          event2rank = 17;
                        }
                      }
                    } else {
                      if (engGroupName === "GROUP-A") {
                        if (e.target.value === "75 METER RUN") {
                          event2rank = 18;
                        } else if (e.target.value === "LONG JUMP") {
                          event2rank = 19;
                        } else if (e.target.value === "SHUTTLE RACE") {
                          event2rank = 20;
                        } else if (e.target.value === "YOGA") {
                          event2rank = 21;
                        }
                      } else if (engGroupName === "GROUP-B") {
                        if (e.target.value === "100 METER RUN") {
                          event2rank = 22;
                        } else if (e.target.value === "200 METER RUN") {
                          event2rank = 23;
                        } else if (e.target.value === "LONG JUMP") {
                          event2rank = 24;
                        } else if (e.target.value === "HIGH JUMP") {
                          event2rank = 25;
                        } else if (e.target.value === "YOGA") {
                          event2rank = 26;
                        } else if (e.target.value === "GYMNASTICS") {
                          event2rank = 27;
                        }
                      } else if (engGroupName === "GROUP-C") {
                        if (e.target.value === "100 METER RUN") {
                          event2rank = 28;
                        } else if (e.target.value === "200 METER RUN") {
                          event2rank = 29;
                        } else if (e.target.value === "LONG JUMP") {
                          event2rank = 30;
                        } else if (e.target.value === "HIGH JUMP") {
                          event2rank = 31;
                        } else if (e.target.value === "YOGA") {
                          event2rank = 32;
                        } else if (e.target.value === "GYMNASTICS") {
                          event2rank = 33;
                        } else if (e.target.value === "FOOTBALL THROWING") {
                          event2rank = 34;
                        }
                      }
                    }

                    if (positionInp2) {
                      positionInp2.value = "";
                    }
                    setEvent2Selected(true);
                    setEngEvent2Name(e.target.value);
                    setE2Rank(event2rank);
                  }}
                  aria-label="Default select example"
                >
                  <option value="">Select Second Event</option>
                  {engGroupName === "GROUP-A"
                    ? events.groupA
                        .filter(
                          (el) =>
                            el === JSON.parse(selectedParticipant).event1 ||
                            el === JSON.parse(selectedParticipant).event2
                        )
                        .filter((el) => el !== engEvent1Name)
                        .map((el, ind) => (
                          <option value={el} key={ind}>
                            {el}
                          </option>
                        ))
                    : engGroupName === "GROUP-B"
                    ? events.groupB
                        .filter(
                          (el) =>
                            el === JSON.parse(selectedParticipant).event1 ||
                            el === JSON.parse(selectedParticipant).event2
                        )
                        .filter((el) => el !== engEvent1Name)
                        .map((el, ind) => (
                          <option value={el} key={ind}>
                            {el}
                          </option>
                        ))
                    : engGroupName === "GROUP-C"
                    ? events.groupC
                        .filter(
                          (el) =>
                            el === JSON.parse(selectedParticipant).event1 ||
                            el === JSON.parse(selectedParticipant).event2
                        )
                        .filter((el) => el !== engEvent1Name)
                        .map((el, ind) => (
                          <option value={el} key={ind}>
                            {el}
                          </option>
                        ))
                    : ""}
                </select>
              </div>
            )}
            {event2Selected && (
              <div className="mb-3 col-md-3">
                <label className="form-label">
                  Select Second Event Position *
                </label>
                <select
                  className="form-select"
                  defaultValue={""}
                  id="position2"
                  onChange={(e) => {
                    setPosition2(e.target.value);
                  }}
                  aria-label="Default select example"
                >
                  <option value="">Select Position</option>
                  <option value="FIRST">FIRST</option>
                  <option value="SECOND">SECOND</option>
                  <option value="THIRD">THIRD</option>
                </select>
              </div>
            )}
          </div>

          {positionSelected && (
            <>
              <button
                type="button"
                className="btn btn-primary m-1 btn-sm"
                onClick={async () => {
                  if (
                    engGenderName !== "" &&
                    engGroupName !== "" &&
                    engEvent1Name !== "" &&
                    position !== ""
                  ) {
                    uploadResult();
                  } else {
                    toast.error("Please Select All Compulsary Details", {
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
                Submit Result
              </button>
              <button
                type="button"
                className="btn btn-danger m-1 btn-sm"
                onClick={async () => {
                  setEngGenderName("");
                  setEngGroupName("");
                  setEngEvent1Name("");
                  setGenderSelected(false);
                  setInpGrSelected(false);
                  setParticipantSelected(false);
                  setEvent1Selected(false);
                  setPositionSelected(false);
                  setEvent2Selected(false);
                  setPosition2Selected(false);
                  if (gender) {
                    gender.value = "";
                  }
                  if (event1Name) {
                    event1Name.value = "";
                  }
                }}
              >
                Reset
              </button>
            </>
          )}
        </div>
      ) : (
        <h6 className="text-center text-danger my-4">
          {thisGPCircleLockData?.gp} GP Circle Sports Student Entry is Still
          Open
        </h6>
      )}
      {loader && <Loader />}
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default GPResultSection;
