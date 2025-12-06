"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { firestore } from "../../context/FirbaseContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";
import Loader from "../../components/Loader";
import CustomInput from "../../components/CustomInput";
import {
  decryptObjData,
  encryptObjData,
  getCookie,
  setCookie,
} from "../../modules/encryption";
import { useGlobalContext } from "../../context/Store";
import axios from "axios";
import Link from "next/link";
import {
  getCollection,
  getDocumentByField,
} from "../../firebase/firestoreHelper";
const Login = () => {
  const { setState } = useGlobalContext();
  const [loader, setLoader] = useState(false);
  const [inputField, setInputField] = useState({
    username: "",
    password: "",
  });
  const [errField, setErrField] = useState({
    usernameErr: "",
    passwordErr: "",
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showDevTechField, setShowDevTechField] = useState(false);
  const [empid, setEmpid] = useState("");
  const [udise, setUdise] = useState("");
  const [showDevSchoolField, setShowDevSchoolField] = useState(false);
  const navigate = useRouter();
  const validForm = () => {
    let formIsValid = true;
    setErrField({
      usernameErr: "",
      passwordErr: "",
    });
    if (inputField.username === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        usernameErr: "Please Enter Valid username",
      }));
    }
    if (inputField.password === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        passwordErr: "Please Enter Password",
      }));
    }

    return formIsValid;
  };
  const compare = (userPassword, serverPassword) => {
    let match = bcrypt.compareSync(userPassword, serverPassword);

    return match;
  };

  const submitBtn = async (e) => {
    e.preventDefault();
    // console.log(inputField);
    if (validForm()) {
      try {
        setLoader(true);
        const collectionRef = collection(firestore, "sportsUsers");
        const q = query(
          collectionRef,
          where("username", "==", inputField.username.toLowerCase())
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
          let fdata = querySnapshot.docs[0].data();

          // if (fdata.password === inputField.password) {
          if (compare(inputField.password, fdata.password)) {
            if (!fdata.disabled) {
              setLoader(false);
              toast.success("Congrats! You are Logined Successfully!");
              const collectionRef2 = collection(firestore, "teachers");
              const q2 = query(collectionRef2, where("pan", "==", fdata.pan));
              const querySnapshot2 = await getDocs(q2);
              // console.log(querySnapshot.docs[0].data().pan);

              let fdata2 = querySnapshot2.docs[0].data();

              // encryptObjData("uid", fdata, 10080);
              // encryptObjData("tid", fdata2, 10080);
              // setCookie("t", fdata2.tname, 10080);
              // setCookie("loggedAt", Date.now(), 10080);
              // setState({
              //   USER: fdata,
              //   ACCESS: fdata.circle,
              //   LOGGEDAT: Date.now(),
              //   TYPE: "teacher",
              // });
              encryptObjData("nonVerifiedUid", fdata, 10080);
              encryptObjData("nonVerifiedTid", fdata2, 10080);
              setCookie("t", fdata2.tname, 10080);
              navigate.push("/VerifyLogin");
            } else {
              setLoader(false);
              toast.error("Your Account is Disabled!");
            }
          } else {
            setLoader(false);
            toast.error("Wrong Password!");
          }
        } else {
          const collectionRef2 = collection(firestore, "userschools");
          const q2 = query(
            collectionRef2,
            where("username", "==", inputField.username)
          );
          const querySnapshot2 = await getDocs(q2);

          if (querySnapshot2.docs.length > 0) {
            let fdata2 = querySnapshot2.docs[0].data();

            // if (fdata.password === inputField.password) {
            if (compare(inputField.password, fdata2.password)) {
              setLoader(false);
              toast.success("Congrats! You are Logined Successfully!");

              // encryptObjData("schid", fdata2, 10080);
              // setCookie("loggedAt", Date.now(), 10080);
              // navigate.push("/VerifyLogin");
              // setState({
              //   USER: fdata2,
              //   ACCESS: fdata2.convenor,
              //   LOGGEDAT: Date.now(),
              //   TYPE: "school",
              // });
              encryptObjData("nonVerifiedSchId", fdata2, 10080);
              navigate.push("/VerifyLogin");
            } else {
              setLoader(false);
              toast.error("Invalid Username or Password!");
            }
          } else {
            setLoader(false);
            toast.error("Invalid Username or Password!");
          }
        }
      } catch (error) {
        setLoader(false);
        toast.error("Error Occurred: " + error.message);
      }
    } else {
      toast.error("Form Is Invalid");
    }
  };
  const adminLogin = async () => {
    if (!inputField.username) {
      return toast.error("Please enter username");
    }
    if (!inputField.password) {
      return toast.error("Please enter password");
    }
    setLoader(true);
    const collectionRef = collection(firestore, "sportsAdmins");
    const q = query(
      collectionRef,
      where("username", "==", inputField.username.trim().toLowerCase())
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const data = querySnapshot.docs[0].data();

      if (compare(inputField.password, data.password)) {
        if (!data.disabled) {
          setLoader(false);
          encryptObjData("nonVerifiedUid", data, 10080);
          encryptObjData("nonVerifiedTid", data, 10080);
          setCookie("t", data.tname, 10080);
          navigate.push("/VerifyLogin");
        } else {
          setLoader(false);
          toast.error("Your Account is Disabled!");
        }
      } else {
        toast.error("Invalid Username or Password!");
        setLoader(false);
      }
    } else {
      toast.error("Invalid Username or Password!");
      setLoader(false);
    }
  };
  const addUser = () => {
    navigate.push("/Signup");
  };
  function removeSpaces(inputString) {
    // Use a regular expression to match all spaces (whitespace characters) and replace them with an empty string
    return inputString.replace(/\s/g, "");
  }
  const getAdminLogin = async () => {
    const data = await getCollection("appUpdate");
    setShowAdminLogin(data[0]?.showAdminLogin);
  };

  const devTeacherLogin = async () => {
    if (!empid) {
      return toast.error("Please enter Employee ID");
    }
    setLoader(true);
    try {
      const data = await getDocumentByField(
        "sportsUsers",
        "empid",
        empid.toUpperCase()
      ).catch((e) => {
        console.log(e);
        setLoader(false);
        toast.error("Invalid Employee ID");
      });
      if (data) {
        setLoader(false);
        encryptObjData("uid", data, 10080);
        encryptObjData("tid", data, 10080);
        setCookie("t", data.tname, 10080);
        setCookie("loggedAt", Date.now(), 10080);
        setTimeout(() => {
          setState({
            USER: data,
            ACCESS: data.circle,
            LOGGEDAT: Date.now(),
            TYPE: "teacher",
          });
          navigate.push("/Dashboard");
        }, 500);
      } else {
        const newData = await getDocumentByField(
          "teachers",
          "empid",
          empid.toUpperCase()
        ).catch((e) => {
          console.log(e);
          setLoader(false);
          toast.error("Invalid Employee ID");
        });
        if (newData) {
          setLoader(false);
          encryptObjData("uid", newData, 10080);
          encryptObjData("tid", newData, 10080);
          setCookie("t", newData.tname, 10080);
          setCookie("loggedAt", Date.now(), 10080);
          setTimeout(() => {
            setState({
              USER: newData,
              ACCESS: newData.circle,
              LOGGEDAT: Date.now(),
              TYPE: "teacher",
            });
            navigate.push("/Dashboard");
          }, 500);
        } else {
          setLoader(false);
          toast.error("Invalid Employee ID");
        }
      }
    } catch (e) {
      console.log(e);
      setLoader(false);
      toast.error("Invalid Employee ID");
    }
  };
  const devAdminLogin = async () => {
    if (!inputField.username) {
      return toast.error("Please enter Username");
    }
    if (!inputField.password) {
      return toast.error("Please enter Password");
    }
    setLoader(true);
    try {
      const data = await getDocumentByField(
        "sportsAdmins",
        "username",
        inputField.username.trim().toLowerCase()
      ).catch((e) => {
        console.log(e);
        setLoader(false);
        toast.error("Invalid Username");
      });
      if (data) {
        if (compare(inputField.password, data.password)) {
          setLoader(false);
          encryptObjData("uid", data, 10080);
          encryptObjData("tid", data, 10080);
          setCookie("t", data.tname, 10080);
          setCookie("loggedAt", Date.now(), 10080);
          setTimeout(() => {
            setState({
              USER: data,
              ACCESS: data.circle,
              LOGGEDAT: Date.now(),
              TYPE: "teacher",
            });
            navigate.push("/Dashboard");
          }, 500);
        } else {
          setLoader(false);
          toast.error("Invalid Password");
        }
      } else {
        setLoader(false);
        toast.error("Invalid Username");
      }
    } catch (e) {
      console.log(e);
      setLoader(false);
      toast.error("Invalid Employee ID");
    }
  };
  const devSchoolLogin = async () => {
    if (!udise) {
      return toast.error("Please enter UDISE");
    }
    setLoader(true);
    try {
      const data = await getDocumentByField(
        "userschools",
        "udise",
        udise.toString()
      ).catch((e) => {
        console.log(e);
        setLoader(false);
        toast.error("Invalid UDISE");
      });

      setLoader(false);
      encryptObjData("schid", data, 10080);
      setCookie("loggedAt", Date.now(), 10080);
      setTimeout(() => {
        setState({
          USER: data,
          ACCESS: data.convenor,
          LOGGEDAT: Date.now(),
          TYPE: "school",
        });
        navigate.push("/Dashboard");
      }, 500);
    } catch (e) {
      console.log(e);
      setLoader(false);
      toast.error("Invalid UDISE");
    }
  };

  useEffect(() => {
    document.title = "AMTA WEST SPORTS: Login Page";
    const loggedAt = getCookie("loggedAt");
    const details = getCookie("tid");
    const schdetails = getCookie("schid");
    if (loggedAt && details && schdetails) {
      navigate.push("/Dashboard");
      if (details) {
        const teacherDetails = decryptObjData("tid");
        setState({
          USER: teacherDetails,
          ACCESS: teacherDetails?.circle,
          LOGGEDAT: Date.now(),
          TYPE: "teacher",
        });
      } else if (schdetails) {
        const schoolDetails = decryptObjData("schid");
        setState({
          USER: schoolDetails,
          ACCESS: schoolDetails?.convenor,
          LOGGEDAT: Date.now(),
          TYPE: "school",
        });
      } else {
        setState({
          USER: {},
          ACCESS: null,
          LOGGEDAT: "",
          TYPE: null,
        });
      }
    }

    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    getAdminLogin();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      empid.length === 8 && devTeacherLogin();
      udise.toString().length === 11 && devSchoolLogin();
    }
    // eslint-disable-next-line
  }, [empid, udise]);
  return (
    <div className="container text-black p-2">
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
      <div className="row m-auto col-md-6 login p-2">
        <h3 className="heading">User Login</h3>
        <br />

        <form autoComplete="off" method="post" onSubmit={submitBtn}>
          <div className="mb-3">
            <label htmlFor="" className="form-label">
              username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter Username"
              className="form-control"
              value={inputField.username}
              onChange={(e) =>
                setInputField({
                  ...inputField,
                  username: removeSpaces(e.target.value),
                })
              }
            />
            {errField.usernameErr.length > 0 && (
              <span className="error">{errField.usernameErr}</span>
            )}
          </div>
          <div className="mb-3">
            <CustomInput
              title={"Password"}
              type={"password"}
              placeholder={"Enter Password"}
              value={inputField.password}
              onChange={(e) => {
                setInputField({
                  ...inputField,
                  password: e.target.value,
                });
              }}
            />
            {errField.passwordErr.length > 0 && (
              <span className="error">{errField.passwordErr}</span>
            )}
          </div>
          <div className="mb-3">
            <Link style={{ textDecoration: "none" }} href={"/ForgotPassword"}>
              Forgot Password?
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="btn btn-primary m-1"
              onClick={submitBtn}
            >
              Login <i className="bi bi-box-arrow-in-left"></i>
            </button>
            {showAdminLogin && (
              <>
                <button
                  type="submit"
                  className="btn btn-dark m-1"
                  onClick={adminLogin}
                >
                  Adminstrator Login <i className="bi bi-box-arrow-in-left"></i>
                </button>
                {process.env.NODE_ENV === "development" && (
                  <button
                    type="submit"
                    className="btn btn-danger m-1"
                    onClick={devAdminLogin}
                  >
                    Dev Adminstrator Login{" "}
                    <i className="bi bi-box-arrow-in-left"></i>
                  </button>
                )}
              </>
            )}
            <button
              type="button"
              className="btn btn-success m-1"
              onClick={addUser}
            >
              Register Now <i className="bi bi-person-add"></i>
            </button>
          </div>
          {process.env.NODE_ENV === "development" && (
            <div className="bg-info bg-opacity-10 p-4 rounded-4 my-4">
              {showDevTechField && (
                <div>
                  <div className="mb-3">
                    <label htmlFor="" className="form-label">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      name="empid"
                      id="empid"
                      placeholder="Enter Employee ID"
                      className="form-control"
                      value={empid}
                      maxLength={8}
                      onChange={(e) => setEmpid(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary m-1"
                    onClick={devTeacherLogin}
                  >
                    Teacher Login
                    <i className="bi bi-box-arrow-in-left"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary m-1"
                    onClick={() => setShowDevTechField(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              {showDevSchoolField && (
                <div>
                  <div className="mb-3">
                    <label htmlFor="" className="form-label">
                      UDISE
                    </label>
                    <input
                      type="number"
                      name="udise"
                      id="udise"
                      placeholder="Enter UDISE"
                      className="form-control"
                      value={udise}
                      onChange={(e) => {
                        if (e.target.value.length <= 11) {
                          setUdise(e.target.value);
                        }
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-success m-1"
                    onClick={devSchoolLogin}
                  >
                    School Login <i className="bi bi-box-arrow-in-left"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary m-1"
                    onClick={() => setShowDevSchoolField(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              <div>
                <button
                  type="button"
                  className="btn btn-primary m-1"
                  onClick={() => {
                    setShowDevTechField(true);
                    setShowDevSchoolField(false);
                  }}
                >
                  Dev Teacher Login
                  <i className="bi bi-box-arrow-in-left"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-success m-1"
                  onClick={() => {
                    setShowDevTechField(false);
                    setShowDevSchoolField(true);
                  }}
                >
                  Dev School Login <i className="bi bi-box-arrow-in-left"></i>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
