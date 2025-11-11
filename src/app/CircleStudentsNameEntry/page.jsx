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
  events,
  gpNames,
  maxdob,
  mindob,
  StdClass,
} from "../../modules/constants";
import {
  createDownloadLink,
  deleteCollection,
  removeDuplicates,
} from "../../modules/calculatefunctions";
import { useGlobalContext } from "../../context/Store";
import axios from "axios";
const CircleStudentsNameEntry = () => {
  const {
    setStateObject,
    setStateArray,
    gpLockState,
    setGpLockState,
    setConvenorsState,
    setGpStudentState,
    setCircleStudentState,
    teachersState,
    setTeachersState,
    schoolState,
    allGPFirstsState,
    setAllGPFirstsState,
    circleAssistantState,
    setCircleAssistantState,
    circleLockState,
    setCircleLockState,
  } = useGlobalContext();
  const navigate = useRouter();
  const [showTable, setShowTable] = useState(false);
  let teacherdetails = {
    convenor: "",
    gp: "",
    school: "",
    circle: "",
    tname: "",
  };
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
    // eslint-disable-next-line
  }, []);
  const [inputField, setInputField] = useState({
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
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [inpGrSelected, setInpGrSelected] = useState(false);
  const [firstEventSelected, setFirstEventSelected] = useState(false);
  const [convenorsGPSchoolData, setConvenorsGPSchoolData] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectGPsParticipants, setSelectGPsParticipants] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [assistantSelected, setAssistantSelected] = useState(false);
  const [allCircleAssistants, setAllCircleAssistants] = useState([]);
  const [btnClickedGP, setBtnClickedGP] = useState("");
  const [gpConvenorsData, setGpConvenorsData] = useState([]);
  const [selectedGP, setSelectedGP] = useState("");
  let group;
  let event1;
  let event2;
  const [editClicked, setEditClicked] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [filteredGPData, setFilteredGPData] = useState([]);
  const [lockData, setLockData] = useState(gpLockState);
  const getAllParticipant = async () => {
    setLoader(true);
    const q1 = query(collection(firestore, "allGPFirsts"));
    const querySnapshot1 = await getDocs(q1);
    const data1 = querySnapshot1.docs
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

    setAllParticipants(data1);
    setFilteredGPData(data1);
    setAllGPFirstsState(data1);
    setGpConvenorsData(data1.filter((el) => el?.gp === teacherdetails.gp));

    setLoader(false);
  };
  const getTeachersData = async () => {
    setAllTeachers(teachersState);
    setTeachersState(teachersState);
    const circleAssistants = teachersState.filter(
      (teacher) => teacher.circleAssistant === "admin"
    );
    setAllCircleAssistants(circleAssistants);
  };
  const updateData = async () => {
    setLoader(true);
    const newData = allGPFirstsState.map((item) =>
      item.id === inputField.id ? inputField : item
    );
    setAllGPFirstsState(newData);
    setAllParticipants(newData);
    setFilteredGPData(newData);
    // await axios.post("/api/updateallGPFirsts", inputField);
    const docRef = doc(firestore, "allGPFirsts", inputField.id);
    await updateDoc(docRef, inputField)
      .then(async () => {
        setLoader(false);
        setInputField({
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
        document.getElementById("gender").value = "";
        document.getElementById("stdClass").value = "";
        document.getElementById("group").value = "";
        document.getElementById("event1").value = "";
        document.getElementById("event2").value = "";
        document.getElementById("birthday").value = birthday;
        setEditClicked(false);
        setInpGrSelected(false);
        setFirstEventSelected(false);
        toast.success(
          `congratulation! Your Data Has Heen Saved to Circle Sports Data`
        );
      })
      .catch((e) => {
        console.log(e);
        setLoader(false);
      });
  };
  const deleteParticipant = async (participant) => {
    try {
      setLoader(true);
      // await axios.post("/api/delallGPFirsts", { id: participant.id });
      await deleteDoc(doc(firestore, "allGPFirsts", participant.id))
        .then(() => {
          setLoader(false);
          const x = allGPFirstsState.filter(
            (item) => item.id !== participant.id
          );
          setAllGPFirstsState(x);
          setFilteredGPData(x);
          toast.success("Participant Deleted Successfully");
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      toast.error(e, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const updateAssistantData = async () => {
    setLoader(true);
    let all = circleAssistantState;
    const circleAssistantsUpdateNteacherUpdate = allCircleAssistants
      .filter((el) => el?.gp === teacherdetails.gp)
      .map(async (el) => {
        // await axios.post("/api/updTeacherConvenor", {
        //   id: el?.id,
        //   circleAssistant: "taw",
        // });
        let x = teachersState.filter((item) => item.id === el?.id)[0];
        x.circleAssistant = "taw";
        let y = teachersState.filter((item) => item.id !== el?.id);
        y = [...y, x];
        setTeachersState(y);
        await updateDoc(doc(firestore, "teachers", el?.id), {
          circleAssistant: "taw",
        })
          .then(async () => {
            try {
              await updateDoc(doc(firestore, "sportsUsers", el?.id), {
                circleAssistant: "taw",
              });
            } catch (e) {
              console.log(e);
            }
          })
          .catch((e) => console.log(e));
      });
    await Promise.all(circleAssistantsUpdateNteacherUpdate).then(async () => {
      const createCircleAssistantNupdateTeacherData = assistants.map(
        async (el, ind) => {
          // await axios.post("/api/updTeacherConvenor", {
          //   id: el?.id,
          //   circleAssistant: "admin",
          // });
          let x = teachersState.filter((item) => item.id === el?.id)[0];
          x.circleAssistant = "admin";
          let y = teachersState.filter((item) => item.id !== el?.id);
          y = [...y, x];
          setTeachersState(y);
          all = [...all, x];
          const docRef = doc(firestore, "teachers", el?.id);
          await updateDoc(docRef, {
            circleAssistant: "admin",
          }).then(async () => {
            try {
              await updateDoc(doc(firestore, "sportsUsers", el?.id), {
                circleAssistant: "admin",
              });
            } catch (e) {
              console.log(e);
            }
          });
        }
      );

      await Promise.all(createCircleAssistantNupdateTeacherData).then(
        async () => {
          setCircleAssistantState(all);
          setLoader(false);
          toast.success("All GP Assistants Created");
          setAssistants([]);
        }
      );
    });
  };

  const removeAssistant = async (el) => {
    setLoader(true);
    let x = teachersState.filter((item) => item.id === el?.id)[0];
    x.circleAssistant = "taw";
    let y = teachersState.filter((item) => item.id !== el?.id);
    y = [...y, x];
    setTeachersState(y);
    // await axios.post("/api/updTeacherConvenor", {
    //   id: el?.id,
    //   circleAssistant: "taw",
    // });
    setCircleAssistantState(
      circleAssistantState.filter((item) => item?.id !== el?.id)
    );
    await updateDoc(doc(firestore, "teachers", el?.id), {
      circleAssistant: "taw",
    })
      .then(async () => {
        try {
          await updateDoc(doc(firestore, "sportsUsers", el?.id), {
            circleAssistant: "taw",
          }).then(() => {
            setLoader(false);
            toast.success("Assistant Removed");
          });
        } catch (e) {
          setLoader(false);
          toast.success("Assistant Removed");
        }
      })
      .catch((e) => console.log(e));
  };

  const columns = [
    {
      name: "Sl",
      selector: (row, index) =>
        allParticipants.findIndex((i) => i.id === row?.id) + 1,
      sortable: +true,
      center: +true,
    },
    {
      name: "GP",
      selector: (row) => row.gp,
      sortable: +true,
      center: +true,
      wrap: true,
    },
    {
      name: "Participants Name",
      selector: (row) => row.name,
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
      selector: (row) => row.event1,
      sortable: +true,
      center: +true,
      wrap: true,
    },
    {
      name: "Event 2",
      selector: (row) => row.event2,
      sortable: +true,
      center: +true,
      wrap: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <div>
          <button
            type="button"
            className="btn btn-success m-1 btn-sm"
            onClick={() => {
              setEditClicked(true);
              setInputField(row);
              setInputField(row);
              setInpGrSelected(true);
              setFirstEventSelected(true);
              setTimeout(() => {
                let gender = document.getElementById("gender");
                let group = document.getElementById("group");
                let stdClass = document.getElementById("stdClass");
                let element1 = document.getElementById("event1");
                let element2 = document.getElementById("event2");
                if (gender) {
                  gender.value = row.gender;
                  group.value = row.group;
                  stdClass.value = row.sclass;
                  element1.value = row.event1;
                  element2.value = row.event2;
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
                : toast.error("Participant Not Deleted", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
            }}
          >
            Delete
          </button>
        </div>
      ),
      sortable: +true,
      center: +true,
      wrap: true,
    },
  ];

  const flushAllData = async () => {
    setLoader(true);

    try {
      await deleteCollection("allGPFirsts");
      await deleteCollection("allconvenors");
      await deleteCollection("AmtaWestCircleAllResult");
      await deleteCollection("gpSportsStudentData");
      await deleteCollection("amoragorigpresult");
      await deleteCollection("bkbatigpresult");
      await deleteCollection("gazipurgpresult");
      await deleteCollection("jhamtiagpresult");
      await deleteCollection("jhikiragpresult");
      await deleteCollection("nowparagpresult");
      await deleteCollection("thaliagpresult");
      setCircleStudentState([]);
      setGpStudentState([]);
    } catch (error) {
      console.log(error);
    }
    // Flushing "allCircleAssistants" and "allGPAssistants" Database
    teachersState.map(async (el) => {
      await updateDoc(doc(firestore, "teachers", el?.id), {
        circleAssistant: "taw",
      })
        .then(async () => {
          // Updating "userteachers" Database
          try {
            await updateDoc(doc(firestore, "sportsUsers", el?.id), {
              gpAssistant: "taw",
              circleAssistant: "taw",
              convenor: "taw",
            });
          } catch (error) {
            console.log(error);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    });
    // Updating "gpLockData" Database
    try {
      let x = [];
      const closeOperation = gpLockState.map(async (el) => {
        const entry = {
          edit: false,
          closeDate: Date.now(),
          entryCloseddBy: teacherdetails.tname,
        };
        el.edit = false;
        el.closeDate = "";
        el.entryCloseddBy = teacherdetails.tname;
        x = [...x, el];
        await updateDoc(doc(firestore, "gpLockData", el?.id), entry)
          .then(() => {
            console.log(`Entry of ${el?.gp} Closed successfully`);
            toast.success(`Entry of ${el?.gp} Closed successfully`);
          })
          .catch((e) => {
            console.log(e);
          });
      });
      await Promise.all(closeOperation).then(() => {
        setGpLockState(x);
      });
    } catch (e) {
      setLoader(false);
      console.log(e);
    }

    // Updating "convenors" Database

    await waitForSomeTime();
    setConvenorsState([]);
    getTeachersData();
  };
  const waitForSomeTime = async () => {
    // Simulate a delay
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };
  const filterData = (gp) => {
    setBtnClickedGP(`${gp}`);
    setFilteredGPData(allParticipants.filter((el) => el?.gp === gp));
    setShowTable(true);
  };

  const lockColumns = [
    {
      name: "Sl",
      selector: (row, index) => index + 1,
      sortable: +true,
      center: +true,
    },
    {
      name: "GP Name",
      selector: (row, index) => row.gp,
      sortable: +true,
      center: +true,
    },
    {
      name: "Lock State",
      selector: (row, index) =>
        row?.edit ? (
          <p className="text-success fw-bold">Unlocked</p>
        ) : (
          <p className="text-danger fw-bold">Locked</p>
        ),
      sortable: +true,
      center: +true,
    },
    {
      name: "Action",
      selector: (row, index) =>
        row?.edit ? (
          <button
            type="button"
            className="btn btn-danger m-1  btn-sm"
            onClick={() => lockGP(row?.gp, false)}
          >
            Lock
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-success m-1  btn-sm"
            onClick={() => lockGP(row?.gp, true)}
          >
            Unlock
          </button>
        ),
      sortable: +true,
      center: +true,
    },
  ];
  const changeGPLockEntry = async (gp, state) => {
    setLoader(true);
    const entry = {
      edit: state,
      closeDate: Date.now(),
      entryCloseddBy: teacherdetails.tname,
    };
    let x = gpLockState.filter((item) => item?.id === gp.id)[0];
    x.edit = state;
    x.closeDate = "";
    x.entryCloseddBy = teacherdetails.tname;
    let y = gpLockState.filter((item) => item?.id !== gp.id);
    y = [...y, x];
    setGpLockState(y);
    const docRef = doc(firestore, "gpLockData", gp.id);
    await updateDoc(docRef, entry)
      .then(async () => {
        setLoader(false);
        // getLockData();
        toast.success(
          `congratulation! Student Entry Closed For ${gp.gp} GP Sports Data`,
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
      })
      .catch((e) => {
        console.log(e);
        setLoader(false);
      });
  };
  const lockGP = async (gp, state) => {
    setLoader(true);
    const selectedGPLock = circleLockState.filter((el) => el?.gp === gp)[0];
    const otherGPLock = circleLockState.filter((el) => el?.gp !== gp);
    selectedGPLock.edit = state;
    if (state) {
      selectedGPLock.entryStaredBy = teacherdetails.tname;
      selectedGPLock.entryDate = Date.now();
    } else {
      selectedGPLock.entryCloseddBy = teacherdetails.tname;
      selectedGPLock.closeDate = Date.now();
    }
    // try {
    //   await axios.post("/api/updatecircleLockData", selectedGPLock);
    // } catch (error) {
    //   console.log(error);
    // }
    try {
      await updateDoc(
        doc(firestore, "circleLockData", selectedGPLock?.id),
        selectedGPLock
      ).then((e) => {
        console.log("Entry of " + gp + " Lock State Changed successfully");
        toast.success("Entry of " + gp + " Lock State Changed successfully");
        setLoader(false);
      });
    } catch (e) {
      setLoader(false);
      console.log(e);
    }
    let x = [...otherGPLock, selectedGPLock].sort((a, b) =>
      a.gp.localeCompare(b.gp)
    );
    setCircleLockState(x);
  };
  const lockAllGP = async (state) => {
    setLoader(true);
    circleLockState.map(async (item) => {
      const selectedGPLock = circleLockState.filter(
        (el) => el?.gp === item?.gp
      )[0];
      const otherGPLock = circleLockState.filter((el) => el?.gp !== item?.gp);
      selectedGPLock.edit = state;
      if (state) {
        selectedGPLock.entryStaredBy = teacherdetails.tname;
        selectedGPLock.entryDate = Date.now();
      } else {
        selectedGPLock.entryCloseddBy = teacherdetails.tname;
        selectedGPLock.closeDate = Date.now();
      }
      // try {
      //   await axios.post("/api/updatecircleLockData", selectedGPLock);
      // } catch (error) {
      //   console.log(error);
      // }
      try {
        await updateDoc(
          doc(firestore, "circleLockData", selectedGPLock?.id),
          selectedGPLock
        ).then((e) => {
          console.log("Entry of " + gp + " Lock State Changed successfully");
          toast.success("Entry of " + gp + " Lock State Changed successfully");
          setLoader(false);
        });
      } catch (e) {
        setLoader(false);
        console.log(e);
      }
      let x = [...otherGPLock, selectedGPLock].sort((a, b) =>
        a.gp.localeCompare(b.gp)
      );
      setCircleLockState(x);
    });
  };

  useEffect(() => {
    setSelectGPsParticipants(
      allParticipants.filter((el) => el?.gp === selectedGP)
    );
    setFilteredData(allParticipants.filter((el) => el?.gp === selectedGP));
  }, [selectedGP]);

  useEffect(() => {
    document.title = "AWC Sports App: Circle Convenors Page";
    group = document.getElementById("group");
    event1 = document.getElementById("event1");
    event2 = document.getElementById("event2");

    setConvenorsGPSchoolData(
      schoolState.filter((el) => el?.gp === teacherdetails.gp)
    );
    getTeachersData();

    if (allGPFirstsState.length === 0) {
      getAllParticipant();
    } else {
      setAllParticipants(allGPFirstsState);
      setFilteredGPData(allGPFirstsState);
      setGpConvenorsData(
        allGPFirstsState.filter((el) => el?.gp === teacherdetails.gp)
      );
    }
  }, []);
  useEffect(() => {
    // eslint-disable-next-line
  }, [inputField, allParticipants, filteredData, gpConvenorsData]);

  return (
    <div className="container-fluid text-center my-5">
      {teacherdetails.circle === "admin" && (
        <div className="mx-auto">
          {allGPFirstsState.length > 0 && (
            <button
              type="button"
              className="btn btn-success m-2"
              onClick={() => {
                createDownloadLink(allGPFirstsState, "allGPFirsts");
              }}
            >
              Download All GP First&#8217;s Result Data
            </button>
          )}

          <button
            type="button"
            className="btn p-4 btn-danger m-1 btn-sm"
            onClick={() => {
              // eslint-disable-next-line
              let conf = confirm(
                `Are You Sure To Flush All Data of Circle And GP Sports`
              );
              if (conf) {
                flushAllData();
              } else {
                toast.success("Data Not Flushed", {
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
            Flush All Data
          </button>
          <button
            type="button"
            className="btn p-4 btn-danger m-1 btn-sm"
            onClick={() => {
              // eslint-disable-next-line
              let conf = confirm(
                `Are You Sure To Flush All Circle Firts Data of Circle And GP Sports`
              );
              if (conf) {
                deleteCollection("AmtaWestCircleFirstResult");
                toast.success("Circle Firsts Data Flushed");
              } else {
                toast.success("Data Not Flushed", {
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
            Flush Circle Firsts Data
          </button>
        </div>
      )}
      {teacherdetails.circle === "admin" && allParticipants.length > 0 && (
        <button
          type="button"
          className="btn p-4 btn-info m-1 btn-sm"
          onClick={() => {
            setStateObject({
              data: allParticipants,
              gp: convenorsGPSchoolData,
            });
            navigate.push(`/CircleAllStudents`);
          }}
        >
          Go To Circle Sports All Student List
        </button>
      )}
      <div className="my-4 container d-flex flex-column justify-centent-center align-items-center mx-auto">
        {lockData
          // .filter((el) => el?.edit === true)
          .map((el, ind) => (
            <div
              className="d-flex flex-row justify-centent-center align-items-center mx-auto"
              key={ind}
            >
              <h6
                className={`text-center text-${
                  el?.edit ? "success" : "danger"
                }`}
              >
                Currently {el?.gp} Student Entry & Edit is{" "}
                {el?.edit ? "Open" : "Closed"}
              </h6>
              <button
                type="button"
                className={`btn btn-${
                  el?.edit ? "danger" : "success"
                } m-1  btn-sm`}
                onClick={() => changeGPLockEntry(el, !el?.edit)}
              >
                {el?.edit ? "Close" : "Open"}
              </button>
            </div>
          ))}
      </div>
      <div className="my-4 container">
        {teacherdetails.circle === "admin" && (
          <div className=" my-2 ">
            <h3 className="text-center text-primary">
              Lock / Unlock Circle Student&#8217;s Name Entry
            </h3>
            <div className="my-2">
              <button
                type="button"
                className="btn btn-danger m-1  btn-sm"
                onClick={() => lockAllGP(false)}
              >
                Lock All Gp
              </button>
              <button
                type="button"
                className="btn btn-success m-1  btn-sm"
                onClick={() => lockAllGP(true)}
              >
                Unlock All Gp
              </button>
            </div>
            <DataTable
              columns={lockColumns}
              data={circleLockState}
              pagination
              highlightOnHover
              fixedHeader
            />
          </div>
        )}
      </div>
      {teacherdetails.circle === "admin" && (
        <div className="my-4 mx-auto">
          {allCircleAssistants.length > 0 && (
            <div className="my-4 mx-auto col-md-4 row justify-content-center align-items-center">
              <h6 className="text-center text-primary">
                Your Current Assistants Are
              </h6>
              {allCircleAssistants.map((el, ind) => (
                <div
                  className="row m-2 col-md-3 justify-content-center align-items-center"
                  key={ind}
                >
                  <h6 className="text-center text-primary">
                    {`${ind + 1}) ${el?.tname}`}
                  </h6>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      // eslint-disable-next-line
                      let conf = confirm(
                        `Are You Sure To Remove Your Assistant ${el?.tname}?`
                      );
                      if (conf) {
                        removeAssistant(el);
                      } else {
                        toast.success("Assistant Not Removed", {
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
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          <h3 className="text-center text-primary">Select Your Assistants</h3>

          <div className="mx-auto mb-3 col-md-4">
            {
              <select
                className="form-select"
                id="assistants"
                defaultValue={""}
                onChange={(e) => {
                  setAssistantSelected(true);
                  let teacher = {
                    circleAssistant: "admin",
                  };
                  if (e.target.value !== "") {
                    teacher = JSON.parse(e.target.value);
                    teacher = { ...teacher, circleAssistant: "admin" };
                  }
                  let y = [];
                  y = [...assistants, e.target.value !== "" ? teacher : ""];
                  y = y.filter((el) => el !== "");
                  setAssistants(removeDuplicates(y));

                  e.target.value = "";
                }}
                aria-label="Default select example"
              >
                <option value="">Select Teacher Name</option>

                {allTeachers.map((el, ind) => {
                  return (
                    <option value={JSON.stringify(el)} key={ind}>
                      {el?.tname}
                    </option>
                  );
                })}
              </select>
            }
          </div>

          {assistantSelected && assistants.length > 0 && (
            <div className="justify-content-center align-items-center">
              <h6 className="text-primary ">Selected Assistants Are</h6>
              <div className="row my-2 justify-content-center align-items-center">
                {assistants.map((el, ind) => (
                  <div
                    className="m-2 col-md-2 row justify-content-center align-items-center"
                    key={ind}
                  >
                    <h6 className="text-center text-primary ">
                      {ind + 1}): {el?.tname}
                    </h6>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        let x = assistants.filter((elem) => el?.id !== elem.id);
                        setAssistants(x);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={() => {
                  updateAssistantData();
                }}
              >
                Submit Assistants
              </button>
            </div>
          )}
        </div>
      )}
      {allParticipants.length > 0 && (
        <div className="container-fluid my-4">
          {teacherdetails.circle === "admin" && (
            <div className=" my-2 ">
              <h3 className="text-center text-primary">Select GP Name</h3>
              <button
                type="button"
                className="btn btn-success m-1 col-md-1 btn-sm"
                style={{ width: "auto" }}
                onClick={() => filterData("AMORAGORI")}
              >
                AMORAGORI
              </button>
              <button
                type="button"
                className="btn btn-primary m-1 col-md-1 btn-sm"
                style={{ width: "auto" }}
                onClick={() => filterData("BKBATI")}
              >
                BKBATI
              </button>
              <button
                type="button"
                className="btn btn-secondary m-1 col-md-1 btn-sm"
                style={{ width: "auto" }}
                onClick={() => filterData("GAZIPUR")}
              >
                GAZIPUR
              </button>
              <button
                type="button"
                className="btn btn-warning m-1 col-md-1 btn-sm"
                style={{ width: "auto" }}
                onClick={() => filterData("JHAMTIA")}
              >
                JHAMTIA
              </button>
              <button
                type="button"
                className="btn btn-info m-1 col-md-1 btn-sm"
                style={{ width: "auto" }}
                onClick={() => filterData("JHIKIRA")}
              >
                JHIKIRA
              </button>
              <button
                type="button"
                className="btn btn-success m-1 col-md-1 btn-sm"
                style={{ width: "auto" }}
                onClick={() => filterData("JOYPUR")}
              >
                JOYPUR
              </button>
              <button
                type="button"
                className="btn btn-primary m-1 col-md-1 btn-sm"
                style={{ width: "auto" }}
                onClick={() => filterData("NOWPARA")}
              >
                NOWPARA
              </button>
              <button
                type="button"
                className="btn btn-info m-1 col-md-1 btn-sm"
                style={{ width: "auto" }}
                onClick={() => filterData("THALIA")}
              >
                THALIA
              </button>
            </div>
          )}
          <h3 className="text-center text-primary">
            Displaying {btnClickedGP !== "" ? btnClickedGP : "All"} GP's
            Participants
          </h3>
        </div>
      )}
      {allParticipants.length > 0 && showTable && (
        <DataTable
          columns={columns}
          data={filteredGPData}
          pagination
          highlightOnHover
          fixedHeader
        />
      )}
      {allParticipants.length > 0 && (
        <>
          <button
            type="button"
            className="btn btn-success m-1 col-md-1 btn-sm"
            style={{ width: "auto" }}
            onClick={() => {
              setShowTable(!showTable);
              setBtnClickedGP("All School");
              setFilteredGPData(allParticipants);
            }}
          >
            {showTable ? "HIDE LIST" : "SHOW LIST"}
          </button>
        </>
      )}

      {!editClicked && (
        <div className="container">
          <div className="col-md-4 mx-auto mb-2">
            <h4 className="text-center text-primary text-wrap">
              Select GP to Show Participants of That GP
            </h4>
            <select
              className="form-select"
              defaultValue={""}
              onChange={(e) => {
                setClicked(true);
                let x = [];
                x = [
                  ...x,
                  e.target.value !== "" ? JSON.parse(e.target.value) : "",
                ];
                setSelectedGP(x[0].englishName);
              }}
              aria-label="Default select example"
            >
              <option value="">Select GP Name</option>
              {gpNames.map((el, ind) => {
                return (
                  <option value={JSON.stringify(el)} key={ind}>
                    {el?.englishName}
                  </option>
                );
              })}
            </select>
          </div>
          {clicked && selectedGP !== "" && selectedGP !== undefined && (
            <div className="container-fluid my-4">
              <h4 className="text-center text-primary">
                Displaying {selectedGP} GP's Participants
              </h4>
              {selectGPsParticipants.length > 0 && (
                <button
                  type="button"
                  className="btn btn-success m-1 btn-sm"
                  onClick={() => {
                    setStateArray(selectGPsParticipants);
                    navigate.push(`/CircleGPWiseStudentList`);
                  }}
                >
                  Print List
                </button>
              )}
              <div className="container-fluid my-4">
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
                      className="w-75 form-control"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        if (e.target.value !== "") {
                          let x = selectGPsParticipants.filter((el) => {
                            return el?.name
                              .toLowerCase()
                              .match(e.target.value?.toLowerCase());
                          });
                          setFilteredData(x);
                        } else {
                          setFilteredData(selectGPsParticipants);
                        }
                      }}
                    />
                  }
                  subHeaderAlign="right"
                />
              </div>
            </div>
          )}
        </div>
      )}
      {editClicked && (
        <div className="container">
          <p className="text-center text-danger">
            (*) Marked Fields are Compulsary.
          </p>
          <h4 className="text-center text-primary text-wrap">
            Edit Details of {inputField.name} of {inputField.school}
          </h4>
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
                  });
                }}
                required
              />
            </div>
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
                  if (group) {
                    group.value = "";
                  }
                  if (event1) {
                    event1.value = "";
                  }
                  if (event2) {
                    event2.value = "";
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
                  setInputField({
                    ...inputField,
                    sclass: e.target.value,
                  });
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
                  }
                  if (event2) {
                    event2.value = "";
                  }
                  setInpGrSelected(true);
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
                <label className="form-label">Select First Event Name *</label>
                <select
                  className="form-select"
                  id="event1"
                  defaultValue={""}
                  onChange={(e) => {
                    let event1rank = 1;
                    if (inputField.gender === "BOYS") {
                      if (inputField.group === "GROUP-A") {
                        if (e.target.value === "75 METER RUN") {
                          event1rank = 1;
                        } else if (e.target.value === "LONG JUMP") {
                          event1rank = 2;
                        } else if (e.target.value === "SHUTTLE RACE") {
                          event1rank = 3;
                        } else if (e.target.value === "YOGA") {
                          event1rank = 4;
                        }
                      } else if (inputField.group === "GROUP-B") {
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
                      } else if (inputField.group === "GROUP-C") {
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
                      if (inputField.group === "GROUP-A") {
                        if (e.target.value === "75 METER RUN") {
                          event1rank = 18;
                        } else if (e.target.value === "LONG JUMP") {
                          event1rank = 19;
                        } else if (e.target.value === "SHUTTLE RACE") {
                          event1rank = 20;
                        } else if (e.target.value === "YOGA") {
                          event1rank = 21;
                        }
                      } else if (inputField.group === "GROUP-B") {
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
                      } else if (inputField.group === "GROUP-C") {
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
                    setInputField({
                      ...inputField,
                      event1: e.target.value,
                      event1rank: event1rank,
                    });
                    setFirstEventSelected(true);
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
                <label className="form-label">Select Second Event Name</label>
                <select
                  className="form-select"
                  defaultValue={""}
                  id="event2"
                  onChange={(e) => {
                    let event2rank = 1;
                    if (inputField.gender === "BOYS") {
                      if (inputField.group === "GROUP-A") {
                        if (e.target.value === "75 METER RUN") {
                          event2rank = 1;
                        } else if (e.target.value === "LONG JUMP") {
                          event2rank = 2;
                        } else if (e.target.value === "SHUTTLE RACE") {
                          event2rank = 3;
                        } else if (e.target.value === "YOGA") {
                          event2rank = 4;
                        }
                      } else if (inputField.group === "GROUP-B") {
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
                      } else if (inputField.group === "GROUP-C") {
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
                      if (inputField.group === "GROUP-A") {
                        if (e.target.value === "75 METER RUN") {
                          event2rank = 18;
                        } else if (e.target.value === "LONG JUMP") {
                          event2rank = 19;
                        } else if (e.target.value === "SHUTTLE RACE") {
                          event2rank = 20;
                        } else if (e.target.value === "YOGA") {
                          event2rank = 21;
                        }
                      } else if (inputField.group === "GROUP-B") {
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
                      } else if (inputField.group === "GROUP-C") {
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

                    setInputField({
                      ...inputField,
                      event2: e.target.value,
                      event2rank: event2rank,
                    });
                  }}
                  aria-label="Default select example"
                >
                  <option value="">Select Second Event</option>
                  {inputField.group === "GROUP-A"
                    ? events.groupA
                        .filter((el) => el !== inputField.event1)
                        .filter((el) => {
                          if (inputField.event1 === "YOGA") {
                            return (
                              el !== "75 METER RUN" &&
                              el !== "SHUTTLE RACE" &&
                              el !== "LONG JUMP"
                            );
                          } else {
                            return el !== "YOGA";
                          }
                        })
                        .map((el, ind) => (
                          <option value={el} key={ind}>
                            {el}
                          </option>
                        ))
                    : inputField.group === "GROUP-B"
                    ? events.groupB
                        .filter((el) => el !== inputField.event1)
                        .filter((el) => {
                          if (inputField.event1 === "YOGA") {
                            return (
                              el !== "100 METER RUN" &&
                              el !== "200 METER RUN" &&
                              el !== "LONG JUMP" &&
                              el !== "HIGH JUMP" &&
                              el !== "GYMNASTICS"
                            );
                          } else if (inputField.event1 === "GYMNASTICS") {
                            return (
                              el !== "100 METER RUN" &&
                              el !== "200 METER RUN" &&
                              el !== "LONG JUMP" &&
                              el !== "HIGH JUMP" &&
                              el !== "YOGA"
                            );
                          } else {
                            return el !== "YOGA" && el !== "GYMNASTICS";
                          }
                        })
                        .map((el, ind) => (
                          <option value={el} key={ind}>
                            {el}
                          </option>
                        ))
                    : inputField.group === "GROUP-C"
                    ? events.groupC
                        .filter((el) => el !== inputField.event1)
                        .filter((el) => {
                          if (inputField.event1 === "YOGA") {
                            return (
                              el !== "100 METER RUN" &&
                              el !== "200 METER RUN" &&
                              el !== "LONG JUMP" &&
                              el !== "HIGH JUMP" &&
                              el !== "FOOTBALL THROWING" &&
                              el !== "GYMNASTICS"
                            );
                          } else if (inputField.event1 === "GYMNASTICS") {
                            return (
                              el !== "100 METER RUN" &&
                              el !== "200 METER RUN" &&
                              el !== "LONG JUMP" &&
                              el !== "HIGH JUMP" &&
                              el !== "FOOTBALL THROWING" &&
                              el !== "YOGA"
                            );
                          } else {
                            return el !== "YOGA" && el !== "GYMNASTICS";
                          }
                        })
                        .map((el, ind) => (
                          <option value={el} key={ind}>
                            {el}
                          </option>
                        ))
                    : ""}
                </select>
              </div>
            )}

            {firstEventSelected && (
              <div>
                <button
                  type="button"
                  className="btn btn-success m-1 col-md-1 btn-sm"
                  style={{ width: "auto" }}
                  onClick={() => {
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
                      inputField.gp !== "" &&
                      inputField.gp !== undefined &&
                      inputField.gender !== "" &&
                      inputField.gender !== undefined &&
                      inputField.group !== "" &&
                      inputField.group !== undefined &&
                      inputField.event1 !== "" &&
                      inputField.event1 !== undefined
                    ) {
                      updateData();
                    } else {
                      toast.error("Please Select All Required Fields", {
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
                <button
                  type="button"
                  className="btn btn-danger m-1 col-md-1 btn-sm"
                  style={{ width: "auto" }}
                  onClick={() => {
                    setInputField({
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
                    setEditClicked(false);
                    setInpGrSelected(false);
                    setFirstEventSelected(false);
                    document.getElementById("gender").value = "";
                    document.getElementById("group").value = "";
                    document.getElementById("event1").value = "";
                    document.getElementById("event2").value = "";
                    document.getElementById("birthday").value = birthday;
                  }}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {loader && <Loader />}
    </div>
  );
};

export default CircleStudentsNameEntry;
