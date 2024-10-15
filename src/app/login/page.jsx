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
const Login = () => {
  const { setState } = useGlobalContext();
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputField, setInputField] = useState({
    username: "",
    password: "",
  });
  const [errField, setErrField] = useState({
    usernameErr: "",
    passwordErr: "",
  });
  const inputHandler = (e) => {
    // console.log(e.target.name, "==", e.target.value);
    setInputField({ ...inputField, [e.target.name]: e.target.value });
    // console.log(inputField);
  };
  useEffect(() => {
    document.title = "AMTA WEST SPORTS: Login Page";
    let loggedAt = getCookie("loggedAt");
    const details = getCookie("tid");
    const schdetails = getCookie("schid");
    if (loggedAt) {
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
        const collectionRef = collection(firestore, "userteachers");
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
              toast.success("Congrats! You are Logined Successfully!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              const collectionRef2 = collection(firestore, "teachers");
              const q2 = query(collectionRef2, where("pan", "==", fdata.pan));
              const querySnapshot2 = await getDocs(q2);
              // console.log(querySnapshot.docs[0].data().pan);

              let fdata2 = querySnapshot2.docs[0].data();

              encryptObjData("uid", fdata, 10080);
              encryptObjData("tid", fdata2, 10080);
              setCookie("t", fdata2.tname, 10080);
              setCookie("loggedAt", Date.now(), 10080);
              setState({
                USER: fdata,
                ACCESS: fdata.circle,
                LOGGEDAT: Date.now(),
                TYPE: "teacher",
              });

              navigate.push("/dashboard");
            } else {
              setLoader(false);
              toast.error("Your Account is Disabled!", {
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
          } else {
            setLoader(false);
            toast.error("Wrong Password!", {
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
              toast.success("Congrats! You are Logined Successfully!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });

              encryptObjData("schid", fdata2, 10080);
              setCookie("loggedAt", Date.now(), 10080);
              navigate.push("/dashboard");
              setState({
                USER: fdata2,
                ACCESS: fdata2.convenor,
                LOGGEDAT: Date.now(),
                TYPE: "school",
              });
            } else {
              setLoader(false);
              toast.error("Invalid Username or Password!", {
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
          } else {
            setLoader(false);
            toast.error("Invalid Username or Password!", {
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
              toast.success("Congrats! You are Logined Successfully!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              encryptObjData("uid", userteacherData, 10080);
              encryptObjData("tid", teacherData, 10080);
              setCookie("t", teacherData.tname, 10080);
              setCookie("loggedAt", Date.now(), 10080);
              setState({
                USER: userteacherData,
                ACCESS: userteacherData.circle,
                LOGGEDAT: Date.now(),
                TYPE: "teacher",
              });
              navigate.push("/dashboard");
            } else {
              const userSchoolData = record.userschoolData;
              setLoader(false);
              toast.success("Congrats! You are Logined Successfully!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              encryptObjData("schid", userSchoolData, 10080);
              setCookie("loggedAt", Date.now(), 10080);
              setState({
                USER: userSchoolData,
                ACCESS: userSchoolData.convenor,
                LOGGEDAT: Date.now(),
                TYPE: "school",
              });
              navigate.push("/dashboard");
            }
          } else {
            setLoader(false);
            toast.error("Invalid Username or Password!", {
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
        } catch (error) {
          setLoader(false);
          toast.error("Error Occurred: " + error.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
    } else {
      toast.error("Form Is Invalid", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
