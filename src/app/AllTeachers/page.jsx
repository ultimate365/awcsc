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
import { useGlobalContext } from "../../context/Store";
import axios from "axios";
import { createDownloadLink } from "@/modules/calculatefunctions";
const AllTeachers = () => {
  const {
    teachersState,
    teacherUpdateTime,
    setTeachersState,
    setTeacherUpdateTime,
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
      sortable: true,
    },
    {
      name: "Teacher Name",
      selector: (row) => row.tname,
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
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
    },

    {
      name: "Access",
      selector: (row) => row.circle,
      sortable: true,
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
            className="btn btn-sm btn-warning"
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
  const createUser = async (el) => {
    setLoader(true);
    const url = `/api/adduserteachers`;
    const entry = {
      teachersID: inputField.teachersID,
      tname: inputField.tname,
      tsname: inputField.tsname,
      school: inputField.school,
      desig: inputField.desig,
      pan: inputField.pan,
      udise: inputField.udise,
      circle: inputField.circle,
      empid: inputField.empid,
      convenor: inputField.convenor,
      gpAssistant: inputField.gpAssistant,
      gp: inputField.gp,
      email: inputField.email,
      phone: inputField.phone,
      id: docId,
      username: inputField.username.toLowerCase(),
      password: bcrypt.hashSync(inputField.password, 10),
      createdAt: inputField.createdAt,
      disabled: false,
    };
    try {
      const response = await axios.post(url, entry);

      if (response.data.success) {
        try {
          await setDoc(doc(firestore, "userteachers", el.id), entry)
            .then(() => {
              getTeacherData();
              setLoader(false);
              toast.success(
                `Registered Successfully with username PAN in LowerCase i.e. ${el.pan.toLowerCase()} and Password EMPID in LowerCase i.e. ${el.empid.toLowerCase()}`,
                {
                  position: "top-right",
                  autoClose: 5000,
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
      const password = bcrypt.hashSync(user.empid.toLowerCase(), 10);
      user.password = password;
      const response = await axios.post(url, user);
      if (response.data.success) {
        const docRef = doc(firestore, "userteachers", user.id);
        await updateDoc(docRef, {
          password,
        })
          .then(() => {
            getTeacherData();
            setLoader(false);
            toast.success(
              `Congrats! User Password Reset to Employee ID in Lower Case i.e. ${user.empid.toLowerCase()} !`,
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
            toast.error("Congrats! User Password Reset Failed!", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          });
      } else {
        toast.error("Failed to Reset Password!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log(response.data);
      }
    } catch (e) {
      toast.error("Failed to Reset Password!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
    </div>
  );
};

export default AllTeachers;
