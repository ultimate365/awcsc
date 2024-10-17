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
import CustomInput from "./CustomInput";

const RegisterUser = ({ sata, setSignUpTrue }) => {
  const navigate = useRouter();
  const docId = sata.id;
  const [displayLoader, setDisplayLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);
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
  const [mobileOTP, setMobileOTP] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const inputHandler = (e) => {
    // console.log(e.target.name, "==", e.target.value);
    setInputField({
      ...inputField,
      [e.target.name]: removeSpaces(e.target.value),
    });
    // console.log(inputField);
  };
  const submitBtn = async (e) => {
    e.preventDefault();
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
    console.log(inputField);
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

  const sendVerificationOTP = async () => {
    setDisplayLoader(true);
    const res = await axios.post("/api/sendVerifyOTP", {
      phone: inputField.phone,
      email: inputField.email,
      name: inputField.tname,
    });
    const record = res.data;
    if (record.success) {
      toast.success("OTP sent to your Email and Mobile Number!");
      setShowModal(true);
      setDisplayLoader(false);
    } else {
      toast.error("Failed to send OTP!");
      setDisplayLoader(false);
    }
  };
  const verifyOTP = async () => {
    setDisplayLoader(true);
    const res = await axios.post("/api/verifyEmailAndMobile", {
      phone: inputField.phone,
      email: inputField.email,
      phoneCode: mobileOTP,
      emailCode: emailOTP,
    });
    const record = res.data;
    if (record.success) {
      toast.success("Your Email and Mobile Number is successfully verified!");
      setShowSubmitBtn(true);
      setDisplayLoader(false);
    } else {
      toast.error("Failed to send OTP!");
      setDisplayLoader(false);
    }
  };

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
      {displayLoader ? <Loader /> : null}
      <div className="row login text-black m-auto col-md-6 p-2">
        <h3 className={`text-${showSubmitBtn ? "success" : "primary"} my-3`}>
          HELLO {sata.tname},{" "}
          {!showSubmitBtn
            ? "PLEASE COMPLETE YOUR REGISTRATION"
            : "YOUR EMAIL AND MOBILE NUMBER IS VERIFIED, PLEASE REGISTER YOURSELF NOW!"}
        </h3>
        <br />

        <form autoComplete="off" method="post">
          {!showSubmitBtn && (
            <div>
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
                  disabled
                  placeholder="Enter Mobile Number"
                  className="form-control"
                  value={inputField.phone}
                  onChange={() => {
                    toast.error("Can't change phone number");
                  }}
                />
                {errField.phoneErr.length > 0 && (
                  <span className="error">{errField.phoneErr}</span>
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
                  type="text"
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
            </div>
          )}

          <div>
            {!showSubmitBtn ? (
              <button
                type="submit"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  if (validForm()) {
                    sendVerificationOTP();
                  } else {
                    toast.error("Form is Invalid");
                  }
                }}
              >
                Verify Email and Mobile
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary m-1"
                onClick={submitBtn}
              >
                Register <i className="bi bi-box-arrow-in-right"></i>
              </button>
            )}
          </div>
        </form>
      </div>
      {!showSubmitBtn && (
        <button
          type="button"
          className="btn btn-danger m-1 px-4"
          onClick={() => setSignUpTrue()}
        >
          Back
        </button>
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
                  Verify Your Mobile Number
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowModal(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mx-auto my-2">
                  <div className="mb-3 mx-auto col-md-6">
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Enter Your Mobile OTP
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Mobile OTP"
                        className="form-control"
                        value={mobileOTP}
                        maxLength={6}
                        onChange={(e) => setMobileOTP(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Enter Your Email OTP
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Email OTP"
                        className="form-control"
                        value={emailOTP}
                        maxLength={6}
                        onChange={(e) => setEmailOTP(e.target.value)}
                      />
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
                    verifyOTP();
                  }}
                >
                  Send OTP
                </button>
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => {
                    setShowModal(false);
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

export default RegisterUser;
