"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PasswordForm from "../../components/PasswordForm";
import Loader from "../../components/Loader";
import Link from "next/link";
const OtpForm = () => {
  const [otpform, showform] = useState(true);
  const [loader, setLoader] = useState(false);
  const emailRef = useRef();
  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const response = await axios.post("/api/forgotpassword", {
        email: emailRef.current.value,
      });
      const record = response.data;
      if (record.success) {
        toast.success(record.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,

          draggable: true,
          progress: undefined,
          theme: "light",
        });
        showform(false);
        setLoader(false);
      } else {
        setLoader(false);
        toast.error(record.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,

          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (e) {
      setLoader(false);
      toast.error("Something Went Wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,

        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  useEffect(() => {
    document.title = "AMTA WEST SPORTS:Forgot Password";
  }, []);
  return (
    <div className="container my-5">
      <div className="col-md-6 mx-auto">
        <h3 className="text-center text-primary mb-3">Reset Password</h3>
        {loader ? <Loader /> : null}
        {otpform ? (
          <form autoComplete="off" id="otpForm" method="post">
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                autoComplete="off"
                ref={emailRef}
              />
            </div>
            <div className="mb-3">
              <button
                type="submit"
                className="btn btn-primary m-1"
                onClick={sendOtp}
              >
                Send OTP
              </button>
              <Link href="/login">
                <button className="btn btn-danger m-1 px-4">Back</button>
              </Link>
            </div>
          </form>
        ) : (
          <PasswordForm email={emailRef.current.value} />
        )}
      </div>
    </div>
  );
};

export default OtpForm;
