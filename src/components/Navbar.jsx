"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCookie } from "../modules/encryption";
import { titleCase } from "../modules/calculatefunctions";
import Image from "next/image";
import { useGlobalContext } from "../context/Store";
import Loader from "./Loader";
import { collection, getDocs, query } from "firebase/firestore";
import { firestore } from "@/context/FirbaseContext";

const Navbar = () => {
  const {
    state,
    setState,
    setGpLockState,
    gpLockUpdateTime,
    setGpLockUpdateTime,
    setCircleLockState,
    circleLockUpdateTime,
    setCircleLockUpdateTime,
    setTeachersState,
    setTeacherUpdateTime,
    teachersState,
    teacherUpdateTime,
  } = useGlobalContext();

  const [showLoader, setShowLoader] = useState(false);
  const type = state.TYPE;
  const access = state.ACCESS;
  const user = state.USER;

  const storeTeachersData = async () => {
    setShowLoader(true);
    const q = query(collection(firestore, "teachers"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));

    const newDatas = data.sort((a, b) => {
      // First, compare the "school" keys
      if (a.school < b.school) {
        return -1;
      }
      if (a.school > b.school) {
        return 1;
      }
      // If "school" keys are equal, compare the "rank" keys
      return a.rank - b.rank;
    });
    setShowLoader(false);
    setTeachersState(newDatas);
    setTeacherUpdateTime(Date.now());
  };
  const getLockData = async () => {
    try {
      const q = query(collection(firestore, "gpLockData"));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        ...doc.data(),
        // id: doc.id,
      }));
      setGpLockState(data);
      setGpLockUpdateTime(Date.now());
    } catch (error) {
      console.log(error);
    }
  };
  const getCircleLockData = async () => {
    try {
      const q = query(collection(firestore, "circleLockData"));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        ...doc.data(),
        // id: doc.id,
      }));
      setCircleLockState(data);
      setCircleLockUpdateTime(Date.now());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const difference = (Date.now() - gpLockUpdateTime) / 1000 / 60 / 10;
    if (difference >= 1) {
      getLockData();
    }
    const difference2 = (Date.now() - circleLockUpdateTime) / 1000 / 60 / 10;
    if (difference2 >= 1) {
      getCircleLockData();
    }
    const teacherDifference = (Date.now() - teacherUpdateTime) / 1000 / 60 / 15;
    if (teacherDifference >= 1 || teachersState.length === 0) {
      storeTeachersData();
    }
    //eslint-disable-next-line
  }, []);
  const schdetails = getCookie("schid");
  const handleNavCollapse = () => {
    if (
      document
        .querySelector("#navbarSupportedContent")
        .classList.contains("show")
    ) {
      document
        .querySelector("#navbarSupportedContent")
        .classList.remove("show");
    }
  };

  const RenderMenu = () => {
    if (type !== null) {
      if (type == "teacher") {
        if (access === "admin") {
          return (
            <>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/"
                  onClick={handleNavCollapse}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/dashboard"
                  onClick={handleNavCollapse}
                >
                  Dashboard
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/htschool"
                  onClick={handleNavCollapse}
                >
                  htschool
                </Link>
              </li> */}

              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/SetConvenors"
                  onClick={handleNavCollapse}
                >
                  Convenors
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/GPStudentNameEntry"
                  onClick={handleNavCollapse}
                >
                  GP Student Name Entry
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/GpSportsDirectNameEntry"
                  onClick={handleNavCollapse}
                >
                  GP Sports Direct Name Entry
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/GPConvenorsPage"
                  onClick={handleNavCollapse}
                >
                  GP Convenors Page
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/CircleSportsDirectNameEntry"
                  onClick={handleNavCollapse}
                >
                  Circle Students Direct Name Entry
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/CircleStudentsNameEntry"
                  onClick={handleNavCollapse}
                >
                  Circle Convenors Page
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/AllTeachers"
                  onClick={handleNavCollapse}
                >
                  All Teachers
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/RegUsers"
                  onClick={handleNavCollapse}
                >
                  Registered Users
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/DisplayComplain"
                  onClick={handleNavCollapse}
                >
                  Display Complains
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/complain"
                  onClick={handleNavCollapse}
                >
                  Complain or Suggest Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/downloads"
                  onClick={handleNavCollapse}
                >
                  Downloads
                </Link>
              </li>
              <button type="button" className="btn btn-info btn-sm nav-link">
                Hello {user ? user.tname : schdetails ? schdetails.school : ""}!
              </button>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/UpdateUP"
                  onClick={handleNavCollapse}
                >
                  Update Profile Details
                </Link>
              </li>
              <div className="row">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    href="/logout"
                    onClick={handleNavCollapse}
                  >
                    Logout
                  </Link>
                </li>
              </div>
            </>
          );
        } else if (access === "taw") {
          return (
            <>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/"
                  onClick={handleNavCollapse}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/dashboard"
                  onClick={handleNavCollapse}
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/SetConvenors"
                  onClick={handleNavCollapse}
                >
                  Convenors
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  href="/GPStudentNameEntry"
                  onClick={handleNavCollapse}
                >
                  GP Student Name Entry
                </Link>
              </li>

              {(user.convenor === "admin" || user.gpAssistant === "admin") && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      aria-current="page"
                      href="/GPConvenorsPage"
                      onClick={handleNavCollapse}
                    >
                      GP Convenors Page
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      aria-current="page"
                      href="/GpSportsDirectNameEntry"
                      onClick={handleNavCollapse}
                    >
                      GP Sports Direct Name Entry
                    </Link>
                  </li>
                </>
              )}
              {user.circleAssistant === "admin" && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      aria-current="page"
                      href="/CircleStudentsNameEntry"
                      onClick={handleNavCollapse}
                    >
                      Circle Convenors Page
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      aria-current="page"
                      href="/CircleSportsDirectNameEntry"
                      onClick={handleNavCollapse}
                    >
                      GP To Circle Direct Name Entry
                    </Link>
                  </li>
                </>
              )}
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/complain"
                  onClick={handleNavCollapse}
                >
                  Complain or Suggest Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/downloads"
                  onClick={handleNavCollapse}
                >
                  Downloads
                </Link>
              </li>
              {user.tname !== "" && (
                <button type="button" className="btn btn-info btn-sm nav-link">
                  Hello {titleCase(user.tname)}!
                </button>
              )}
              {schdetails && (
                <button type="button" className="btn btn-info btn-sm nav-link">
                  Hello {titleCase(schdetails.school)}!
                </button>
              )}
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/UpdateUP"
                  onClick={handleNavCollapse}
                >
                  Update Profile Details
                </Link>
              </li>
              <div className="row">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    href="/logout"
                    onClick={handleNavCollapse}
                  >
                    Logout
                  </Link>
                </li>
              </div>
            </>
          );
        }
      } else {
        return (
          <>
            <li className="nav-item">
              <Link
                className="nav-link"
                aria-current="page"
                href="/"
                onClick={handleNavCollapse}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                aria-current="page"
                href="/dashboard"
                onClick={handleNavCollapse}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                aria-current="page"
                href="/SetConvenors"
                onClick={handleNavCollapse}
              >
                Convenors
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                aria-current="page"
                href="/GPStudentNameEntry"
                onClick={handleNavCollapse}
              >
                GP Student Name Entry
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                href="/complain"
                onClick={handleNavCollapse}
              >
                Complain or Suggest Us
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                href="/downloads"
                onClick={handleNavCollapse}
              >
                Downloads
              </Link>
            </li>
            {schdetails && (
              <button type="button" className="btn btn-info btn-sm nav-link">
                Hello {titleCase(user.hoi)}! HOI of {titleCase(user.school)}!
              </button>
            )}
            <li className="nav-item">
              <Link
                className="nav-link"
                href="/UpdateUP"
                onClick={handleNavCollapse}
              >
                Update Profile Details
              </Link>
            </li>
            <div className="row">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/logout"
                  onClick={handleNavCollapse}
                >
                  Logout
                </Link>
              </li>
            </div>
          </>
        );
      }
    } else {
      return (
        <>
          <li className="nav-item">
            <Link
              className="nav-link"
              aria-current="page"
              href="/"
              onClick={handleNavCollapse}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              aria-current="page"
              href="/SetConvenors"
              onClick={handleNavCollapse}
            >
              Convenors
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/downloads"
              onClick={handleNavCollapse}
            >
              Downloads
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/complain"
              onClick={handleNavCollapse}
            >
              Complain or Suggest Us
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/login"
              onClick={handleNavCollapse}
            >
              Login
            </Link>
          </li>
        </>
      );
    }
  };

  return (
    <nav className="navbar align-items-end navbar-expand-lg bg-white px-lg-3 py-lg-2 shadow-sm sticky-top p-2 overflow-auto bg-body-tertiary noprint">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          <Image
            src={require("../images/AWCSC.png")}
            alt="LOGO"
            width={0}
            height={0}
            style={{
              width: 60,
              height: "auto",
            }}
            className="App-logo"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <RenderMenu />
          </ul>
        </div>
      </div>
      {showLoader && <Loader />}
    </nav>
  );
};

export default Navbar;
