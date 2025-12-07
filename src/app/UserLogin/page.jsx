"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/Store";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../components/Loader";
import { getDocumentByField } from "../../firebase/firestoreHelper";
import { OTPWidget } from "@msg91comm/sendotp-sdk";
import { encryptObjData, setCookie } from "../../modules/encryption";
import { useRouter } from "next/navigation";
export default function UserLogin() {
  const { setState, appUpdateState } = useGlobalContext();
  const widgetId = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID;
  const authToken = process.env.NEXT_PUBLIC_MSG91_AUTH_TOKEN;
  useEffect(() => {
    OTPWidget.initializeWidget(widgetId, authToken);
  }, []);
  const navigate = useRouter();
  const [loader, setLoader] = useState(false);
  const [inputField, setInputField] = useState("");
  const [adminInputField, setAdminInputField] = useState("");
  const [errAdminInputField, setErrAdminInputField] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [errField, setErrField] = useState("");
  const [mobileOTP, setMobileOTP] = useState("");
  const [userType, setUserType] = useState("teacher");
  const [userData, setUserData] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [showRetryBtn, setShowRetryBtn] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [reqId, setReqId] = useState("");
  function removeSpaces(inputString) {
    // Use a regular expression to match all spaces (whitespace characters) and replace them with an empty string
    return inputString.replace(/\s/g, "");
  }
  const validForm = () => {
    let formIsValid = true;
    setErrField("");
    if (inputField === "" || inputField.toString().length < 10) {
      formIsValid = false;
      setErrField("Please Enter Valid Mobile No. or UDISE Code");
    }
    return formIsValid;
  };
  const validAdminForm = () => {
    let formIsValid = true;
    setErrAdminInputField("");
    if (adminInputField === "" || adminInputField.toString().length < 10) {
      formIsValid = false;
      setErrAdminInputField("Please Enter Valid Mobile No.");
    }
    return formIsValid;
  };
  const submitBtn = async (e) => {
    e.preventDefault();
    if (validForm()) {
      setLoader(true);
      try {
        if (inputField.toString().length === 10) {
          const res = await getDocumentByField(
            "teachers",
            "phone",
            inputField.toString()
          );
          if (res) {
            setUserType("teacher");
            setUserData(res);
            if (res.disabled) {
              toast.error("Your Account is Disabled");
              setLoader(false);
              return;
            } else {
              await sendVerificationOTP(res.phone);
            }
          } else {
            setLoader(false);
            toast.error("No teacher found with this Mobile Number");
            return;
          }
        } else if (inputField.toString().length === 11) {
          const res = await getDocumentByField(
            "userschools",
            "udise",
            inputField.toString()
          );
          if (res) {
            setUserType("school");
            setUserData(res);
            await sendVerificationOTP(res.phone);
          } else {
            setLoader(false);
            toast.error("No school found with this UDISE Code");
            return;
          }
        } else {
          setLoader(false);
          toast.error("Please fill the Mobile No. or UDISE Code correctly");
          return;
        }
      } catch (error) {
        setLoader(false);
        toast.error("An error occurred while processing your request.");
        console.error("Error in submitBtn:", error);
      }
    } else {
      toast.error("Please fill the Mobile No. or UDISE Code correctly");
    }
  };
  const submitAdminBtn = async (e) => {
    e.preventDefault();
    if (validAdminForm()) {
      setLoader(true);
      try {
        if (adminInputField.toString().length === 10) {
          const res = await getDocumentByField(
            "sportsAdmins",
            "phone",
            adminInputField.toString()
          );
          if (res) {
            setUserType("Administrator");
            setUserData(res);
            if (res.disabled) {
              toast.error("Your Account is Disabled");
              setLoader(false);
              return;
            } else {
              await sendVerificationOTP(res.phone);
            }
          } else {
            setLoader(false);
            toast.error("No Administrator found with this Mobile Number");
            return;
          }
        } else {
          setLoader(false);
          toast.error("Please fill the Mobile No.");
          return;
        }
      } catch (error) {
        setLoader(false);
        toast.error("An error occurred while processing your request.");
        console.error("Error in submitBtn:", error);
      }
    } else {
      toast.error("Please fill the Mobile No.");
    }
  };
  const sendVerificationOTP = async (phone) => {
    setLoader(true);
    const data = {
      identifier: `91${phone}`,
    };
    const response = await OTPWidget.sendOTP(data);
    if (response.type === "success") {
      setReqId(response.message);
      toast.success("OTP sent to your Mobile Number!");
      setLoader(false);
      setOtpSent(true);
      setShowRetryBtn(false);
      setTimeout(() => {
        setShowRetryBtn(true);
      }, 30000);
    } else {
      setShowRetryBtn(true);
      toast.error("Failed to send OTP!");
      setLoader(false);
    }
  };
  const resendOTP = async () => {
    setLoader(true);
    const data = {
      reqId: reqId,
      retryChannel: 11,
    };
    const response = await OTPWidget.retryOTP(data);
    if (response.type === "success") {
      toast.success("OTP resent to your Mobile Number!");
      setLoader(false);
      setOtpSent(true);
      setShowRetryBtn(false);
    }
  };
  const verifyOTP = async (e) => {
    e.preventDefault();
    if (mobileOTP !== "" && mobileOTP.length === 6) {
      setLoader(true);
      const data = {
        otp: mobileOTP,
        reqId: reqId,
      };
      const response = await OTPWidget.verifyOTP(data);
      if (response.type === "success") {
        toast.success("Your Mobile Number is successfully verified!");
        setLoader(false);
        if (userType === "teacher") {
          encryptObjData("tid", userData, 10080);
          setCookie("t", userData.tname, 10080);
          setCookie("loggedAt", Date.now(), 10080);
          setTimeout(() => {
            setState({
              USER: userData,
              ACCESS: userData.circle,
              LOGGEDAT: Date.now(),
              TYPE: "teacher",
            });
            navigate.push("/Dashboard");
          }, 500);
        } else if (userType === "Administrator") {
          encryptObjData("tid", userData, 10080);
          setCookie("t", userData.tname, 10080);
          setCookie("loggedAt", Date.now(), 10080);
          setTimeout(() => {
            setState({
              USER: userData,
              ACCESS: userData.circle,
              LOGGEDAT: Date.now(),
              TYPE: "Administrator",
            });
            navigate.push("/Dashboard");
          }, 500);
        } else {
          encryptObjData("schid", userData, 10080);
          setCookie("loggedAt", Date.now(), 10080);
          setTimeout(() => {
            setState({
              USER: userData,
              ACCESS: userData.convenor,
              LOGGEDAT: Date.now(),
              TYPE: "school",
            });
            navigate.push("/Dashboard");
          }, 500);
        }
      } else {
        toast.error("Failed to Verify OTP!");
        setLoader(false);
        console.log(record.message);
      }
    } else {
      toast.error("Please enter a Valid 6 Digit OTP");
    }
  };
  return (
    <div className="container text-black p-2">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />

      {loader && <Loader />}
      {appUpdateState.showAdminLogin && (
        <div
          className="position-absolute bg-primary text-white p-2"
          style={{
            top: 100,
            right: 30,
            width: 50,
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
            zIndex: 1000,
            cursor: "pointer",
          }}
          onClick={() => setShowAdminLogin(!showAdminLogin)}
        >
          {showAdminLogin ? (
            <i className="bi bi-person-fill-check fs-4"></i>
          ) : (
            <span>
              <i className="bi bi-person-fill-gear fs-4"></i>
            </span>
          )}
        </div>
      )}

      {!otpSent ? (
        !showAdminLogin ? (
          <form autoComplete="off" onSubmit={submitBtn}>
            <h2 className="text-2xl font-bold mb-4">User Login</h2>
            <div className="mb-3 col-md-6 mx-auto">
              <label htmlFor="" className="form-label">
                Mobile No. or UDISE Code
              </label>
              <input
                type="number"
                placeholder="Enter  Mobile No. or UDISE Code"
                className="form-control "
                value={inputField}
                maxLength={11}
                onChange={(e) => {
                  e.target.value.toString().length <= 11 &&
                    setInputField(removeSpaces(e.target.value));
                }}
              />
            </div>
            {errField.length > 0 && <span className="error">{errField}</span>}
            <div>
              <button
                type="submit"
                className="btn btn-primary m-3"
                disabled={loader ? true : false}
                onClick={submitBtn}
              >
                Submit
              </button>
            </div>
          </form>
        ) : (
          <form autoComplete="off" onSubmit={submitAdminBtn}>
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
            <div className="mb-3 col-md-6 mx-auto">
              <label htmlFor="" className="form-label">
                Mobile No.
              </label>
              <input
                type="number"
                placeholder="Enter  Mobile No."
                className="form-control "
                value={adminInputField}
                maxLength={10}
                onChange={(e) => {
                  e.target.value.toString().length <= 10 &&
                    setAdminInputField(removeSpaces(e.target.value));
                }}
              />
            </div>
            {errAdminInputField.length > 0 && (
              <span className="error">{errAdminInputField}</span>
            )}
            <div>
              <button
                type="submit"
                className="btn btn-primary m-3"
                disabled={loader ? true : false}
                onClick={submitAdminBtn}
              >
                Submit
              </button>
            </div>
          </form>
        )
      ) : (
        <div className="col-md-6 mx-auto">
          <form autoComplete="off" onSubmit={verifyOTP}>
            <input
              className="form-control mb-3"
              ref={(input) => input && input.focus()}
              title={"Enter Your OTP"}
              type={"number"}
              placeholder={"Enter Your 6 digit OTP"}
              value={mobileOTP}
              onChange={(e) => {
                // Only digits, max 6
                const inputValue = e.target.value;
                setMobileOTP(inputValue);
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pasted = e.clipboardData.getData("Text");
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
      )}
    </div>
  );
}
