"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { firestore } from "../../context/FirbaseContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import RegisterUser from "../../components/RegisterUser";

const SignUp = () => {
  const navigate = useRouter();
  const [showRegForm, setShowRegForm] = useState(false);
  const [teacherData, setTeacherData] = useState({});
  const [inputField, setInputField] = useState({
    empid: "",
  });
  const [errField, setErrField] = useState({
    empidErr: "",
  });
  const inputHandler = (e) => {
    // console.log(e.target.name, "==", e.target.value);
    setInputField({
      ...inputField,
      [e.target.name]: e.target.value.toUpperCase(),
    });
    // console.log(inputField);
  };
  const setSignUpTrue = () => {
    setInputField({ ...inputField, empid: "" });
    setShowRegForm(false);
  };
  useEffect(() => {
    document.title = "AWC Sports App:Sign Up";
    //eslint-disable-next-line
  }, [inputField]);
  const submitBtn = async (e) => {
    e.preventDefault();
    // console.log(inputField);
    if (validForm()) {
      try {
        const collectionRef = collection(firestore, "userteachers");
        const q = query(
          collectionRef,
          where("empid", "==", inputField.empid.toUpperCase())
        );
        const querySnapshot = await getDocs(q);
        // console.log(querySnapshot.docs[0].data().pan);
        if (querySnapshot.docs.length > 0) {
          let fdata = querySnapshot.docs[0].data();
          toast.error(
            `Dear ${fdata.tname}, ${fdata.desig} OF ${fdata.school}! You are Already Registered,Please Log In.`,
            {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
          setTimeout(() => {
            navigate.push("/login");
          }, 2000);
        } else {
          const collectionRef2 = collection(firestore, "teachers");
          const q = query(
            collectionRef2,
            where("empid", "==", inputField.empid.toUpperCase())
          );
          const querySnapshot = await getDocs(q);
          // console.log(querySnapshot.docs[0].data());
          if (querySnapshot.docs.length > 0) {
            let data = querySnapshot.docs[0].data();
            setTeacherData(data);
            let fdata2 = querySnapshot.docs[0].data();

            toast.success(
              `Congrats! ${fdata2.tname}, ${fdata2.desig} OF ${fdata2.school}! Please Review And Register Yourself.`,
              {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              }
            );
            setTimeout(() => {
              // navigate(`/register?data=${JSON.stringify(data)}`);
              setShowRegForm(true);
            }, 2000);
          } else {
            toast.error("EMPID Not Found.", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        }
      } catch (e) {
        toast.error("Something Went Wrong.", {
          position: "top-right",
          autoClose: 2000,
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
  const validForm = () => {
    let formIsValid = true;
    setErrField({
      empidErr: "",
    });
    if (inputField.empid === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        empidErr: "Please Enter Employee ID",
      }));
    }
    return formIsValid;
  };

  return (
    <div className="container text-black p-2">
      {!showRegForm ? (
        <div className="row login m-auto col-md-6 p-2">
          <h3 className="heading">Add Registration</h3>
          <br />
          <form autoComplete="off" onSubmit={submitBtn}>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Enter Employee ID
              </label>
              <input
                type="text"
                name="empid"
                placeholder="Enter Employee ID"
                className="form-control"
                value={inputField.empid}
                onChange={inputHandler}
                maxLength={8}
              />
              {errField.empidErr.length > 0 && (
                <span className="error">{errField.empidErr}</span>
              )}
            </div>
          </form>
          <div>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={submitBtn}
            >
              Check
            </button>
            <Link href="/login">
              <button className="btn btn-danger m-1 px-4">Back</button>
            </Link>
          </div>
        </div>
      ) : (
        <RegisterUser sata={teacherData} setSignUpTrue={setSignUpTrue} />
      )}
    </div>
  );
};

export default SignUp;
