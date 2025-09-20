"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { firestore } from "../../context/FirbaseContext";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import { decryptObjData, getCookie } from "../../modules/encryption";
import Loader from "../../components/Loader";
const UpdateUP = () => {
  const navigate = useRouter();
  let userdetails;
  const [loader, setLoader] = useState(false);
  const [usernameForm, setUsernameForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTeacher, setIsTeacher] = useState(true);
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [inputField, setInputField] = useState({
    username: username,
    password: "",
    cpassword: "",
    id: id,
  });
  const [errField, setErrField] = useState({
    usernameErr: "",
    passwordErr: "",
    cpasswordErr: "",
  });
  const checkUser = () => {
    let details = getCookie("uid");
    let schdetails = getCookie("schid");
    if (details) {
      userdetails = decryptObjData("uid");
      setIsTeacher(true);
      setId(userdetails.id);
      setUsername(userdetails.username);
      setInputField({
        username: userdetails.username,
        id: userdetails.id,
        password: "",
        cpassword: "",
      });
    }
    if (schdetails) {
      userdetails = decryptObjData("schid");
      setIsTeacher(false);
      setId(userdetails.id);
      setUsername(userdetails.username);
      setInputField({
        username: userdetails.username,
        id: userdetails.id,
        password: "",
        cpassword: "",
      });
    }
    if (!details) {
      if (!schdetails) {
        navigate.push("/logout");
      }
    }
  };

  const inputHandler = (e) => {
    // console.log(e.target.name, "==", e.target.value);
    setInputField({
      ...inputField,
      [e.target.name]: removeSpaces(e.target.value),
    });
    // console.log(inputField);
  };

  const validForm = () => {
    let formIsValid = true;
    // const validEmailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    setErrField({
      passwordErr: "",
      cpasswordErr: "",
    });

    if (inputField.username === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        usernameErr: "Please Enter Username",
      }));
    }
    if (inputField.password === "") {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        passwordErr: "Please Enter Password",
      }));
    }

    if (
      inputField.cpassword === "" ||
      inputField.password !== inputField.cpassword
    ) {
      formIsValid = false;
      setErrField((prevState) => ({
        ...prevState,
        cpasswordErr: "Password and Confirm Password Are Not Same",
      }));
    }

    return formIsValid;
  };
  function removeSpaces(inputString) {
    // Use a regular expression to match all spaces (whitespace characters) and replace them with an empty string
    return inputString.replace(/\s/g, "");
  }

  const checkUsername = async () => {
    setLoader(true);
    if (isTeacher) {
      if (inputField.username !== "") {
        const collectionRef = collection(firestore, "sportsUsers");
        const q = query(
          collectionRef,
          where("username", "==", inputField.username.toLowerCase())
        );
        const querySnapshot = await getDocs(q);
        // console.log(querySnapshot.docs[0].data().username);
        if (querySnapshot.docs.length > 0) {
          setLoader(false);
          toast.error("Username already Exists! Please Select Another One", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          const docRef = doc(firestore, "sportsUsers", id);
          await updateDoc(docRef, {
            username: inputField.username.toLowerCase(),
          }).then(() => {
            setLoader(false);
            toast.success("Congrats! Your Username Changed Successfully!", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setTimeout(() => {
              navigate.push("/logout");
            }, 1500);
          });
        }
      }
    } else {
      if (inputField.username !== "") {
        const collectionRef = collection(firestore, "userschools");
        const q = query(
          collectionRef,
          where("username", "==", inputField.username.toLowerCase())
        );
        const querySnapshot = await getDocs(q);
        // console.log(querySnapshot.docs[0].data().username);
        if (querySnapshot.docs.length > 0) {
          setLoader(false);
          toast.error("Username already Exists! Please Select Another One", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          const docRef = doc(firestore, "userschools", id);
          await updateDoc(docRef, {
            username: inputField.username.toLowerCase(),
          }).then(() => {
            setLoader(false);
            toast.success("Congrats! Your Username Changed Successfully!", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setTimeout(() => {
              navigate.push("/logout");
            }, 1500);
          });
        }
      }
    }
  };
  const submitBtn = async (e) => {
    // e.preventDefault();
    // console.log(inputField);
    if (validForm()) {
      setLoader(true);
      if (isTeacher) {
        try {
          const docRef = doc(firestore, "sportsUsers", id);
          await updateDoc(docRef, {
            password: bcrypt.hashSync(inputField.password, 10),
          }).then(() => {
            setLoader(false);
            toast.success("Congrats! Your Password Changed Successfully!", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setTimeout(() => {
              navigate.push("/logout");
            }, 1500);
          });
        } catch (e) {
          toast.error("Server Error! Unable to Change Password!", {
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
        try {
          const docRef = doc(firestore, "userschools", id);
          await updateDoc(docRef, {
            password: bcrypt.hashSync(inputField.password, 10),
          }).then(() => {
            setLoader(false);
            toast.success("Congrats! Your Password Changed Successfully!", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setTimeout(() => {
              navigate.push("/logout");
            }, 1500);
          });
        } catch (e) {
          toast.error("Server Error! Unable to Change Password!", {
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
  useEffect(() => {
    document.title = "WBTPTA Sports App:Update User ID or Password";
    checkUser();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    // eslint-disable-next-line
  }, [isTeacher, username, id, inputField]);

  return (
    <div className="container text-black p-2">
      {loader ? <Loader /> : null}
      <div className="col-md-6 mx-auto p-2">
        <div className="col-md-4 mx-auto">
          <button
            type="button"
            className="btn btn-primary m-1"
            onClick={() => setUsernameForm(!usernameForm)}
          >
            {!usernameForm ? "Change Username" : "Change Password"}
          </button>
        </div>
        <form autoComplete="off" method="post">
          {!usernameForm ? (
            <>
              <h3 className="my-3 text-center text-primary">Change Password</h3>
              <div className="mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  name="password"
                  id="password"
                  placeholder="Enter Password"
                  value={inputField.password}
                  onChange={(e) =>
                    setInputField({ ...inputField, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="btn btn-warning btn-sm mt-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide Password" : "Show Password"}
                </button>
                <br />

                {errField.passwordErr.length > 0 && (
                  <span className="error">{errField.passwordErr}</span>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  name="cpassword"
                  id="cpassword"
                  placeholder="Confirm Password"
                  value={inputField.cpassword}
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      cpassword: e.target.value,
                    })
                  }
                />
                {errField.cpasswordErr.length > 0 && (
                  <span className="error">{errField.cpasswordErr}</span>
                )}
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-primary m-1"
                  onClick={submitBtn}
                >
                  Change Password <i className="bi bi-box-arrow-in-right"></i>
                </button>
              </div>
            </>
          ) : (
            <div className="mb-3">
              <h3 className="my-3 text-center text-primary">Change Username</h3>
              <label htmlFor="" className="form-label">
                Username
              </label>
              <div className="row">
                <input
                  type="text"
                  className="form-control m-3"
                  name="username"
                  id="username"
                  placeholder="Enter Username"
                  value={inputField.username}
                  onChange={inputHandler}
                />
                <div className="col-mb-4 mx-auto">
                  <button
                    type="button"
                    className="btn btn-primary m-1"
                    onClick={(e) => {
                      if (inputField.username === username) {
                        toast.error(
                          "Entered Username is Same as Previous Username",
                          {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                          }
                        );
                      } else {
                        checkUsername();
                      }
                    }}
                  >
                    Check & Change Username{" "}
                    <i className="bi bi-box-arrow-in-right"></i>
                  </button>
                </div>
              </div>
              {errField.usernameErr.length > 0 && (
                <span className="error">{errField.usernameErr}</span>
              )}
            </div>
          )}

          <button
            type="button"
            className="btn btn-danger m-1 px-4"
            onClick={() => navigate.back()}
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUP;
