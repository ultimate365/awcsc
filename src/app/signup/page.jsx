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
    phone: "",
  });
  const [errField, setErrField] = useState({
    phoneErr: "",
  });
  const inputHandler = (e) => {
    // console.log(e.target.name, "==", e.target.value);
    setInputField({
      ...inputField,
      [e.target.name]: e.target.value,
    });
    // console.log(inputField);
  };
  const setSignUpTrue = () => {
    setInputField({ ...inputField, phone: "" });
    setShowRegForm(false);
  };

  const submitBtn = async (e) => {
    e.preventDefault();
    // console.log(inputField);
    if (validForm()) {
      try {
        const collectionRef = collection(firestore, "userteachers");
        const q = query(collectionRef, where("phone", "==", inputField.phone));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
          let fdata = querySnapshot.docs[0].data();
          toast.error(
            `Dear ${fdata.tname}, ${fdata.desig} OF ${fdata.school}! You are Already Registered,Please Log In.`
          );
          setTimeout(() => {
            navigate.push("/login");
          }, 2000);
        } else {
          const collectionRef2 = collection(firestore, "teachers");
          const q = query(
            collectionRef2,
            where("phone", "==", inputField.phone)
          );
          const querySnapshot = await getDocs(q);
          // console.log(querySnapshot.docs[0].data());
          if (querySnapshot.docs.length > 0) {
            let data = querySnapshot.docs[0].data();
            setTeacherData(data);
            let fdata2 = querySnapshot.docs[0].data();

            toast.success(
              `Congrats! ${fdata2.tname}, ${fdata2.desig} OF ${fdata2.school}! Please Review And Register Yourself.`
            );
            setTimeout(() => {
              setShowRegForm(true);
            }, 2000);
          } else {
            toast.error("phone Not Found.");
          }
        }
      } catch (e) {
        toast.error("Something Went Wrong.");
      }
    } else {
      toast.error("Form Is Invalid");
    }
  };
  const validForm = () => {
    let formIsValid = true;
    setErrField({
      phoneErr: "",
    });
    if (inputField.phone === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        phoneErr: "Please Enter Mobile Number",
      }));
    }
    return formIsValid;
  };
  useEffect(() => {
    document.title = "AWC Sports App:Sign Up";
    //eslint-disable-next-line
  }, [inputField]);
  return (
    <div className="container text-black p-2">
      {!showRegForm ? (
        <div className="row login m-auto col-md-6 p-2">
          <h3 className="heading">Add Registration</h3>
          <br />
          <form autoComplete="off" onSubmit={submitBtn}>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Enter Mobile Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Enter Mobile Number"
                className="form-control"
                value={inputField.phone}
                onChange={inputHandler}
                maxLength={10}
              />
              {errField.phoneErr.length > 0 && (
                <span className="error">{errField.phoneErr}</span>
              )}
            </div>
          </form>

          <div>
            <button
              type="submit"
              className="btn m-3 btn-primary"
              onClick={submitBtn}
            >
              Check
            </button>

            <Link href="/login">
              <button className="btn btn-danger m-3 px-4">Back</button>
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
