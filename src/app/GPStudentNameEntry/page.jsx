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
  where,
} from "firebase/firestore";
import { firestore } from "../../context/FirbaseContext";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { v4 as uuid } from "uuid";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { DateValueToSring, titleCase } from "../../modules/calculatefunctions";
import {
  StdClass,
  birthday,
  events,
  maxdob,
  mindob,
} from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import axios from "axios";
const GPStudentNameEntry = () => {
  const {
    setStateArray,
    schoolState,
    setSchoolState,
    gpLockState,
    setGpLockState,
    selectedGpStudentState,
    setSelectedGpStudentState,
    setGpLockUpdateTime,
    selectedGpStudentStateUpdateTime,
    setSelectedGpStudentStateUpdateTime,
  } = useGlobalContext();
  const navigate = useRouter();
  const docId = uuid();
  const [showTable, setShowTable] = useState(true);
  let teacherdetails = {
    convenor: "",
    gp: "",
    school: "",
    circle: "",
    tname: "",
    udise: "",
  };
  let schdetails = {
    gp: "",
    school: "",
    udise: "",
  };
  let details = getCookie("tid");
  schdetails = getCookie("schid");
  if (details) {
    teacherdetails = decryptObjData("tid");
  }
  if (schdetails) {
    schdetails = decryptObjData("schid");
  }
  useEffect(() => {
    if (!details) {
      if (schdetails.udise === "") {
        navigate.push("/logout");
      }
    }
    // eslint-disable-next-line
  }, []);
  const [loader, setLoader] = useState(false);
  const [lockData, setLockData] = useState([]);
  const [gpLockData, setGpLockData] = useState({});
  const [lockStatus, setLockStatus] = useState(false);
  const [editClicked, setEditClicked] = useState(false);
  const [tawSchoolData, setTawSchoolData] = useState({
    school: "",
    gp: "",
  });
  const [selectSchoolsParticipants, setSelectSchoolsParticipants] = useState(
    []
  );
  const [inputField, setInputField] = useState({
    id: docId,
    name: "",
    gurdiansName: "",
    chestNo: "",
    birthday: birthday,
    studentId: "",
    sclass: "",
    school: tawSchoolData.school,
    gp: tawSchoolData.gp,
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

  let group;
  let event1;
  let event2;

  const [allResult, setAllResult] = useState([]);
  const [filteredResult, setFilteredResult] = useState([]);
  const [resSearch, setResSearch] = useState("");

  const [allCircleResult, setAllCircleResult] = useState([]);
  const [resultFilteredData, setresultFilteredData] = useState([]);
  const [resultSearch, setResultSearch] = useState("");
  const [showCircleResult, setShowCircleResult] = useState(false);

  const getLockData = async () => {
    const data = gpLockState;
    setLockData(data);
    let gp;
    if (teacherdetails.gp !== "") {
      gp = teacherdetails.gp;
    } else if (schdetails.gp !== "") {
      gp = schdetails.gp;
    }

    setLockStatus(data?.filter((el) => el?.gp === gp)[0]?.edit);
    // if (!data.filter((el) => el.gp === gp)[0].edit) {
    //   getAllResult();
    // }

    setGpLockData(data?.filter((el) => el?.gp === gp)[0]);
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
    setGpLockUpdateTime(Date.now());
    const docRef = doc(firestore, "gpLockData", id);
    await axios.post(`/api/updategpLockData`, x);
    await updateDoc(docRef, entry)
      .then(async () => {
        setLoader(false);
        // getLockData();
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
    await axios.post(`/api/updategpLockData`, x);
    setGpLockState(y);
    setGpLockUpdateTime(Date.now());
    const docRef = doc(firestore, "gpLockData", id);
    await updateDoc(docRef, entry)
      .then(async () => {
        setLoader(false);
        // getLockData();
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

  const getAllParticipant = async () => {
    let udise;
    if (teacherdetails.udise !== "") {
      udise = teacherdetails.udise;
    } else if (schdetails.udise !== "") {
      udise = schdetails.udise;
    }
    setLoader(true);
    const q = query(
      collection(firestore, "gpSportsStudentData"),
      where("udise", "==", udise)
    );
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
    setSelectedGpStudentState(data);
    setSelectedGpStudentStateUpdateTime(Date.now());
    setSelectSchoolsParticipants(data);
    setFilteredData(data);
    setLoader(false);

    // if (details) {
    //   setSelectSchoolsParticipants(
    //     data1.filter((el) => el.udise === teacherdetails.udise)
    //   );
    //   setFilteredData(data1.filter((el) => el.udise === teacherdetails.udise));
    // }
    // if (schdetails) {
    //   setSelectSchoolsParticipants(
    //     data1.filter((el) => el.udise === schdetails.udise)
    //   );
    //   setFilteredData(data1.filter((el) => el.udise === schdetails.udise));
    // }
  };

  const getAllResult = async () => {
    setLoader(true);
    let gp;
    if (teacherdetails.gp !== "") {
      gp = teacherdetails.gp;
    } else if (schdetails.gp !== "") {
      gp = schdetails.gp;
    }
    const q1 = query(collection(firestore, `${gp.toLowerCase()}gpresult`));
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
    setLoader(false);
    setAllResult(data1);
    setFilteredResult(data1);
  };

  const getAllCircleResult = async () => {
    setLoader(true);
    const q1 = query(collection(firestore, `AmtaWestCircleAllResult`));
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
    setLoader(false);
    setAllCircleResult(data1);
    setresultFilteredData(data1);
    setShowCircleResult(true);
  };

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
      updatedBy: tawSchoolData.id,
    };
    setSelectedGpStudentState([...selectedGpStudentState, upLoadedResult]);
    setSelectedGpStudentStateUpdateTime(Date.now());
    // await axios.post("/api/addgpSportsStudentData", upLoadedResult);
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
        school: tawSchoolData.school,
        gp: tawSchoolData.gp,
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
        `congratulation! Your Data Has Heen Saved to ${tawSchoolData.gp} GP Sports Data`
      );
      // getAllParticipant();
      setSelectSchoolsParticipants([
        ...selectSchoolsParticipants,
        upLoadedResult,
      ]);
      setFilteredData([...filteredData, upLoadedResult]);
    });
  };
  const updateData = async () => {
    setLoader(true);
    let filteredUpdatedResult = selectSchoolsParticipants.filter(
      (student) => student.id !== inputField.id
    );

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
      updatedBy: tawSchoolData.id,
    };
    let x = selectedGpStudentState.filter((item) => item.id !== inputField.id);
    x = [...x, updatedResult];
    setSelectedGpStudentState(x);
    setSelectedGpStudentStateUpdateTime(Date.now());
    // await axios.post("/api/updategpSportsStudentData", updatedResult);
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
        school: tawSchoolData.school,
        gp: tawSchoolData.gp,
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
        `congratulation! Your Data Has Heen Saved to ${tawSchoolData.gp} GP Sports Data`
      );
      // getAllParticipant();
      setSelectSchoolsParticipants([...filteredUpdatedResult, updatedResult]);
      setFilteredData([...filteredUpdatedResult, updatedResult]);
    });
  };
  const deleteParticipant = async (participant) => {
    setLoader(true);
    try {
      await axios.post("api/delgpSportsStudentData", participant.id);
      await deleteDoc(
        doc(firestore, "gpSportsStudentData", participant.id)
      ).then(() => {
        setLoader(false);
        let filteredUpdatedResult = selectSchoolsParticipants.filter(
          (student) => student.id !== participant.id
        );
        setSelectSchoolsParticipants(filteredUpdatedResult);
        setFilteredData(filteredUpdatedResult);
        setSelectedGpStudentState(
          selectedGpStudentState.filter((item) => item.id !== participant.id)
        );
        setSelectedGpStudentStateUpdateTime(Date.now());
        toast.success("Participant Deleted Successfully");
      });
    } catch (e) {
      setLoader(false);
      console.error(e);
      toast.error("Participant Deletable Error");
    }
  };

  const columns = [
    {
      name: "Sl",
      selector: (row, index) =>
        selectedGpStudentState.findIndex((i) => i.id === row?.id) + 1,
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
                setTimeout(() => {
                  let gender = document.getElementById("gender");
                  let group = document.getElementById("group");
                  let element1 = document.getElementById("event1");
                  let element2 = document.getElementById("event2");
                  if (gender) {
                    gender.value = row.gender;
                    group.value = row.group;
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
        ) : (
          <h6 className="text-center text-danger">Closed</h6>
        ),
      wrap: true,
    },
  ];

  const resultColumns = [
    {
      name: "Sl",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Chest No.",
      selector: (row, index) => row.chestNo,
      sortable: true,
    },

    {
      name: "Participants Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },

    {
      name: "Class",
      selector: (row) => row.sclass,
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
      selector: (row) => row.event1 + ", " + row.position1,
      sortable: true,
      wrap: true,
    },
    {
      name: "Event 2",
      selector: (row) =>
        row.event2 !== "" ? row.event2 + ", " + row.position2 : "",
      sortable: true,
      wrap: true,
    },
  ];

  const resultCircleColumns = [
    {
      name: "Sl",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Chest No.",
      selector: (row, index) => row.chestNo,
      sortable: true,
    },

    {
      name: "Participants Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },

    {
      name: "Class",
      selector: (row) => row.sclass,
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
      selector: (row) => row.event1 + ", " + row.position1,
      sortable: true,
      wrap: true,
    },
    {
      name: "Event 2",
      selector: (row) =>
        row.event2 !== "" ? row.event2 + ", " + row.position2 : "",
      sortable: true,
      wrap: true,
    },
  ];

  const sortForSchool = (data) => {
    let udise;
    if (teacherdetails.udise !== "") {
      udise = teacherdetails.udise;
    } else if (schdetails.udise !== "") {
      udise = schdetails.udise;
    }
    const sorted = selectedGpStudentState
      .filter((el) => el?.udise === udise)
      .sort((b, a) => b?.event1rank - a?.event1rank);
    setSelectSchoolsParticipants(sorted);
    setFilteredData(sorted);
  };

  useEffect(() => {
    group = document.getElementById("group");
    event1 = document.getElementById("event1");
    event2 = document.getElementById("event2");

    // getAllCircleResult();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getLockData();

    if (teacherdetails.udise !== "") {
      setTawSchoolData(
        schoolState.filter((el) => el.udise === teacherdetails.udise)[0]
      );
    } else if (schdetails.udise !== "") {
      setTawSchoolData(
        schoolState.filter((el) => el.udise === schdetails.udise)[0]
      );
    }

    const difference =
      (Date.now() - selectedGpStudentStateUpdateTime) / 1000 / 60 / 10;
    if (difference >= 1 || selectedGpStudentState.length === 0) {
      getAllParticipant();
    } else {
      sortForSchool(selectedGpStudentState);
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.title = `AWC Sports App: ${tawSchoolData.gp} Students Name Entry`;
    // eslint-disable-next-line
  }, [tawSchoolData]);
  useEffect(() => {
    // eslint-disable-next-line
  }, [
    selectSchoolsParticipants,
    inputField,
    docId,
    allResult,
    filteredResult,
    inpGrSelected,
    firstEventSelected,
    filteredData,
  ]);
  // useEffect(() => {
  //   const result = selectSchoolsParticipants.filter((el) => {
  //     return el.name.toLowerCase().match(search.toLowerCase());
  //   });
  //   setFilteredData(result);

  //   // eslint-disable-next-line
  // }, [search]);
  // useEffect(() => {
  //   const gpresult = allResult.filter((el) => {
  //     return el.name.toLowerCase().match(resSearch.toLowerCase());
  //   });
  //   setFilteredResult(gpresult);
  //   // eslint-disable-next-line
  // }, [resSearch]);

  // useEffect(() => {
  //   const result = allCircleResult.filter((el) => {
  //     return el.name.toLowerCase().match(resultSearch.toLowerCase());
  //   });
  //   setresultFilteredData(result);

  //   // eslint-disable-next-line
  // }, [resultSearch]);

  return (
    <div className="container text-center my-5">
      {selectSchoolsParticipants.length > 0 && showTable && (
        <div className="my-4">
          <h3 className="text-center text-primary">
            Displaying School's Participants
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
                  if (e.target.value !== "") {
                    let x = selectSchoolsParticipants.filter((el) => {
                      return el.name
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
      )}
      {selectSchoolsParticipants.length > 0 && (
        <button
          type="button"
          className="btn btn-info m-1 btn-sm"
          onClick={() => {
            setStateArray(selectSchoolsParticipants);
            navigate.push(`/GPSchoolWiseStudentList`);
          }}
        >
          Print List
        </button>
      )}
      {selectSchoolsParticipants.length > 0 && (
        <button
          type="button"
          className="btn btn-success m-1 col-md-1 btn-sm"
          onClick={() => setShowTable(!showTable)}
        >
          {showTable ? "HIDE LIST" : "SHOW LIST"}
        </button>
      )}
      {(teacherdetails.circle === "admin" ||
        teacherdetails.convenor === "admin") && (
        <>
          {lockStatus ? (
            <button
              type="button"
              className="btn btn-danger m-1 btn-sm"
              onClick={() => {
                let id = lockData.filter((el) => el.gp === teacherdetails.gp)[0]
                  .id;
                closeLockForEntry(id);
              }}
            >
              Close Student Entry
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary m-1 btn-sm"
              onClick={() => {
                let id = lockData.filter((el) => el.gp === teacherdetails.gp)[0]
                  .id;
                openLockForEntry(id);
              }}
            >
              Open Student Entry
            </button>
          )}
        </>
      )}
      {lockStatus ? (
        <div className="container">
          <h4 className="text-center text-primary">
            Students Name Entry for {titleCase(tawSchoolData.gp)} GP Sports
          </h4>
          <h4 className="text-center text-primary">
            Your School is {titleCase(tawSchoolData.school)}
          </h4>
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
                    school: tawSchoolData.school,
                    gp: tawSchoolData.gp,
                    udise: tawSchoolData.udise,
                    entryBy: tawSchoolData.id,
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
                        let event1rank = "";
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
                        let event2rank = "";
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
                          id: docId,
                          name: "",
                          gurdiansName: "",
                          chestNo: "",
                          birthday: birthday,
                          studentId: "",
                          sclass: "",
                          school: tawSchoolData.school,
                          gp: tawSchoolData.gp,
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
                        document.getElementById("birthday").value = birthday;
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
      ) : (
        gpLockData.closeDate !== undefined && (
          <h6 className="text-center text-danger my-4">
            {tawSchoolData.gp} GP Sports Student Entry & Edit Closed By{" "}
            {gpLockData.entryCloseddBy} at{" "}
            {DateValueToSring(gpLockData.closeDate)}
          </h6>
        )
      )}

      {/* {allResult.length > 0 && (
        <div className="my-4">
          <h3 className="text-center text-primary">
            Displaying {tawSchoolData.gp} GP Sports Result
          </h3>

          <DataTable
            columns={resultColumns}
            data={filteredResult}
            pagination
            highlightOnHover
            fixedHeader
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search"
                className="w-25 form-control"
                value={resSearch}
                onChange={(e) => setResSearch(e.target.value)}
              />
            }
            subHeaderAlign="right"
          />
        </div>
      )}
      {showCircleResult && allCircleResult.length > 0 && (
        <div className="my-4">
          <h3 className="text-center text-primary">Circle Result Section</h3>
          <div className="my-2">
            <DataTable
              columns={resultCircleColumns}
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
                  onChange={(e) => setResultSearch(e.target.value)}
                />
              }
              subHeaderAlign="right"
            />
          </div>
        </div>
      )} */}
      {loader && <Loader />}
    </div>
  );
};

export default GPStudentNameEntry;
