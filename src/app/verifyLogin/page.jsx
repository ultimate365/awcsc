"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from "../../context/Store";
import {
  decryptObjData,
  deleteCookie,
  getCookie,
  setCookie,
} from "../../modules/encryption";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import CustomInput from "../../components/CustomInput";
import axios from "axios";
import Link from "next/link";
export default function VerifyLogin() {
  const { setState } = useGlobalContext();

  const navigate = useRouter();
  const [phone, setPhone] = useState(null);
  const [name, setName] = useState(null);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [mobileOTP, setMobileOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showRetryBtn, setShowRetryBtn] = useState(false);
  let nonVerifiedTid = getCookie("nonVerifiedTid");
  let nonVerifiedUid = getCookie("nonVerifiedUid");
  let nonVerifiedSchId = getCookie("nonVerifiedSchId");

  const sendVerificationOTP = async (phone, name) => {
    setDisplayLoader(true);
    const res = await axios.post("/api/sendMobileOTP", {
      phone,
      name,
    });
    const record = res.data;
    if (record.success) {
      toast.success("OTP sent to your Mobile Number!");
      setDisplayLoader(false);
      setOtpSent(true);
      setShowRetryBtn(false);
      setTimeout(() => {
        setShowRetryBtn(true);
      }, 30000);
    } else {
      setShowRetryBtn(true);
      toast.error("Failed to send OTP!");
      setDisplayLoader(false);
    }
  };
  const verifyOTP = async (e) => {
    e.preventDefault();
    if (mobileOTP !== "" && mobileOTP.length === 6) {
      setDisplayLoader(true);
      const res = await axios.post("/api/verifyMobileOTP", {
        phone,
        phoneCode: mobileOTP,
      });
      const record = res.data;
      if (record.success) {
        toast.success("Your Mobile Number is successfully verified!");
        setDisplayLoader(false);
        if (nonVerifiedTid) {
          const userTeacherData = decryptObjData("nonVerifiedUid");
          const teacherData = decryptObjData("nonVerifiedTid");
          setCookie("uid", nonVerifiedUid, 10080);
          setCookie("tid", nonVerifiedTid, 10080);
          setCookie("t", teacherData.tname, 10080);
          setCookie("loggedAt", Date.now(), 10080);
          deleteCookie("nonVerifiedUid");
          deleteCookie("nonVerifiedTid");
          setTimeout(() => {
            setState({
              USER: userTeacherData,
              ACCESS: teacherData.circle,
              LOGGEDAT: Date.now(),
              TYPE: "teacher",
            });
            navigate.push("/dashboard");
          }, 500);
        } else if (nonVerifiedSchId) {
          const schoolData = decryptObjData("nonVerifiedSchId");
          setCookie("schid", nonVerifiedSchId, 10080);
          setCookie("loggedAt", Date.now(), 10080);
          deleteCookie("nonVerifiedSchId");
          setTimeout(() => {
            setState({
              USER: schoolData,
              ACCESS: schoolData.convenor,
              LOGGEDAT: Date.now(),
              TYPE: "school",
            });
            navigate.push("/dashboard");
          }, 500);
        }
      } else {
        toast.error("Failed to Verify OTP!");
        setDisplayLoader(false);
        console.log(record.message);
      }
    } else {
      toast.error("Please enter a Valid 6 Digit OTP");
    }
  };

  useEffect(() => {
    if (!nonVerifiedTid && !nonVerifiedSchId) {
      navigate.push("/logout");
    }
    if (nonVerifiedSchId) {
      const schoolData = decryptObjData("nonVerifiedSchId");
      setPhone(schoolData.phone);
      setName(schoolData.hoi);
    }
    if (nonVerifiedTid) {
      const teacherData = decryptObjData("nonVerifiedTid");
      console.log(teacherData);
      setPhone(teacherData.phone);
      setName(teacherData.tname);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      {displayLoader ? <Loader /> : null}
      <h3>Verify Login</h3>

      {!otpSent ? (
        <button
          type="button"
          className="btn btn-primary m-1"
          onClick={() => sendVerificationOTP(phone, name)}
        >
          Send Verification OTP
        </button>
      ) : (
        <div>
          <p>Please check your OTP on Our Telegram Group</p>
          {/* <p>
            Please check your phone +91-
            {`${phone?.slice(0, 4)}XXXX${phone?.slice(8, 10)}`} for an OTP.
          </p> */}
          <div className="col-md-6 mx-auto">
            <form action="" autoComplete="off" onSubmit={verifyOTP}>
              <CustomInput
                title={"Enter Your OTP"}
                type={"number"}
                placeholder={"Enter Your 6 digit OTP"}
                value={mobileOTP}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  // Set a maxLength (e.g., 6 digits)
                  if (inputValue.length <= 6) {
                    setMobileOTP(inputValue);
                  }
                }}
              />
            </form>

            <button
              type="submit"
              className="btn btn-primary m-1"
              onClick={verifyOTP}
            >
              Verify
            </button>
            {showRetryBtn && (
              <button
                type="button"
                className="btn btn-primary m-1"
                onClick={() => sendVerificationOTP(phone, name)}
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      )}

      <div className="my-5">
        <Link
          className="btn btn-success m-1 fs-5"
          href={"https://t.me/+ZYcKXX_HM9g5NDk1"}
          target="_blank"
        >
         <i className="bi bi-telegram"></i> Our Telegram Group
        </Link>
      </div>
    </div>
  );
}
