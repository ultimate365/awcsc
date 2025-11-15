"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { firestore } from "../../context/FirbaseContext";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import { decryptObjData, getCookie } from "../../modules/encryption";
import Loader from "../../components/Loader";
import { useGlobalContext } from "../../context/Store";
import axios from "axios";
import { OTPWidget } from "@msg91comm/sendotp-sdk";
const UpdateUP = () => {
  const widgetId = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID;
  const authToken = process.env.NEXT_PUBLIC_MSG91_AUTH_TOKEN;

  useEffect(() => {
    OTPWidget.initializeWidget(widgetId, authToken);
  }, []);
  const { state, setState } = useGlobalContext();
  const navigate = useRouter();
  let userdetails;
  const [loader, setLoader] = useState(false);
  const user = state.USER;
  const [isTeacher, setIsTeacher] = useState(true);
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [inputField, setInputField] = useState({
    username: username,
    password: "",
    cpassword: "",
    id: id,
  });
  const [errField, setErrField] = useState({
    usernameErr: "",
    passwordErr: "",
    cpasswordErr: "",
  });
  const [showBtns, setShowBtns] = useState(true);
  const [usernameForm, setUsernameForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [mobileOTPSent, setMobileOTPSent] = useState(false);
  const [emailOTPSent, setEmailOTPSent] = useState(false);
  const [mobileOTP, setMobileOTP] = useState("");
  const [emailOTP, setEmailOTP] = useState("");
  const [showRetryBtn, setShowRetryBtn] = useState(false);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [showEmailRetryBtn, setShowEmailRetryBtn] = useState(false);
  const [reqId, setReqId] = useState("");
  const checkUser = () => {
    let details = getCookie("uid");
    let schdetails = getCookie("schid");
    if (details) {
      userdetails = decryptObjData("uid");
      setIsTeacher(true);
      setId(userdetails.id);
      setUsername(userdetails.username);
      setInputField({
        username: userdetails.username,
        id: userdetails.id,
        password: "",
        cpassword: "",
      });
      setState({
        USER: userdetails,
        ACCESS: userdetails?.circle,
        LOGGEDAT: Date.now(),
        TYPE: "teacher",
      });
    } else if (schdetails) {
      userdetails = decryptObjData("schid");
      setIsTeacher(false);
      setId(userdetails.id);
      setUsername(userdetails.username);
      setInputField({
        username: userdetails.username,
        id: userdetails.id,
        password: "",
        cpassword: "",
      });
      setState({
        USER: userdetails,
        ACCESS: userdetails?.convenor,
        LOGGEDAT: Date.now(),
        TYPE: "school",
      });
    } else {
      navigate.push("/logout");
    }
  };

  const inputHandler = (e) => {
    // console.log(e.target.name, "==", e.target.value);
    setInputField({
      ...inputField,
      [e.target.name]: removeSpaces(e.target.value),
    });
    // console.log(inputField);
  };

  const validForm = () => {
    let formIsValid = true;
    // const validEmailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    setErrField({
      passwordErr: "",
      cpasswordErr: "",
    });

    if (inputField.username === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        usernameErr: "Please Enter Username",
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
  function removeSpaces(inputString) {
    // Use a regular expression to match all spaces (whitespace characters) and replace them with an empty string
    return inputString.replace(/\s/g, "");
  }

  const checkUsername = async () => {
    setLoader(true);
    if (inputField.username !== "") {
      const collectionRef = collection(firestore, "sportsUsers");
      const q = query(
        collectionRef,
        where("username", "==", inputField.username.toLowerCase())
      );
      const querySnapshot = await getDocs(q);
      const collectionRef2 = collection(firestore, "sportsUsers");
      const q2 = query(
        collectionRef2,
        where("username", "==", inputField.username.toLowerCase())
      );
      const querySnapshot2 = await getDocs(q2);
      if (querySnapshot.docs.length > 0 || querySnapshot2.docs.length > 0) {
        setLoader(false);
        toast.error("Username already Exists! Please Select Another One", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        const docRef = isTeacher
          ? doc(firestore, "sportsUsers", id)
          : doc(firestore, "userschools", id);
        await updateDoc(docRef, {
          username: inputField.username.toLowerCase(),
        }).then(() => {
          setLoader(false);
          toast.success("Congrats! Your Username Changed Successfully!", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setTimeout(() => {
            navigate.push("/logout");
          }, 1500);
        });
      }
    }
  };
  const submitBtn = async (e) => {
    e.preventDefault();
    if (validForm()) {
      setLoader(true);
      try {
        const docRef = isTeacher
          ? doc(firestore, "sportsUsers", id)
          : doc(firestore, "userschools", id);
        await updateDoc(docRef, {
          password: bcrypt.hashSync(inputField.password, 10),
        }).then(() => {
          setLoader(false);
          toast.success("Congrats! Your Password Changed Successfully!", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setTimeout(() => {
            navigate.push("/logout");
          }, 1500);
        });
      } catch (e) {
        toast.error("Server Error! Unable to Change Password!", {
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
  const changePhone = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      // const res = await axios.post(`/api/sendMobileOTP`, {
      //   phone,
      //   name: user.tname,
      // });
      // const record = res.data;
      // if (record.success) {
      const data = {
        identifier: `91${phone}`,
      };
      const response = await OTPWidget.sendOTP(data);
      if (response.type === "success") {
        setReqId(response.message);
        toast.success("OTP sent to your Mobile Number!");
        setLoader(false);
        setMobileOTPSent(true);
        setShowRetryBtn(false);
        setTimeout(() => {
          setShowRetryBtn(true);
        }, 30000);
      } else {
        setShowRetryBtn(true);
        toast.error("Failed to send OTP!");
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!");
      setLoader(false);
    }
  };
  const verifyMobileOTP = async (e) => {
    e.preventDefault();
    if (mobileOTP !== "" && mobileOTP.toString().length === 6) {
      setLoader(true);
      try {
        // const res = await axios.post(`/api/verifyMobileOTP`, {
        //   phone,
        //   phoneCode: mobileOTP.toString(),
        //   name: user.tname,
        // });
        // const record = res.data;
        // if (record.success) {
        const data = {
          otp: mobileOTP.toString(),
          reqId: reqId,
        };
        const response = await OTPWidget.verifyOTP(data);
        if (response.type === "success") {
          const docRef = isTeacher
            ? doc(firestore, "sportsUsers", id)
            : doc(firestore, "userschools", id);
          await updateDoc(docRef, {
            phone: phone.toString(),
          }).then(() => {
            toast.success("Your Mobile Number is successfully verified!");
            setLoader(false);
            setTimeout(async () => {
              navigate.push("/logout");
              setState({
                USER: {},
                ACCESS: null,
                LOGGEDAT: "",
                TYPE: null,
              });
            }, 1500);
          });
        } else {
          toast.error("Please enter a Valid 6 Digit OTP");
          setLoader(false);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong!");
        setLoader(false);
      }
    }
  };
  const changeEmail = async () => {
    setLoader(true);
    try {
      const res = await axios.post(`/api/sendEmailOTP`, {
        email,
        name: user.tname,
      });
      const record = res.data;
      if (record.success) {
        toast.success("OTP sent to your Email!");
        setLoader(false);
        setEmailOTPSent(true);
        setShowEmailRetryBtn(false);
        setTimeout(() => {
          setShowEmailRetryBtn(true);
        }, 30000);
      } else {
        setShowEmailRetryBtn(true);
        toast.error("Failed to send OTP!");
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!");
      setLoader(false);
    }
  };
  const verifyEmailOTP = async () => {
    if (emailOTP !== "" && emailOTP.toString().length === 6) {
      setLoader(true);
      try {
        const res = await axios.post(`/api/verifyEmailOTP`, {
          email,
          code: emailOTP.toString(),
        });
        const record = res.data;
        if (record.success) {
          const docRef = doc(firestore, "sportsUsers", id);
          await updateDoc(docRef, {
            email,
          }).then(() => {
            toast.success("Your Email is successfully verified!");
            setLoader(false);
            setTimeout(async () => {
              navigate.push("/logout");
              setState({
                USER: {},
                ACCESS: null,
                LOGGEDAT: "",
                TYPE: null,
              });
            }, 1500);
          });
        } else {
          toast.error("Please enter a Valid 6 Digit OTP");
          setLoader(false);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong!");
        setLoader(false);
      }
    }
  };
  useEffect(() => {
    document.title = "WBTPTA Sports App:Update User ID or Password";
    checkUser();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    // eslint-disable-next-line
  }, [isTeacher, username, id, inputField]);

  return (
    <div className="container text-black p-2">
      {loader ? <Loader /> : null}
      <h3 className="text-primary text-center">Update User Details</h3>
      <div className="col-md-6 mx-auto p-2">
        {showBtns && (
          <div className="mx-auto">
            <button
              type="button"
              className="btn btn-primary m-1"
              onClick={() => {
                setUsernameForm(true);
                setShowBtns(false);
              }}
            >
              Change Username
            </button>
            <button
              type="button"
              className="btn btn-secondary m-1"
              onClick={() => {
                setShowPassword(true);
                setShowBtns(false);
              }}
            >
              Change Password
            </button>
            <button
              type="button"
              className="btn btn-info m-1"
              onClick={() => {
                setShowMobile(true);
                setShowBtns(false);
              }}
            >
              Change Mobile
            </button>
            {state.TYPE === "teacher" && (
              <button
                type="button"
                className="btn btn-warning m-1"
                onClick={() => {
                  setShowEmail(true);
                  setShowBtns(false);
                }}
              >
                Change Email
              </button>
            )}
          </div>
        )}
        {usernameForm && (
          <form action="" onSubmit={checkUsername} autoComplete="off">
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                name="username"
                id="username"
                placeholder="Enter Username"
                value={inputField.username}
                onChange={inputHandler}
              />
            </div>
            <div className="col-mb-4 mx-auto">
              <button
                type="submit"
                className="btn btn-primary m-1"
                disabled={
                  inputField.username === username || inputField.username === ""
                }
                onClick={() => {
                  if (inputField.username === username) {
                    toast.error(
                      "Entered Username is Same as Previous Username",
                      {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      }
                    );
                  } else {
                    checkUsername();
                  }
                }}
              >
                Check & Change Username{" "}
                <i className="bi bi-box-arrow-in-right"></i>
              </button>
              <button
                type="button"
                className="btn btn-danger m-1"
                onClick={() => {
                  setUsernameForm(false);
                  setShowBtns(true);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {showPassword && (
          <form autoComplete="off" method="post" onSubmit={submitBtn}>
            <h3 className="my-3 text-center text-primary">Change Password</h3>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                placeholder="Enter Password"
                value={inputField.password}
                onChange={(e) =>
                  setInputField({ ...inputField, password: e.target.value })
                }
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
            <div>
              <button
                type="submit"
                className="btn btn-primary m-1"
                disabled={
                  inputField.password === "" ||
                  inputField.cpassword === "" ||
                  inputField.password !== inputField.cpassword
                }
                onClick={submitBtn}
              >
                Change Password <i className="bi bi-box-arrow-in-right"></i>
              </button>
              <button
                type="button"
                className="btn btn-danger m-1"
                onClick={() => {
                  setShowPassword(false);
                  setShowBtns(true);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {showMobile && (
          <form autoComplete="off">
            <h3 className="my-3 text-center text-primary">Change Mobile</h3>
            {!mobileOTPSent ? (
              <div>
                <div className="mb-3">
                  <label htmlFor="" className="form-label">
                    Mobile
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="mobile"
                    id="mobile"
                    placeholder="Enter Mobile"
                    value={phone}
                    onChange={(e) =>
                      e.target.value.length <= 10 && setPhone(e.target.value)
                    }
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary m-1"
                    disabled={phone.length !== 10 || user.phone === phone}
                    onClick={changePhone}
                  >
                    Change Mobile <i className="bi bi-box-arrow-in-right"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger m-1"
                    onClick={() => {
                      setShowMobile(false);
                      setShowBtns(true);
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right"></i>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-3">
                  <label htmlFor="" className="form-label">
                    OTP
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="otp"
                    id="otp"
                    placeholder="Enter OTP"
                    value={mobileOTP}
                    onChange={(e) => setMobileOTP(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary m-1"
                    disabled={mobileOTP.length !== 6}
                    onClick={verifyMobileOTP}
                  >
                    Verify OTP <i className="bi bi-box-arrow-in-right"></i>
                  </button>
                  {showRetryBtn && (
                    <button
                      type="button"
                      className="btn btn-danger m-1"
                      onClick={changePhone}
                    >
                      <i className="bi bi-box-arrow-in-right"></i>
                      Retry
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-danger m-1"
                    onClick={() => {
                      setShowMobile(false);
                      setShowBtns(true);
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right"></i>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
        {state.TYPE === "teacher" && showEmail && (
          <form autoComplete="off">
            <h3 className="my-3 text-center text-primary">Change Email</h3>
            {!emailOTPSent ? (
              <div>
                <div className="mb-3">
                  <label htmlFor="" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary m-1"
                    disabled={
                      email === "" ||
                      !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ||
                      email == user.email
                    }
                    onClick={changeEmail}
                  >
                    Change Email <i className="bi bi-box-arrow-in-right"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger m-1"
                    onClick={() => {
                      setShowEmail(false);
                      setShowBtns(true);
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right"></i>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-3">
                  <label htmlFor="" className="form-label">
                    OTP
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="otp"
                    id="otp"
                    placeholder="Enter OTP"
                    value={emailOTP}
                    onChange={(e) => setEmailOTP(e.target.value)}
                  />
                </div>
                <div>
                  {showEmailRetryBtn && (
                    <button
                      type="button"
                      className="btn btn-primary m-1"
                      onClick={changeEmail}
                    >
                      Retry
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn btn-primary m-1"
                    disabled={emailOTP.length !== 6}
                    onClick={verifyEmailOTP}
                  >
                    Verify OTP <i className="bi bi-box-arrow-in-right"></i>
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateUP;
