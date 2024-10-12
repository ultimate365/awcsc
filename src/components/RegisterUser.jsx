import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-image-crop/dist/ReactCrop.css";
import { firestore } from "../context/FirbaseContext";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import bcrypt from "bcryptjs";
import Loader from "./Loader";
import axios from "axios";

const RegisterUser = ({ sata, setSignUpTrue }) => {
  const navigate = useRouter();
  const docId = sata.id;
  const [displayLoader, setDisplayLoader] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [inputField, setInputField] = useState({
    teachersID: sata.id,
    tname: sata.tname,
    school: sata.school,
    desig: sata.desig,
    pan: sata.pan,
    udise: sata.udise,
    circle: sata.circle,
    empid: sata.empid,
    convenor: sata.convenor,
    gpAssistant: sata.gpAssistant,
    gp: sata.gp,
    email: sata.email,
    phone: sata.phone,
    id: docId,
    username: "",
    password: "",
    cpassword: "",
    createdAt: Date.now(),
  });
  const [errField, setErrField] = useState({
    usernameErr: "",
    emailErr: "",
    phoneErr: "",
    passwordErr: "",
    cpasswordErr: "",
    profilePhotoErr: "",
  });

  const inputHandler = (e) => {
    // console.log(e.target.name, "==", e.target.value);
    setInputField({
      ...inputField,
      [e.target.name]: removeSpaces(e.target.value),
    });
    // console.log(inputField);
  };
  const submitBtn = async (e) => {
    // e.preventDefault();
    // console.log(inputField);
    if (validForm()) {
      setDisplayLoader(true);
      const collectionRef = collection(firestore, "userteachers");
      const q = query(
        collectionRef,
        where("username", "==", inputField.username)
      );
      const querySnapshot = await getDocs(q);
      // console.log(querySnapshot.docs[0].data().pan);
      if (querySnapshot.docs.length > 0) {
        toast.error(
          `Dear ${inputField.tname}, User ID Already Taken,Choose Another One.`,
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
        setTimeout(() => {
          setInputField({ ...inputField, username: "" });
        }, 2000);
      } else {
        const url = `/api/adduserteachers`;
        const entry = {
          teachersID: inputField.teachersID,
          tname: inputField.tname,
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
          const record = response.data;
          if (record.success) {
            await setDoc(doc(firestore, "userteachers", docId), entry).catch(
              (e) => console.log(e)
            );

            const docRef = doc(firestore, "teachers", inputField.teachersID);
            await updateDoc(docRef, {
              registered: true,
            }).catch((e) => console.log(e));

            setDisplayLoader(false);
            toast.success(
              `Congratulation ${inputField.tname} You are Successfully Registered!`
            );

            setTimeout(() => {
              navigate.push("/login");
            }, 1500);
          } else {
            toast.error(
              `Dear ${inputField.tname}, Something went Dont Know wrong while registering, Please try again later.`
            );
            setDisplayLoader(false);
            console.log("record error", record?.success);
          }
        } catch (e) {
          toast.error(
            `Dear ${inputField.tname}, Something went very wrong while registering, Please try again later.`
          );
          setDisplayLoader(false);
          console.log(e);
        }
      }
    } else {
      toast.error("Form Is Invalid");
    }
  };
  const validForm = () => {
    let formIsValid = true;
    setErrField({
      usernameErr: "",
      emailErr: "",
      phoneErr: "",
      passwordErr: "",
      cpasswordErr: "",
      profilePhotoErr: "",
    });
    if (inputField.username === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        usernameErr: "Please Enter Username",
      }));
    }
    if (inputField.email === "" || !ValidateEmail(inputField.email)) {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        emailErr: "Please Enter Valid email",
      }));
    }
    if (inputField.phone === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        phoneErr: "Please Enter Phone No.",
      }));
    }
    if (inputField.password === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        passwordErr: "Please Enter Password",
      }));
    }

    if (
      inputField.cpassword === "" ||
      inputField.password !== inputField.cpassword
    ) {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        cpasswordErr: "Password and Confirm Password Are Not Same",
      }));
    }

    return formIsValid;
  };
  function ValidateEmail(mail) {
    //eslint-disable-next-line
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail)) {
      return true;
    }
    // alert("You have entered an invalid email address!");
    return false;
  }

  function removeSpaces(inputString) {
    // Use a regular expression to match all spaces (whitespace characters) and replace them with an empty string
    return inputString.replace(/\s/g, "");
  }
  useEffect(() => {
    document.title = "AWC Sports App:Register Now";
    //eslint-disable-next-line
  }, [inputField]);
  return (
    <div className="container my-5">
      <div className="row login text-black m-auto col-md-6 p-2">
        <h3 className="text-primary">
          HELLO {sata.tname}, PLEASE COMPLETE YOUR REGISTRATION
        </h3>
        <br />

        {displayLoader ? <Loader /> : null}
        <form autoComplete="off" method="post">
          <div className="mb-3">
            <label htmlFor="" className="form-label">
              User Name
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
                  username: e.target.value.replace(/[^\w\s]/g, ""),
                })
              }
            />
            {errField.usernameErr.length > 0 && (
              <span className="error">{errField.usernameErr}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="" className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Email"
              className="form-control"
              value={inputField.email}
              onChange={inputHandler}
            />
            {errField.emailErr.length > 0 && (
              <span className="error">{errField.emailErr}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="" className="form-label">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              placeholder="Enter Mobile Number"
              className="form-control"
              value={inputField.phone}
              onChange={inputHandler}
            />
            {errField.phoneErr.length > 0 && (
              <span className="error">{errField.phoneErr}</span>
            )}
          </div>
          <div className="mb-3">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              name="password"
              id="password"
              placeholder="Enter Password"
              value={inputField.password}
              onChange={(e) =>
                setInputField({ ...inputField, password: e.target.value })
              }
            />
            <button
              type="button"
              className="btn btn-warning btn-sm mt-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
            <br />

            {errField.passwordErr.length > 0 && (
              <span className="error">{errField.passwordErr}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="" className="form-label">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              name="cpassword"
              id="cpassword"
              placeholder="Confirm Password"
              value={inputField.cpassword}
              onChange={(e) =>
                setInputField({
                  ...inputField,
                  cpassword: e.target.value,
                })
              }
            />
            {errField.cpasswordErr.length > 0 && (
              <span className="error">{errField.cpasswordErr}</span>
            )}
          </div>

          <div>
            <button
              type="button"
              className="btn btn-primary m-1"
              onClick={submitBtn}
            >
              Register <i className="bi bi-box-arrow-in-right"></i>
            </button>

            <button
              type="button"
              className="btn btn-danger m-1 px-4"
              onClick={() => setSignUpTrue()}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
