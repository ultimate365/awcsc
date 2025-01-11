"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../context/FirbaseContext";
import { useGlobalContext } from "../../context/Store";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  StdClass,
  birthday,
  events,
  maxdob,
  mindob,
} from "../../modules/constants";
import bcrypt from "bcryptjs";
import {
  createDownloadLink,
  removeDuplicates,
} from "../../modules/calculatefunctions";
import axios from "axios";
const GPConvenorsPage = () => {
  const {
    setStateArray,
    setYourStateObject,
    gpStudentState,
    gpStudentStateUpdateTime,
    schoolState,
    teachersState,
    setTeachersState,
    teacherUpdateTime,
    setTeacherUpdateTime,
    setGpStudentState,
    setGpStudentStateUpdateTime,
    AmtaWestCircleAllResultState,
    setAmtaWestCircleAllResultState,
    setAmtaWestCircleAllResultUpdateTime,
    AmtaWestCircleAllResultUpdateTime,
    allGPAssistantsState,
    setAllGPAssistantsState,
    userSchoolState,
    setUserSchoolState,
    setUserSchoolStateUpdateTime,
  } = useGlobalContext();

  const navigate = useRouter();

  const [showTable, setShowTable] = useState(true);
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
      if (teacherdetails.convenor !== "admin") {
        if (teacherdetails.gpAssistant !== "admin") {
          navigate.push("/login");
        }
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
    entryBy: "",
    updatedBy: "",
  });
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [inpGrSelected, setInpGrSelected] = useState(false);
  const [firstEventSelected, setFirstEventSelected] = useState(false);
  const [convenorsGPSchoolData, setConvenorsGPSchoolData] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [loader, setLoader] = useState(false);
  const [schoolData, setSchoolData] = useState([]);
  const [selectSchoolsParticipants, setSelectSchoolsParticipants] = useState(
    []
  );
  const [allResult, setAllResult] = useState([]);
  const [resultFilteredData, setresultFilteredData] = useState([]);
  const [resultSearch, setResultSearch] = useState("");
  const [showCircleResult, setShowCircleResult] = useState(false);
  const [allTeachers, setAllTeachers] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [allGPAssistants, setAllGPAssistants] = useState([]);
  const [thisGpAssistance, setThisGpAssistance] = useState([]);
  const [assistantSelected, setAssistantSelected] = useState(false);
  const [gpClicked, setGpClicked] = useState(false);
  const [btnClickedGP, setBtnClickedGP] = useState("");
  const [gpConvenorsData, setGpConvenorsData] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState({
    id: "",
    school: "",
    gp: "",
    udise: "",
  });
  let group;
  let event1;
  let event2;

  const [editClicked, setEditClicked] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [filteredGPData, setFilteredGPData] = useState([]);

  const getSchoolData = async () => {
    const querySnapshot = await getDocs(
      query(collection(firestore, "schools"))
    );
    const data = querySnapshot.docs.map((doc) => doc.data());
    setSchoolData(data);
    setConvenorsGPSchoolData(
      data?.filter((el) => el?.gp === teacherdetails.gp)
    );
  };
  const getTeachersData = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(firestore, "teachers"))
      );
      const data = querySnapshot.docs
        .map((doc) => doc.data())
        .sort((a, b) => a?.tname.localeCompare(b?.tname));
      setAllTeachers(data);
      setTeachersState(data);
      setTeacherUpdateTime(Date.now());
    } catch (error) {
      await axios
        .post("/api/getTeacher")
        .then((response) => {
          const data = response.data.data.sort((a, b) =>
            a?.tname.localeCompare(b?.tname)
          );
          setAllTeachers(data);
          setTeachersState(data);
          setTeacherUpdateTime(Date.now());
        })
        .catch((error) => {
          console.error("Error fetching lock data: ", error);
        });
      console.error("Error fetching lock data: ", error);
    }
  };

  const getAllGPAssistantsData = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(firestore, "allGPAssistants"))
      );
      const data = querySnapshot.docs.map((doc) => doc.data());
      setAllGPAssistantsState(data);
      setAllGPAssistants(data);
      setThisGpAssistance(
        data
          .filter((el) => el?.gp === teacherdetails.gp)
          .filter((el) => el?.gpAssistant === "admin")
      );
    } catch (error) {
      await axios
        .post("/api/getallGPAssistants")
        .then((response) => {
          const data = response.data.data;
          setAllGPAssistantsState(data);
          setAllGPAssistants(data);
          setThisGpAssistance(
            data
              .filter((el) => el?.gp === teacherdetails.gp)
              .filter((el) => el?.gpAssistant === "admin")
          );
        })
        .catch((error) => {
          console.error("Error fetching lock data: ", error);
        });
      console.error("Error fetching lock data: ", error);
    }
  };
  const getAllResult = async () => {
    try {
      setLoader(true);
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
      setresultFilteredData(data);
      setShowCircleResult(true);
    } catch (error) {
      await axios
        .post("/api/getAmtaWestCircleAllResult")
        .then((response) => {
          const data = response.data.data.sort(
            (a, b) => a?.event1rank - b?.event1rank
          );
          setLoader(false);
          setAmtaWestCircleAllResultState(data);
          setAmtaWestCircleAllResultUpdateTime(Date.now());
          setAllResult(data);
          setresultFilteredData(data);
          setShowCircleResult(true);
        })
        .catch((error) => {
          console.error("Error fetching lock data: ", error);
        });
      console.error("Error fetching lock data: ", error);
    }
  };
  const updateAssistantData = async () => {
    let all = allGPAssistantsState;
    setLoader(true);
    let gpAssistantUpdateNteacherUpdate = allGPAssistants
      .filter((el) => el?.gp === teacherdetails.gp)
      .map(async (el) => {
        let x = teachersState.filter((item) => item.id === el?.id)[0];
        x.gpAssistant = "taw";
        let y = teachersState.filter((item) => item.id !== el?.id);
        y = [...y, x];
        setTeachersState(y);
        await axios.post("/api/updTeacherConvenor", {
          id: el?.id,
          gpAssistant: "taw",
        });
        await updateDoc(doc(firestore, "teachers", el?.id), {
          gpAssistant: "taw",
        })
          .then(async () => {
            all = all.pop((item) => item.id === el?.id);
            await deleteDoc(doc(firestore, "allGPAssistants", el?.id));
            await axios.post("/api/delallGPAssistants", {
              id: el?.id,
            });
            try {
              await updateDoc(doc(firestore, "userteachers", el?.id), {
                gpAssistant: "taw",
              });
            } catch (e) {
              console.log(e);
            }
          })
          .catch((e) => console.log(e));
      });
    await Promise.all(gpAssistantUpdateNteacherUpdate).then(async () => {
      let createGpAssistantNupdateTeacherData = assistants.map(
        async (el, ind) =>
          await setDoc(doc(firestore, "allGPAssistants", el?.id), el).then(
            async () => {
              await axios.post("/api/updTeacherConvenor", {
                id: el?.id,
                gpAssistant: "admin",
              });
              await axios.post("/api/addallGPAssistants", el);
              let x = teachersState.filter((item) => item.id === el?.id)[0];
              x.gpAssistant = "admin";
              let y = teachersState.filter((item) => item.id !== el?.id);
              y = [...y, x];
              setTeachersState(y);
              all = [...all, x];
              const docRef = doc(firestore, "teachers", el?.id);
              await updateDoc(docRef, {
                gpAssistant: "admin",
              }).then(async () => {
                try {
                  await updateDoc(doc(firestore, "userteachers", el?.id), {
                    gpAssistant: "admin",
                  });
                } catch (e) {
                  console.log(e);
                }
              });
            }
          )
      );
      await Promise.all(createGpAssistantNupdateTeacherData).then(async () => {
        setTeacherUpdateTime(Date.now());
        setAllGPAssistantsState(all);
        setLoader(false);
        toast.success("All GP Assistants Created", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setAssistants([]);
      });
    });
  };

  const removeAssistant = async (el) => {
    setLoader(true);
    let x = teachersState.filter((item) => item.id === el?.id)[0];
    x.gpAssistant = "taw";
    let y = teachersState.filter((item) => item.id !== el?.id);
    y = [...y, x];
    setTeachersState(y);
    setTeacherUpdateTime(Date.now());
    await axios.post("/api/updTeacherConvenor", {
      id: el?.id,
      gpAssistant: "taw",
    });
    await axios.post("/api/delallGPAssistants", {
      id: el?.id,
    });
    setAllGPAssistantsState(
      allGPAssistantsState.filter((item) => item?.id !== el?.id)
    );
    await updateDoc(doc(firestore, "teachers", el?.id), {
      gpAssistant: "taw",
    })
      .then(async () => {
        await deleteDoc(doc(firestore, "allGPAssistants", el?.id));
        try {
          await updateDoc(doc(firestore, "userteachers", el?.id), {
            gpAssistant: "taw",
          }).then(() => {
            // getTeachersData();
            // getAllGPAssistantsData();
            setLoader(false);
            toast.success("Assistant Removed", {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          });
        } catch (e) {
          console.log(e);
          // getTeachersData();
          // getAllGPAssistantsData();
          setLoader(false);
          toast.success("Assistant Removed", {
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
      })
      .catch((e) => console.log(e));
  };

  const getAllParticipant = async () => {
    try {
      setLoader(true);
      const querySnapshot = await getDocs(
        query(collection(firestore, "gpSportsStudentData"))
      );
      const data = querySnapshot.docs
        .map((doc) => doc.data())
        .sort(
          (a, b) =>
            a?.school.localeCompare(b?.school) ||
            a?.gender.localeCompare(b?.gender) ||
            a?.group.localeCompare(b?.group) ||
            a?.event1rank - b?.event1rank
        );
      setGpStudentState(data);
      setGpStudentStateUpdateTime(Date.now());
      setAllParticipants(data);
      setFilteredGPData(data);
      setGpConvenorsData(data.filter((el) => el?.gp === teacherdetails.gp));
      setLoader(false);
    } catch (error) {
      await axios
        .post("/api/getgpSportsStudentData")
        .then((response) => {
          const data = response.data.data.sort(
            (a, b) =>
              a?.school.localeCompare(b?.school) ||
              a?.gender.localeCompare(b?.gender) ||
              a?.group.localeCompare(b?.group) ||
              a?.event1rank - b?.event1rank
          );
          setGpStudentState(data);
          setGpStudentStateUpdateTime(Date.now());
          setAllParticipants(data);
          setFilteredGPData(data);
          setGpConvenorsData(data.filter((el) => el?.gp === teacherdetails.gp));
          setLoader(false);
        })
        .catch((error) => {
          console.error("Error fetching lock data: ", error);
        });
      console.error("Error fetching lock data: ", error);
    }
  };
  const updateData = async () => {
    setLoader(true);
    const entry = {
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
      updatedBy: teacherdetails.tname,
    };
    let x = gpStudentState.filter((item) => item.id !== inputField.id);
    x = [...x, entry];
    setGpStudentState(x);
    setGpStudentStateUpdateTime(Date.now());

    await axios.post("/api/updategpSportsStudentData", entry);
    const docRef = doc(firestore, "gpSportsStudentData", inputField.id);

    await updateDoc(docRef, entry)
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
          entryBy: "",
          updatedBy: "",
        });
        document.getElementById("gender").value = "";
        document.getElementById("group").value = "";
        document.getElementById("event1").value = "";
        document.getElementById("event2").value = "";
        document.getElementById("birthday").value = birthday;
        setEditClicked(false);
        setInpGrSelected(false);
        setFirstEventSelected(false);

        toast.success(
          `congratulation! Your Data Has Heen Saved to ${inputField.gp} GP Sports Data`,
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
        // getAllParticipant();
      })
      .catch((e) => {
        console.log(e);
        setLoader(false);
        console.log(inputField);
      });
  };
  const deleteParticipant = async (participant) => {
    try {
      await axios.post("api/delgpSportsStudentData", { id: participant.id });
      setGpStudentState(
        gpStudentState.filter((item) => item.id !== participant.id)
      );
      setGpStudentStateUpdateTime(Date.now());
      await deleteDoc(doc(firestore, "gpSportsStudentData", participant.id))
        .then(() => {
          const x = gpStudentState.filter((item) => item.id !== participant.id);
          setGpStudentState(x);
          setAllParticipants(x);
          setFilteredGPData(x);
          // getAllParticipant();
          toast.success("Participant Deleted Successfully", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
        .catch((e) => {
          console.log(e);
          console.log(inputField);
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

  const resultColumns = [
    {
      name: "Sl",
      selector: (row, index) =>
        gpStudentState.findIndex((i) => i.id === row?.id) + 1,
      sortable: true,
    },
    {
      name: "Chest No.",
      selector: (row, index) => row?.chestNo,
      sortable: true,
    },

    {
      name: "Participants Name",
      selector: (row) => row?.name,
      sortable: true,
      wrap: true,
    },

    {
      name: "Class",
      selector: (row) => row?.sclass,
      sortable: true,
      wrap: true,
    },
    {
      name: "School Name",
      selector: (row) => row?.school,
      sortable: true,
      wrap: true,
    },
    {
      name: "Gender",
      selector: (row) => row?.gender,
      sortable: true,
      wrap: true,
    },

    {
      name: "Group",
      selector: (row) => row?.group,
      sortable: true,
      wrap: true,
    },
    {
      name: "Event 1",
      selector: (row) => row?.event1 + ", " + row?.position1,
      sortable: true,
      wrap: true,
    },
    {
      name: "Event 2",
      selector: (row) =>
        row?.event2 !== "" ? row?.event2 + ", " + row?.position2 : "",
      sortable: true,
      wrap: true,
    },
  ];

  const columns = [
    {
      name: "Sl",
      selector: (row, index) =>
        gpStudentState.findIndex((i) => i.id === row?.id) + 1,
      sortable: true,
    },
    {
      name: "GP",
      selector: (row) => row?.gp,
      sortable: true,
      wrap: true,
    },
    {
      name: "Participants Name",
      selector: (row) => row?.name,
      sortable: true,
      wrap: true,
    },

    {
      name: "School Name",
      selector: (row) => row?.school,
      sortable: true,
      wrap: true,
    },
    {
      name: "Gender",
      selector: (row) => row?.gender,
      sortable: true,
      wrap: true,
    },
    {
      name: "Group",
      selector: (row) => row?.group,
      sortable: true,
      wrap: true,
    },
    {
      name: "Event 1",
      selector: (row) => row?.event1,
      sortable: true,
      wrap: true,
    },
    {
      name: "Event 2",
      selector: (row) => row?.event2,
      sortable: true,
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
                let studentClass = document.getElementById("stdClass");
                let element1 = document.getElementById("event1");
                let element2 = document.getElementById("event2");
                if (gender) {
                  gender.value = row?.gender;
                  group.value = row?.group;
                  studentClass.value = row?.sclass;
                  element1.value = row?.event1;
                  element2.value = row?.event2;
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
                `Are You Sure To Delete Participant ${row?.name}`
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
      sortable: true,
      wrap: true,
    },
  ];

  const filterData = (gp) => {
    setBtnClickedGP(`${gp} GP`);
    setGpClicked(true);
    setFilteredGPData(allParticipants.filter((el) => el?.gp === gp));
  };
  const updatePassword = async () => {
    setLoader(true);
    const password = bcrypt.hashSync(
      selectedSchool.id + "@" + selectedSchool.gp.toLowerCase(),
      10
    );
    let x = selectedSchool;
    x.password = password;
    await axios.post("/api/updateuserschools", x);
    if (userSchoolState.length > 0) {
      let us = userSchoolState.filter((el) => el.id !== selectedSchool.id);
      setUserSchoolState([...us, x]);
      setUserSchoolStateUpdateTime(Date.now());
    }
    await updateDoc(doc(firestore, "userschools", selectedSchool.id), {
      password: password,
    }).then(() => {
      setLoader(false);
      toast.success(
        `congratulation! ${
          selectedSchool.school
        }'s Password Has Been Resetted to ${
          selectedSchool.id
        }@${selectedSchool.gp.toLowerCase()} Successfully!`,
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
    });
  };

  const handleSchoolChange = (e) => {
    setClicked(true);
    let x = [];
    x = [...x, e.target.value !== "" ? JSON.parse(e.target.value) : ""];
    setSelectedSchool(x[0]);
    let y = x[0];
    setSelectSchoolsParticipants(
      allParticipants.filter((el) => el?.udise === y?.udise)
    );
    setFilteredData(allParticipants.filter((el) => el?.udise === y?.udise));
  };

  useEffect(() => {
    // eslint-disable-next-line
  }, [selectedSchool, filteredData, resultFilteredData, gpConvenorsData]);

  useEffect(() => {
    document.title = "AWC Sports App: GP Convenors Page";
    group = document.getElementById("group");
    event1 = document.getElementById("event1");
    event2 = document.getElementById("event2");
    if (schoolState.length === 0) {
      getSchoolData();
    } else {
      setSchoolData(schoolState);
      setConvenorsGPSchoolData(
        schoolState.filter((el) => el?.gp === teacherdetails.gp)
      );
    }
    const difference = (Date.now() - gpStudentStateUpdateTime) / 1000 / 60 / 10;
    if (difference >= 1 || gpStudentState.length === 0) {
      getAllParticipant();
    } else {
      const sorted = gpStudentState.sort(
        (a, b) =>
          a?.school?.localeCompare(b?.school) ||
          a?.gender?.localeCompare(b?.gender) ||
          a?.group?.localeCompare(b?.group) ||
          a?.event1rank - b?.event1rank
      );
      setAllParticipants(sorted);
      setFilteredGPData(sorted);
      setGpConvenorsData(sorted.filter((el) => el?.gp === teacherdetails?.gp));
    }
    const difference2 = (Date.now() - teacherUpdateTime) / 1000 / 60 / 15;
    if (teachersState.length === 0 || difference2 >= 1) {
      getTeachersData();
    } else {
      setAllTeachers(teachersState);
    }
    const difference3 =
      (Date.now() - AmtaWestCircleAllResultUpdateTime) / 1000 / 60 / 15;
    if (AmtaWestCircleAllResultState.length === 0 || difference3 >= 1) {
      getAllResult();
    } else {
      setresultFilteredData(AmtaWestCircleAllResultState);
      setShowCircleResult(true);
    }

    if (allGPAssistantsState.length === 0) {
      getAllGPAssistantsData();
    } else {
      setAllGPAssistants(allGPAssistantsState);
      setThisGpAssistance(
        allGPAssistantsState
          .filter((el) => el?.gp === teacherdetails.gp)
          .filter((el) => el?.gpAssistant === "admin")
      );
    }

    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    // eslint-disable-next-line
  }, [inputField, allParticipants, filteredData, thisGpAssistance]);

  return (
    <div className="container text-center my-5">
      {teacherdetails.circle === "admin" && (
        <div className="my-2">
          {gpStudentState.length > 0 && (
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={() => {
                createDownloadLink(gpStudentState, "gpSportsStudentData");
              }}
            >
              Download All GP Student&#8217;s Data
            </button>
          )}
          {allGPAssistantsState.length > 0 && (
            <button
              type="button"
              className="btn btn-dark m-2"
              onClick={() => {
                createDownloadLink(allGPAssistantsState, "allGPAssistants");
              }}
            >
              Download All GP Assistant&#8217;s Data
            </button>
          )}
          {AmtaWestCircleAllResultState.length > 0 && (
            <button
              type="button"
              className="btn btn-success m-2"
              onClick={() => {
                createDownloadLink(
                  AmtaWestCircleAllResultState,
                  "AmtaWestCircleAllResult"
                );
              }}
            >
              Download All Circle All Result Data
            </button>
          )}
          <button
            type="button"
            className="btn btn-info m-2"
            onClick={() => {
              createDownloadLink(teachersState, "teachers");
            }}
          >
            Download All Teacher&#8217;s Data
          </button>
        </div>
      )}
      {(teacherdetails.circle === "admin" ||
        teacherdetails.convenor === "admin" ||
        teacherdetails.gpAssistant === "admin") &&
        allParticipants.length > 0 && (
          <button
            type="button"
            className="btn p-4 btn-info m-1 btn-sm"
            onClick={() => {
              setYourStateObject({
                data: allParticipants,
                school: convenorsGPSchoolData,
              });
              navigate.push(`/GPAllStudents`);
            }}
          >
            Go To GP Sports All Student List
          </button>
        )}
      {(teacherdetails.circle === "admin" ||
        teacherdetails.convenor === "admin") && (
        <div className="my-4 mx-auto">
          {thisGpAssistance.length > 0 && (
            <div className="my-4 mx-auto col-md-4 row justify-content-center align-items-center">
              <h6 className="text-center text-primary">
                Your Current Assistants Are
              </h6>
              {thisGpAssistance.map((el, ind) => (
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
          <div className="mb-3 col-md-4">
            <select
              className="form-select"
              id="assistants"
              defaultValue={""}
              onChange={(e) => {
                setAssistantSelected(true);
                let teacher = {
                  gpAssistant: "admin",
                };
                if (e.target.value !== "") {
                  teacher = JSON.parse(e.target.value);
                  teacher = { ...teacher, gpAssistant: "admin" };
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
              {allTeachers
                .filter((el) => el?.gp === teacherdetails.gp)
                .map((el, ind) => {
                  return (
                    <option value={JSON.stringify(el)} key={ind}>
                      {el?.tname}
                    </option>
                  );
                })}
            </select>
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
                        let x = assistants.filter(
                          (elem) => el?.id !== elem?.id
                        );
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
      {allParticipants.length > 0 && showTable && (
        <div className="my-4">
          {teacherdetails.circle === "admin" && (
            <div className=" my-2 ">
              <h3 className="text-center text-primary">Select GP Name</h3>
              <button
                type="button"
                className="btn btn-success m-1 col-md-1 btn-sm"
                onClick={() => filterData("AMORAGORI")}
              >
                AMORAGORI
              </button>
              <button
                type="button"
                className="btn btn-primary m-1 col-md-1 btn-sm"
                onClick={() => filterData("BKBATI")}
              >
                BKBATI
              </button>
              <button
                type="button"
                className="btn btn-secondary m-1 col-md-1 btn-sm"
                onClick={() => filterData("GAZIPUR")}
              >
                GAZIPUR
              </button>
              <button
                type="button"
                className="btn btn-warning m-1 col-md-1 btn-sm"
                onClick={() => filterData("JHAMTIA")}
              >
                JHAMTIA
              </button>
              <button
                type="button"
                className="btn btn-info m-1 col-md-1 btn-sm"
                onClick={() => filterData("JHIKIRA")}
              >
                JHIKIRA
              </button>
              <button
                type="button"
                className="btn btn-success m-1 col-md-1 btn-sm"
                onClick={() => filterData("JOYPUR")}
              >
                JOYPUR
              </button>
              <button
                type="button"
                className="btn btn-primary m-1 col-md-1 btn-sm"
                onClick={() => filterData("NOWPARA")}
              >
                NOWPARA
              </button>
              <button
                type="button"
                className="btn btn-info m-1 col-md-1 btn-sm"
                onClick={() => filterData("THALIA")}
              >
                THALIA
              </button>
            </div>
          )}
          <h3 className="text-center text-primary">
            Displaying{" "}
            {teacherdetails.circle === "admin"
              ? gpClicked
                ? `${btnClickedGP}'s
            Participants`
                : `All School's
            Participants`
              : `${teacherdetails.gp} GP Sport's
            Participants`}
          </h3>

          <DataTable
            columns={columns}
            data={
              teacherdetails.circle === "admin"
                ? filteredGPData
                : gpConvenorsData
            }
            pagination
            highlightOnHover
            fixedHeader
          />
        </div>
      )}
      {allParticipants.length > 0 && (
        <>
          <button
            type="button"
            className="btn btn-success m-1 col-md-1 btn-sm"
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

      {(teacherdetails.circle === "admin" ||
        teacherdetails.convenor === "admin") &&
        !editClicked && (
          <div className="container ">
            <div className="col-md-4 mx-auto mb-2">
              <h4 className="text-center text-primary text-wrap">
                Select School to Show Participants of That School
              </h4>
              <select
                className="form-select"
                defaultValue={""}
                onChange={handleSchoolChange}
                aria-label="Default select example"
              >
                <option value="">Select School Name</option>
                {teacherdetails.circle === "admin"
                  ? schoolData?.map((el, ind) => {
                      return (
                        <option value={JSON.stringify(el)} key={ind}>
                          {el?.school}
                        </option>
                      );
                    })
                  : convenorsGPSchoolData?.map((el, ind) => {
                      return (
                        <option value={JSON.stringify(el)} key={ind}>
                          {el?.school}
                        </option>
                      );
                    })}
              </select>
            </div>
            {clicked &&
              selectedSchool.school !== "" &&
              selectedSchool.school !== undefined && (
                <div className="container my-4">
                  <h4 className="text-center text-primary">
                    Username: {selectedSchool.udise}
                  </h4>
                  <h4 className="text-center text-primary">
                    Default Password:{" "}
                    {selectedSchool.id + "@" + selectedSchool.gp.toLowerCase()}
                  </h4>
                  <button
                    type="button"
                    className="btn btn-danger m-1 btn-sm"
                    onClick={() => {
                      // eslint-disable-next-line
                      let confirmReset = confirm(
                        `Reset ${selectedSchool.school}'s Password to Default Password`
                      );
                      if (confirmReset) {
                        updatePassword();
                      } else {
                        toast.error(`Password Not Resetted`, {
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
                    }}
                  >
                    Reset Password
                  </button>
                  <h4 className="text-center text-primary">
                    Displaying {selectedSchool.school}'s Participants
                  </h4>
                  {selectSchoolsParticipants.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-success m-1 btn-sm"
                      onClick={() => {
                        setStateArray(selectSchoolsParticipants);
                        navigate.push(`/GPSchoolWiseStudentList`);
                      }}
                    >
                      Print List
                    </button>
                  )}
                  <div className="my-4">
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
                              let x = selectSchoolsParticipants.filter((el) => {
                                return el?.name
                                  .toLowerCase()
                                  .match(e.target.value?.toLowerCase());
                              });
                              setFilteredData(x);
                            } else {
                              setFilteredData(selectSchoolsParticipants);
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
              {/* <input
                type="text"
                className="form-control"
                placeholder="CLASS"
                value={inputField.sclass}
                onChange={(e) => {
                  setInputField({
                    ...inputField,
                    sclass: e.target.value.toUpperCase(),
                  });
                }}
                required
              /> */}
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
                    ? events.groupA?.map((el, ind) => (
                        <option value={el} key={ind}>
                          {el}
                        </option>
                      ))
                    : inputField.group === "GROUP-B"
                    ? events.groupB?.map((el, ind) => (
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
                        .map((el, ind) => (
                          <option value={el} key={ind}>
                            {el}
                          </option>
                        ))
                    : inputField.group === "GROUP-B"
                    ? events.groupB
                        .filter((el) => el !== inputField.event1)
                        .map((el, ind) => (
                          <option value={el} key={ind}>
                            {el}
                          </option>
                        ))
                    : inputField.group === "GROUP-C"
                    ? events.groupC
                        .filter((el) => el !== inputField.event1)
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
                      setInputField({
                        ...inputField,
                        updatedBy: teacherdetails.tname,
                      });
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
                    document.getElementById("stdClass").value = "";
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

      {showCircleResult && allResult.length > 0 && (
        <div className="my-4">
          <h3 className="text-center text-primary">Circle Result Section</h3>
          <div className="my-2">
            <DataTable
              columns={resultColumns}
              data={resultFilteredData}
              pagination
              highlightOnHover
              fixedHeader
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search"
                  className="w-25 form-control"
                  value={resultSearch}
                  onChange={(e) => {
                    setResultSearch(e.target.value);
                    if (e.target.value !== "") {
                      let x = allResult.filter((el) => {
                        return el?.name
                          ?.toLowerCase()
                          .match(e.target.value?.toLowerCase());
                      });
                      setresultFilteredData(x);
                    } else {
                      setresultFilteredData(allResult);
                    }
                  }}
                />
              }
              subHeaderAlign="right"
            />
          </div>
        </div>
      )}

      {loader && <Loader />}
    </div>
  );
};

export default GPConvenorsPage;
