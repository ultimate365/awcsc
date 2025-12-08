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
  createDownloadLink,
  DateValueToString,
} from "@/modules/calculatefunctions";
import { v4 as uuid } from "uuid";
import {
  generateID,
  generateRandomPAN,
  generateRandomUDISE,
} from "../../modules/calculatefunctions";
const RegUsers = () => {
  const docID = uuid().split("-")[0];
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

  const [searchSchool, setSearchSchool] = useState("");
  const [adminsData, setAdminsData] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const [filterSchoolData, setFilterSchoolData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showEditSchool, setShowEditSchool] = useState(false);
  const [schoolField, setSchoolField] = useState({
    id: "",
    school: "",
    udise: "",
    gp: "",
    year: "",
    hoi: "",
    convenor: "taw",
    phone: "",
  });
  const [selectedAdmin, setSelectedAdmin] = useState({
    id: `teacher-${docID}`,
    disabled: false,
    pan: generateRandomPAN(),
    createdAt: Date.now(),
    school: "",
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
    console.log("data", data);
    setAdminsData(data);
  };
  const resetInput = () => {
    setSelectedAdmin({
      id: `teacher-${docID}`,
      disabled: false,
      pan: generateRandomPAN(),
      createdAt: Date.now(),
      school: "",
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
    document.title = "AWC Sports App:User Databse";
    schoolUserData();
    userAdminData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const resultSchool = schoolData.filter((el) => {
      return el.school.toLowerCase().match(searchSchool.toLowerCase());
    });
    setFilterSchoolData(resultSchool);
    // eslint-disable-next-line
  }, [searchSchool, schoolData]);

  const schoolColumns = [
    {
      name: "Sl",
      selector: (row, index) =>
        schoolData.findIndex((i) => i.id === row?.id) + 1,
      width: "16%",
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
      width: "20%",
    },

    {
      name: "Edit",
      cell: (row) => {
        return (
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => {
              setSchoolField(row);
              setShowEditSchool(true);
            }}
          >
            Edit
          </button>
        );
      },
      width: "24%",
      center: +true,
      wrap: +true,
    },
    // {
    //   name: "Reset Password",
    //   cell: (row) => {
    //     const isPasswordChanged = !compare(
    //       `${row.id}@${row.gp.toLowerCase()}`,
    //       row.password
    //     );
    //     if (isPasswordChanged) {
    //       return (
    //         <button
    //           type="button"
    //           className="btn btn-sm"
    //           style={{ fontSize: 9 }}
    //           onClick={() => {
    //             // eslint-disable-next-line
    //             let message = confirm(
    //               `Are You Sure To Reset Password of ${row.school} to ${
    //                 row.id
    //               }@${row.gp.toLowerCase()}? `
    //             );
    //             message
    //               ? resetSchoolPassword(row)
    //               : toast.error("School Password Not Resetted!", {
    //                   position: "top-right",
    //                   autoClose: 1500,
    //                   hideProgressBar: false,
    //                   closeOnClick: true,
    //                   pauseOnHover: true,
    //                   draggable: true,
    //                   progress: undefined,
    //                   theme: "light",
    //                 });
    //           }}
    //         >
    //           <i className="bi bi-arrow-counterclockwise text-warning fs-1"></i>
    //         </button>
    //       );
    //     } else {
    //       return <i className="bi bi-check-circle-fill text-success fs-4"></i>;
    //     }
    //   },
    //   width: "10%",
    //   center: +true,
    //   wrap: +true,
    // },
  ];

  const adminColumns = [
    {
      name: "Sl",
      selector: (row, index) =>
        adminsData.findIndex((i) => i.id === row?.id) + 1,
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
  ];

  const updateUserSchool = async () => {
    setLoader(true);
    try {
      const docRef = doc(firestore, "userschools", schoolField.id);
      await updateDoc(docRef, {
        hoi: schoolField.hoi,
        username: schoolField.username,
        phone: schoolField.phone,
      })
        .then(() => {
          setLoader(false);
          schoolUserData();
          toast.success("Congrats! School Details Updated Successfully!");
          setShowEditSchool(false);
        })
        .catch((e) => {
          setLoader(false);
          toast.error("Congrats! School Details Update Failed!");
        });
    } catch (error) {
      setLoader(false);
      toast.error("Congrats! School Details Update Failed!");
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
          className="btn btn-success m-2"
          onClick={() => {
            createDownloadLink(schoolData, "userschools");
          }}
        >
          Download User School's Data
        </button>
      </div>
      {!showInput && (
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

        <h3 className="text-center text-primary my-3">
          Registered Administrators
        </h3>
        {adminsData.length > 0 ? (
          <>
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
      {showEditSchool && (
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
                  Edit School Details
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowEditSchool(false);
                  }}
                ></button>
              </div>
              <div className="modal-body modal-xl">
                <div className="mb-3">
                  <label className="form-label">Enter School Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter School Name"
                    value={schoolField.school}
                    onChange={(e) => {
                      setSchoolField({
                        ...schoolField,
                        school: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Enter HOI Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter HOI Name"
                    value={schoolField.hoi}
                    onChange={(e) => {
                      setSchoolField({
                        ...schoolField,
                        hoi: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Enter Phone</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Phone"
                    value={schoolField.phone}
                    onChange={(e) => {
                      e.target.value.toString().length <= 10 &&
                        setSchoolField({
                          ...schoolField,
                          phone: e.target.value,
                        });
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer d-flex flex-column">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    updateUserSchool();
                    setShowEditSchool(false);
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditSchool(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {loader && <Loader />}
    </div>
  );
};

export default RegUsers;
