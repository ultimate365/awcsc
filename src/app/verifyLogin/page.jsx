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
export default function VerifyLogin() {
  const { setState } = useGlobalContext();

  const navigate = useRouter();
  const [phone, setPhone] = useState(null);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [mobileOTP, setMobileOTP] = useState("");

  let nonVerifiedTid = getCookie("nonVerifiedTid");
  let nonVerifiedUid = getCookie("nonVerifiedUid");
  let nonVerifiedSchId = getCookie("nonVerifiedSchId");

  const sendVerificationOTP = async (phone) => {
    setDisplayLoader(true);
    const res = await axios.post("/api/sendMobileOTP", {
      phone,
    });
    const record = res.data;
    if (record.success) {
      toast.success("OTP sent to your Mobile Number!");
      setDisplayLoader(false);
    } else {
      toast.error("Failed to send OTP!");
      setDisplayLoader(false);
    }
  };
  const verifyOTP = async () => {
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
      toast.error("Failed to send OTP!");
      setDisplayLoader(false);
    }
  };

  useEffect(() => {
    if (!nonVerifiedTid && !nonVerifiedSchId) {
      navigate.push("/logout");
    }

    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (nonVerifiedSchId) {
      const schoolData = decryptObjData("nonVerifiedSchId");
      setPhone(schoolData.phone);
      sendVerificationOTP(schoolData.phone);
    }
    if (nonVerifiedTid) {
      const teacherData = decryptObjData("nonVerifiedTid");
      setPhone(teacherData.phone);
      sendVerificationOTP(teacherData.phone);
    }

    // eslint-disable-next-line
  }, [phone]);

  return (
    <div className="container">
      {displayLoader ? <Loader /> : null}
      <h3>Verify Login</h3>
      <p>
        Please check your phone +91-
        {`${phone?.slice(0, 4)}XXXX${phone?.slice(8, 10)}`} for an OTP.
      </p>
      <div className="col-md-6 mx-auto">
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
        <button
          type="button"
          className="btn btn-primary m-3"
          onClick={() => {
            if (mobileOTP !== "" && mobileOTP.length !== 6) {
              verifyOTP();
            } else {
              toast.error("Please enter a Valid 6 Digit OTP");
            }
          }}
        >
          Verify
        </button>
      </div>
    </div>
  );
}
