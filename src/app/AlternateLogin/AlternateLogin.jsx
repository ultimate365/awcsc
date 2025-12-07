"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from "../../context/Store";
import { encryptObjData, setCookie } from "../../modules/encryption";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { OTPWidget } from "@msg91comm/sendotp-sdk";
import { getDocumentByField } from "../../firebase/firestoreHelper";
export default function AlternateLogin() {
  const widgetId = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID;
  const authToken = process.env.NEXT_PUBLIC_MSG91_AUTH_TOKEN;

  useEffect(() => {
    OTPWidget.initializeWidget(widgetId, authToken);
  }, []);
  const { setState } = useGlobalContext();
  const formRef = useRef(null);
  const navigate = useRouter();

  const [displayLoader, setDisplayLoader] = useState(false);
  const [mobileOTP, setMobileOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showRetryBtn, setShowRetryBtn] = useState(false);
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const type = searchParams.get("type");
  const redirectURL = searchParams.get("redirectURL");
  const [reqId, setReqId] = useState("");
  const sendVerificationOTP = async () => {
    setDisplayLoader(true);
    const data = {
      identifier: `91${phone}`,
    };
    const response = await OTPWidget.sendOTP(data);
    if (response.type === "success") {
      setReqId(response.message);
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
  const resendOTP = async () => {
    setDisplayLoader(true);
    const data = {
      reqId: reqId,
      retryChannel: 11,
    };
    const response = await OTPWidget.retryOTP(data);
    if (response.type === "success") {
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
      const data = {
        otp: mobileOTP,
        reqId: reqId,
      };
      const response = await OTPWidget.verifyOTP(data);
      if (response.type === "success") {
        toast.success("Your Mobile Number is successfully verified!");
        setDisplayLoader(false);
        if (type === "teacher") {
          const data = await getDocumentByField("teachers", "phone", phone);
          encryptObjData("tid", data, 10080);
          setCookie("t", data.tname, 10080);
          setCookie("loggedAt", Date.now(), 10080);

          setTimeout(() => {
            setState({
              USER: data,
              ACCESS: data.circle,
              LOGGEDAT: Date.now(),
              TYPE: "teacher",
            });
            navigate.push(redirectURL ? `/${redirectURL}` : "/Dashboard");
          }, 500);
        } else {
          const data = await getDocumentByField("userschools", "phone", phone);
          encryptObjData("schid", data, 10080);
          setCookie("loggedAt", Date.now(), 10080);
          setTimeout(() => {
            setState({
              USER: data,
              ACCESS: data.circle,
              LOGGEDAT: Date.now(),
              TYPE: "school",
            });
            navigate.push(redirectURL ? `/${redirectURL}` : "/Dashboard");
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
    if (!phone && !type) {
      navigate.push("/Logout");
    }

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
          onClick={() => sendVerificationOTP()}
        >
          Send Verification OTP
        </button>
      ) : (
        <div>
          {/* <p>Please check your OTP on Our Telegram Group</p> */}
          <p>
            Please check your Mobile +91-
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
                onClick={resendOTP}
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
