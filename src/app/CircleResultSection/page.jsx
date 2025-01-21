"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import { firestore } from "../../context/FirbaseContext";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import Loader from "../../components/Loader";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  createDownloadLink,
  enToBnNumber,
} from "../../modules/calculatefunctions";
import { circleBenName, gpNames } from "../../modules/constants";
import { events } from "../../modules/constants";
import { v4 as uuid } from "uuid";
import { useGlobalContext } from "../../context/Store";
import axios from "axios";
const CircleResultSection = () => {
  const {
    myStateObject,
    setYourStateObject,
    AmtaWestCircleAllResultState,
    setAmtaWestCircleAllResultState,
    AmtaWestCircleAllResultUpdateTime,
    setAmtaWestCircleAllResultUpdateTime,
    setStateObject,
  } = useGlobalContext();
  const data = myStateObject?.data?.sort((a, b) =>
    a?.school.localeCompare(b?.school)
  );
  const gpData = myStateObject?.gp?.sort((a, b) =>
    a?.school.localeCompare(b?.school)
  );

  const navigate = useRouter();
  const docId = uuid();
  const [allData, setAllData] = useState(data);
  const [gpSchools, setGpSchools] = useState(gpData);
  const [allFirstResult, setAllFirstResult] = useState([]);
  const [thisGp, setThisGp] = useState("");
  const [loader, setLoader] = useState(false);
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
  const [search, setSearch] = useState("");

  const [genderres, setGenderres] = useState("");
  const [groupres, setGroupres] = useState("");
  const [groupresSelected, setGroupresSelected] = useState(false);

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
    await axios.post("/api/addAmtaWestCircleAllResult", entry);
    setAmtaWestCircleAllResultState([...AmtaWestCircleAllResultState, entry]);
    setAmtaWestCircleAllResultUpdateTime(Date.now());
    await setDoc(
      doc(firestore, `AmtaWestCircleAllResult`, student.id),
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
          event1rank: e1Rank,
          event2rank: e2Rank,
          gender: student.gender,
          group: student.group,
          udise: student.udise,
        };
        await axios.post("/api/addAmtaWestCircleFirstResult", entry2);
        await setDoc(
          doc(firestore, "AmtaWestCircleFirstResult", student.id),
          entry2
        ).then(async () => {
          setLoader(false);
          setTimeout(() => {
            navigate.back();
          }, 2000);
          toast.success(
            `Student Sucessfully Registerd in the Circle Sports First & All Result Database`
          );
        });
      } else {
        setLoader(false);
        setTimeout(() => {
          navigate.back();
        }, 2000);
        toast.success(
          `Student Sucessfully Registed in the Circle All Result Database`
        );
      }
    });
  };
  const getAllResult = async () => {
    setLoader(true);
    try {
      const querySnapshot = await getDocs(
        query(collection(firestore, "AmtaWestCircleAllResult"))
      );
      const data = querySnapshot.docs
        .map((doc) => doc.data())
        .sort((a, b) => a?.event1rank - b?.event1rank);
      setLoader(false);
      setAmtaWestCircleAllResultState(data);
      setAmtaWestCircleAllResultUpdateTime(Date.now());
      setAllResult(data);
      setFilteredData(data);
    } catch (error) {
      await axios
        .post("/api/getAmtaWestCircleAllResult")
        .then((response) => {
          const data = response.data?.data?.sort(
            (a, b) => a?.event1rank - b?.event1rank
          );
          setLoader(false);
          setAmtaWestCircleAllResultState(data);
          setAmtaWestCircleAllResultUpdateTime(Date.now());
          setAllResult(data);
          setFilteredData(data);
        })
        .catch((error) => {
          setLoader(false);
          console.error("Error fetching Result data: ", error);
        });
      console.log(error);
    }
  };
  const getAllCircleFirstResult = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(firestore, "AmtaWestCircleFirstResult"))
      );
      const data = querySnapshot.docs
        .map((doc) => doc.data())
        .sort((a, b) => a?.event1rank - b?.event1rank);
      setAllFirstResult(data);
    } catch (error) {
      await axios
        .post("/api/getAmtaWestCircleFirstResult")
        .then((response) => {
          const data = response.data.data.sort(
            (a, b) => a?.event1rank - b?.event1rank
          );
          setAllFirstResult(data);
        })
        .catch((error) => {
          console.error("Error fetching lock data: ", error);
        });
      console.error("Error fetching lock data: ", error);
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

  const columns = [
    {
      name: "Sl",
      selector: (row, index) =>
        allResult.findIndex((i) => i.id === row?.id) + 1,
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
      center: +true,
      wrap: true,
    },

    {
      name: "Class",
      selector: (row) => row.sclass,
      sortable: +true,
      center: +true,
      wrap: true,
    },
    {
      name: "School Name",
      selector: (row) => row.school,
      sortable: +true,
      center: +true,
      wrap: true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: +true,
      center: +true,
      wrap: true,
    },

    {
      name: "Group",
      selector: (row) => row.group,
      sortable: +true,
      center: +true,
      wrap: true,
    },
    {
      name: "Event 1",
      selector: (row) => row.event1 + ", " + row.position1,
      sortable: +true,
      center: +true,
      wrap: true,
    },
    {
      name: "Event 2",
      selector: (row) =>
        row.event2 !== "" ? row.event2 + ", " + row.position2 : "",
      sortable: +true,
      center: +true,
      wrap: true,
    },
  ];

  useEffect(() => {
    if (!details) {
      if (
        teacherdetails.circle !== "admin" ||
        teacherdetails.convenor !== "admin"
      ) {
        navigate.push("/logout");
      }
    }
    getAllCircleFirstResult();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const difference =
      (Date.now() - AmtaWestCircleAllResultUpdateTime) / 1000 / 60 / 5;
    if (difference >= 1 || AmtaWestCircleAllResultState.length === 0) {
      getAllResult();
    } else {
      const rdata = AmtaWestCircleAllResultState.sort(
        (a, b) => a?.event1rank - b?.event1rank
      );
      setAllResult(rdata);
      setFilteredData(rdata);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setThisGp(
      gpNames.filter((el) => el.englishName === gpData[0].gp)[0].bengaliName
    );
    // eslint-disable-next-line
  }, [allData, gpSchools, thisGp]);
  useEffect(() => {
    const result = allResult.filter((el) => {
      return el.name.toLowerCase().match(search.toLowerCase());
    });
    setFilteredData(result);
    // eslint-disable-next-line
  }, [search]);
  useEffect(() => {
    // eslint-disable-next-line
  }, [selectedParticipant]);
  return (
    <div className="container-fluid  my-4 bg-white">
      <div className="my-4">
        <h3 className="text-center ben text-primary">
          {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগীতা,{" "}
          {enToBnNumber(new Date().getFullYear() - 1)} রেজাল্ট
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
      {allFirstResult.length > 0 && (
        <div className="my-2">
          <button
            type="button"
            className="btn btn-success m-2"
            onClick={() => {
              createDownloadLink(allFirstResult, "AmtaWestCircleFirstResult");
            }}
          >
            Download All Circle First&#8217;s Result Data
          </button>
          <button
            type="button"
            className="btn btn-success m-1 "
            onClick={() => {
              setStateObject(allFirstResult);
              navigate.push(`/CircleAllFirstResultPrint`);
            }}
          >
            {`Go to Print All First Result`}
          </button>
        </div>
      )}
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
                    gender: genderres,
                    group: groupres,
                  });
                  navigate.push(`/CircleGroupWiseResultPrint`);
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
                    gender: genderres,
                    group: groupres,
                  });
                  navigate.push(`/CircleGroupWiseResultPrintBlank`);
                }}
              >
                {`Go to Blank ${genderres} ${groupres} => Result`}
              </button>
            </div>
          )}
        </div>
      </div>
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
                    {el.name}
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
            <label className="form-label">Select First Event Position *</label>
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
      </div>
      {event2Selected && (
        <div className="mb-3 col-md-3">
          <label className="form-label">Select Second Event Position *</label>
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
              if (event1Name) {
                event1Name.value = "";
              }
              if (gender) {
                gender.value = "";
              }
            }}
          >
            Reset
          </button>
        </>
      )}
      {loader && <Loader />}
    </div>
  );
};

export default CircleResultSection;
