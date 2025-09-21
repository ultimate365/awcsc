"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { firestore } from "../../context/FirbaseContext";

import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { BsClipboard, BsClipboard2Check } from "react-icons/bs";
import Loader from "../../components/Loader";
import { decryptObjData, getCookie } from "../../modules/encryption";
import axios from "axios";
const Complain = () => {
  let teacherdetails, userdetails;
  let details = getCookie("tid");
  if (details) {
    teacherdetails = decryptObjData("tid");
    userdetails = decryptObjData("uid");
  }

  const [docId, setDocId] = useState(uuid().split("-")[0]);
  const [showMessage, setShowMessage] = useState(true);
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useRouter();
  const [search, setSearch] = useState("");
  const [inputField, setInputField] = useState({
    tname: teacherdetails ? teacherdetails.tname : "",
    school: teacherdetails ? teacherdetails.school : "",
    sis: "AMTA WEST CIRCLE",
    email: teacherdetails ? teacherdetails.email : "",
    mobile: teacherdetails ? teacherdetails.phone : "",
    complain: "",
    status: "Not Solved",
    complainTime: Date.now(),
    id: docId,
    solvedOn: "Not Solved",
    remarks: "Not Solved",
  });
  const [errField, setErrField] = useState({
    errtname: "",
    errschool: "",
    errsis: "",
    erremail: "",
    errmobile: "",
    errcomplain: "",
  });

  const validForm = () => {
    let formIsValid = true;
    setErrField({
      errtname: "",
      errschool: "",
      errsis: "",
      erremail: "",
      errmobile: "",
      errcomplain: "",
    });
    if (inputField.tname === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        errtname: "Please Enter Your Name",
      }));
    }
    if (inputField.school === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        errschool: "Please Enter Your School Name",
      }));
    }
    if (inputField.sis === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        errsis: "Please Enter Your Circle Name",
      }));
    }
    if (inputField.email === "" || !ValidateEmail(inputField.email)) {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        erremail: "Please Enter Valid email",
      }));
    }
    if (inputField.mobile === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        errmobile: "Please Enter Mobile No.",
      }));
    }
    if (inputField.complain === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        errcomplain: "Please Enter Your Request or Complain",
      }));
    }

    return formIsValid;
  };
  function ValidateEmail(mail) {
    // eslint-disable-next-line
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail)) {
      return true;
    }
    // alert("You have entered an invalid email address!");
    return false;
  }

  useEffect(() => {
    document.title = "AWC Sports App:Request Or Complain";
    // eslint-disable-next-line
  }, [inputField, docId]);
  useEffect(() => {
    // eslint-disable-next-line
  }, [userdetails, teacherdetails]);
  const changeData = (e) =>
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  // console.log(inputField);
  const regComplain = async () => {
    if (validForm()) {
      try {
        setLoader(true);
        await setDoc(doc(firestore, "sportscomplains", docId), inputField);
        // await axios.post("/api/addcomplains", inputField);
        // console.log(result.id);
        setLoader(false);
        toast.success("Congrats! Request Has Been Registered Successfully!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setShowMessage(false);
      } catch (e) {
        toast.error("Something went Wrong", {
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
      toast.error("Form is Invalid!", {
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
  };
  const [complainSearch, setComplainSearch] = useState(false);
  const [comptname, setComptname] = useState("");
  const [compToken, setCompToken] = useState("");
  const [compStatus, setCompStatus] = useState("");
  const [compRemarks, setCompRemarks] = useState("");
  const [compReqDate, setCompReqDate] = useState(0);
  const [compClosedDate, setCompClosedDate] = useState(0);
  const searchComplain = async () => {
    setLoader(true);
    let data;
    try {
      const collectionRef = collection(firestore, "sportscomplains");
      const q = query(collectionRef, where("id", "==", search));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        setComplainSearch(true);
        data = querySnapshot.docs[0].data();
        setComptname(data.tname);
        setCompToken(data.id);
        setCompStatus(data.status);
        setCompRemarks(data.remarks);
        setCompReqDate(data.complainTime);
        setCompClosedDate(data.solvedOn);
        setLoader(false);
      } else {
        setLoader(false);
        toast.error("Invalid Token Number!");
      }
    } catch (error) {
      toast.error("Something went Wrong");
      await axios
        .post("/api/findComplains", { id: search })
        .then((data) => {
          if (data.data.length > 0) {
            setComplainSearch(true);
            data = data.data[0];
            setComptname(data.tname);
            setCompToken(data.id);
            setCompStatus(data.status);
            setCompRemarks(data.remarks);
            setCompReqDate(data.complainTime);
            setCompClosedDate(data.solvedOn);
            setLoader(false);
          } else {
            setLoader(false);
            toast.error("Invalid Token Number!");
          }
        })
        .catch((error) => {
          toast.error("Something went Wrong");
          setLoader(false);
          console.log(error);
        });
    }
  };

  const DateValueToSring = (dateValue) => {
    let date = new Date(dateValue);
    return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} At ${
      date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
    }:${date.getMinutes()}:${date.getSeconds()} ${
      date.getHours() > 12 ? "PM" : "AM"
    }`;
  };
  return (
    <div className="container my-5">
      {loader ? <Loader /> : null}
      {showMessage ? (
        <>
          <div className="container my-5">
            <div className="col-md-6 mx-auto">
              <h3 className="text-primary text-center">
                Search Request Status
              </h3>
              <input
                type="text"
                className="form-control mb-3"
                id="search"
                name="search"
                placeholder="Enter Token Number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-primary mb-3"
                onClick={searchComplain}
              >
                Search
              </button>
              {complainSearch ? (
                <div>
                  <h4 className="text-primary text-center">
                    Token No: {compToken}
                  </h4>
                  <h4 className="text-primary text-center">
                    Name: {comptname}
                  </h4>
                  <h4 className="text-primary text-center">
                    Status: {compStatus}
                  </h4>
                  <h4 className="text-primary text-center">
                    Remarks: {compRemarks}
                  </h4>
                  <h4 className="text-primary text-center">
                    Request Date: {DateValueToSring(compReqDate)}
                  </h4>
                  {compClosedDate !== "Not Solved" && (
                    <h4
                      className="text-primary text-center"
                      onClick={() => console.log(compClosedDate)}
                    >
                      Close Date: {DateValueToSring(compClosedDate)}
                    </h4>
                  )}
                  <button
                    type="button"
                    className="btn btn-primary mb-3"
                    onClick={() => setComplainSearch(false)}
                  >
                    Close
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          <div className="row align-items-start">
            <h3 className="text-primary text-center">
              Request or Suggest or Complain Us
            </h3>
            <div className="mb-3 col-md-3">
              <label className="form-label">Full Name:</label>
              <input
                type="text"
                className="form-control"
                id="tname"
                name="tname"
                placeholder="Full Name"
                value={inputField.tname}
                onChange={changeData}
                required
              />
              {errField.errtname.length > 0 && (
                <span className="error">{errField.errtname}</span>
              )}
            </div>
            <div className="mb-3 col-md-3">
              <label className="form-label">School Name:</label>
              <input
                type="text"
                className="form-control"
                id="school"
                name="school"
                placeholder="School Name"
                value={inputField.school}
                onChange={changeData}
                required
              />
              {errField.errschool.length > 0 && (
                <span className="error">{errField.errschool}</span>
              )}
            </div>
            <div className="mb-3 col-md-3">
              <label className="form-label">Circle Name:</label>
              <input
                type="text"
                className="form-control"
                id="sis"
                name="sis"
                placeholder="Circle Name"
                value={inputField.sis}
                onChange={changeData}
                required
              />
              {errField.errsis.length > 0 && (
                <span className="error">{errField.errsis}</span>
              )}
            </div>
            <div className="mb-3 col-md-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Email"
                value={inputField.email}
                onChange={changeData}
                required
              />
              {errField.erremail.length > 0 && (
                <span className="error">{errField.erremail}</span>
              )}
            </div>
            <div className="mb-3 col-md-3">
              <label className="form-label">Mobile No:</label>
              <input
                type="number"
                className="form-control"
                id="mobile"
                name="mobile"
                placeholder="Mobile No"
                value={inputField.mobile}
                onChange={changeData}
                required
              />
              {errField.errmobile.length > 0 && (
                <span className="error">{errField.errmobile}</span>
              )}
            </div>
            <div className="mb-3 col-md-6">
              <label className="form-label">
                Request or Suggest or Complain Us (Max 255 Characters):
              </label>
              <textarea
                name="complain"
                id="complain"
                cols="30"
                rows="10"
                maxLength="555"
                className="form-control"
                placeholder="Request or Suggest or Complain Us"
                value={inputField.complain}
                style={{ resize: "none" }}
                onChange={changeData}
                required
              ></textarea>
            </div>
            {errField.errcomplain.length > 0 && (
              <span className="error">{errField.errcomplain}</span>
            )}
          </div>
          <div className="row">
            <div className="m-3 form-check col-md-3">
              <button
                type="button"
                className="btn btn-primary"
                name="submit"
                onClick={regComplain}
              >
                Submit
              </button>

              <button
                type="button"
                className="btn btn-warning m-3"
                onClick={() => navigate.push("/")}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="container">
          <h1 className="text-success text-center mb-3">
            Complain or Request Filed Successfully
          </h1>

          <h6 className="text-primary text-center mb-3">
            Your name: {inputField.tname}
          </h6>
          <h6 className="text-primary text-center mb-3">
            Your School: {inputField.school}
          </h6>
          <h6 className="text-primary text-center mb-3">
            Your Circle: {inputField.sis}
          </h6>
          <h6 className="text-primary text-center mb-3">
            Your Email: {inputField.email}
          </h6>
          <h6 className="text-primary text-center mb-3">
            Your Mobile No.: {inputField.mobile}
          </h6>
          <h6 className="text-primary text-center mb-3">
            Your Request.: {inputField.complain}
          </h6>
          <h3 className="text-primary text-center mb-3">
            Kindly Note Your Token Number:
          </h3>
          <div className="bg-light  mx-auto p-4 rounded">
            <div className="float-end">
              {!success ? (
                <BsClipboard
                  onClick={() => {
                    navigator.clipboard.writeText(docId);
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 1500);
                  }}
                  size={30}
                  color="skyblue"
                />
              ) : (
                <BsClipboard2Check
                  onClick={() => {
                    navigator.clipboard.writeText(docId);
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 1500);
                  }}
                  size={30}
                  color="skyblue"
                />
              )}
            </div>
            <h3 className="text-primary text-center">{docId}</h3>
            {success ? (
              <h6 className="text-success">Token Coppied to Clipboard</h6>
            ) : null}
            <div className="mx-auto mt-2">
              <button
                className="btn btn-success"
                type="button"
                onClick={() => {
                  setShowMessage(!showMessage);
                  setDocId(uuid().split("-")[0]);
                  setInputField({
                    tname: "",
                    school: "",
                    sis: "",
                    email: "",
                    mobile: "",
                    complain: "",
                    status: "Not Solved",
                    complainTime: Date.now(),
                    id: docId,
                    solvedOn: "Not Solved",
                    remarks: "Not Solved",
                  });
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complain;
