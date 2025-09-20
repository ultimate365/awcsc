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
import { v4 as uuid } from "uuid";
import SCHOOLS from "../../helpers/schools.json";
export default function CircleSportsDirectNameEntry() {
  const {
    setStateObject,
    setStateArray,
    gpLockState,
    setGpLockState,
    setGpLockUpdateTime,
    convenorsState,
    setConvenorsState,
    setGpStudentState,
    setCircleStudentState,
    setConvenorsUpdateTime,
    teachersState,
    setTeachersState,
    teacherUpdateTime,
    setTeacherUpdateTime,
    schoolState,
    allGPFirstsState,
    setAllGPFirstsState,
    allGPFirstsStateUpdateTime,
    setAllGPFirstsStateUpdateTime,
    circleAssistantState,
    setCircleAssistantState,
    circleLockState,
    setCircleLockState,
    circleLockUpdateTime,
    setCircleLockUpdateTime,
  } = useGlobalContext();
  const navigate = useRouter();
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
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState({
    id: "",
    school: "",
    udise: "",
    gp: "",
    year: 2025,
    hoi: "",
  });
  const [teacher, setTeacher] = useState({
    id: "",
    convenor: "",
    gp: "",
    school: "",
    circle: "",
    tname: "",
  });

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
    setAllGPFirstsStateUpdateTime(Date.now());
    setGpConvenorsData(data1.filter((el) => el?.gp === teacherdetails.gp));

    setLoader(false);
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
          const data = response.data?.data?.sort((a, b) =>
            a?.tname.localeCompare(b?.tname)
          );
          setLoader(false);
          setAllTeachers(data);
          setTeachersState(data);
          setTeacherUpdateTime(Date.now());
        })
        .catch((error) => {
          setLoader(false);
          console.error("Error fetching Result data: ", error);
        });
      console.log(error);
    }
  };
  const getAllCircleAssistantsData = async () => {
    const q = query(collection(firestore, "allCircleAssistants"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      // id: doc.id,
    }));
    setAllCircleAssistants(data);
    setCircleAssistantState(data);
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
      updatedBy: teacher.id,
    };
    setAllGPFirstsState([...allGPFirstsState, upLoadedResult]);
    setAllGPFirstsStateUpdateTime(Date.now());
    setAllParticipants([...allGPFirstsState, upLoadedResult]);
    setFilteredGPData([...allGPFirstsState, upLoadedResult]);
    setGpConvenorsData(
      [...allGPFirstsState, upLoadedResult].filter(
        (el) => el?.gp === teacherdetails.gp
      )
    );
    // await axios.post("/api/addallGPFirsts", upLoadedResult);
    await setDoc(
      doc(firestore, "allGPFirsts", inputField.id),
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
        `congratulation! Your Data Has Heen Saved to Circle Sports Data`
      );
    });
  };

  const updateData = async () => {
    setLoader(true);
    const newData = allGPFirstsState.map((item) =>
      item.id === inputField.id ? inputField : item
    );
    setAllGPFirstsState(newData);
    setAllGPFirstsStateUpdateTime(Date.now());
    // await axios.post("/api/updateallGPFirsts", inputField);
    const docRef = doc(firestore, "allGPFirsts", inputField.id);
    await updateDoc(docRef, inputField)
      .then(async () => {
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
        const newData = allGPFirstsState.map((item) =>
          item.id === inputField.id ? upLoadedResult : item
        );
        setAllGPFirstsState(newData);
        setAllGPFirstsStateUpdateTime(Date.now());
        setAllParticipants(newData);
        setFilteredGPData(newData);
        setLoader(false);
        setInputField({
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
        document.getElementById("gender").value = "";
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
          setAllGPFirstsStateUpdateTime(Date.now());
          setAllParticipants(x);
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
    let circleAssistantsUpdateNteacherUpdate = allCircleAssistants
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
            all = all.pop((item) => item.id === el?.id);
            // await axios.post("/api/delallCircleAssistants", {
            //   id: el?.id,
            // });
            await deleteDoc(doc(firestore, "allCircleAssistants", el?.id));
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
      let createCircleAssistantNupdateTeacherData = assistants.map(
        async (el, ind) =>
          await setDoc(doc(firestore, "allCircleAssistants", el?.id), el).then(
            async () => {
              // await axios.post("/api/updTeacherConvenor", {
              //   id: el?.id,
              //   circleAssistant: "admin",
              // });
              // await axios.post("/api/addallGPAssistants", el);
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
          )
      );
      await Promise.all(createCircleAssistantNupdateTeacherData).then(
        async () => {
          setTeacherUpdateTime(Date.now());
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
    setTeacherUpdateTime(Date.now());
    // await axios.post("/api/updTeacherConvenor", {
    //   id: el?.id,
    //   circleAssistant: "taw",
    // });
    // await axios.post("/api/delallCircleAssistants", {
    //   id: el?.id,
    // });
    setCircleAssistantState(
      circleAssistantState.filter((item) => item?.id !== el?.id)
    );
    await updateDoc(doc(firestore, "teachers", el?.id), {
      circleAssistant: "taw",
    })
      .then(async () => {
        await deleteDoc(doc(firestore, "allCircleAssistants", el?.id));
        try {
          await updateDoc(doc(firestore, "sportsUsers", el?.id), {
            circleAssistant: "taw",
          }).then(() => {
            // getTeachersData();
            // getAllCircleAssistantsData();
            setLoader(false);
            toast.success("Assistant Removed");
          });
        } catch (e) {
          // console.log(e);
          // getTeachersData();
          // getAllCircleAssistantsData();
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
        allGPFirstsState.findIndex((i) => i.id === row?.id) + 1,
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
      selector: (row) => (
        <div>
          <button
            type="button"
            className="btn btn-success m-1 btn-sm"
            onClick={() => {
              console.log(row);
              setInputField(row);
              setSelectedGP(row.gp);

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
                  element4.value = JSON.stringify(fdS);
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
      ),

      wrap: true,
    },
  ];
  useEffect(() => {
    document.title = "AWC Sports App: Circle Convenors Page";
    group = document.getElementById("group");
    event1 = document.getElementById("event1");
    event2 = document.getElementById("event2");

    setConvenorsGPSchoolData(
      schoolState.filter((el) => el?.gp === teacherdetails.gp)
    );

    const difference = (Date.now() - teacherUpdateTime) / 1000 / 60 / 15;
    if (difference >= 1 || teachersState.length === 0) {
      getTeachersData();
    } else {
      setAllTeachers(teachersState);
    }
    const AllParticipantdifference =
      (Date.now() - allGPFirstsStateUpdateTime) / 1000 / 60 / 10;
    if (AllParticipantdifference >= 1 || allGPFirstsState.length === 0) {
      getAllParticipant();
    } else {
      setAllParticipants(allGPFirstsState);
      setFilteredGPData(allGPFirstsState);
      setGpConvenorsData(
        allGPFirstsState.filter((el) => el?.gp === teacherdetails.gp)
      );
    }
    if (circleAssistantState.length === 0) {
      getAllCircleAssistantsData();
    }
  }, []);
  useEffect(() => {
    setTeacher(teacherdetails);
    if (teacherdetails.circle !== "admin") {
      if (teacherdetails.convenor !== "admin") {
        if (teacherdetails.circleAssistant !== "admin") {
          navigate.push("/");
        }
      }
    }

    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    // eslint-disable-next-line
  }, [selectedSchool]);
  const waitForSomeTime = async () => {
    // Simulate a delay
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };
  const filterData = (gp) => {
    setBtnClickedGP(`${gp}`);
    setFilteredGPData(allParticipants.filter((el) => el?.gp === gp));
  };

  return (
    <div className="container text-center my-3">
      {loader && <Loader />}
      <DataTable
        columns={columns}
        data={filteredGPData}
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
                let x = allGPFirstsState.filter((el) => {
                  return el.name
                    .toLowerCase()
                    .match(e.target.value?.toLowerCase());
                });
                setFilteredGPData(x);
              } else {
                setFilteredGPData(allGPFirstsState);
              }
            }}
          />
        }
        subHeaderAlign="right"
      />
      <h3 className="text-primary my-3">
        Circle Sports Students Direct Name Entry Section
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
              setFilteredSchools(SCHOOLS.filter((s) => s.gp === gpEngName));
              setSelectedSchool({
                id: "",
                school: "",
                udise: "",
                gp: "",
                year: 2025,
                hoi: "",
              });
              setInputField({
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
                    {s?.school}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            {selectedSchool.udise && (
              <div className="my-2">
                <h4 className="text-primary">
                  Selected School is {selectedSchool.school} (
                  {selectedSchool.udise})
                </h4>
                <div className="my-2">
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
                            <label className="form-label">
                              Gurdian's Name *
                            </label>
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
                            <label className="form-label">
                              Date Of Birth: *
                            </label>

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
                                      } else if (
                                        e.target.value === "LONG JUMP"
                                      ) {
                                        event1rank = 2;
                                      } else if (
                                        e.target.value === "SHUTTLE RACE"
                                      ) {
                                        event1rank = 3;
                                      } else if (e.target.value === "YOGA") {
                                        event1rank = 4;
                                      }
                                    } else if (inputField.group === "GROUP-B") {
                                      if (e.target.value === "100 METER RUN") {
                                        event1rank = 5;
                                      } else if (
                                        e.target.value === "200 METER RUN"
                                      ) {
                                        event1rank = 6;
                                      } else if (
                                        e.target.value === "LONG JUMP"
                                      ) {
                                        event1rank = 7;
                                      } else if (
                                        e.target.value === "HIGH JUMP"
                                      ) {
                                        event1rank = 8;
                                      } else if (e.target.value === "YOGA") {
                                        event1rank = 9;
                                      } else if (
                                        e.target.value === "GYMNASTICS"
                                      ) {
                                        event1rank = 10;
                                      }
                                    } else if (inputField.group === "GROUP-C") {
                                      if (e.target.value === "100 METER RUN") {
                                        event1rank = 11;
                                      } else if (
                                        e.target.value === "200 METER RUN"
                                      ) {
                                        event1rank = 12;
                                      } else if (
                                        e.target.value === "LONG JUMP"
                                      ) {
                                        event1rank = 13;
                                      } else if (
                                        e.target.value === "HIGH JUMP"
                                      ) {
                                        event1rank = 14;
                                      } else if (e.target.value === "YOGA") {
                                        event1rank = 15;
                                      } else if (
                                        e.target.value === "GYMNASTICS"
                                      ) {
                                        event1rank = 16;
                                      } else if (
                                        e.target.value === "FOOTBALL THROWING"
                                      ) {
                                        event1rank = 17;
                                      }
                                    }
                                  } else {
                                    if (inputField.group === "GROUP-A") {
                                      if (e.target.value === "75 METER RUN") {
                                        event1rank = 18;
                                      } else if (
                                        e.target.value === "LONG JUMP"
                                      ) {
                                        event1rank = 19;
                                      } else if (
                                        e.target.value === "SHUTTLE RACE"
                                      ) {
                                        event1rank = 20;
                                      } else if (e.target.value === "YOGA") {
                                        event1rank = 21;
                                      }
                                    } else if (inputField.group === "GROUP-B") {
                                      if (e.target.value === "100 METER RUN") {
                                        event1rank = 22;
                                      } else if (
                                        e.target.value === "200 METER RUN"
                                      ) {
                                        event1rank = 23;
                                      } else if (
                                        e.target.value === "LONG JUMP"
                                      ) {
                                        event1rank = 24;
                                      } else if (
                                        e.target.value === "HIGH JUMP"
                                      ) {
                                        event1rank = 25;
                                      } else if (e.target.value === "YOGA") {
                                        event1rank = 26;
                                      } else if (
                                        e.target.value === "GYMNASTICS"
                                      ) {
                                        event1rank = 27;
                                      }
                                    } else if (inputField.group === "GROUP-C") {
                                      if (e.target.value === "100 METER RUN") {
                                        event1rank = 28;
                                      } else if (
                                        e.target.value === "200 METER RUN"
                                      ) {
                                        event1rank = 29;
                                      } else if (
                                        e.target.value === "LONG JUMP"
                                      ) {
                                        event1rank = 30;
                                      } else if (
                                        e.target.value === "HIGH JUMP"
                                      ) {
                                        event1rank = 31;
                                      } else if (e.target.value === "YOGA") {
                                        event1rank = 32;
                                      } else if (
                                        e.target.value === "GYMNASTICS"
                                      ) {
                                        event1rank = 33;
                                      } else if (
                                        e.target.value === "FOOTBALL THROWING"
                                      ) {
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
                                      } else if (
                                        e.target.value === "LONG JUMP"
                                      ) {
                                        event2rank = 2;
                                      } else if (
                                        e.target.value === "SHUTTLE RACE"
                                      ) {
                                        event2rank = 3;
                                      } else if (e.target.value === "YOGA") {
                                        event2rank = 4;
                                      }
                                    } else if (inputField.group === "GROUP-B") {
                                      if (e.target.value === "100 METER RUN") {
                                        event2rank = 5;
                                      } else if (
                                        e.target.value === "200 METER RUN"
                                      ) {
                                        event2rank = 6;
                                      } else if (
                                        e.target.value === "LONG JUMP"
                                      ) {
                                        event2rank = 7;
                                      } else if (
                                        e.target.value === "HIGH JUMP"
                                      ) {
                                        event2rank = 8;
                                      } else if (e.target.value === "YOGA") {
                                        event2rank = 9;
                                      } else if (
                                        e.target.value === "GYMNASTICS"
                                      ) {
                                        event2rank = 10;
                                      }
                                    } else if (inputField.group === "GROUP-C") {
                                      if (e.target.value === "100 METER RUN") {
                                        event2rank = 11;
                                      } else if (
                                        e.target.value === "200 METER RUN"
                                      ) {
                                        event2rank = 12;
                                      } else if (
                                        e.target.value === "LONG JUMP"
                                      ) {
                                        event2rank = 13;
                                      } else if (
                                        e.target.value === "HIGH JUMP"
                                      ) {
                                        event2rank = 14;
                                      } else if (e.target.value === "YOGA") {
                                        event2rank = 15;
                                      } else if (
                                        e.target.value === "GYMNASTICS"
                                      ) {
                                        event2rank = 16;
                                      } else if (
                                        e.target.value === "FOOTBALL THROWING"
                                      ) {
                                        event2rank = 17;
                                      }
                                    }
                                  } else {
                                    if (inputField.group === "GROUP-A") {
                                      if (e.target.value === "75 METER RUN") {
                                        event2rank = 18;
                                      } else if (
                                        e.target.value === "LONG JUMP"
                                      ) {
                                        event2rank = 19;
                                      } else if (
                                        e.target.value === "SHUTTLE RACE"
                                      ) {
                                        event2rank = 20;
                                      } else if (e.target.value === "YOGA") {
                                        event2rank = 21;
                                      }
                                    } else if (inputField.group === "GROUP-B") {
                                      if (e.target.value === "100 METER RUN") {
                                        event2rank = 22;
                                      } else if (
                                        e.target.value === "200 METER RUN"
                                      ) {
                                        event2rank = 23;
                                      } else if (
                                        e.target.value === "LONG JUMP"
                                      ) {
                                        event2rank = 24;
                                      } else if (
                                        e.target.value === "HIGH JUMP"
                                      ) {
                                        event2rank = 25;
                                      } else if (e.target.value === "YOGA") {
                                        event2rank = 26;
                                      } else if (
                                        e.target.value === "GYMNASTICS"
                                      ) {
                                        event2rank = 27;
                                      }
                                    } else if (inputField.group === "GROUP-C") {
                                      if (e.target.value === "100 METER RUN") {
                                        event2rank = 28;
                                      } else if (
                                        e.target.value === "200 METER RUN"
                                      ) {
                                        event2rank = 29;
                                      } else if (
                                        e.target.value === "LONG JUMP"
                                      ) {
                                        event2rank = 30;
                                      } else if (
                                        e.target.value === "HIGH JUMP"
                                      ) {
                                        event2rank = 31;
                                      } else if (e.target.value === "YOGA") {
                                        event2rank = 32;
                                      } else if (
                                        e.target.value === "GYMNASTICS"
                                      ) {
                                        event2rank = 33;
                                      } else if (
                                        e.target.value === "FOOTBALL THROWING"
                                      ) {
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
                                        } else if (
                                          inputField.event1 === "GYMNASTICS"
                                        ) {
                                          return (
                                            el !== "100 METER RUN" &&
                                            el !== "200 METER RUN" &&
                                            el !== "LONG JUMP" &&
                                            el !== "HIGH JUMP" &&
                                            el !== "YOGA"
                                          );
                                        } else {
                                          return (
                                            el !== "YOGA" && el !== "GYMNASTICS"
                                          );
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
                                        } else if (
                                          inputField.event1 === "GYMNASTICS"
                                        ) {
                                          return (
                                            el !== "100 METER RUN" &&
                                            el !== "200 METER RUN" &&
                                            el !== "LONG JUMP" &&
                                            el !== "HIGH JUMP" &&
                                            el !== "FOOTBALL THROWING" &&
                                            el !== "YOGA"
                                          );
                                        } else {
                                          return (
                                            el !== "YOGA" && el !== "GYMNASTICS"
                                          );
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
        </div>
      )}
    </div>
  );
}
