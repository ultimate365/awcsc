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
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../components/Loader";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { gpEngNames } from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import { createDownloadLink } from "@/modules/calculatefunctions";
import { v4 as uuid } from "uuid";
const AllTeachers = () => {
  const { teachersState, setTeachersState, schoolState } = useGlobalContext();
  const navigate = useRouter();
  const docId = `teacher-${uuid().split("-")[0]}`;
  let teacherdetails = {
    tname: "",
    school: "",
    gp: "",
    circle: "taw",
  };

  let details = getCookie("tid");
  let schdetails = getCookie("schid");

  if (details) {
    teacherdetails = decryptObjData("tid");
  }
  if (schdetails) {
    schdetails = decryptObjData("schid");
  }
  const [showAdd, setShowAdd] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [search, setSearch] = useState("");
  const [teacherdata, setTeacherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputField, setInputField] = useState({
    id: docId,
    convenor: "taw",
    desig: "AT",
    dataYear: new Date().getFullYear().toString(),
    gp: "",
    school: "",
    email: "",
    gpAssistant: "taw",
    circleAssistant: "taw",
    tname: "",
    circle: "taw",
    hoi: "No",
    udise: "",
    disabled: false,
    rank: "",
    phone: "",
    empid: "",
    pan: "",
  });
  const [inputOrgField, setInputOrgField] = useState({
    id: docId,
    convenor: "taw",
    desig: "AT",
    dataYear: new Date().getFullYear().toString(),
    gp: "",
    school: "",
    email: "",
    gpAssistant: "taw",
    circleAssistant: "taw",
    tname: "",
    circle: "taw",
    hoi: "No",
    udise: "",
    disabled: false,
    rank: "",
    phone: "",
    empid: "",
    pan: "",
  });
  const resetInput = () => {
    setInputField({
      id: docId,
      convenor: "taw",
      desig: "AT",
      dataYear: new Date().getFullYear().toString(),
      gp: "",
      school: "",
      email: "",
      gpAssistant: "taw",
      circleAssistant: "taw",
      tname: "",
      circle: "taw",
      hoi: "No",
      udise: "",
      disabled: false,
      rank: "",
      phone: "",
      empid: "",
      pan: "",
    });
    setInputOrgField({
      id: docId,
      convenor: "taw",
      desig: "AT",
      dataYear: new Date().getFullYear().toString(),
      gp: "",
      school: "",
      email: "",
      gpAssistant: "taw",
      circleAssistant: "taw",
      tname: "",
      circle: "taw",
      hoi: "No",
      udise: "",
      disabled: false,
      rank: "",
      phone: "",
      empid: "",
      pan: "",
    });
  };
  const getTeacherData = async () => {
    const q = query(collection(firestore, "teachers"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    const newDatas = data.sort((a, b) => {
      // First, compare the "school" keys
      if (a.school < b.school) {
        return -1;
      }
      if (a.school > b.school) {
        return 1;
      }
      // If "school" keys are equal, compare the "rank" keys
      return a.rank - b.rank;
    });
    setTeacherData(newDatas);
    setFilteredData(newDatas);
    setTeachersState(newDatas);
    setShowTable(true);
  };
  const columns = [
    {
      name: "Sl",
      selector: (row, index) =>
        teachersState.findIndex((i) => i.id === row?.id) + 1,
      sortable: +true,
      center: +true,
    },
    {
      name: "Teacher Name",
      selector: (row) => row.tname,
      sortable: +true,
      center: +true,
      wrap: +true,
    },

    {
      name: "School Name",
      selector: (row) => row.school,
      sortable: +true,
      center: +true,
      wrap: +true,
    },

    {
      name: "Email",
      selector: (row) => row.email,
      sortable: +true,
      center: +true,
      wrap: +true,
    },

    {
      name: "Access",
      selector: (row) => row.circle,
      sortable: +true,
      center: +true,
    },
    {
      name: "Edit",
      selector: (row) => (
        <button
          type="button"
          className="btn btn-warning"
          onClick={() => {
            setInputField(row);
            setInputOrgField(row);
            setShowModal(true);
          }}
        >
          Edit
        </button>
      ),
      sortable: +true,
      center: +true,
      omit: teacherdetails.circle !== "admin",
    },
    {
      name: "Delete",
      selector: (row) => (
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            //eslint-disable-next-line
            let conf = confirm(`Are you sure to delete Teacher ${row.tname}?`);
            if (conf) {
              deleteTeacher(row.id);
            }
          }}
        >
          Delete
        </button>
      ),
      sortable: +true,
      center: +true,
      omit: teacherdetails.circle !== "admin",
    },
  ];

  const updateTeacher = async () => {
    try {
      setLoader(true);
      const docRef = doc(firestore, "teachers", inputField.id);
      await updateDoc(docRef, inputField);
      let x = teachersState.filter((item) => item.id !== inputField.id);
      x = [...x, inputField].sort((a, b) => {
        if (a?.school < b?.school) {
          return -1;
        }
        if (a?.school > b?.school) {
          return 1;
        }
        return a?.rank - b?.rank;
      });
      setTeachersState(x);
      setFilteredData(x);
      resetInput();
      toast.success("Teacher Details Updated Successfully!");
      setShowModal(false);
      setLoader(false);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
      setLoader(false);
      setShowModal(false);
    }
  };
  const addNewTeacher = async () => {
    try {
      setLoader(true);
      await setDoc(doc(firestore, "teachers", inputField.id), inputField);
      let x = teachersState;
      x = [...x, inputField].sort((a, b) => {
        if (a?.school < b?.school) {
          return -1;
        }
        if (a?.school > b?.school) {
          return 1;
        }
        return a?.rank - b?.rank;
      });
      setTeachersState(x);
      setFilteredData(x);
      resetInput();
      toast.success("Teacher Details Added Successfully!");
      setShowAdd(false);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      toast.error(error.message);
      console.log(error);
      setShowAdd(false);
    }
  };
  const deleteTeacher = async (id) => {
    try {
      setLoader(true);
      await deleteDoc(doc(firestore, "teachers", id));
      let x = teachersState.filter((item) => item.id !== id);
      setTeachersState(x);
      setFilteredData(x);
      resetInput();
      toast.success("Teacher Details Deleted Successfully!");
      setLoader(false);
    } catch (error) {
      setLoader(false);
      toast.error(error.message);
      console.log(error);
    }
  };
  useEffect(() => {
    if (!details) {
      if (teacherdetails.circle !== "admin") {
        navigate.push("/Logout");
      }
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    document.title = "AWC Sports App:Teacher Databse";
    if (teachersState.length === 0) {
      getTeacherData();
    } else {
      setTeacherData(teachersState);
      setFilteredData(teachersState);
      setShowTable(true);
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const result = teacherdata.filter((el) => {
      return el.tname.toLowerCase().match(search.toLowerCase());
    });
    setFilteredData(result);
    // eslint-disable-next-line
  }, [search, teacherdata]);
  useEffect(() => {
    // eslint-disable-next-line
  }, [inputField, inputOrgField]);

  return (
    <div className="container text-center my-5">
      {loader ? <Loader /> : null}
      {showTable ? (
        <>
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              createDownloadLink(teacherdata, "teachers");
            }}
          >
            Download Teachers Data
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => setShowAdd(true)}
          >
            Add Teacher
          </button>
          <h3 className="text-center text-primary">
            Displaying Teachers Database
          </h3>
          {showAdd && (
            <div
              className="modal fade show"
              tabIndex="-1"
              role="dialog"
              style={{ display: "block" }}
              aria-modal="true"
            >
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="addNoticeLabel">
                      Add New Teacher
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => {
                        setShowAdd(false);
                        resetInput();
                      }}
                    ></button>
                  </div>
                  <div className="modal-body modal-xl">
                    <div className="mb-3">
                      <label className="form-label">Select School</label>
                      <select
                        className="form-select"
                        defaultValue={""}
                        id="school-select"
                        onChange={(e) => {
                          const value = JSON.parse(e.target.value);
                          const totalTeachers = teachersState.filter(
                            (el) => el.udise === value.udise
                          ).length;

                          setInputField((prev) => ({
                            ...prev,
                            school: value.school,
                            udise: value.udise,
                            gp: value.gp,
                            rank: totalTeachers + 1,
                          }));
                        }}
                        aria-label="Default select example"
                      >
                        <option value="">Select School</option>
                        {schoolState.map((s, i) => (
                          <option value={JSON.stringify(s)} key={i}>
                            {s?.school}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Teacher Name"
                        className="form-control"
                        value={inputField.tname}
                        onChange={(e) =>
                          setInputField({
                            ...inputField,
                            tname: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Designation
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.desig}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            desig: e.target.value,
                          });
                        }}
                      >
                        <option value="">
                          Select Teacher&#8217;s Designation
                        </option>
                        <option value={"AT"}>AT</option>
                        <option value={"HT"}>HT</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Is Hoi?
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.hoi}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            hoi: e.target.value,
                          });
                        }}
                      >
                        <option value="">SelectIs Hoi?</option>
                        <option value={"No"}>No</option>
                        <option value={"Yes"}>Yes</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Rank
                      </label>
                      <input
                        type="number"
                        placeholder="Enter Teacher Rank"
                        className="form-control"
                        value={inputField.rank}
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            setInputField({
                              ...inputField,
                              rank: parseInt(e.target.value),
                            });
                          } else {
                            setInputField({
                              ...inputField,
                              rank: "",
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Employee ID
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Teacher Employee ID"
                        className="form-control"
                        value={inputField.empid}
                        onChange={(e) =>
                          setInputField({
                            ...inputField,
                            empid: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter Teacher Email"
                        className="form-control"
                        value={inputField.email}
                        onChange={(e) =>
                          setInputField({
                            ...inputField,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Mobile
                      </label>
                      <input
                        type="number"
                        placeholder="Enter Teacher Mobile"
                        className="form-control"
                        value={inputField.phone}
                        onChange={(e) =>
                          setInputField({
                            ...inputField,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s PAN
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Teacher PAN"
                        className="form-control"
                        value={inputField.pan}
                        onChange={(e) =>
                          setInputField({
                            ...inputField,
                            pan: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Access
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.circle}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            circle: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select Circle Convenor Access</option>
                        <option value={"admin"}>Admin</option>
                        <option value={"taw"}>No Access</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Circle Assistant Access
                      </label>

                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.circleAssistant}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            circleAssistant: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select Circle Assistant Access</option>
                        <option value={"admin"}>Admin</option>
                        <option value={"taw"}>No Access</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s GP Convenor Access
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.convenor}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            convenor: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select GP Convenor Access</option>
                        <option value={"admin"}>Admin</option>
                        <option value={"taw"}>No Access</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s GP Assistant Access
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.gpAssistant}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            gpAssistant: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select GP Assistant Access</option>
                        <option value={"admin"}>Admin</option>
                        <option value={"taw"}>No Access</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Account Status
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.disabled}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            disabled: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select Status</option>
                        <option value={true}>Disable</option>
                        <option value={false}>Enable</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer d-flex flex-column">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        addNewTeacher();
                        setShowAdd(false);
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowAdd(false);
                        resetInput();
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
        </>
      ) : (
        <Loader />
      )}
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
          aria-modal="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  Update Details of {inputOrgField.tname}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowModal(false);
                    resetInput();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mx-auto my-2">
                  <div className="mb-3 mx-auto col-md-6">
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Teacher Name"
                        className="form-control"
                        value={inputField.tname}
                        onChange={(e) =>
                          setInputField({
                            ...inputField,
                            tname: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s School
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.school}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            school: e.target.value,
                            udise: schoolState.filter(
                              (el) => el.school === e.target.value
                            )[0].udise,
                          });
                        }}
                      >
                        <option value="">Select Teacher&#8217;s School</option>
                        {schoolState.map((school, i) => (
                          <option value={school.school} key={i}>
                            {school.school}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        School&#8217;s UDISE
                      </label>
                      <input
                        type="text"
                        disabled
                        placeholder="Enter School&#8217;s UDISE"
                        className="form-control"
                        value={inputField.udise}
                        onChange={(e) =>
                          setInputField({
                            ...inputField,
                            udise: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        School&#8217;s GP
                      </label>

                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.gp}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            gp: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select School&#8217;s GP</option>
                        {gpEngNames.map((gp, i) => (
                          <option value={gp} key={i}>
                            {gp}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Designation
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.desig}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            desig: e.target.value,
                          });
                        }}
                      >
                        <option value="">
                          Select Teacher&#8217;s Designation
                        </option>
                        <option value={"AT"}>AT</option>
                        <option value={"HT"}>HT</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Is Hoi?
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.hoi}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            hoi: e.target.value,
                          });
                        }}
                      >
                        <option value="">SelectIs Hoi?</option>
                        <option value={"No"}>No</option>
                        <option value={"Yes"}>Yes</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Rank
                      </label>
                      <input
                        type="number"
                        placeholder="Enter Teacher Rank"
                        className="form-control"
                        value={inputField.rank}
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            setInputField({
                              ...inputField,
                              rank: parseInt(e.target.value),
                            });
                          } else {
                            setInputField({
                              ...inputField,
                              rank: "",
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Employee ID
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Teacher Employee ID"
                        className="form-control"
                        value={inputField.empid}
                        onChange={(e) =>
                          setInputField({
                            ...inputField,
                            empid: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter Teacher Email"
                        className="form-control"
                        value={inputField.email}
                        onChange={(e) =>
                          setInputField({
                            ...inputField,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Mobile
                      </label>
                      <input
                        type="number"
                        placeholder="Enter Teacher Mobile"
                        className="form-control"
                        value={inputField.phone}
                        onChange={(e) =>
                          setInputField({
                            ...inputField,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s PAN
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Teacher PAN"
                        className="form-control"
                        value={inputField.pan}
                        onChange={(e) =>
                          setInputField({
                            ...inputField,
                            pan: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Access
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.circle}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            circle: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select Circle Convenor Access</option>
                        <option value={"admin"}>Admin</option>
                        <option value={"taw"}>No Access</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s Circle Assistant Access
                      </label>

                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.circleAssistant}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            circleAssistant: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select Circle Assistant Access</option>
                        <option value={"admin"}>Admin</option>
                        <option value={"taw"}>No Access</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s GP Convenor Access
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.convenor}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            convenor: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select GP Convenor Access</option>
                        <option value={"admin"}>Admin</option>
                        <option value={"taw"}>No Access</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Teacher&#8217;s GP Assistant Access
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.gpAssistant}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            gpAssistant: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select GP Assistant Access</option>
                        <option value={"admin"}>Admin</option>
                        <option value={"taw"}>No Access</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Account Status
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.disabled}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            disabled: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select Status</option>
                        <option value={true}>Disable</option>
                        <option value={false}>Enable</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    setShowModal(false);
                    updateTeacher();
                  }}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => {
                    setShowModal(false);
                    resetInput();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

export default AllTeachers;
