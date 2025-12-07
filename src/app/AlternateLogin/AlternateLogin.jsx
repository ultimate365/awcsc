"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from "../../context/Store";
import { encryptObjData, setCookie } from "../../modules/encryption";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../context/FirbaseContext";
export default function AlternateLogin() {
  const { setState } = useGlobalContext();
  const formRef = useRef(null);
  const navigate = useRouter();
  const [phone, setPhone] = useState(null);
  const [name, setName] = useState(null);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [mobileOTP, setMobileOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showRetryBtn, setShowRetryBtn] = useState(false);
  const [tData, setTData] = useState({});
  const [uData, setUData] = useState({});
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const type = searchParams.get("type");
  const redirectURL = searchParams.get("redirectURL");

  const getUserData = async () => {
    try {
      setDisplayLoader(true);
      const collectionRef = collection(firestore, "sportsUsers");
      const q = query(collectionRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        let fdata = querySnapshot.docs[0].data();

        if (!fdata.disabled) {
          setDisplayLoader(false);
          toast.success("Congrats! You are Logined Successfully!");
          const collectionRef2 = collection(firestore, "teachers");
          const q2 = query(collectionRef2, where("empid", "==", fdata.empid));
          const querySnapshot2 = await getDocs(q2);
          let fdata2 = querySnapshot2.docs[0].data();
          setPhone(fdata2.phone);
          setName(fdata2.tname);
          setTData(fdata2);
          setUData(fdata);
        } else {
          setDisplayLoader(false);
          toast.error("Your Account is Disabled!");
        }
      } else {
        const collectionRef2 = collection(firestore, "userschools");
        const q2 = query(collectionRef2, where("username", "==", username));
        const querySnapshot2 = await getDocs(q2);

        if (querySnapshot2.docs.length > 0) {
          let fdata2 = querySnapshot2.docs[0].data();
          setDisplayLoader(false);
          setPhone(fdata2.phone);
          setName(fdata2.hoi);
          setUData(fdata2);
          toast.success("Congrats! You are Logined Successfully!");
        } else {
          setDisplayLoader(false);
          toast.error("Invalid Username or Password!");
        }
      }
    } catch (error) {
      setDisplayLoader(false);
      toast.error("Error Occurred: " + error.message);
    }
  };

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
        if (type === "teacher") {
          encryptObjData("uid", uData, 10080);
          encryptObjData("tid", tData, 10080);
          setCookie("t", tData.tname, 10080);
          setCookie("loggedAt", Date.now(), 10080);

          setTimeout(() => {
            setState({
              USER: uData,
              ACCESS: tData.circle,
              LOGGEDAT: Date.now(),
              TYPE: "teacher",
            });
            navigate.push(redirectURL ? `/${redirectURL}` : "/dashboard");
          }, 500);
        } else {
          encryptObjData("schid", uData, 10080);
          setCookie("loggedAt", Date.now(), 10080);
          setTimeout(() => {
            setState({
              USER: uData,
              ACCESS: uData.convenor,
              LOGGEDAT: Date.now(),
              TYPE: "school",
            });
            navigate.push(redirectURL ? `/${redirectURL}` : "/dashboard");
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
    if (!username && !type) {
      navigate.push("/logout");
    }
    getUserData();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (mobileOTP.length === 6) {
      formRef.current?.requestSubmit();
    }
  }, [mobileOTP]);
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
          {/* <p>Please check your OTP on Our Telegram Group</p> */}
          <p>
            Please check your Telegram App on +91-
            {`${phone?.slice(0, 4)}XXXX${phone?.slice(8, 10)}`} for an OTP.
          </p>
          <div className="col-md-6 mx-auto">
            <form ref={formRef} autoComplete="off" onSubmit={verifyOTP}>
              <input
                className="form-control mb-3"
                ref={(input) => input && input.focus()}
                title={"Enter Your OTP"}
                type={"number"}
                placeholder={"Enter Your 6 digit OTP"}
                value={mobileOTP}
                onChange={(e) => {
                  // Only digits, max 6
                  const inputValue = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);
                  setMobileOTP(inputValue);
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData
                    .getData("Text")
                    .replace(/\D/g, "")
                    .slice(0, 6);
                  setMobileOTP(pasted);
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
    </div>
  );
}
