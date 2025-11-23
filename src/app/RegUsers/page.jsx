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
import bcrypt from "bcryptjs";
import Loader from "../../components/Loader";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  comparePassword,
  createDownloadLink,
  DateValueToString,
} from "@/modules/calculatefunctions";
import { useGlobalContext } from "../../context/Store";
import axios from "axios";
import { v4 as uuid } from "uuid";
import {
  generateID,
  generateRandomPAN,
  generateRandomUDISE,
} from "../../modules/calculatefunctions";
import { getCollection, updateDocument } from "../../firebase/firestoreHelper";
const RegUsers = () => {
  const docID = uuid().split("-")[0];
  const { teachersState, setTeachersState } = useGlobalContext();
  const navigate = useRouter();
  let teacherdetails = {
    tname: "",
    school: "",
    gp: "",
    circle: "taw",
  };
  let adminType = "";
  let details = getCookie("tid");
  let schdetails = getCookie("schid");

  if (details) {
    teacherdetails = decryptObjData("tid");
    adminType = teacherdetails.type;
  }
  if (schdetails) {
    schdetails = decryptObjData("schid");
  }

  const [showTable, setShowTable] = useState(false);
  const [search, setSearch] = useState("");
  const [showSchoolTable, setShowSchoolTable] = useState(false);
  const [searchSchool, setSearchSchool] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [adminsData, setAdminsData] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const [filterSchoolData, setFilterSchoolData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showAdminPassWord, setShowAdminPassWord] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminID, setAdminID] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState({
    id: `teacher-${docID}`,
    disabled: false,
    pan: generateRandomPAN(),
    createdAt: Date.now(),
    username: "",
    school: "",
    password: "",
    gp: "AMORAGORI",
    empid: generateID(),
    circleAssistant: "taw",
    circle: "admin",
    tname: "",
    convenor: "taw",
    udise: generateRandomUDISE(),
    phone: "",
    teachersID: `teacher-${docID}`,
    email: "",
    desig: "",
    gpAssistant: "taw",
    type: "Administrator",
  });
  const [type, setType] = useState("Add");
  const userAdminData = async () => {
    const q = query(collection(firestore, "sportsAdmins"));

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setAdminsData(data);
  };
  const resetInput = () => {
    setSelectedAdmin({
      id: `teacher-${docID}`,
      disabled: false,
      pan: generateRandomPAN(),
      createdAt: Date.now(),
      username: "",
      school: "",
      password: "",
      gp: "AMORAGORI",
      empid: generateID(),
      circleAssistant: "taw",
      circle: "admin",
      tname: "",
      convenor: "taw",
      udise: generateRandomUDISE(),
      phone: "",
      teachersID: `teacher-${docID}`,
      email: "",
      desig: "",
      gpAssistant: "taw",
      type: "Administrator",
    });
  };
  const userData = async () => {
    // try {
    const q = query(collection(firestore, "sportsUsers"));

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setData(data);
    setFilteredData(data);
    setShowTable(true);
  };
  const schoolUserData = async () => {
    // try {
    const q = query(collection(firestore, "userschools"));

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setSchoolData(data);
    setFilterSchoolData(data);
    setShowSchoolTable(true);
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
    document.title = "AWC Sports App:User Databse";
    userData();
    schoolUserData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const result = data.filter((el) => {
      return el?.tname?.toLowerCase().match(search.toLowerCase());
    });
    setFilteredData(result);
    // eslint-disable-next-line
  }, [search, data]);
  useEffect(() => {
    const resultSchool = schoolData.filter((el) => {
      return el.school.toLowerCase().match(searchSchool.toLowerCase());
    });
    setFilterSchoolData(resultSchool);
    // eslint-disable-next-line
  }, [searchSchool, schoolData]);
  const columns = [
    {
      name: "Sl",
      selector: (row, index) => data.findIndex((i) => i.id === row?.id) + 1,
      sortable: +true,
      center: +true,
    },
    {
      name: "Teacher Name",
      selector: (row) => row.tname,
      sortable: +true,
      wrap: +true,
      center: +true,
    },

    {
      name: "School Name",
      selector: (row) => row.school,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: +true,
      wrap: +true,
      center: +true,
    },

    {
      name: "Access",
      selector: (row) => row.circle,
      sortable: +true,
      center: +true,
    },
    {
      name: "Registered On",
      selector: (row) => DateValueToString(row.createdAt),
      wrap: +true,
      center: +true,
    },
    {
      name: "Delete User",
      cell: (row) => (
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            // eslint-disable-next-line
            let message = confirm(`Are You Sure To Delete User ${row.tname}`);
            message
              ? adminType === "Administrator" && row.circle === "admin"
                ? toast.error("Access Denied")
                : deleteUser(row)
              : alert("Teacher Not Deleted");
          }}
        >
          Delete
        </button>
      ),
      center: +true,
    },
    {
      name: "Update User Login",
      cell: (row) =>
        row.disabled ? (
          <button
            type="button"
            className="btn btn-sm btn-success"
            onClick={() => {
              // eslint-disable-next-line
              let message = confirm(
                `Are You Sure To Restore User ${row.tname}'s Login? `
              );
              message
                ? adminType === "Administrator" && row.circle === "admin"
                  ? toast.error("Access Denied")
                  : restoreUser(row.id)
                : alert("User Login Not Restored!");
            }}
          >
            Unlock User
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-sm btn-warning"
            onClick={() => {
              // eslint-disable-next-line
              let message = confirm(
                `Are You Sure To Disable User ${row.tname}'s Login? `
              );
              message
                ? adminType === "Administrator" && row.circle === "admin"
                  ? toast.error("Access Denied")
                  : disableUser(row.id)
                : alert("User Login Not Disabled!");
            }}
          >
            Lock User
          </button>
        ),
      center: +true,
    },
    {
      name: "Reset Password",
      cell: (row) =>
        comparePassword(row.pan.toLowerCase(), row.password) ? (
          <button
            type="button"
            className="btn btn-sm btn-success"
            style={{ fontSize: 9 }}
            onClick={() => {
              // eslint-disable-next-line
              alert(
                `Password of ${
                  row.tname
                } is PAN in Lowercase i.e. ${row.pan.toLowerCase()}? `
              );
            }}
          >
            Show Password
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-sm btn-warning"
            style={{ fontSize: 9 }}
            onClick={() => {
              // eslint-disable-next-line
              let message = confirm(
                `Are You Sure To Reset Password of ${
                  row.tname
                } to PAN in Lowercase i.e. ${row.pan.toLowerCase()}? `
              );
              message
                ? adminType === "Administrator" && row.circle === "admin"
                  ? toast.error("Access Denied")
                  : resetPassword(row)
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
      center: +true,
    },
  ];
  const schoolColumns = [
    {
      name: "Sl",
      selector: (row, index) =>
        schoolData.findIndex((i) => i.id === row?.id) + 1,
      width: "5%",
      sortable: +true,
      center: +true,
    },
    {
      name: "School Name",
      selector: (row) => row.school,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "40%",
    },
    {
      name: "GP",
      selector: (row) => row.gp,
      sortable: +true,
      wrap: +true,
      center: +true,
      width: "10%",
    },
    {
      name: "Username",
      selector: (row) => row.username,
      wrap: +true,
      center: +true,
      width: "10%",
    },
    {
      name: "Default Password",
      selector: (row) => `${row.id}@${row.gp.toLowerCase()}`,
      wrap: +true,
      center: +true,
      width: "15%",
    },

    {
      name: "Reset Password",
      cell: (row) => {
        const isPasswordChanged = !compare(
          `${row.id}@${row.gp.toLowerCase()}`,
          row.password
        );
        if (isPasswordChanged) {
          return (
            <button
              type="button"
              className="btn btn-sm"
              style={{ fontSize: 9 }}
              onClick={() => {
                // eslint-disable-next-line
                let message = confirm(
                  `Are You Sure To Reset Password of ${row.school} to ${
                    row.id
                  }@${row.gp.toLowerCase()}? `
                );
                message
                  ? resetSchoolPassword(row)
                  : toast.error("School Password Not Resetted!", {
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
              <i className="bi bi-arrow-counterclockwise text-warning fs-1"></i>
            </button>
          );
        } else {
          return <i className="bi bi-check-circle-fill text-success fs-4"></i>;
        }
      },
      width: "10%",
      center: +true,
      wrap: +true,
    },
  ];

  const adminColumns = [
    {
      name: "Sl",
      selector: (row, index) => data.findIndex((i) => i.id === row?.id) + 1,
      sortable: +true,
      center: +true,
    },
    {
      name: "Name",
      selector: (row) => row.tname,
      sortable: +true,
      wrap: +true,
      center: +true,
    },

    {
      name: "Office Name",
      selector: (row) => row.school,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: +true,
      wrap: +true,
      center: +true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: +true,
      wrap: +true,
      center: +true,
    },

    {
      name: "Access",
      selector: (row) => row.circle,
      sortable: +true,
      center: +true,
    },
    {
      name: "Registered On",
      selector: (row) => DateValueToString(row.createdAt),
      wrap: +true,
      center: +true,
    },
    {
      name: "Delete Admin",
      cell: (row) => (
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            // eslint-disable-next-line
            let message = confirm(
              `Are You Want to Remove Admin ${row?.tname}?`
            );
            message ? deleteAdmin(row) : alert("Admin Not Deleted");
          }}
        >
          Delete
        </button>
      ),
      center: +true,
    },
    {
      name: "Update User Login",
      cell: (row) =>
        row.disabled ? (
          <button
            type="button"
            className="btn btn-sm btn-success"
            onClick={() => {
              // eslint-disable-next-line
              let message = confirm(
                `Are You Sure To Restore Admin ${row.tname}'s Login? `
              );
              message ? restoreAdmin(row) : alert("User Admin Not Restored!");
            }}
          >
            Unlock Admin
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-sm btn-warning"
            onClick={() => {
              // eslint-disable-next-line
              let message = confirm(
                `Are You Sure To Disable Admin ${row.tname}'s Login? `
              );
              message ? disableAdmin(row) : alert("Admin Login Not Disabled!");
            }}
          >
            Lock Admin
          </button>
        ),
      center: +true,
    },
    {
      name: "Reset Password",
      cell: (row) => (
        <button
          type="button"
          className="btn btn-sm btn-success"
          style={{ fontSize: 9 }}
          onClick={() => {
            setShowAdminPassWord(true);
            setSelectedAdmin(row);
          }}
        >
          Change Password
        </button>
      ),
      center: +true,
    },
  ];

  // console.log(inputField);
  const deleteUser = async (user) => {
    setLoader(true);
    try {
      await axios.post("/api/deluserteachers", { id: user.id });
      await deleteDoc(doc(firestore, "sportsUsers", user.id));
      let x = teachersState.filter((item) => item.id !== user.id);
      let y = teachersState.filter((item) => item.id === user.id)[0];
      y.registered = false;
      x = [...x, y].sort((a, b) => {
        if (a?.school < b?.school) {
          return -1;
        }
        if (a?.school > b?.school) {
          return 1;
        }
        return a?.rank - b?.rank;
      });
      setTeachersState(x);
      const docRef = doc(firestore, "teachers", user.id);
      await updateDoc(docRef, {
        spregistered: false,
      });
      setLoader(false);
      userData();
      toast.success(`User Deleted Successfully`);
    } catch (error) {
      toast.error("Failed to delete user!");
      console.log(error);
    }
  };
  const compare = (userPassword, serverPassword) => {
    let match = bcrypt.compareSync(userPassword, serverPassword);

    return match;
  };
  const disableUser = async (id) => {
    setLoader(true);
    try {
      await axios.post("/api/endisuserteachers", { id: id, disabled: true });
      const docRef = doc(firestore, "sportsUsers", id);
      await updateDoc(docRef, {
        disabled: true,
      })
        .then(() => {
          setLoader(false);
          toast.success("Congrats! User Login is Disabled Successfully!");
          userData();
        })
        .catch((e) => {
          setLoader(false);
          toast.success("Congrats! User Login Disable Updation Failed!");
        });
    } catch (error) {
      setLoader(false);
    }
  };
  const restoreUser = async (id) => {
    setLoader(true);
    try {
      await axios.post("/api/endisuserteachers", { id: id, disabled: false });
      const docRef = doc(firestore, "sportsUsers", id);
      await updateDoc(docRef, {
        disabled: false,
      })
        .then(() => {
          setLoader(false);
          toast.success("Congrats! User Login is Enabled Successfully!");
          userData();
        })
        .catch((e) => {
          setLoader(false);
          toast.success("User Login Enable Updation Failed!");
          console.log(e);
        });
    } catch (error) {
      setLoader(false);
      toast.success(" User Login Enable Updation Failed!");
      console.log(e);
    }
  };
  const resetPassword = async (user) => {
    setLoader(true);
    try {
      const password = bcrypt.hashSync(user.pan.toLowerCase(), 10);
      user.password = password;
      await axios.post("/api/updateuserteachers", user);
      const docRef = doc(firestore, "sportsUsers", user.id);
      await updateDoc(docRef, {
        password: password,
      })
        .then(() => {
          setLoader(false);
          toast.success(
            `Congrats! User Password Reset to PAN in Lower Case i.e. ${user.pan.toLowerCase()} !`
          );
          userData();
        })
        .catch((e) => {
          setLoader(false);
          toast.error("Congrats! User Password Reset Failed!");
        });
    } catch (error) {
      setLoader(false);
      toast.error("Congrats! User Password Reset Failed!");
    }
  };
  const resetSchoolPassword = async (user) => {
    setLoader(true);
    try {
      const password = bcrypt.hashSync(
        user.id + "@" + user.gp.toLowerCase(),
        10
      );
      user.password = password;
      await axios.post("/api/updateuserschools", user);
      await updateDoc(doc(firestore, "userschools", user.id), {
        password: password,
      })
        .then(() => {
          setLoader(false);
          schoolUserData();
          toast.success(
            `congratulation! ${user.school}'s Password Has Been Resetted to ${
              user.id
            }@${user.gp.toLowerCase()} Successfully!`
          );
        })
        .catch((error) => {
          setLoader(false);
          toast.error("Congrats! School Password Reset Failed!");
          console.log(error);
        });
    } catch (error) {
      setLoader(false);
      toast.error("Congrats! School Password Reset Failed!");
    }
  };
  const addAdmin = async () => {
    if (!selectedAdmin.tname) {
      toast.error("Please Enter Admin Name");
      return;
    }
    if (!selectedAdmin.username) {
      toast.error("Please Enter Admin Username");
      return;
    }
    if (!selectedAdmin.password) {
      toast.error("Please Enter Admin Password");
      return;
    }
    if (!selectedAdmin.school) {
      toast.error("Please Enter Office Name");
      return;
    }
    if (
      !selectedAdmin.email ||
      !selectedAdmin.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      toast.error("Please Enter Valid Email");
      return;
    }
    if (!selectedAdmin.phone) {
      toast.error("Please Enter Phone Number");
      return;
    }
    if (!selectedAdmin.desig) {
      toast.error("Please Enter Designation");
      return;
    }
    setLoader(true);
    try {
      const entry = {
        ...selectedAdmin,
        id: `teacher-${docID}`,
        password:
          type === "add"
            ? bcrypt.hashSync(selectedAdmin.password.trim(), 10)
            : selectedAdmin.password,
        username: selectedAdmin.username.trim().toLowerCase(),
        tname: selectedAdmin.tname.trim().toUpperCase(),
        school: selectedAdmin.school.trim().toUpperCase(),
        gp: selectedAdmin.gp.trim(),
        email: selectedAdmin.email.trim(),
        desig: selectedAdmin.desig.trim().toUpperCase(),
        phone: selectedAdmin.phone.trim(),
        teachersID: `teacher-${docID}`,
        createdAt: Date.now(),
      };
      const docRef = doc(firestore, "sportsAdmins", entry.id);
      await setDoc(docRef, entry)
        .then(() => {
          setLoader(false);
          resetInput();
          toast.success("Congrats! Admin Added Successfully!");
          userAdminData();
          setShowInput(false);
        })
        .catch((error) => {
          setLoader(false);
          console.log(error);
        });
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  const resetAdminsPassword = async (admin) => {
    setLoader(true);
    try {
      const password = bcrypt.hashSync(adminPassword.trim(), 10);
      await updateDoc(doc(firestore, "sportsAdmins", admin.id), {
        password: password,
      })
        .then(() => {
          setLoader(false);
          showToast(
            "success",
            `congratulation! ${
              admin.tname
            }'s Password Has Been Resetted to ${adminPassword.trim()} Successfully!`
          );
          userAdminData();
          setShowAdminPassWord(false);
          setAdminPassword("");
          resetInput();
        })
        .catch((error) => {
          setLoader(false);
          toast.error("Congrats! Admin Password Reset Failed!");
          console.log(error);
        });
    } catch (error) {
      setLoader(false);
      toast.error("Congrats! Admin Password Reset Failed!");
      console.log(error);
    }
  };
  const deleteAdmin = async (admin) => {
    setLoader(true);
    try {
      await deleteDoc(doc(firestore, "sportsAdmins", admin.id));
      let x = adminsData.filter((item) => item.id !== admin.id);
      setAdminsData(x);
      setLoader(false);
      userAdminData();
    } catch (error) {
      toast.error("Failed to delete admin!");
      console.log(error);
    }
  };
  const getAdminLogin = async () => {
    const data = await getCollection("appUpdate");
    setShowAdminLogin(data[0]?.showAdminLogin);
    setAdminID(data[0].id);
  };
  const disableAdmin = async (admin) => {
    setLoader(true);
    try {
      const docRef = doc(firestore, "sportsAdmins", admin.id);
      await updateDoc(docRef, {
        disabled: true,
      }).then(() => {
        setLoader(false);
        toast.success("Congrats! Admin Login is Disabled Successfully!");
        userAdminData();
      });
    } catch (error) {
      setLoader(false);
      toast.error("Admin Login Disable Updation Failed!");
      console.log(error);
    }
  };
  const restoreAdmin = async (admin) => {
    setLoader(true);
    try {
      const docRef = doc(firestore, "sportsAdmins", admin.id);
      await updateDoc(docRef, {
        disabled: false,
      })
        .then(() => {
          setLoader(false);
          toast.success("Congrats! Admin Login is Enabled Successfully!");
          userAdminData();
        })
        .catch((e) => {
          setLoader(false);
          toast.error("Admin Login Enable Updation Failed!");
          console.log(e);
        });
    } catch (error) {
      setLoader(false);
      toast.error("Admin Login Enable Updation Failed!");
      console.log(error);
    }
  };
  const updateAdminLogin = async () => {
    setLoader(true);
    await updateDocument("appUpdate", adminID, {
      showAdminLogin: !showAdminLogin,
    })
      .then(() => {
        setLoader(false);
        toast.success(
          `Admin Login Button ${!showAdminLogin ? "Displayed" : "Hidden"}`
        );
      })
      .catch((e) => {
        setLoader(false);
        toast.error("Failed to the Operation");
        console.log(e);
      });
  };
  const onChangeRadio = () => {
    setShowAdminLogin(!showAdminLogin);
    updateAdminLogin();
  };
  useEffect(() => {
    getAdminLogin();
    //eslint-disable-next-line
  }, []);
  return (
    <div className="container text-center my-5">
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
      <div>
        <button
          type="button"
          className="btn btn-primary m-2"
          onClick={() => {
            createDownloadLink(data, "sportsUsers");
          }}
        >
          Download User Teacher's Data
        </button>
        <button
          type="button"
          className="btn btn-success m-2"
          onClick={() => {
            createDownloadLink(schoolData, "userschools");
          }}
        >
          Download User School's Data
        </button>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setShowTable(!showTable)}
      >
        {showTable ? "Hide Users" : "Show Users"}
      </button>
      {showTable && !showInput && (
        <>
          <h3 className="text-center text-primary">
            Displaying Users Database
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
      )}
      <button
        type="button"
        className="btn btn-primary m-2"
        onClick={() => setShowSchoolTable(!showSchoolTable)}
      >
        {showSchoolTable ? "Hide School Users" : "Show School Users"}
      </button>
      {showSchoolTable && !showInput && (
        <>
          <h3 className="text-center text-primary">
            Displaying School Users Database
          </h3>

          <DataTable
            columns={schoolColumns}
            data={filterSchoolData}
            pagination
            highlightOnHover
            fixedHeader
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search"
                className="w-25 form-control"
                value={searchSchool}
                onChange={(e) => setSearchSchool(e.target.value)}
              />
            }
            subHeaderAlign="right"
          />
        </>
      )}
      <div>
        <div>
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              setShowInput(!showInput);
              resetInput();
              setType("add");
            }}
          >
            {showInput ? "Hide Add Admin" : "Add New Admin"}
          </button>
        </div>
        <h3 className="text-center text-primary">
          Displaying Administrators Data
        </h3>
        <div className="bg-dark col-md-6 mx-auto p-2 rounded rounded-4 d-flex justify-content-between align-items-center">
          <div className="form-check m-1 d-flex justify-content-between align-items-center">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefaul2"
              id="flexRadioDefault2"
              checked={showAdminLogin}
              onChange={onChangeRadio}
              style={{ width: 30, height: 30 }}
            />
            <label
              className="form-check-label m-2 text-white fs-6"
              htmlFor="flexRadioDefault2"
            >
              Shown Admin Login
            </label>
          </div>
          <div className="form-check m-1 d-flex justify-content-between align-items-center">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              checked={!showAdminLogin}
              onChange={onChangeRadio}
              style={{ width: 30, height: 30 }}
            />
            <label
              className="form-check-label m-2 text-white fs-6"
              htmlFor="flexRadioDefault1"
            >
              Hide Admin Login
            </label>
          </div>
        </div>
        {showInput && (
          <div className="my-3 mx-auto">
            <h5 className="text-primary">Add New Admin</h5>
            <div className="col-md-6 mx-auto">
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Admin Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  className="form-control"
                  value={selectedAdmin.tname}
                  onChange={(e) => {
                    setSelectedAdmin({
                      ...selectedAdmin,
                      tname: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Admin Username
                </label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  className="form-control"
                  value={selectedAdmin.username}
                  onChange={(e) => {
                    setSelectedAdmin({
                      ...selectedAdmin,
                      username: e.target.value,
                    });
                  }}
                />
              </div>
              {type === "add" && (
                <div className="mb-3">
                  <label htmlFor="" className="form-label">
                    Admin Password
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Password"
                    className="form-control"
                    value={selectedAdmin.password}
                    onChange={(e) => {
                      setSelectedAdmin({
                        ...selectedAdmin,
                        password: e.target.value,
                      });
                    }}
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Admin Phone
                </label>
                <input
                  type="number"
                  placeholder="Enter Phone"
                  className="form-control"
                  value={selectedAdmin.phone}
                  onChange={(e) => {
                    e.target.value.toString().length <= 10 &&
                      setSelectedAdmin({
                        ...selectedAdmin,
                        phone: e.target.value,
                      });
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Admin Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="form-control"
                  value={selectedAdmin.email}
                  onChange={(e) => {
                    setSelectedAdmin({
                      ...selectedAdmin,
                      email: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Admin Office
                </label>
                <input
                  type="text"
                  placeholder="Enter Office"
                  className="form-control"
                  value={selectedAdmin.school}
                  onChange={(e) => {
                    setSelectedAdmin({
                      ...selectedAdmin,
                      school: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Admin Designation
                </label>
                <input
                  type="text"
                  placeholder="Enter Designation"
                  className="form-control"
                  value={selectedAdmin.desig}
                  onChange={(e) => {
                    setSelectedAdmin({
                      ...selectedAdmin,
                      desig: e.target.value,
                    });
                  }}
                />
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-primary m-1"
                  onClick={addAdmin}
                >
                  Add
                  <i className="bi bi-box-arrow-in-left"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary m-1"
                  onClick={() => {
                    setShowInput(false);
                    resetInput();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showAdminPassWord && (
          <div className="col-md-6 mx-auto">
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Admin Password
              </label>
              <input
                type="text"
                placeholder="Enter Password"
                className="form-control"
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                }}
              />
            </div>
            <div>
              <button
                type="button"
                className="btn btn-warning m-1"
                disabled={!adminPassword}
                onClick={() => {
                  // eslint-disable-next-line
                  let message = confirm(
                    `Are You Want to Reset Password of Admin ${
                      selectedAdmin?.tname
                    } to ${adminPassword.trim()}`
                  );
                  message
                    ? resetAdminsPassword(selectedAdmin)
                    : toast.success("Password Not Reset!");
                }}
              >
                Update
              </button>
              <button
                type="button"
                className="btn btn-secondary m-1"
                onClick={() => {
                  setShowAdminPassWord(false);
                  setAdminPassword("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <h3 className="text-center text-primary">Registered Administrators</h3>
        {adminsData.length > 0 ? (
          <>
            <h3 className="text-center text-primary">
              Displaying Users Database
            </h3>

            <DataTable
              columns={adminColumns}
              data={adminsData}
              pagination
              highlightOnHover
              fixedHeader
            />
          </>
        ) : (
          <h3 className="text-center text-primary">No Data Found</h3>
        )}
      </div>
      {loader && <Loader />}
    </div>
  );
};

export default RegUsers;
