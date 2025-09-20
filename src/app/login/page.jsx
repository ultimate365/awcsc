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
const Login = () => {
  const { setState, setStateObject } = useGlobalContext();
  const [loader, setLoader] = useState(false);
  const [inputField, setInputField] = useState({
    username: "",
    password: "",
  });
  const [errField, setErrField] = useState({
    usernameErr: "",
    passwordErr: "",
  });

  useEffect(() => {
    document.title = "AMTA WEST SPORTS: Login Page";
    const loggedAt = getCookie("loggedAt");
    const details = getCookie("tid");
    const schdetails = getCookie("schid");
    if (loggedAt && details && schdetails) {
      navigate.push("/dashboard");
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
              navigate.push("/verifyLogin");
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
              // navigate.push("/verifyLogin");
              // setState({
              //   USER: fdata2,
              //   ACCESS: fdata2.convenor,
              //   LOGGEDAT: Date.now(),
              //   TYPE: "school",
              // });
              encryptObjData("nonVerifiedSchId", fdata2, 10080);
              navigate.push("/verifyLogin");
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
        try {
          const res = await axios.post("/api/login", {
            username: inputField.username.toLowerCase(),
            password: inputField.password,
          });
          const record = res.data;
          const type = record.type;
          if (record.success) {
            if (type === "teacher") {
              const userteacherData = record.userteacherData;
              const teacherData = record.teacherData;
              setLoader(false);
              toast.success("Congrats! You are Logined Successfully!");
              // encryptObjData("uid", userteacherData, 10080);
              // encryptObjData("tid", teacherData, 10080);
              // setCookie("t", teacherData.tname, 10080);
              // setCookie("loggedAt", Date.now(), 10080);
              // setState({
              //   USER: userteacherData,
              //   ACCESS: userteacherData.circle,
              //   LOGGEDAT: Date.now(),
              //   TYPE: "teacher",
              // });
              encryptObjData("nonVerifiedUid", userteacherData, 10080);
              encryptObjData("nonVerifiedTid", teacherData, 10080);
              setCookie("t", teacherData.tname, 10080);

              navigate.push("/verifyLogin");
            } else {
              const userSchoolData = record.userschoolData;
              setLoader(false);
              toast.success("Congrats! You are Logined Successfully!");
              // encryptObjData("schid", userSchoolData, 10080);
              // setCookie("loggedAt", Date.now(), 10080);
              // setState({
              //   USER: userSchoolData,
              //   ACCESS: userSchoolData.convenor,
              //   LOGGEDAT: Date.now(),
              //   TYPE: "school",
              // });
              encryptObjData("nonVerifiedSchId", userSchoolData, 10080);

              navigate.push("/verifyLogin");
            }
          } else {
            setLoader(false);
            toast.error("Invalid Username or Password!");
          }
        } catch (error) {
          setLoader(false);
          toast.error("Error Occurred: " + error.message);
        }
      }
    } else {
      toast.error("Form Is Invalid");
    }
  };
  // useEffect(() => {
  //   getSchoolData();
  // }, []);
  const addUser = () => {
    navigate.push("/signup");
  };
  function removeSpaces(inputString) {
    // Use a regular expression to match all spaces (whitespace characters) and replace them with an empty string
    return inputString.replace(/\s/g, "");
  }

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
              ref={(input) => input && input.focus()}
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
            <Link style={{ textDecoration: "none" }} href={"/forgotPassword"}>
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
            <button
              type="button"
              id="addUserBtn"
              className="btn btn-success m-1"
              onClick={addUser}
            >
              Register Now <i className="bi bi-person-add"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
