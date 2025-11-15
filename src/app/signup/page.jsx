"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import bcrypt from "bcryptjs";

import { firestore } from "../../context/FirbaseContext"; // adjust path if needed

import { validateEmployeeID } from "../../modules/calculatefunctions";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import { OTPWidget } from "@msg91comm/sendotp-sdk";
/**
 * Client-side Signup component converted from React Native
 * Uses Bootstrap classes for styling
 */

function Loader({ visible }) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.6)",
        zIndex: 1050,
      }}
    >
      <div className="spinner-border" role="status" aria-hidden="true"></div>
    </div>
  );
}

export default function Signup() {
  const widgetId = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID;
  const authToken = process.env.NEXT_PUBLIC_MSG91_AUTH_TOKEN;

  useEffect(() => {
    OTPWidget.initializeWidget(widgetId, authToken);
  }, []);
  const router = useRouter();

  const [phone, setPhone] = useState(new Array(10).fill(""));
  const [loader, setLoader] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [emailOtp, setEmailOtp] = useState(new Array(6).fill(""));
  const [showRetryBtn, setShowRetryBtn] = useState(false);
  const inputsRef = useRef([]);
  const emailRef = useRef([]);

  const [inputField, setInputField] = useState({
    teachersID: "",
    tname: "",
    school: "",
    desig: "",
    pan: "",
    udise: "",
    circle: "",
    empid: "",
    convenor: "",
    gpAssistant: "",
    gp: "",
    email: "",
    phone: "",
    id: "",
    username: "",
    password: "",
    cpassword: "",
    createdAt: Date.now(),
  });

  const [showRegForm, setShowRegForm] = useState(false);
  const [empid, setEmpid] = useState("");
  const [showRegisterBtn, setShowRegisterBtn] = useState(false);
  const [reqId, setReqId] = useState("");
  // Fetch user data from Firestore (teachers & sportsUsers)
  const fetchUserData = async () => {
    const trimEmpid = empid.trim().toUpperCase();
    if (!validateEmployeeID(trimEmpid)) {
      toast.error("Please enter valid Employee ID");
      return;
    }
    setLoader(true);
    try {
      const collectionRef = collection(firestore, "sportsUsers");
      const q = query(collectionRef, where("empid", "==", trimEmpid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        toast.error(`You are Already Registered, Please Log In.`);
      } else {
        const collectionRef2 = collection(firestore, "teachers");
        const q2 = query(collectionRef2, where("empid", "==", trimEmpid));
        const querySnapshot2 = await getDocs(q2);
        if (querySnapshot2.docs.length > 0) {
          const data = querySnapshot2.docs[0].data();
          setInputField({
            teachersID: data.id,
            tname: data.tname,
            school: data.school,
            desig: data.desig,
            pan: data.pan,
            udise: data.udise,
            circle: data.circle,
            empid: data.empid,
            convenor: data.circle,
            gpAssistant: data.gpAssistant,
            gp: data.gp,
            email: data.email,
            phone: data.phone,
            id: data.id,
            username: "",
            password: "",
            cpassword: "",
            createdAt: Date.now(),
          });
          toast.success(`Please Review And Register Yourself.`);
          setShowRegForm(true);
        } else {
          toast.error("Employee ID Not Found.");
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Something Went Wrong.");
    } finally {
      setLoader(false);
    }
  };

  // Send OTP (calls your API)
  const sendOTP = async (isResend = false) => {
    if (isResend) {
      // clear existing OTP fields when user requests resend
      setOtp(new Array(6).fill(""));
      setEmailOtp(new Array(6).fill(""));
      // focus first mobile OTP input if available
      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 50);
    }
    if (
      !inputField.phone ||
      inputField.phone.length < 10 ||
      !inputField.phone.match(/^[0-9]+$/)
    ) {
      toast.error("Please enter valid mobile number");
      return;
    }
    if (
      !inputField.email ||
      !inputField.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      toast.error("Please enter valid email address");
      return;
    }

    setLoader(true);
    try {
      const data = {
        identifier: `91${inputField.phone}`,
      };
      const response = await OTPWidget.sendOTP(data);
      if (response.type === "success") {
        setReqId(response.message);
        toast.success("OTP sent to your Mobile Number!");
        const res = await axios.post(`/api/sendEmailOTP`, {
          email: inputField.email,
          name: inputField.tname,
          username: "",
        });
        if (res.data.success) {
          setLoader(false);
          setOtpSent(true);
          setShowRetryBtn(false);
          setTimeout(() => {
            setShowRetryBtn(true);
          }, 30000);
        } else {
          toast.success("OTP sent to your Email!");
          setLoader(false);
          setOtpSent(true);
          setShowRetryBtn(false);
        }
      } else {
        setShowRetryBtn(true);
        toast.error("Failed to send OTP!");
        setLoader(false);
        console.log(record);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP!");
      setLoader(false);
    }
  };

  // Verify both mobile & email OTP
  const verifyMobile = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter Mobile OTP");
      return;
    }
    const emailCode = emailOtp.join("");
    if (emailCode.length < 6) {
      toast.error("Please enter Email OTP");
      return;
    }
    setLoader(true);
    try {
      const data = {
        otp: code,
        reqId: reqId,
      };
      const response = await OTPWidget.verifyOTP(data);
      if (response.type === "success") {
        // const res = await axios.post(`/api/verifyEmailAndMobile`, {
        //   phone: inputField.phone,
        //   phoneCode: code,
        //   email: inputField.email,
        //   emailCode: emailCode,
        // });
        // const record = res.data;
        // if (record.success) {
        const res = await axios.post(`/api/verifyEmailOTP`, {
          email: inputField.email.trim().toLowerCase(),
          code: parseInt(emailCode, 10),
        });

        if (res.data.success) {
          toast.success("OTP verified successfully!");
          setShowRegisterBtn(true);
          setLoader(false);
          setOtpSent(false);
          setOtp(new Array(6).fill(""));
          setEmailOtp(new Array(6).fill(""));
          setPhone(new Array(10).fill(""));
        } else {
          toast.error("Failed to verify Email OTP!");
          setLoader(false);
          console.log(res.data.message);
        }
      } else {
        toast.error("Failed to verify Mobile OTP!");
        console.log(response);
        setLoader(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify OTP!");
      setLoader(false);
    }
  };

  // Register user and write to Firestore + call your API
  const registerUser = async () => {
    setLoader(true);
    if (inputField.password !== inputField.cpassword) {
      toast.error("Passwords do not match!");
      setLoader(false);
      return;
    }
    if (inputField.password.length < 6) {
      toast.error("Password should be atleast 6 characters long");
      setLoader(false);
      return;
    }

    if (!inputField.username || !inputField.username.match(/^[a-zA-Z0-9]+$/)) {
      toast.error("Please enter valid username");
      setLoader(false);
      return;
    }
    try {
      const entry = {
        teachersID: inputField.teachersID,
        tname: inputField.tname,
        school: inputField.school,
        desig: inputField.desig,
        pan: inputField.pan,
        udise: inputField.udise,
        circle: inputField.circle,
        empid: inputField.empid,
        convenor: inputField.circle,
        gpAssistant: inputField.circle,
        gp: inputField.gp,
        email: inputField.email,
        phone: inputField.phone,
        id: inputField.id,
        username: inputField.username.toLowerCase(),
        password: bcrypt.hashSync(inputField.password, 10),
        createdAt: inputField.createdAt,
        disabled: false,
      };
      const res = await axios.post(`/api/adduserteachers`, entry);
      const record = res.data;
      if (record.success) {
        await setDoc(doc(firestore, "sportsUsers", inputField.id), entry).catch(
          (e) => {
            console.error(e);
            setLoader(false);
            toast.error("Failed to register user!");
          }
        );

        const docRef = doc(firestore, "teachers", inputField.id);
        await updateDoc(docRef, {
          spregistered: true,
        })
          .then(async () => {
            toast.success("User registered successfully!");
            setLoader(false);
            router.push("/login");
          })
          .catch((e) => {
            console.error(e);
            setLoader(false);
            toast.error("Failed to register user!");
          });
      } else {
        toast.error("Failed to register user!");
        setLoader(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to register user!");
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };

  // OTP input helpers (mobile and email)
  const handleOtpChange = (val, index) => {
    const only = val.replace(/[^0-9]/g, "");
    const newOtp = [...otp];

    // guard: ensure previous are filled
    const prevFilled = otp.slice(0, index).every((d) => d !== "");
    if (!prevFilled) {
      const firstEmpty = otp.slice(0, index).findIndex((d) => d === "");
      inputsRef.current[firstEmpty]?.focus();
      return;
    }

    if (only.length > 1) {
      const paste = only.split("").slice(0, 6);
      for (let i = 0; i < paste.length; i++) {
        if (i + index < 6) newOtp[i + index] = paste[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(index + only.length, 5);
      inputsRef.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = only;
    setOtp(newOtp);
    if (only && index < 5) {
      inputsRef.current[index + 1]?.focus();
    } else if (!only && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Paste handler for mobile OTP inputs
  const handleOtpPaste = (e, index) => {
    e.preventDefault();
    const pasted =
      (e.clipboardData || window.clipboardData).getData("Text") || "";
    const digits = pasted.replace(/[^0-9]/g, "");
    if (!digits) return;

    const newOtp = [...otp];

    // If user pasted a full 6-digit code, populate from start
    if (digits.length >= 6) {
      const firstSix = digits.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) newOtp[i] = firstSix[i];
      setOtp(newOtp);
      // focus last input
      inputsRef.current[5]?.focus();
      return;
    }

    // If previous fields are not filled, try to place starting at first empty
    const prevFilled = otp.slice(0, index).every((d) => d !== "");
    let start = index;
    if (!prevFilled) {
      const firstEmpty = otp.slice(0, index).findIndex((d) => d === "");
      if (firstEmpty !== -1) start = firstEmpty;
    }

    for (let i = 0; i < digits.length; i++) {
      if (start + i < 6) newOtp[start + i] = digits[i];
    }
    setOtp(newOtp);
    const focusIndex = Math.min(start + digits.length, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleEmailOtpChange = (val, index) => {
    const only = val.replace(/[^0-9]/g, "");
    const newOtp = [...emailOtp];

    const prevFilled = emailOtp.slice(0, index).every((d) => d !== "");
    if (!prevFilled) {
      const firstEmpty = emailOtp.slice(0, index).findIndex((d) => d === "");
      emailRef.current[firstEmpty]?.focus();
      return;
    }

    if (only.length > 1) {
      const paste = only.split("").slice(0, 6);
      for (let i = 0; i < paste.length; i++) {
        if (i + index < 6) newOtp[i + index] = paste[i];
      }
      setEmailOtp(newOtp);
      const nextIndex = Math.min(index + only.length, 5);
      emailRef.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = only;
    setEmailOtp(newOtp);
    if (only && index < 5) {
      emailRef.current[index + 1]?.focus();
    } else if (!only && index > 0) {
      emailRef.current[index - 1]?.focus();
    }
  };

  // Paste handler for email OTP inputs
  const handleEmailOtpPaste = (e, index) => {
    e.preventDefault();
    const pasted =
      (e.clipboardData || window.clipboardData).getData("Text") || "";
    const digits = pasted.replace(/[^0-9]/g, "");
    if (!digits) return;

    const newOtp = [...emailOtp];

    if (digits.length >= 6) {
      const firstSix = digits.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) newOtp[i] = firstSix[i];
      setEmailOtp(newOtp);
      emailRef.current[5]?.focus();
      return;
    }

    const prevFilled = emailOtp.slice(0, index).every((d) => d !== "");
    let start = index;
    if (!prevFilled) {
      const firstEmpty = emailOtp.slice(0, index).findIndex((d) => d === "");
      if (firstEmpty !== -1) start = firstEmpty;
    }

    for (let i = 0; i < digits.length; i++) {
      if (start + i < 6) newOtp[start + i] = digits[i];
    }
    setEmailOtp(newOtp);
    const focusIndex = Math.min(start + digits.length, 5);
    emailRef.current[focusIndex]?.focus();
  };

  // Keys handling (backspace) for OTP inputs
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
        return;
      }
      if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handleEmailOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...emailOtp];
      if (emailOtp[index]) {
        newOtp[index] = "";
        setEmailOtp(newOtp);
        return;
      }
      if (index > 0) {
        newOtp[index - 1] = "";
        setEmailOtp(newOtp);
        emailRef.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 820 }}>
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
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="text-center">
            <Image
              src={require("../../../public/assets/images/logo.png")}
              width={140}
              height={140}
              alt="logo"
              style={{ width: 140, height: 140, objectFit: "contain" }}
            />
            <h2 className="mt-2">Welcome To Sign Up Page</h2>
            <p className="text-muted">Please follow the steps below</p>
          </div>

          <div className="mt-3">
            {!showRegisterBtn ? (
              !otpSent ? (
                !showRegForm ? (
                  // Step 1: Enter Employee ID
                  <div>
                    <p className="fw-medium">
                      Enter Your Employee ID to continue
                    </p>
                    <div className="mb-3">
                      <label className="form-label">Employee ID</label>
                      <input
                        className="form-control"
                        placeholder="Enter Employee ID"
                        value={empid}
                        onChange={(e) => setEmpid(e.target.value)}
                        maxLength={8}
                      />
                    </div>
                    <button
                      className="btn"
                      style={{
                        background: "navy",
                        color: "#fff",
                      }}
                      onClick={fetchUserData}
                      disabled={loader}
                    >
                      {loader ? "Fetching User Data..." : "Fetch Data"}
                    </button>
                  </div>
                ) : (
                  // Step 2: Review details and request OTP
                  <div>
                    <p className="fw-medium">
                      Please Check and Review Your Contact Details
                    </p>

                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        value={inputField.tname}
                        readOnly
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Designation</label>
                      <input
                        className="form-control"
                        value={inputField.desig}
                        readOnly
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">School</label>
                      <input
                        className="form-control"
                        value={inputField.school}
                        readOnly
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Teacher's Employee ID
                      </label>
                      <input
                        className="form-control"
                        value={inputField.empid}
                        readOnly
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Teacher's Mobile No.</label>
                      <input
                        className="form-control"
                        value={inputField.phone}
                        inputMode="numeric"
                        maxLength={10}
                        readOnly
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Teacher's Email id</label>
                      <input
                        className="form-control"
                        value={inputField.email}
                        onChange={(e) =>
                          setInputField({
                            ...inputField,
                            email: e.target.value,
                          })
                        }
                        type="email"
                      />
                    </div>

                    <button
                      className="btn"
                      style={{
                        background: "navy",
                        color: "#fff",
                      }}
                      onClick={sendOTP}
                      disabled={loader}
                    >
                      {loader ? "Sending OTP..." : "Verify"}
                    </button>
                  </div>
                )
              ) : (
                // OTP entry screen
                <div>
                  <p className="fw-medium">Enter OTP to continue</p>

                  <p className="mb-1">Enter Mobile OTP</p>
                  <div className="d-flex justify-content-center mb-3 gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onPaste={(e) => handleOtpPaste(e, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        inputMode="numeric"
                        maxLength={1}
                        className="form-control text-center"
                        style={{ width: 56, height: 56, fontSize: 20 }}
                        type="text"
                        autoComplete="one-time-code"
                      />
                    ))}
                  </div>

                  <p className="mb-1">Enter Email OTP</p>
                  <div className="d-flex justify-content-center mb-3 gap-2">
                    {emailOtp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (emailRef.current[index] = el)}
                        value={digit}
                        onChange={(e) =>
                          handleEmailOtpChange(e.target.value, index)
                        }
                        onPaste={(e) => handleEmailOtpPaste(e, index)}
                        onKeyDown={(e) => handleEmailOtpKeyDown(e, index)}
                        inputMode="numeric"
                        maxLength={1}
                        className="form-control text-center"
                        style={{ width: 56, height: 56, fontSize: 20 }}
                        type="text"
                        autoComplete="one-time-code"
                      />
                    ))}
                  </div>

                  <div className="d-flex gap-2 justify-content-center mb-3 align-items-center">
                    <button
                      className="btn"
                      style={{
                        background: "navy",
                        color: "#fff",
                      }}
                      onClick={verifyMobile}
                      disabled={loader}
                    >
                      {loader ? "Verifying OTP..." : "Verify"}
                    </button>

                    {showRetryBtn && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => sendOTP(true)}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )
            ) : (
              // Final registration form (username/password)
              <div>
                <p className="fw-medium">
                  Please Enter your own credentials to continue
                </p>

                <div className="mb-3">
                  <label className="form-label">Enter Your Username</label>
                  <input
                    className="form-control"
                    placeholder="Enter Your Username"
                    value={inputField.username}
                    onChange={(e) =>
                      setInputField({ ...inputField, username: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Enter Your Password</label>
                  <input
                    className="form-control"
                    placeholder="Enter Your Password"
                    value={inputField.password}
                    onChange={(e) =>
                      setInputField({ ...inputField, password: e.target.value })
                    }
                    type="password"
                    style={{
                      background:
                        inputField.password === inputField.cpassword &&
                        inputField.password !== ""
                          ? "rgba(135,255,167,.3)"
                          : "transparent",
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Your Password</label>
                  <input
                    className="form-control"
                    placeholder="Confirm Your Password"
                    value={inputField.cpassword}
                    onChange={(e) =>
                      setInputField({
                        ...inputField,
                        cpassword: e.target.value,
                      })
                    }
                    type="password"
                    style={{
                      background:
                        inputField.password === inputField.cpassword &&
                        inputField.cpassword !== ""
                          ? "rgba(135,255,167,.3)"
                          : "transparent",
                    }}
                  />
                </div>

                <button
                  className="btn"
                  style={{
                    background: "darkgreen",
                    color: "#fff",
                  }}
                  onClick={registerUser}
                >
                  Register
                </button>
              </div>
            )}

            {/* Login row */}
            <div className="d-flex justify-content-center gap-3 align-items-center mt-4">
              <div style={{ color: "navy", fontSize: 16 }}>Go To Login</div>
              <button
                className="btn"
                style={{ background: "chocolate", color: "#fff" }}
                onClick={() => router.push("/login")}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      <Loader visible={loader} />
    </div>
  );
}
