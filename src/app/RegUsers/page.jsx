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
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../context/FirbaseContext";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";
import Loader from "../../components/Loader";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  comparePassword,
  createDownloadLink,
  DateValueToSring,
} from "@/modules/calculatefunctions";
import { useGlobalContext } from "../../context/Store";
import axios from "axios";
const RegUsers = () => {
  const { teachersState, setTeachersState, setTeacherUpdateTime } =
    useGlobalContext();
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
  const [showSchoolTable, setShowSchoolTable] = useState(false);
  const [searchSchool, setSearchSchool] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const [filterSchoolData, setFilterSchoolData] = useState([]);
  const [loader, setLoader] = useState(false);
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
    // } catch (error) {
    //   await axios
    //     .post(`/api/getuserteachers`)
    //     .then((data) => {
    //       const res = data.data?.data;
    //       setData(res);
    //       setFilteredData(res);
    //       setShowTable(true);
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //       setLoader(false);
    //     });
    //   console.log(error);
    // }
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
    // } catch (error) {
    //   await axios
    //     .post(`/api/getuserschools`)
    //     .then((data) => {
    //       const res = data.data?.data;
    //       setSchoolData(res);
    //       setFilterSchoolData(res);
    //       setShowSchoolTable(true);
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //       setLoader(false);
    //     });
    //   console.log(error);
    // }
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
      selector: (row) => DateValueToSring(row.createdAt),
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
            message ? deleteUser(row) : alert("Teacher Not Deleted");
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
              message ? restoreUser(row.id) : alert("User Login Not Restored!");
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
              message ? disableUser(row.id) : alert("User Login Not Disabled!");
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
              className="btn btn-sm btn-warning"
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
              Reset Password
            </button>
          );
        } else {
          return (
            <h5>
              <span className="badge bg-success">Default Password</span>
            </h5>
          );
        }
      },
      width: "10%",
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
      setTeacherUpdateTime(Date.now());
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

  return (
    <div className="container text-center my-5">
      {loader ? <Loader /> : null}
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
      {showTable ? (
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
      ) : (
        <Loader />
      )}
      {showSchoolTable ? (
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
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default RegUsers;
