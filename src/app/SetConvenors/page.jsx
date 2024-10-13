"use client";
import React, { useEffect, useMemo, useState } from "react";

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
import { useGlobalContext } from "../../context/Store";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/Loader";
import axios from "axios";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  filterArrayExtraItems,
  filterArraySameItems,
  removeDuplicates,
} from "../../modules/calculatefunctions";
const SetConvenors = () => {
  const {
    teachersState,
    teacherUpdateTime,
    setTeachersState,
    setTeacherUpdateTime,
    convenorsState,
    convenorsUpdateTime,
    setConvenorsState,
    setConvenorsUpdateTime,
    gpLockState,
    setGpLockState,
    gpLockUpdateTime,
    setGpLockUpdateTime,
  } = useGlobalContext();
  const [isAdmin, setIsAdmin] = useState(false);
  let teacherdetails = {
    tname: "",
    school: "",
    gp: "",
    circle: "taw",
  };

  let details = getCookie("tid");
  let schdetails = getCookie("schid");
  // useEffect(() => {
  //   if (!details) {
  //     if (!schdetails) {
  //       navigate("/logout");
  //     }
  //   }
  //   // eslint-disable-next-line
  // }, []);
  if (details) {
    teacherdetails = decryptObjData("tid");
  }
  if (schdetails) {
    schdetails = decryptObjData("schid");
  }

  const [data, setData] = useState([]);

  const [amoragoriConvenor, setAmoragoriConvenor] = useState({});
  const [bkbatiConvenor, setBkbatiConvenor] = useState({});
  const [gazipurConvenor, setGazipurConvenor] = useState({});
  const [jhamtiaConvenor, setJhamtiaConvenor] = useState({});
  const [jhikiraConvenor, setJhikiraConvenor] = useState({});
  const [joypurConvenor, setJoypurConvenor] = useState({});
  const [nowparaConvenor, setNowparaConvenor] = useState({});
  const [thaliaConvenor, setThaliaConvenor] = useState({});
  const [amoragoriTeachers, setAmoragoriTeachers] = useState([]);
  const [bkbatiTeachers, setBkbatiTeachers] = useState([]);
  const [gazipurTeachers, setGazipurTeachers] = useState([]);
  const [jhamtiaTeachers, setJhamtiaTeachers] = useState([]);
  const [jhikiraTeachers, setJhikiraTeachers] = useState([]);
  const [joypurTeachers, setJoypurTeachers] = useState([]);
  const [nowparaTeachers, setNowparaTeachers] = useState([]);
  const [thaliaTeachers, setThaliaTeachers] = useState([]);

  const [allConvenors, setAllConvenors] = useState([]);

  const [loader, setLoader] = useState(false);

  const getAllConvenors = async () => {
    setLoader(true);
    const q = query(collection(firestore, "allconvenors"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs
      .map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        ...doc.data(),
        // id: doc.id,
      }))
      .sort((a, b) => a?.gp.localeCompare(b?.gp));

    setData(data);
    setConvenorsState(data);
    setLoader(false);
  };

  const teacherData = async () => {
    try {
      const q = query(collection(firestore, "teachers"));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs
        .map((doc) => ({
          // doc.data() is never undefined for query doc snapshots
          ...doc.data(),
          // id: doc.id,
        }))
        .sort((a, b) => {
          if (a?.school < b?.school) {
            return -1;
          }
          if (a?.school > b?.school) {
            return 1;
          }
          return a?.rank - b?.rank;
        });
      setTeachersState(data);
      setTeacherUpdateTime(Date.now());
      filterGPTeachers(data.sort((a, b) => a?.tname.localeCompare(b?.tname)));
    } catch (error) {
      await axios
        .post("/api/getTeacher")
        .then((response) => {
          const data = response.data.data.sort((a, b) => {
            if (a?.school < b?.school) {
              return -1;
            }
            if (a?.school > b?.school) {
              return 1;
            }
            return a?.rank - b?.rank;
          });
          setTeachersState(data);
          setTeacherUpdateTime(Date.now());
          filterGPTeachers(
            data.sort((a, b) => a?.tname.localeCompare(b?.tname))
          );
        })
        .catch((error) => {
          console.error("Error fetching lock data: ", error);
        });
      console.error("Error fetching lock data: ", error);
    }
  };

  const filterGPTeachers = (lists) => {
    setAmoragoriTeachers(lists.filter((el) => el?.gp === "AMORAGORI"));
    setBkbatiTeachers(lists.filter((el) => el?.gp === "BKBATI"));
    setGazipurTeachers(lists.filter((el) => el?.gp === "GAZIPUR"));
    setJhamtiaTeachers(lists.filter((el) => el?.gp === "JHAMTIA"));
    setJhikiraTeachers(lists.filter((el) => el?.gp === "JHIKIRA"));
    setJoypurTeachers(lists.filter((el) => el?.gp === "JOYPUR"));
    setNowparaTeachers(lists.filter((el) => el?.gp === "NOWPARA"));
    setThaliaTeachers(lists.filter((el) => el?.gp === "THALIA"));
  };

  const delConvenor = async () => {
    data?.map(async (el) => {
      setLoader(true);
      updateTeachersState(el?.id, "taw");
      await updateDoc(doc(firestore, "teachers", el?.id), {
        convenor: "taw",
      })
        .then(async () => {
          delFromConvenorsState(el?.id);
          await deleteDoc(doc(firestore, "allconvenors", el?.id));
        })
        .catch((e) => console.log(e));
    });
    const q1 = query(collection(firestore, "userteachers"));
    const querySnapshot1 = await getDocs(q1);
    const data1 = querySnapshot1.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      // id: doc.id,
    }));
    let allIds = data1.map((doc) => doc.id);
    let delConvenorIds = data?.map((convenor) => convenor.id);
    let delUserExists = filterArraySameItems(delConvenorIds, allIds);
    let flush = delUserExists.map(async (id) => {
      await updateDoc(doc(firestore, "userteachers", id), {
        convenor: "taw",
      });
    });
    await Promise.all(flush).then(() => {
      toast.success("All Convenors Deleted Successfully");
      setLoader(false);
      // getAllConvenors();
      delAllConvenorsState();
    });
  };

  const updateConvenorData = async () => {
    setLoader(true);
    const q1 = query(collection(firestore, "userteachers"));
    const querySnapshot1 = await getDocs(q1);
    const data1 = querySnapshot1.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      // id: doc.id,
    }));
    let allIds = data1.map((doc) => doc.id);

    let newConvenors = filterArrayExtraItems(allConvenors, data);
    let delConvenors = filterArrayExtraItems(data, allConvenors);

    let newConvenorIds = newConvenors.map((convenor) => convenor.id);
    let delConvenorIds = delConvenors.map((convenor) => convenor.id);

    let newUserExists = filterArraySameItems(newConvenorIds, allIds);
    let delUserExists = filterArraySameItems(delConvenorIds, allIds);

    if (newUserExists.length > 0) {
      newUserExists.map(
        async (id) =>
          await updateDoc(doc(firestore, "userteachers", id), {
            convenor: "admin",
          })
      );
    }
    if (delUserExists.length > 0) {
      delUserExists.map(
        async (id) =>
          await updateDoc(doc(firestore, "userteachers", id), {
            convenor: "taw",
          })
      );
    }

    let delConvenorUpdate = delConvenors.map(async (el) => {
      updateTeachersState(el?.id, "taw");
      await updateDoc(doc(firestore, "teachers", el?.id), {
        convenor: "taw",
      })
        .then(async () => {
          delFromConvenorsState(el);
          await deleteDoc(doc(firestore, "allconvenors", el?.id));
        })
        .catch((e) => console.log(e));
    });
    await Promise.all(delConvenorUpdate).then(async () => {
      let newConvenorAdd = newConvenors.map(async (el) => {
        el.convenor = "admin";
        el.gpAssistant = "admin";
        await setDoc(doc(firestore, "allconvenors", el?.id), el).then(
          async () => {
            await addNewConvenorMongoDB(el);
            const x = [...convenorsState, el].sort((a, b) =>
              a?.gp.localeCompare(b?.gp)
            );
            setConvenorsState(x);
            setData(x);
            setConvenorsUpdateTime(Date.now());
            updateTeachersState(el?.id, "admin");
            const docRef = doc(firestore, "teachers", el?.id);
            await updateDoc(docRef, {
              convenor: "admin",
            });
          }
        );
      });
      await Promise.all(newConvenorAdd).then(async () => {
        // teacherData();
        // getAllConvenors();
        setLoader(false);
        toast.success("All GP Convenor Created", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setAllConvenors([]);
        setAmoragoriConvenor({});
        setBkbatiConvenor({});
        setGazipurConvenor({});
        setJhamtiaConvenor({});
        setJhikiraConvenor({});
        setJoypurConvenor({});
        setNowparaConvenor({});
        setThaliaConvenor({});
      });
    });
  };

  const openLockForEntry = async () => {
    setLoader(true);
    try {
      let x = [];
      let y = [];
      gpLockState.map(async (el) => {
        const entry = {
          edit: true,
          entryDate: Date.now(),
          closeDate: "",
          entryStaredBy: teacherdetails.tname,
        };
        x = gpLockState.filter((item) => item?.id === el?.id)[0];
        x.edit = true;
        x.entryDate = Date.now();
        x.closeDate = "";
        x.entryStaredBy = teacherdetails.tname;

        y = [...y, x];
        await axios.post(`/api/updategpLockData`, x);
        await updateDoc(doc(firestore, "gpLockData", el?.id), entry)
          .then(() => {
            setLoader(false);
            toast.success(`Student Entry For ${el?.gp} GP Has Been Opened`);
          })
          .catch((e) => {
            console.log(e);
          });
      });
      setGpLockState(y);
      setGpLockUpdateTime(Date.now());
    } catch (e) {
      setLoader(false);
      console.log(e);
    }
  };

  const closeLockForEntry = async () => {
    setLoader(true);
    try {
      let x = [];
      let y = [];

      gpLockState.map(async (el) => {
        const entry = {
          edit: false,
          closeDate: Date.now(),
          entryCloseddBy: teacherdetails.tname,
        };
        x = gpLockState.filter((item) => item?.id === el?.id)[0];
        x.edit = false;
        x.closeDate = "";
        x.entryCloseddBy = teacherdetails.tname;
        y = gpLockState.filter((item) => item?.id !== el?.id);
        y = [...y, x];
        await axios.post(`/api/updategpLockData`, x);
        await updateDoc(doc(firestore, "gpLockData", el?.id), entry)
          .then(() => {
            setLoader(false);
            toast.success(`Student Entry For ${el?.gp} GP Has Been Closed`, {
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
          .catch((e) => {
            console.log(e);
          });
      });
      await waitForSomeTime();
      setGpLockState(y);
      setGpLockUpdateTime(Date.now());
    } catch (e) {
      setLoader(false);
      console.log(e);
    }
  };

  const deleteConvenor = async (id) => {
    setLoader(true);
    updateTeachersState(id, "taw");
    await updateDoc(doc(firestore, "teachers", id), {
      convenor: "taw",
    })
      .then(async () => {
        await deleteDoc(doc(firestore, "allconvenors", id))
          .then(async () => {
            delFromConvenorsState(id);
            try {
              await updateDoc(doc(firestore, "userteachers", id), {
                convenor: "taw",
              }).then(() => {
                // teacherData();
                // getAllConvenors();
                setLoader(false);
                toast.success("GP Convenor Deleted", {
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
              // teacherData();
              // getAllConvenors();
              setLoader(false);
              toast.success("GP Convenor Deleted", {
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
      })
      .catch((e) => console.log(e));
  };

  const columns = useMemo(
    () => [
      {
        name: "Sl",
        selector: (row, index) => index + 1,

        center: +true,
      },
      {
        name: "GP",
        selector: (row) => row.gp,
        sortable: true,
        wrap: true,
        center: +true,
      },
      {
        name: "Teacher Name",
        selector: (row) => row.tname,

        wrap: true,
        center: +true,
      },
      {
        name: "School Name",
        selector: (row) => row.school,

        wrap: true,
        center: +true,
      },
      {
        name: "Mobile No.",
        selector: (row) => (
          <a
            href={`tel: +91${row.phone}`}
            className="d-inline-block mb-2 text-decoration-none text-dark"
          >
            <i className="bi bi-telephone-fill"></i>
            {"  "}
            +91{row.phone}
          </a>
        ),

        wrap: true,
        center: +true,
      },
      {
        name: "Actions",
        selector: (row) =>
          teacherdetails.circle === "admin" ? (
            <button
              type="button"
              className="btn btn-danger m-1"
              onClick={() => {
                //eslint-disable-next-line
                let confirmDelete = confirm(
                  `Are You Want to Remove Convenor ${row.tname} of ${row.gp} GP?`
                );
                if (confirmDelete) {
                  deleteConvenor(row.id);
                } else {
                  toast.success("GP Convenor Not Deleted", {
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
              Delete
            </button>
          ) : null,

        wrap: true,
        center: +true,
        omit: !isAdmin,
      },
    ],
    // eslint-disable-next-line
    [isAdmin]
  );

  const updateTeachersState = async (id, access) => {
    let x = teachersState.filter((item) => item.id === id)[0];
    x.convenor = access;
    let y = teachersState.filter((item) => item.id !== id);
    y = [...y, x];
    const newData = y.sort((a, b) => {
      // First, compare the "school" keys
      if (a?.school < b?.school) {
        return -1;
      }
      if (a?.school > b?.school) {
        return 1;
      }
      // If "school" keys are equal, compare the "rank" keys
      return a?.rank - b?.rank;
    });
    setTeachersState(newData);
    setTeacherUpdateTime(Date.now());
    await updTeacherMongoDB(id, access);
  };

  const delFromConvenorsState = async (id) => {
    let y = convenorsState.filter((item) => item.id !== id);
    setConvenorsState(y);
    setConvenorsUpdateTime(Date.now());
    await delConvenorMongoDB(id);
  };
  const delAllConvenorsState = async () => {
    setConvenorsState([]);
    setConvenorsUpdateTime(Date.now());
    await delAllConvenorMongoDB();
  };

  const updTeacherMongoDB = async (id, access) => {
    setLoader(true);
    const url = `/api/updTeacherConvenor`;
    try {
      const response = await axios.post(url, { id, convenor: access });
      const record = response.data;
      if (record.success) {
        console.log("GP Convenor Updated Successfully from MongoDB");
        setLoader(false);
      } else {
        setLoader(false);
        console.error(`Failed to update teacher in MongoDB: ${e}`);
      }
    } catch (e) {
      setLoader(false);
      console.error(`Failed to update teacher in MongoDB: ${e}`);
    }
  };

  const addNewConvenorMongoDB = async (convenor) => {
    setLoader(true);
    const url = `/api/addallconvenors`;
    try {
      const response = await axios.post(url, convenor);
      const record = response.data;
      if (record.success) {
        setLoader(false);
        console.log("New GP Convenor Added Successfully from MongoDB");
      } else {
        setLoader(false);
        console.error(`Failed to delete teacher in MongoDB: ${e}`);
      }
    } catch (e) {
      setLoader(false);
      console.error(`Failed to delete teacher in MongoDB: ${e}`);
    }
  };
  const delConvenorMongoDB = async (id) => {
    setLoader(true);
    const url = `/api/delconvenor`;
    try {
      const response = await axios.post(url, { id });
      const record = response.data;
      if (record.success) {
        setLoader(false);
        console.log("GP Convenor Deleted Successfully from MongoDB");
      } else {
        setLoader(false);
        console.error(`Failed to delete teacher in MongoDB: ${e}`);
      }
    } catch (e) {
      setLoader(false);
      console.error(`Failed to delete teacher in MongoDB: ${e}`);
    }
  };
  const delAllConvenorMongoDB = async (id) => {
    setLoader(true);
    const url = `/api/Flushallconvenors`;
    try {
      const response = await axios.post(url);
      const record = response.data;
      if (record.success) {
        setLoader(false);
        console.log("GP Convenor Deleted Successfully from MongoDB");
      } else {
        setLoader(false);
        console.error(`Failed to delete teacher in MongoDB: ${e}`);
      }
    } catch (e) {
      setLoader(false);
      console.error(`Failed to delete teacher in MongoDB: ${e}`);
    }
  };

  const waitForSomeTime = async () => {
    // Simulate a delay
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  useEffect(() => {
    document.title = "AWC Sports App:Convenors";
    const difference = (Date.now() - convenorsUpdateTime) / 1000 / 60 / 15;
    if (convenorsState?.length === 0 || difference >= 1) {
      getAllConvenors();
    } else {
      setData(convenorsState);
    }
    const difference2 = (Date.now() - teacherUpdateTime) / 1000 / 60 / 15;
    if (teachersState?.length === 0 || difference2 >= 1) {
      teacherData();
    } else {
      setData(teachersState);
      filterGPTeachers(teachersState);
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    // eslint-disable-next-line
  }, [
    data,
    amoragoriConvenor,
    bkbatiConvenor,
    gazipurConvenor,
    jhamtiaConvenor,
    jhikiraConvenor,
    joypurConvenor,
    nowparaConvenor,
    thaliaConvenor,

    allConvenors,
  ]);
  useEffect(() => {
    if (teacherdetails.circle === "admin") {
      setIsAdmin(true);
    }
    // eslint-disable-next-line
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
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {loader ? <Loader /> : null}
      {teacherdetails.circle === "admin" && (
        <div className="container my-4 text-center">
          <button
            type="button"
            className="btn btn-primary m-1"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            Set Up Convenors
          </button>
          <button
            type="button"
            className="btn btn-success m-1"
            onClick={getAllConvenors}
          >
            Refresh Convenors
          </button>
          {data?.length > 0 && (
            <div>
              <button
                type="button"
                className="btn btn-danger m-1"
                onClick={() => {
                  //eslint-disable-next-line
                  let confirmDelete = confirm(
                    `Are You Want to Remove All Convenors?`
                  );
                  if (confirmDelete) {
                    delConvenor();
                  } else {
                    toast.success("GP Convenor Not Deleted", {
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
                Remove All Convenors
              </button>
              <button
                type="button"
                className="btn btn-success m-1"
                onClick={openLockForEntry}
              >
                Open Student Entry For All Gp
              </button>
              <button
                type="button"
                className="btn btn-danger m-1"
                onClick={closeLockForEntry}
              >
                Close Student Entry For All Gp
              </button>
            </div>
          )}
        </div>
      )}

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title " id="staticBackdropLabel">
                ADD GP CONVENORS
              </h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setAllConvenors([]);
                  document.getElementById("amoAdmin1").value = "";
                  document.getElementById("bkbatiAdmin1").value = "";
                  document.getElementById("gaziAdmin1").value = "";
                  document.getElementById("jhamAdmin1").value = "";
                  document.getElementById("jhikAdmin1").value = "";
                  document.getElementById("joyAdmin1").value = "";
                  document.getElementById("nowAdmin1").value = "";
                  document.getElementById("thalAdmin1").value = "";
                }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                <h6 className="text-primary col-md-2">GP Name</h6>
                <h6 className="text-primary col-md-4 mx-auto">
                  Select Convenor
                </h6>
              </div>

              <div className="row justify-content-center align-items-center mx-auto mb-3">
                <h6 className="text-primary col-md-2">AMORAGORI</h6>
                <div className="col-md-4 mx-auto mb-2">
                  <select
                    className="form-select"
                    id="amoAdmin1"
                    defaultValue={""}
                    onChange={(e) => {
                      let x = [];
                      x = [
                        ...x,
                        e.target.value !== "" ? JSON.parse(e.target.value) : "",
                      ];
                      setAmoragoriConvenor(x[0]);
                      let teacher = {
                        convenor: "admin",
                      };
                      if (e.target.value !== "") {
                        teacher = JSON.parse(e.target.value);
                        teacher = { ...teacher, convenor: "admin" };
                      }
                      let y = [];
                      y = [
                        ...allConvenors,
                        e.target.value !== "" ? teacher : "",
                      ];
                      y = y.filter((el) => el !== "");
                      setAllConvenors(removeDuplicates(y));
                      document.getElementById("amoAdmin1").value = "";
                    }}
                    aria-label="Default select example"
                  >
                    <option value="">Select Convenor Name</option>
                    {amoragoriTeachers.map((el, ind) => {
                      return (
                        <option value={JSON.stringify(el)} key={ind}>
                          {el?.tname}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                {data?.length > 0 &&
                  data
                    .filter((el) => el?.gp === "AMORAGORI")
                    .map((el, ind) => (
                      <h6 className="text-primary col-md-4" key={ind}>
                        Current Convenor {ind + 1}: {el?.tname}
                      </h6>
                    ))}

                {allConvenors.length > 0 &&
                allConvenors.filter((el) => el?.gp === "AMORAGORI").length >
                  0 ? (
                  <div className="row justify-content-center align-items-center mx-auto mb-3">
                    {allConvenors
                      .filter((el) => el?.gp === "AMORAGORI")
                      .map((el, ind) => (
                        <div className="col-md-6  mb-2 " key={ind}>
                          <h6 className="text-primary ">
                            Selected Convenor {ind + 1}: {el?.tname}
                          </h6>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              let x = allConvenors.filter(
                                (elem) => el?.id !== elem.id
                              );
                              setAllConvenors(x);
                              if (
                                x.filter((el) => el?.gp === "AMORAGORI")
                                  .length === 0
                              ) {
                                document.getElementById("amoAdmin1").value = "";
                              }
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                  </div>
                ) : null}
              </div>
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                <h6 className="text-primary col-md-2">BKBATI</h6>
                <div className="col-md-4 mx-auto mb-2 ">
                  <select
                    className="form-select"
                    id="bkbatiAdmin1"
                    defaultValue={""}
                    onChange={(e) => {
                      let x = [];
                      x = [
                        ...x,
                        e.target.value !== "" ? JSON.parse(e.target.value) : "",
                      ];
                      setBkbatiConvenor(x[0]);
                      let teacher = {
                        convenor: "admin",
                      };
                      if (e.target.value !== "") {
                        teacher = JSON.parse(e.target.value);
                        teacher = { ...teacher, convenor: "admin" };
                      }
                      let y = [];
                      y = [
                        ...allConvenors,
                        e.target.value !== "" ? teacher : "",
                      ];
                      y = y.filter((el) => el !== "");
                      setAllConvenors(removeDuplicates(y));
                      document.getElementById("bkbatiAdmin1").value = "";
                    }}
                    aria-label="Default select example"
                  >
                    <option value="">Select Convenor Name</option>
                    {bkbatiTeachers.map((el, ind) => {
                      return (
                        <option value={JSON.stringify(el)} key={ind}>
                          {el?.tname}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                {data?.length > 0 &&
                  data
                    .filter((el) => el?.gp === "BKBATI")
                    .map((el, ind) => (
                      <h6 className="text-primary col-md-4" key={ind}>
                        Current Convenor {ind + 1}: {el?.tname}
                      </h6>
                    ))}
              </div>
              {allConvenors.length > 0 &&
              allConvenors.filter((el) => el?.gp === "BKBATI").length > 0 ? (
                <div className="row justify-content-center align-items-center mx-auto mb-3">
                  {allConvenors
                    .filter((el) => el?.gp === "BKBATI")
                    .map((el, ind) => (
                      <div className="col-md-6  mb-2 " key={ind}>
                        <h6 className="text-primary ">
                          Selected Convenor {ind + 1}: {el?.tname}
                        </h6>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            let x = allConvenors.filter(
                              (elem) => el?.id !== elem.id
                            );
                            setAllConvenors(x);
                            if (
                              x.filter((el) => el?.gp === "BKBATI").length === 0
                            ) {
                              document.getElementById("bkbatiAdmin1").value =
                                "";
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              ) : null}
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                <h6 className="text-primary col-md-2">GAZIPUR</h6>
                <div className="col-md-4 mx-auto mb-2 ">
                  <select
                    className="form-select"
                    id="gaziAdmin1"
                    defaultValue={""}
                    onChange={(e) => {
                      let x = [];
                      x = [
                        ...x,
                        e.target.value !== "" ? JSON.parse(e.target.value) : "",
                      ];
                      setGazipurConvenor(x[0]);
                      let teacher = {
                        convenor: "admin",
                      };
                      if (e.target.value !== "") {
                        teacher = JSON.parse(e.target.value);
                        teacher = { ...teacher, convenor: "admin" };
                      }
                      let y = [];
                      y = [
                        ...allConvenors,
                        e.target.value !== "" ? teacher : "",
                      ];
                      y = y.filter((el) => el !== "");
                      setAllConvenors(removeDuplicates(y));
                      document.getElementById("gaziAdmin1").value = "";
                    }}
                    aria-label="Default select example"
                  >
                    <option value="">Select Convenor Name</option>
                    {gazipurTeachers.map((el, ind) => {
                      return (
                        <option value={JSON.stringify(el)} key={ind}>
                          {el?.tname}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                {data?.length > 0 &&
                  data
                    .filter((el) => el?.gp === "GAZIPUR")
                    .map((el, ind) => (
                      <h6 className="text-primary col-md-4" key={ind}>
                        Current Convenor {ind + 1}: {el?.tname}
                      </h6>
                    ))}
              </div>
              {allConvenors.length > 0 &&
              allConvenors.filter((el) => el?.gp === "GAZIPUR").length > 0 ? (
                <div className="row justify-content-center align-items-center mx-auto mb-3">
                  {allConvenors
                    .filter((el) => el?.gp === "GAZIPUR")
                    .map((el, ind) => (
                      <div className="col-md-6  mb-2 " key={ind}>
                        <h6 className="text-primary ">
                          Selected Convenor {ind + 1}: {el?.tname}
                        </h6>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            let x = allConvenors.filter(
                              (elem) => el?.id !== elem.id
                            );
                            setAllConvenors(x);
                            if (
                              x.filter((el) => el?.gp === "GAZIPUR").length ===
                              0
                            ) {
                              document.getElementById("gaziAdmin1").value = "";
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              ) : null}
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                <h6 className="text-primary col-md-2">JHAMTIA</h6>
                <div className="col-md-4 mx-auto mb-2 ">
                  <select
                    className="form-select"
                    id="jhamAdmin1"
                    defaultValue={""}
                    onChange={(e) => {
                      let x = [];
                      x = [
                        ...x,
                        e.target.value !== "" ? JSON.parse(e.target.value) : "",
                      ];
                      setJhamtiaConvenor(x[0]);
                      let teacher = {
                        convenor: "admin",
                      };
                      if (e.target.value !== "") {
                        teacher = JSON.parse(e.target.value);
                        teacher = { ...teacher, convenor: "admin" };
                      }
                      let y = [];
                      y = [
                        ...allConvenors,
                        e.target.value !== "" ? teacher : "",
                      ];
                      y = y.filter((el) => el !== "");
                      setAllConvenors(removeDuplicates(y));
                      document.getElementById("jhamAdmin1").value = "";
                    }}
                    aria-label="Default select example"
                  >
                    <option value="">Select Convenor Name</option>
                    {jhamtiaTeachers.map((el, ind) => {
                      return (
                        <option value={JSON.stringify(el)} key={ind}>
                          {el?.tname}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                {data?.length > 0 &&
                  data
                    .filter((el) => el?.gp === "JHAMTIA")
                    .map((el, ind) => (
                      <h6 className="text-primary col-md-4" key={ind}>
                        Current Convenor {ind + 1}: {el?.tname}
                      </h6>
                    ))}
              </div>
              {allConvenors.length > 0 &&
              allConvenors.filter((el) => el?.gp === "JHAMTIA").length > 0 ? (
                <div className="row justify-content-center align-items-center mx-auto mb-3">
                  {allConvenors
                    .filter((el) => el?.gp === "JHAMTIA")
                    .map((el, ind) => (
                      <div className="col-md-6  mb-2 " key={ind}>
                        <h6 className="text-primary ">
                          Selected Convenor {ind + 1}: {el?.tname}
                        </h6>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            let x = allConvenors.filter(
                              (elem) => el?.id !== elem.id
                            );
                            setAllConvenors(x);
                            if (
                              x.filter((el) => el?.gp === "JHAMTIA").length ===
                              0
                            ) {
                              document.getElementById("jhamAdmin1").value = "";
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              ) : null}
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                <h6 className="text-primary col-md-2">JHIKIRA</h6>
                <div className="col-md-4 mx-auto mb-2 ">
                  <select
                    className="form-select"
                    id="jhikAdmin1"
                    defaultValue={""}
                    onChange={(e) => {
                      let x = [];
                      x = [
                        ...x,
                        e.target.value !== "" ? JSON.parse(e.target.value) : "",
                      ];
                      setJhikiraConvenor(x[0]);
                      let teacher = {
                        convenor: "admin",
                      };
                      if (e.target.value !== "") {
                        teacher = JSON.parse(e.target.value);
                        teacher = { ...teacher, convenor: "admin" };
                      }
                      let y = [];
                      y = [
                        ...allConvenors,
                        e.target.value !== "" ? teacher : "",
                      ];
                      y = y.filter((el) => el !== "");
                      setAllConvenors(removeDuplicates(y));
                      document.getElementById("jhikAdmin1").value = "";
                    }}
                    aria-label="Default select example"
                  >
                    <option value="">Select Convenor Name</option>
                    {jhikiraTeachers.map((el, ind) => {
                      return (
                        <option value={JSON.stringify(el)} key={ind}>
                          {el?.tname}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                {data?.length > 0 &&
                  data
                    .filter((el) => el?.gp === "JHIKIRA")
                    .map((el, ind) => (
                      <h6 className="text-primary col-md-4" key={ind}>
                        Current Convenor {ind + 1}: {el?.tname}
                      </h6>
                    ))}
              </div>
              {allConvenors.length > 0 &&
              allConvenors.filter((el) => el?.gp === "JHIKIRA").length > 0 ? (
                <div className="row justify-content-center align-items-center mx-auto mb-3">
                  {allConvenors
                    .filter((el) => el?.gp === "JHIKIRA")
                    .map((el, ind) => (
                      <div className="col-md-6  mb-2 " key={ind}>
                        <h6 className="text-primary ">
                          Selected Convenor {ind + 1}: {el?.tname}
                        </h6>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            let x = allConvenors.filter(
                              (elem) => el?.id !== elem.id
                            );
                            setAllConvenors(x);
                            if (
                              x.filter((el) => el?.gp === "JHIKIRA").length ===
                              0
                            ) {
                              document.getElementById("jhikAdmin1").value = "";
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              ) : null}
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                <h6 className="text-primary col-md-2">JOYPUR</h6>
                <div className="col-md-4 mx-auto mb-2 ">
                  <select
                    className="form-select"
                    id="joyAdmin1"
                    defaultValue={""}
                    onChange={(e) => {
                      let x = [];
                      x = [
                        ...x,
                        e.target.value !== "" ? JSON.parse(e.target.value) : "",
                      ];
                      setJoypurConvenor(x[0]);
                      let teacher = {
                        convenor: "admin",
                      };
                      if (e.target.value !== "") {
                        teacher = JSON.parse(e.target.value);
                        teacher = { ...teacher, convenor: "admin" };
                      }
                      let y = [];
                      y = [
                        ...allConvenors,
                        e.target.value !== "" ? teacher : "",
                      ];
                      y = y.filter((el) => el !== "");
                      setAllConvenors(removeDuplicates(y));
                      document.getElementById("joyAdmin1").value = "";
                    }}
                    aria-label="Default select example"
                  >
                    <option value="">Select Convenor Name</option>
                    {joypurTeachers.map((el, ind) => {
                      return (
                        <option value={JSON.stringify(el)} key={ind}>
                          {el?.tname}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                {data?.length > 0 &&
                  data
                    .filter((el) => el?.gp === "JOYPUR")
                    .map((el, ind) => (
                      <h6 className="text-primary col-md-4" key={ind}>
                        Current Convenor {ind + 1}: {el?.tname}
                      </h6>
                    ))}
              </div>
              {allConvenors.length > 0 &&
              allConvenors.filter((el) => el?.gp === "JOYPUR").length > 0 ? (
                <div className="row justify-content-center align-items-center mx-auto mb-3">
                  {allConvenors
                    .filter((el) => el?.gp === "JOYPUR")
                    .map((el, ind) => (
                      <div className="col-md-6  mb-2 " key={ind}>
                        <h6 className="text-primary ">
                          Selected Convenor {ind + 1}: {el?.tname}
                        </h6>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            let x = allConvenors.filter(
                              (elem) => el?.id !== elem.id
                            );
                            setAllConvenors(x);
                            if (
                              x.filter((el) => el?.gp === "JOYPUR").length === 0
                            ) {
                              document.getElementById("joyAdmin1").value = "";
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              ) : null}
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                <h6 className="text-primary col-md-2">NOWPARA</h6>
                <div className="col-md-4 mx-auto mb-2 ">
                  <select
                    className="form-select"
                    id="nowAdmin1"
                    defaultValue={""}
                    onChange={(e) => {
                      let x = [];
                      x = [
                        ...x,
                        e.target.value !== "" ? JSON.parse(e.target.value) : "",
                      ];
                      setNowparaConvenor(x[0]);
                      let teacher = {
                        convenor: "admin",
                      };
                      if (e.target.value !== "") {
                        teacher = JSON.parse(e.target.value);
                        teacher = { ...teacher, convenor: "admin" };
                      }
                      let y = [];
                      y = [
                        ...allConvenors,
                        e.target.value !== "" ? teacher : "",
                      ];
                      y = y.filter((el) => el !== "");
                      setAllConvenors(removeDuplicates(y));
                      document.getElementById("nowAdmin1").value = "";
                    }}
                    aria-label="Default select example"
                  >
                    <option value="">Select Convenor Name</option>
                    {nowparaTeachers.map((el, ind) => {
                      return (
                        <option value={JSON.stringify(el)} key={ind}>
                          {el?.tname}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                {data?.length > 0 &&
                  data
                    .filter((el) => el?.gp === "NOWPARA")
                    .map((el, ind) => (
                      <h6 className="text-primary col-md-4" key={ind}>
                        Current Convenor {ind + 1}: {el?.tname}
                      </h6>
                    ))}
              </div>
              {allConvenors.length > 0 &&
              allConvenors.filter((el) => el?.gp === "NOWPARA").length > 0 ? (
                <div className="row justify-content-center align-items-center mx-auto mb-3">
                  {allConvenors
                    .filter((el) => el?.gp === "NOWPARA")
                    .map((el, ind) => (
                      <div className="col-md-6  mb-2 " key={ind}>
                        <h6 className="text-primary ">
                          Selected Convenor {ind + 1}: {el?.tname}
                        </h6>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            let x = allConvenors.filter(
                              (elem) => el?.id !== elem.id
                            );
                            setAllConvenors(x);
                            if (
                              x.filter((el) => el?.gp === "NOWPARA").length ===
                              0
                            ) {
                              document.getElementById("nowAdmin1").value = "";
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              ) : null}
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                <h6 className="text-primary col-md-2">THALIA</h6>
                <div className="col-md-4 mx-auto mb-2 ">
                  <select
                    className="form-select"
                    id="thalAdmin1"
                    defaultValue={""}
                    onChange={(e) => {
                      let x = [];
                      x = [
                        ...x,
                        e.target.value !== "" ? JSON.parse(e.target.value) : "",
                      ];
                      setThaliaConvenor(x[0]);
                      let teacher = {
                        convenor: "admin",
                      };
                      if (e.target.value !== "") {
                        teacher = JSON.parse(e.target.value);
                        teacher = { ...teacher, convenor: "admin" };
                      }
                      let y = [];
                      y = [
                        ...allConvenors,
                        e.target.value !== "" ? teacher : "",
                      ];
                      y = y.filter((el) => el !== "");
                      setAllConvenors(removeDuplicates(y));
                      document.getElementById("thalAdmin1").value = "";
                    }}
                    aria-label="Default select example"
                  >
                    <option value="">Select Convenor Name</option>
                    {thaliaTeachers.map((el, ind) => {
                      return (
                        <option value={JSON.stringify(el)} key={ind}>
                          {el?.tname}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="row justify-content-center align-items-center mx-auto mb-3">
                {data?.length > 0 &&
                  data
                    .filter((el) => el?.gp === "THALIA")
                    .map((el, ind) => (
                      <h6 className="text-primary col-md-4" key={ind}>
                        Current Convenor {ind + 1}: {el?.tname}
                      </h6>
                    ))}
              </div>
              {allConvenors.length > 0 &&
              allConvenors.filter((el) => el?.gp === "THALIA").length > 0 ? (
                <div className="row justify-content-center align-items-center mx-auto mb-3">
                  {allConvenors
                    .filter((el) => el?.gp === "THALIA")
                    .map((el, ind) => (
                      <div className="col-md-6  mb-2 " key={ind}>
                        <h6 className="text-primary ">
                          Selected Convenor {ind + 1}: {el?.tname}
                        </h6>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            let x = allConvenors.filter(
                              (elem) => el?.id !== elem.id
                            );
                            setAllConvenors(x);
                            if (
                              x.filter((el) => el?.gp === "THALIA").length === 0
                            ) {
                              document.getElementById("thalAdmin1").value = "";
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              ) : null}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={() => {
                  if (
                    allConvenors.filter((el) => el?.gp === "AMORAGORI").length >
                      0 &&
                    allConvenors.filter((el) => el?.gp === "BKBATI").length >
                      0 &&
                    allConvenors.filter((el) => el?.gp === "GAZIPUR").length >
                      0 &&
                    allConvenors.filter((el) => el?.gp === "JHAMTIA").length >
                      0 &&
                    allConvenors.filter((el) => el?.gp === "JHIKIRA").length >
                      0 &&
                    allConvenors.filter((el) => el?.gp === "JOYPUR").length >
                      0 &&
                    allConvenors.filter((el) => el?.gp === "NOWPARA").length >
                      0 &&
                    allConvenors.filter((el) => el?.gp === "THALIA").length > 0
                  ) {
                    updateConvenorData();
                  } else {
                    toast.error("Please Select All GP Convenor", {
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
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => {
                  setAllConvenors([]);
                  document.getElementById("amoAdmin1").value = "";
                  document.getElementById("bkbatiAdmin1").value = "";
                  document.getElementById("gaziAdmin1").value = "";
                  document.getElementById("jhamAdmin1").value = "";
                  document.getElementById("jhikAdmin1").value = "";
                  document.getElementById("joyAdmin1").value = "";
                  document.getElementById("nowAdmin1").value = "";
                  document.getElementById("thalAdmin1").value = "";
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-center text-primary">Displaying GP Convenors</h3>

      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        fixedHeader
        responsive
        striped
      />
    </div>
  );
};

export default SetConvenors;
