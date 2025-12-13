"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "react-data-table-component";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../context/FirbaseContext";
import { useGlobalContext } from "../../context/Store";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../components/Loader";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  BUTTONCOLORS,
  StdClass,
  birthday,
  events,
  gpEngNames,
  maxdob,
  mindob,
} from "../../modules/constants";
import {
  createDownloadLink,
  DateValueToString,
  getCurrentDateInput,
  getSubmitDateInput,
  removeDuplicates,
} from "../../modules/calculatefunctions";
import SCHOOLS from "../../helpers/schools.json";
import dynamic from "next/dynamic";
import GPSchoolStudentList from "../../pdf/GPSchoolStudentList";
const GPConvenorsPage = () => {
  const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    }
  );
  const {
    setStateArray,
    setYourStateObject,
    gpStudentState,
    schoolState,
    teachersState,
    setTeachersState,
    setGpStudentState,
    AmtaWestCircleAllResultState,
    setAmtaWestCircleAllResultState,
    allGPAssistantsState,
    setAllGPAssistantsState,
    gpSportsDateState,
    setGpSportsDateState,
    gpLockState,
    setGpLockState,
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
          console.log(teacherdetails.circle);
          navigate.push("/Login");
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
  const [selectedGP, setSelectedGP] = useState("");
  const [showDateSection, setShowDateSection] = useState(false);
  const [gpSpDate, setGpSpDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [inpGrSelected, setInpGrSelected] = useState(false);
  const [firstEventSelected, setFirstEventSelected] = useState(false);
  const [convenorsGPSchoolData, setConvenorsGPSchoolData] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [loader, setLoader] = useState(false);
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
  const [schFilterClicked, setSchFilterClicked] = useState(false);
  const [filteredSchData, setFilteredSchData] = useState([]);
  const [lockStatus, setLockStatus] = useState(false);
  const [lockData, setLockData] = useState([]);
  const [gpLockData, setGpLockData] = useState({
    entryDate: 1708313683517,
    gp: "",
    edit: true,
    entryStaredBy: "",
    entryCloseddBy: "",
    id: "0eb11c9f-ca67-4388-b4f6-61aa5b646d9b-0",
    closeDate: 1728288554977,
  });
  const [showDld, setShowDld] = useState(false);
  const getSchoolData = async () => {
    setFilteredSchData(SCHOOLS);
    setConvenorsGPSchoolData(
      SCHOOLS?.filter((el) => el?.gp === teacherdetails.gp)
    );
  };
  const getLockData = async (gp) => {
    setLockData(gpLockState);
    setLockStatus(
      gpLockState?.filter((el) => el?.gp === (gp || selectedGP))[0]?.edit
    );
    setGpLockData(
      gpLockState?.filter((el) => el?.gp === (gp || selectedGP))[0]
    );
  };
  const getTeachersData = async () => {
    setAllTeachers(teachersState);
    setTeachersState(teachersState);
  };

  const getAllGPAssistantsData = async () => {
    const gpAssistants = teachersState.filter(
      (teacher) => teacher.gpAssistant === "admin"
    );
    setAllGPAssistantsState(gpAssistants);
    setAllGPAssistants(gpAssistants);
    setThisGpAssistance(
      gpAssistants
        .filter((el) => el?.gp === teacherdetails.gp)
        .filter((el) => el?.gpAssistant === "admin")
    );
  };
  const getAllResult = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "AmtaWestCircleAllResult"))
    );
    const data = querySnapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => {
        if (a.gp < b.gp) return -1;
        if (a.gp > b.gp) return 1;
        if (a.gender < b.gender) return -1;
        if (a.gender > b.gender) return 1;
        if (a.event1rank < b.event1rank) return -1;
        if (a.event1rank > b.event1rank) return 1;
        return 0;
      });
    setLoader(false);
    setAmtaWestCircleAllResultState(data);
    setAllResult(data);
    setresultFilteredData(data);
    setShowCircleResult(true);
  };
  const updateAssistantData = async () => {
    let all = allGPAssistantsState;
    setLoader(true);
    const gpAssistantUpdateNteacherUpdate = allGPAssistants
      .filter((el) => el?.gp === teacherdetails.gp)
      .map(async (el) => {
        let x = teachersState.filter((item) => item.id === el?.id)[0];
        x.gpAssistant = "taw";
        let y = teachersState.filter((item) => item.id !== el?.id);
        y = [...y, x];
        setTeachersState(y);
        let z = allGPAssistantsState.filter((item) => item.id !== el?.id);
        setAllGPAssistantsState(z);
        setAllGPAssistants(z);
        setThisGpAssistance(
          z
            .filter((el) => el?.gp === teacherdetails.gp)
            .filter((el) => el?.gpAssistant === "admin")
        );

        await updateDoc(doc(firestore, "teachers", el?.id), {
          gpAssistant: "taw",
        }).catch((e) => console.log(e));
      });
    await Promise.all(gpAssistantUpdateNteacherUpdate).then(async () => {
      const createGpAssistantNupdateTeacherData = assistants.map(
        async (el, ind) => {
          let x = teachersState.filter((item) => item.id === el?.id)[0];
          x.gpAssistant = "admin";
          let y = teachersState.filter((item) => item.id !== el?.id);
          y = [...y, x];
          setTeachersState(y);
          all = [...all, x];
          const docRef = doc(firestore, "teachers", el?.id);
          await updateDoc(docRef, {
            gpAssistant: "admin",
          });
        }
      );
      await Promise.all(createGpAssistantNupdateTeacherData).then(async () => {
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

    setAllGPAssistantsState(
      allGPAssistantsState.filter((item) => item?.id !== el?.id)
    );
    await updateDoc(doc(firestore, "teachers", el?.id), {
      gpAssistant: "taw",
    })
      .then(async () => {
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
      })
      .catch((e) => console.log(e));
  };

  const getAllParticipant = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "gpSportsStudentData"))
    );
    const data = querySnapshot.docs
      .map((doc) => doc.data())
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
    setAllParticipants(data);
    setFilteredGPData(data);
    setGpConvenorsData(data.filter((el) => el?.gp === teacherdetails.gp));
    setLoader(false);
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
      setGpStudentState(
        gpStudentState.filter((item) => item.id !== participant.id)
      );
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
            className="btn btn-success m-1"
            style={{ width: "auto" }}
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
            className="btn btn-danger m-1"
            style={{ width: "auto" }}
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
    setSelectedGP(gp);
    const spDate = gpSportsDateState.filter((item) => item.gp === gp)[0].date;
    setGpSpDate(spDate);
    getLockData(gp);
  };

  const updateGPDate = async () => {
    setLoader(true);
    let x = gpSportsDateState.map((item) => {
      if (item.gp === selectedGP) {
        item.date = gpSpDate;
      }
      return item;
    });
    setGpSportsDateState(x);
    const docRef = doc(firestore, "gpSportsDate", selectedGP);
    await updateDoc(docRef, { date: gpSpDate })
      .then(() => {
        setLoader(false);
        toast.success(`GP Sports Date Updated Successfully`);
        setShowDateSection(false);
      })
      .catch((e) => {
        console.log(e);
        setLoader(false);
        toast.error("GP Sports Date Not Updated");
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
  const openLockForEntry = async (id) => {
    setLoader(true);
    const entry = {
      edit: true,
      entryDate: Date.now(),
      closeDate: "",
      entryStaredBy: teacherdetails.tname,
    };
    let x = gpLockState.filter((item) => item?.id === id)[0];
    x.edit = true;
    x.entryDate = Date.now();
    x.closeDate = "";
    x.entryStaredBy = teacherdetails.tname;
    let y = gpLockState.filter((item) => item?.id !== id);
    y = [...y, x];
    setGpLockState(y);
    const docRef = doc(firestore, "gpLockData", id);
    await updateDoc(docRef, entry)
      .then(async () => {
        setLoader(false);
        setLockStatus(true);
        toast.success(
          `congratulation! Student Entry Open For ${teacherdetails.gp} GP Sports Data`,
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
  const closeLockForEntry = async (id) => {
    setLoader(true);

    const entry = {
      edit: false,
      closeDate: Date.now(),
      entryCloseddBy: teacherdetails.tname,
    };
    let x = gpLockState.filter((item) => item?.id === id)[0];
    x.edit = false;
    x.closeDate = "";
    x.entryCloseddBy = teacherdetails.tname;
    let y = gpLockState.filter((item) => item?.id !== id);
    y = [...y, x];
    setGpLockState(y);
    const docRef = doc(firestore, "gpLockData", id);
    await updateDoc(docRef, entry)
      .then(async () => {
        setLoader(false);
        setLockStatus(false);
        toast.success(
          `congratulation! Student Entry Closed For ${teacherdetails.gp} GP Sports Data`,
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

  useEffect(() => {
    // eslint-disable-next-line
  }, [
    selectedSchool,
    filteredData,
    resultFilteredData,
    gpConvenorsData,
    gpLockData,
  ]);

  useEffect(() => {
    document.title = "AWC Sports App: GP Convenors Page";
    group = document.getElementById("group");
    event1 = document.getElementById("event1");
    event2 = document.getElementById("event2");
    if (schoolState.length === 0) {
      getSchoolData();
    } else {
      setFilteredSchData(schoolState);
      setConvenorsGPSchoolData(
        schoolState.filter((el) => el?.gp === teacherdetails.gp)
      );
    }

    if (gpStudentState.length === 0) {
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

    getTeachersData();

    if (AmtaWestCircleAllResultState.length === 0) {
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
    setSelectedGP(teacherdetails?.gp);
    filterData(teacherdetails?.gp);
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    // eslint-disable-next-line
  }, [inputField, allParticipants, filteredData, thisGpAssistance]);
  useEffect(() => {
    getLockData(selectedGP);
    // eslint-disable-next-line
  }, [selectedGP]);
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
        teacherdetails.circleAssistant === "admin" ||
        teacherdetails.convenor === "admin" ||
        teacherdetails.gpAssistant === "admin") &&
        selectedGP && (
          <button
            type="button"
            className={`btn btn-${lockStatus ? "danger" : "success"} m-1`}
            style={{ width: "auto" }}
            onClick={() => {
              let id = lockData.filter((el) => el.gp === selectedGP)[0].id;
              lockStatus ? closeLockForEntry(id) : openLockForEntry(id);
            }}
          >
            {lockStatus
              ? `Close ${selectedGP} GP Student Entry`
              : `Open ${selectedGP} GP Student Entry`}
          </button>
        )}
      {!lockStatus && gpLockData?.closeDate !== undefined && (
        <h6 className="text-danger">
          {selectedGP} GP Sports Student Entry & Edit Closed By{" "}
          {gpLockData?.entryCloseddBy} at{" "}
          {DateValueToString(gpLockData?.closeDate)}
        </h6>
      )}
      {(teacherdetails.circle === "admin" ||
        teacherdetails.circleAssistant === "admin" ||
        teacherdetails.convenor === "admin" ||
        teacherdetails.gpAssistant === "admin") &&
        selectedGP &&
        allParticipants.length > 0 && (
          <button
            type="button"
            className="btn p-4 btn-info m-1"
            style={{ width: "auto" }}
            onClick={() => {
              setYourStateObject({
                data: allParticipants,
                school: convenorsGPSchoolData,
                gp: selectedGP,
              });
              navigate.push(`/GPAllStudents`);
            }}
          >
            {`Go To ${selectedGP} GP Sports All Student List`}
          </button>
        )}
      {(teacherdetails.circle === "admin" ||
        teacherdetails.circleAssistant === "admin") && (
        <div>
          <p className="text-success">
            Click on any Filter Button to show that GP's Convenor's Page
          </p>
          {gpEngNames.map((el, ind) => (
            <button
              type="button"
              className="btn m-2"
              style={{
                backgroundColor: BUTTONCOLORS[ind],
                color: "white",
                width: "auto",
              }}
              key={ind}
              onClick={() => {
                filterData(el);
                setSchFilterClicked(true);
                const GPSchools = schoolState.filter(
                  (student) => student.gp === el
                );
                setFilteredSchData(GPSchools);
                const firstGPSchool = GPSchools[0];
                document.getElementById("schNames").value =
                  JSON.stringify(firstGPSchool);
              }}
            >
              {el}
            </button>
          ))}
        </div>
      )}
      <h4 className="text-primary m-3">
        {selectedGP && gpSpDate && `${selectedGP} GP Sports Date is `}
        {gpSpDate}
      </h4>
      {(teacherdetails.circle === "admin" ||
        teacherdetails.circleAssistant === "admin" ||
        teacherdetails.convenor === "admin" ||
        teacherdetails.gpAssistant === "admin") &&
        selectedGP && (
          <div className="m-2 mx-auto">
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setShowDateSection(!showDateSection)}
            >
              Set GP Sports Date
            </button>
            {showDateSection && (
              <div className="my-4 mx-auto col-md-6 ">
                <input
                  type="date"
                  className="form-control"
                  id="gpSportsDate"
                  placeholder="Select GP Sports Date"
                  value={getCurrentDateInput(gpSpDate)}
                  onChange={(e) => {
                    setGpSpDate(getSubmitDateInput(e.target.value));
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary m-2"
                  onClick={updateGPDate}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger m-2"
                  onClick={() => {
                    setGpSpDate(
                      gpSportsDateState.filter(
                        (item) => item.gp === selectedGP
                      )[0].date
                    );
                    setShowDateSection(false);
                  }}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
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
                    className="btn btn-danger"
                    style={{ width: "auto" }}
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
                      className="btn btn-danger"
                      style={{ width: "auto" }}
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
                className="btn btn-success"
                style={{ width: "auto" }}
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

      {(teacherdetails.circle === "admin" ||
        teacherdetails.convenor === "admin") &&
        !editClicked && (
          <div className="container ">
            {teacherdetails.circle === "admin" && (
              <div className="my-3">
                <div className="my-1">
                  <h6 className="text-primary">
                    Select GP Name to Filter Participants
                  </h6>
                  <button
                    type="button"
                    className="btn btn-success m-1 col-md-1 btn-sm"
                    style={{ width: "auto" }}
                    onClick={() => {
                      setSchFilterClicked(true);
                      const GPSchools = schoolState.filter(
                        (student) => student.gp === "AMORAGORI"
                      );
                      setFilteredSchData(GPSchools);
                      const firstGPSchool = GPSchools[0];
                      document.getElementById("schNames").value =
                        JSON.stringify(firstGPSchool);
                    }}
                  >
                    AMORAGORI
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary m-1 col-md-1 btn-sm"
                    style={{ width: "auto" }}
                    onClick={() => {
                      setSchFilterClicked(true);
                      const GPSchools = schoolState.filter(
                        (student) => student.gp === "BKBATI"
                      );
                      setFilteredSchData(GPSchools);
                      const firstGPSchool = GPSchools[0];
                      document.getElementById("schNames").value =
                        JSON.stringify(firstGPSchool);
                    }}
                  >
                    BKBATI
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary m-1 col-md-1 btn-sm"
                    style={{ width: "auto" }}
                    onClick={() => {
                      setSchFilterClicked(true);
                      const GPSchools = schoolState.filter(
                        (student) => student.gp === "GAZIPUR"
                      );
                      setFilteredSchData(GPSchools);
                      const firstGPSchool = GPSchools[0];
                      document.getElementById("schNames").value =
                        JSON.stringify(firstGPSchool);
                    }}
                  >
                    GAZIPUR
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning m-1 col-md-1 btn-sm"
                    style={{ width: "auto" }}
                    onClick={() => {
                      setSchFilterClicked(true);
                      const GPSchools = schoolState.filter(
                        (student) => student.gp === "JHAMTIA"
                      );
                      setFilteredSchData(GPSchools);
                      const firstGPSchool = GPSchools[0];
                      document.getElementById("schNames").value =
                        JSON.stringify(firstGPSchool);
                    }}
                  >
                    JHAMTIA
                  </button>
                  <button
                    type="button"
                    className="btn btn-info m-1 col-md-1 btn-sm"
                    style={{ width: "auto" }}
                    onClick={() => {
                      setSchFilterClicked(true);
                      const GPSchools = schoolState.filter(
                        (student) => student.gp === "JHIKIRA"
                      );
                      setFilteredSchData(GPSchools);
                      const firstGPSchool = GPSchools[0];
                      document.getElementById("schNames").value =
                        JSON.stringify(firstGPSchool);
                    }}
                  >
                    JHIKIRA
                  </button>
                  <button
                    type="button"
                    className="btn btn-success m-1 col-md-1 btn-sm"
                    style={{ width: "auto" }}
                    onClick={() => {
                      setSchFilterClicked(true);
                      const GPSchools = schoolState.filter(
                        (student) => student.gp === "JOYPUR"
                      );
                      setFilteredSchData(GPSchools);
                      const firstGPSchool = GPSchools[0];
                      document.getElementById("schNames").value =
                        JSON.stringify(firstGPSchool);
                    }}
                  >
                    JOYPUR
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary m-1 col-md-1 btn-sm"
                    style={{ width: "auto" }}
                    onClick={() => {
                      setSchFilterClicked(true);
                      const GPSchools = schoolState.filter(
                        (student) => student.gp === "NOWPARA"
                      );
                      setFilteredSchData(GPSchools);
                      const firstGPSchool = GPSchools[0];
                      document.getElementById("schNames").value =
                        JSON.stringify(firstGPSchool);
                    }}
                  >
                    NOWPARA
                  </button>
                  <button
                    type="button"
                    className="btn btn-info m-1 col-md-1 btn-sm"
                    style={{ width: "auto" }}
                    onClick={() => {
                      setSchFilterClicked(true);
                      const GPSchools = schoolState.filter(
                        (student) => student.gp === "THALIA"
                      );
                      setFilteredSchData(GPSchools);
                      const firstGPSchool = GPSchools[0];
                      document.getElementById("schNames").value =
                        JSON.stringify(firstGPSchool);
                    }}
                  >
                    THALIA
                  </button>
                </div>
                {schFilterClicked && (
                  <div className="my-1">
                    <button
                      type="button"
                      className="btn btn-danger m-1 col-md-1 btn-sm"
                      style={{ width: "auto" }}
                      onClick={() => {
                        setSchFilterClicked(false);
                        setFilteredSchData(schoolState);
                        document.getElementById("schNames").value = "";
                      }}
                    >
                      Show All GP
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="col-md-4 mx-auto mb-2">
              <h4 className="text-center text-primary text-wrap">
                Select School to Show Participants of That School
              </h4>
              <select
                className="form-select"
                id="schNames"
                defaultValue={""}
                onChange={handleSchoolChange}
                aria-label="Default select example"
              >
                <option value="">Select School Name</option>
                {teacherdetails.circle === "admin"
                  ? filteredSchData?.map((el, ind) => {
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
                    Displaying {selectedSchool.school}'s Participants
                  </h4>
                  {selectSchoolsParticipants.length > 0 && (
                    <div>
                      <button
                        type="button"
                        className="btn btn-success m-1"
                        style={{ width: "auto" }}
                        onClick={() => {
                          setStateArray(selectSchoolsParticipants);
                          navigate.push(`/GPSchoolWiseStudentList`);
                        }}
                      >
                        Print List
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary m-1 btn-sm"
                        onClick={() => setShowDld(!showDld)}
                      >
                        {showDld ? "Hide Download" : "Download List"}
                      </button>
                      {showDld && (
                        <div className="my-4">
                          <PDFDownloadLink
                            document={
                              <GPSchoolStudentList
                                studentData={selectSchoolsParticipants}
                                gp={selectSchoolsParticipants[0].gp}
                                school={selectSchoolsParticipants[0].school}
                              />
                            }
                            fileName={`${selectSchoolsParticipants[0].school} GP Sports Student List.pdf`}
                            style={{
                              textDecoration: "none",
                              padding: "10px",
                              color: "#fff",
                              backgroundColor: "navy",
                              border: "1px solid #4a4a4a",
                              width: "40%",
                              borderRadius: 10,
                              margin: 20,
                              textAlign: "center",
                            }}
                          >
                            {({ blob, url, loading, error }) =>
                              loading ? "Loading..." : "Download Student List"
                            }
                          </PDFDownloadLink>
                          {/* <GPSchoolStudentList
                                  studentData={selectSchoolsParticipants}
                                  gp={tawSchoolData.gp}
                                  school={tawSchoolData.school}
                                  udise={tawSchoolData.udise}
                                /> */}
                        </div>
                      )}
                    </div>
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
