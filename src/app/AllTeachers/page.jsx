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
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";
import Loader from "../../components/Loader";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { gpEngNames } from "../../modules/constants";
import { useGlobalContext } from "../../context/Store";
import axios from "axios";
import { createDownloadLink } from "@/modules/calculatefunctions";
const AllTeachers = () => {
  const {
    teachersState,
    teacherUpdateTime,
    setTeachersState,
    setTeacherUpdateTime,
    schoolState,
  } = useGlobalContext();
  const navigate = useRouter();
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

  const [showTable, setShowTable] = useState(false);
  const [search, setSearch] = useState("");
  const [teacherdata, setTeacherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputField, setInputField] = useState({
    convenor: "",
    desig: "",
    dataYear: "",
    gp: "",
    school: "",
    email: "",
    gpAssistant: "",
    circleAssistant: "",
    tname: "",
    circle: "",
    hoi: "",
    udise: "",
    registered: "",
    rank: "",
    phone: "",
    empid: "",
    pan: "",
    id: "",
  });
  const [inputOrgField, setInputOrgField] = useState({
    convenor: "",
    desig: "",
    dataYear: "",
    gp: "",
    school: "",
    email: "",
    gpAssistant: "",
    circleAssistant: "",
    tname: "",
    circle: "",
    hoi: "",
    udise: "",
    registered: "",
    rank: "",
    phone: "",
    empid: "",
    pan: "",
    id: "",
  });
  const getTeacherData = async () => {
    let data;
    try {
      const q = query(collection(firestore, "teachers"));
      const querySnapshot = await getDocs(q);
      data = querySnapshot.docs.map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        ...doc.data(),
        id: doc.id,
      }));

      setTeacherData(data);
      setFilteredData(data);
      setTeachersState(data);
      setTeacherUpdateTime(Date.now());
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching teachers data: ", error);
      const url = `/api/getTeachers`;
      const response = await axios.post(url);
      data = response.data.data;
      setTeacherData(data);
      setFilteredData(data);
      setTeachersState(data);
      setTeacherUpdateTime(Date.now());
      setShowTable(true);
    }
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
      name: "Create User",
      cell: (row) =>
        !row.registered ? (
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              // eslint-disable-next-line
              let message = confirm(
                `Are You Sure To Create User Account of ${row.tname}`
              );
              message
                ? createUser(row)
                : toast.success(`Account Not Created`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
            }}
          >
            Create User
          </button>
        ) : (
          <button
            type="button"
            className="btn  btn-warning"
            onClick={() => {
              // eslint-disable-next-line
              let message = confirm(
                `Are You Sure To Reset Password of ${row.tname}? `
              );
              message
                ? resetPassword(row)
                : toast.error("User Password Not Resetted!", {
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
            Reset Password
          </button>
        ),
    },
  ];

  const updateTeacher = async () => {
    setLoader(true);
    const url = `/api/updateteachers`;
    const entry = {
      id: inputField.id,
      tname: inputField.tname,
      school: inputField.school,
      gp: inputField.gp,
      circle: inputField.circle,
      email: inputField.email,
      hoi: inputField.hoi,
      udise: inputField.udise,
      registered: inputField.registered,
      rank: inputField.rank,
      phone: inputField.phone,
      pan: inputField.pan,
      empid: inputField.empid,
      gpAssistant: inputField.gpAssistant,
      circleAssistant: inputField.circleAssistant,
      convenor: inputField.convenor,
      desig: inputField.desig,
      dataYear: inputField.dataYear,
    };
    try {
      const response = await axios.post(url, entry);
      if (response.data.success) {
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
        setTeacherUpdateTime(Date.now());
        toast.success("Teacher Details Updated Successfully!");

        setShowModal(false);
        setLoader(false);
      } else {
        toast.error("Error Updating Teacher Details!");
        setLoader(false);
      }
    } catch (error) {
      console.error("Error Updating Teacher Details: ", error);
      toast.error("Error Updating Teacher Details!");
      setLoader(false);
    }
  };

  const createUser = async (el) => {
    setLoader(true);
    const url = `/api/adduserteachers`;
    const entry = {
      teachersID: el?.id,
      tname: el?.tname,
      school: el?.school,
      desig: el?.desig,
      pan: el?.pan,
      udise: el?.udise,
      circle: el?.circle,
      empid: el?.empid,
      convenor: el?.convenor,
      gpAssistant: el?.gpAssistant,
      gp: el?.gp,
      email: el?.email,
      phone: el?.phone,
      id: el?.id,
      username: el?.pan.toLowerCase(),
      password: bcrypt.hashSync(el?.empid?.toLowerCase(), 10),
      createdAt: Date.now(),
      disabled: false,
    };
    try {
      const response = await axios.post(url, entry);

      if (response.data.success) {
        try {
          const docRef = doc(firestore, "teachers", el.id);
          await updateDoc(docRef, {
            registered: true,
          });
          await setDoc(doc(firestore, "userteachers", el.id), entry)
            .then(() => {
              el.registered = true;
              let x = teachersState.filter((item) => item.id !== el.id);
              x = [...x, el].sort((a, b) => {
                if (a?.school < b?.school) {
                  return -1;
                }
                if (a?.school > b?.school) {
                  return 1;
                }
                return a?.rank - b?.rank;
              });
              setTeachersState(x);
              setTeacherUpdateTime(Date.now());
              setLoader(false);
              toast.success(
                `Registered Successfully with username Employee ID in LowerCase i.e. ${el.empid.toLowerCase()} and Password PAN in LowerCase i.e. ${el.pan.toLowerCase()}`,
                {
                  position: "top-right",
                  autoClose: 2000,
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
              toast.error("Failed to Register User Account!");
              console.log(e);
            });
        } catch (error) {
          console.log(error);
          toast.error("Failed to Register User Account!");
        }
      } else {
        toast.error("Failed to Register User Account!");
        console.log(response.data);
      }
    } catch (e) {
      toast.error("Failed to Create User Account!");
      console.log(e);
    }
  };

  const resetPassword = async (user) => {
    setLoader(true);
    const url = `/api/updateuserteachers`;
    try {
      const password = bcrypt.hashSync(user.pan.toLowerCase(), 10);
      user.password = password;
      const response = await axios.post(url, user);
      if (response.data.success) {
        const docRef = doc(firestore, "userteachers", user.id);
        await updateDoc(docRef, {
          password,
        })
          .then(() => {
            setLoader(false);
            toast.success(
              `Congrats! User Password Reset to PAN in Lower Case i.e. ${user.pan.toLowerCase()} !`,
              {
                position: "top-right",
                autoClose: 1500,
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
            toast.error("Congrats! User Password Reset Failed!");
          });
      } else {
        toast.error("Failed to Reset Password!");
        console.log(response.data);
      }
    } catch (e) {
      toast.error("Failed to Reset Password!");
      console.log(e);
    }
  };
  useEffect(() => {
    if (!details) {
      if (teacherdetails.circle !== "admin") {
        navigate.push("/logout");
      }
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    document.title = "AWC Sports App:Teacher Databse";
    const difference = (Date.now() - teacherUpdateTime) / 1000 / 60 / 15;
    if (teachersState.length === 0 || difference >= 1) {
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
          <h3 className="text-center text-primary">
            Displaying Teachers Database
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
                  class="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowModal(false);
                    setInputField({
                      convenor: "",
                      desig: "",
                      dataYear: "",
                      gp: "",
                      school: "",
                      email: "",
                      gpAssistant: "",
                      circleAssistant: "",
                      tname: "",
                      circle: "",
                      hoi: "",
                      udise: "",
                      registered: "",
                      rank: "",
                      phone: "",
                      empid: "",
                      pan: "",
                      id: "",
                    });

                    setInputOrgField({
                      convenor: "",
                      desig: "",
                      dataYear: "",
                      gp: "",
                      school: "",
                      email: "",
                      gpAssistant: "",
                      circleAssistant: "",
                      tname: "",
                      circle: "",
                      hoi: "",
                      udise: "",
                      registered: "",
                      rank: "",
                      phone: "",
                      empid: "",
                      pan: "",
                      id: "",
                    });
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
                      <input
                        type="text"
                        placeholder="Enter Teacher Name"
                        className="form-control"
                        value={inputField.circle}
                        onChange={(e) =>
                          setInputField({
                            ...inputField,
                            circle: e.target.value,
                          })
                        }
                      />
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
                        Is Registered
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg example"
                        value={inputField?.registered}
                        onChange={(e) => {
                          setInputField({
                            ...inputField,
                            registered: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select Registration Status</option>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
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
                    setInputField({
                      convenor: "",
                      desig: "",
                      dataYear: "",
                      gp: "",
                      school: "",
                      email: "",
                      gpAssistant: "",
                      circleAssistant: "",
                      tname: "",
                      circle: "",
                      hoi: "",
                      udise: "",
                      registered: "",
                      rank: "",
                      phone: "",
                      empid: "",
                      pan: "",
                      id: "",
                    });

                    setInputOrgField({
                      convenor: "",
                      desig: "",
                      dataYear: "",
                      gp: "",
                      school: "",
                      email: "",
                      gpAssistant: "",
                      circleAssistant: "",
                      tname: "",
                      circle: "",
                      hoi: "",
                      udise: "",
                      registered: "",
                      rank: "",
                      phone: "",
                      empid: "",
                      pan: "",
                      id: "",
                    });
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTeachers;
