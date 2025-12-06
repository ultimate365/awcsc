"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import AWCSCLogo from "../images/AWCSC.png";

import { decryptObjData, getCookie } from "../modules/encryption";
import { titleCase } from "../modules/calculatefunctions";
import { useGlobalContext } from "../context/Store";
import Loader from "./Loader";
import { collection, getDocs, query } from "firebase/firestore";
import { firestore } from "../context/FirbaseContext";
import Link from "next/link";
import Header from "./Header";
const Navbar = () => {
  const {
    state,
    setState,
    setGpLockState,
    setCircleLockState,
    setTeachersState,
    teachersState,
    setGpSportsDateState,
    setAppUpdateState,
  } = useGlobalContext();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const type = state?.TYPE ?? null; // teacher | school | null
  const access = state?.ACCESS ?? null; // admin | taw | null
  const user = state?.USER ?? null;

  const [tidObj, setTidObj] = useState(null);
  const [schObj, setSchObj] = useState(null);

  // ---------------- COOKIE LOADING ----------------
  useEffect(() => {
    const tidRaw = getCookie("tid");
    const schRaw = getCookie("schid");

    if (tidRaw) {
      try {
        const decrypted = decryptObjData("tid");
        setTidObj(decrypted);
        setState({
          USER: decrypted,
          ACCESS: decrypted?.circle,
          LOGGEDAT: Date.now(),
          TYPE: "teacher",
        });
      } catch {}
    }

    if (schRaw) {
      try {
        const decrypted = decryptObjData("schid");
        setSchObj(decrypted);
        setState({
          USER: decrypted,
          ACCESS: decrypted?.convenor,
          LOGGEDAT: Date.now(),
          TYPE: "school",
        });
      } catch {}
    }
  }, []);

  // ---------------- FIREBASE FETCH ----------------
  const storeTeachersData = useCallback(async () => {
    setShowLoader(true);
    try {
      const q = query(collection(firestore, "teachers"));
      const qs = await getDocs(q);
      const data = qs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const sorted = data.sort((a, b) => {
        if (a.school < b.school) return -1;
        if (a.school > b.school) return 1;
        return (a.rank ?? 0) - (b.rank ?? 0);
      });

      setTeachersState(sorted);
    } catch {}
    setShowLoader(false);
  }, []);
  const getAppData = useCallback(async () => {
    try {
      // Fetch other app data if needed
      const q = query(collection(firestore, "appUpdate"));
      const qs = await getDocs(q);
      const data = qs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setAppUpdateState(data[0]);
    } catch (error) {
      // Handle errors if needed
      console.error("Error fetching app data:", error);
    }
  }, []);

  const getLockData = useCallback(async () => {
    try {
      const q = query(collection(firestore, "gpLockData"));
      setGpLockState((await getDocs(q)).docs.map((d) => d.data()));
    } catch {}
  }, []);

  const getCircleLockData = useCallback(async () => {
    try {
      const q = query(collection(firestore, "circleLockData"));
      setCircleLockState((await getDocs(q)).docs.map((d) => d.data()));
    } catch {}
  }, []);

  const getGPSportsDate = useCallback(async () => {
    try {
      const q = query(collection(firestore, "gpSportsDate"));
      setGpSportsDateState((await getDocs(q)).docs.map((d) => d.data()));
    } catch {}
  }, []);

  useEffect(() => {
    getLockData();
    getCircleLockData();
    getGPSportsDate();
    getAppData();

    if (!teachersState || teachersState.length === 0) {
      storeTeachersData();
    }
  }, []);

  const closeDrawer = () => setDrawerOpen(false);

  // ---------------- DYNAMIC NAVBAR HEIGHT ----------------
  useEffect(() => {
    const nav = document.querySelector(".navbar");
    if (nav) {
      const h = nav.offsetHeight;
      document.documentElement.style.setProperty("--nav-height", `${h}px`);
    }
  }, []);

  // ---------------- MENU DEFINITIONS ----------------
  const menuDefinitions = useMemo(() => {
    const isLogged = (ctx) => ctx.type !== null;
    const isTeacher = (ctx) => ctx.type === "teacher";
    const isSchool = (ctx) => ctx.type === "school";
    const hasAccess = (ctx, v) => ctx.access === v;
    const userHas = (ctx, prop, val) => ctx.user?.[prop] === val;

    return {
      // COMMON FOR ALL USERS
      common: [
        { key: "home", label: "Home", to: "/", show: () => true },
        {
          key: "convenors",
          label: "Convenors",
          to: "/SetConvenors",
          show: () => true,
        },
        {
          key: "dashboard",
          label: "Dashboard",
          to: "/Dashboard",
          show: (ctx) => isLogged(ctx),
        },
        {
          key: "downloads",
          label: "Downloads",
          to: "/Downloads",
          show: () => true,
        },
        {
          key: "complain",
          label: "Complain or Suggest Us",
          to: "/Complain",
          show: () => true,
        },
      ],

      // SPECIAL FOR SCHOOL USERS
      schoolMenu: [
        {
          key: "gp_entry",
          label: "GP Student Name Entry",
          to: "/GPStudentNameEntry",
          show: (ctx) => isSchool(ctx),
        },
        {
          key: "convenors_school",
          label: "Convenors",
          to: "/SetConvenors",
          show: (ctx) => isSchool(ctx),
        },
        {
          key: "dashboard_school",
          label: "Dashboard",
          to: "/Dashboard",
          show: (ctx) => isSchool(ctx),
        },
        {
          key: "complain_school",
          label: "Complain or Suggest Us",
          to: "/Complain",
          show: (ctx) => isSchool(ctx),
        },
        {
          key: "update_profile",
          label: "Update Profile",
          to: "/UpdateUP",
          show: (ctx) => isSchool(ctx),
        },
      ],

      // TEACHER ADMIN
      teacherAdmin: [
        {
          key: "gp_entry",
          label: "GP Student Name Entry",
          to: "/GPStudentNameEntry",
          show: (ctx) => isSchool(ctx),
        },
        {
          key: "all_teachers",
          label: "All Teachers",
          to: "/AllTeachers",
          show: (ctx) => isTeacher(ctx) && hasAccess(ctx, "admin"),
        },
        {
          key: "reg_users",
          label: "Registered Users",
          to: "/RegUsers",
          show: (ctx) => isTeacher(ctx) && hasAccess(ctx, "admin"),
        },
        {
          key: "display_complains",
          label: "Display Complains",
          to: "/DisplayComplain",
          show: (ctx) => isTeacher(ctx) && hasAccess(ctx, "admin"),
        },
        {
          key: "update_profile",
          label: "Update Profile",
          to: "/UpdateUP",
          show: (ctx) => isTeacher(ctx),
        },
      ],

      // TEACHER CONVENOR
      teacherConvenor: [
        {
          key: "gp_entry",
          label: "GP Student Name Entry",
          to: "/GPStudentNameEntry",
          show: (ctx) => isSchool(ctx),
        },
        {
          key: "gp_convenors",
          label: "GP Convenors Page",
          to: "/GPConvenorsPage",
          show: (ctx) =>
            isTeacher(ctx) &&
            (hasAccess(ctx, "admin") ||
              userHas(ctx, "convenor", "admin") ||
              userHas(ctx, "gpAssistant", "admin")),
        },
        {
          key: "gp_direct",
          label: "GP Direct Entry",
          to: "/GpSportsDirectNameEntry",
          show: (ctx) =>
            isTeacher(ctx) &&
            (hasAccess(ctx, "admin") || userHas(ctx, "gpAssistant", "admin")),
        },
        {
          key: "circle_convenors",
          label: "Circle Convenors Page",
          to: "/CircleStudentsNameEntry",
          show: (ctx) =>
            isTeacher(ctx) &&
            (hasAccess(ctx, "admin") ||
              userHas(ctx, "circleAssistant", "admin")),
        },
        {
          key: "circle_direct",
          label: "Circle Direct Entry",
          to: "/CircleSportsDirectNameEntry",
          show: (ctx) =>
            isTeacher(ctx) &&
            (hasAccess(ctx, "admin") ||
              userHas(ctx, "circleAssistant", "admin")),
        },
        {
          key: "update_profile",
          label: "Update Profile",
          to: "/UpdateUP",
          show: (ctx) => isTeacher(ctx),
        },
      ],
    };
  }, []);

  const ctx = { type, access, user, schObj, tidObj };

  // ---------------- GREETING ----------------
  const greeting = (() => {
    if (type === "teacher")
      return `Hello ${titleCase(user?.tname ?? tidObj?.tname)}`;
    if (type === "school")
      return `Hello ${titleCase(user?.hoi ?? schObj?.hoi)} (HOI)`;
    return "Welcome";
  })();

  // ---------------- DRAWER MENU ----------------
  const DrawerMenu = () => (
    <>
      <div
        className={`nav-drawer-overlay ${drawerOpen ? "open" : ""}`}
        onClick={closeDrawer}
      ></div>

      <div className={`nav-drawer ${drawerOpen ? "open" : ""}`}>
        {/* PROFILE */}
        <Image
          src={AWCSCLogo}
          alt="Logo"
          width={80}
          className="d-block mx-auto App-logo"
        />
        <div className="mb-3 p-2 border-bottom">
          <h6 className="fw-bold mb-0">{greeting}</h6>

          {type === "school" && (
            <small className="text-muted">
              HOI of {titleCase(schObj?.school ?? user?.school)}
            </small>
          )}

          {type === "teacher" && <small className="text-muted">Teacher</small>}
        </div>

        {/* COMMON MENU */}
        {menuDefinitions.common
          .filter((m) => m.show(ctx))
          .map((m) => (
            <Link
              key={m.key}
              href={m.to}
              className="nav-link"
              onClick={closeDrawer}
            >
              {m.label}
            </Link>
          ))}

        {/* SCHOOL MENU */}
        {menuDefinitions.schoolMenu.some((m) => m.show(ctx)) && (
          <>
            <div className="fw-bold text-secondary mt-3">School Menu</div>
            {menuDefinitions.schoolMenu
              .filter((m) => m.show(ctx))
              .map((m) => (
                <Link
                  key={m.key}
                  href={m.to}
                  className="nav-link"
                  onClick={closeDrawer}
                >
                  {m.label}
                </Link>
              ))}
          </>
        )}

        {/* TEACHER ADMIN MENU */}
        {menuDefinitions.teacherAdmin.some((m) => m.show(ctx)) && (
          <>
            <div className="fw-bold text-secondary mt-3">Admin</div>
            {menuDefinitions.teacherAdmin
              .filter((m) => m.show(ctx))
              .map((m) => (
                <Link
                  key={m.key}
                  href={m.to}
                  className="nav-link"
                  onClick={closeDrawer}
                >
                  {m.label}
                </Link>
              ))}
          </>
        )}

        {/* TEACHER CONVENOR MENU */}
        {menuDefinitions.teacherConvenor.some((m) => m.show(ctx)) && (
          <>
            <div className="fw-bold text-secondary mt-3">Convenor Tools</div>
            {menuDefinitions.teacherConvenor
              .filter((m) => m.show(ctx))
              .map((m) => (
                <Link
                  key={m.key}
                  href={m.to}
                  className="nav-link"
                  onClick={closeDrawer}
                >
                  {m.label}
                </Link>
              ))}
          </>
        )}

        <hr />

        {/* LOGIN / LOGOUT */}
        {!type ? (
          <Link href="/Login" className="nav-link" onClick={closeDrawer}>
            Login
          </Link>
        ) : (
          <>
            <Link href="/UpdateUP" className="nav-link" onClick={closeDrawer}>
              Update Profile
            </Link>
            <Link href="/Logout" className="nav-link" onClick={closeDrawer}>
              Logout
            </Link>
          </>
        )}
      </div>
    </>
  );

  return (
    <div className="noprint">
      {/* TOP NAVBAR */}
      <nav className="navbar navbar-light bg-white shadow-sm sticky-top p-2">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Logo */}

          <Link className="navbar-brand d-flex align-items-center" href="/">
            <Image src={AWCSCLogo} width={55} alt="Logo" className="App-logo" />
          </Link>
          {/* DESKTOP NAV LINKS */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            {/* COMMON MENU */}
            {menuDefinitions.common
              .filter((m) => m.show(ctx))
              .map((m) => (
                <Link key={m.key} href={m.to} className="nav-link">
                  {m.label}
                </Link>
              ))}

            {/* SCHOOL MENU */}
            {menuDefinitions.schoolMenu
              .filter((m) => m.show(ctx))
              .map((m) => (
                <Link key={m.key} href={m.to} className="nav-link">
                  {m.label}
                </Link>
              ))}

            {/* TEACHER ADMIN */}
            {menuDefinitions.teacherAdmin
              .filter((m) => m.show(ctx))
              .map((m) => (
                <Link key={m.key} href={m.to} className="nav-link">
                  {m.label}
                </Link>
              ))}

            {/* TEACHER CONVENOR */}
            {menuDefinitions.teacherConvenor
              .filter((m) => m.show(ctx))
              .map((m) => (
                <Link key={m.key} href={m.to} className="nav-link">
                  {m.label}
                </Link>
              ))}
          </div>

          {/* RIGHT SIDE BUTTONS */}
          <div className="d-flex align-items-center gap-2">
            {/* LOGIN BUTTON WHEN NOT LOGGED IN */}
            {!type && (
              <Link
                href="/Login"
                className="btn btn-outline-primary d-none d-lg-block"
              >
                Login
              </Link>
            )}

            {/* GREETING + LOGOUT WHEN LOGGED IN */}
            {type && (
              <>
                <span className="fw-semibold text-dark d-none d-lg-block">
                  {greeting}
                </span>
                <Link
                  href="/Logout"
                  className="btn btn-outline-danger d-none d-lg-block"
                >
                  Logout
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button
              className="btn btn-outline-secondary d-lg-none"
              onClick={() => setDrawerOpen((prev) => !prev)}
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer */}
      {drawerOpen && <DrawerMenu />}

      {showLoader && <Loader />}
    </div>
  );
};

export default Navbar;
