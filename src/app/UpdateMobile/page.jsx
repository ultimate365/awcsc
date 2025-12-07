"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { firestore } from "../../context/FirbaseContext";
import { doc, updateDoc } from "firebase/firestore";
import { decryptObjData, getCookie } from "../../modules/encryption";
import Loader from "../../components/Loader";
import { useGlobalContext } from "../../context/Store";
import { OTPWidget } from "@msg91comm/sendotp-sdk";

export default function UpdateMobile() {
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
  const [adminType, setAdminType] = useState(user.type);
  const [isTeacher, setIsTeacher] = useState(true);
  const [id, setId] = useState("");

  const [mobileOTPSent, setMobileOTPSent] = useState(false);
  const [mobileOTP, setMobileOTP] = useState("");
  const [showRetryBtn, setShowRetryBtn] = useState(false);
  const [phone, setPhone] = useState(user.phone);
  const [reqId, setReqId] = useState("");
  const checkUser = () => {
    let details = getCookie("tid");
    let schdetails = getCookie("schid");
    if (details) {
      userdetails = decryptObjData("tid");
      setIsTeacher(true);
      setId(userdetails.id);
      setState({
        USER: userdetails,
        ACCESS: userdetails?.circle,
        LOGGEDAT: Date.now(),
        TYPE: "teacher",
      });
      setAdminType(userdetails.type);
    } else if (schdetails) {
      userdetails = decryptObjData("schid");
      setIsTeacher(false);
      setId(userdetails.id);
      setState({
        USER: userdetails,
        ACCESS: userdetails?.convenor,
        LOGGEDAT: Date.now(),
        TYPE: "school",
      });
    } else {
      navigate.push("/Logout");
    }
  };
  const changePhone = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
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
        const data = {
          otp: mobileOTP.toString(),
          reqId: reqId,
        };
        const response = await OTPWidget.verifyOTP(data);
        if (response.type === "success") {
          const docRef = doc(
            firestore,
            isTeacher
              ? adminType === "Administrator"
                ? "sportsAdmins"
                : "teachers"
              : "userschools",
            id
          );
          await updateDoc(docRef, {
            phone: phone.toString(),
          }).then(() => {
            toast.success("Your Mobile Number is successfully verified!");
            setLoader(false);
            setTimeout(async () => {
              navigate.push("/Logout");
            }, 200);
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
    document.title = "WBTPTA Sports App:Update Mobile Number";
    checkUser();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container text-black p-2">
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
            </div>
          </div>
        )}
      </form>
      {loader && <Loader />}
    </div>
  );
}
