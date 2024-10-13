"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from "../../context/Store";

import Typed from "typed.js";
import { decryptObjData, getCookie } from "../../modules/encryption";

const Dashboard = () => {
  const { state, setState } = useGlobalContext();
  const user = state.USER;
  const navigate = useRouter();
  let details = getCookie("tid");
  let schid = getCookie("schid");
  let teacher = {
    tname: "",
    school: "",
    gp: "",
    circle: "",
    desig: "",
  };

  if (schid) {
    schid = decryptObjData("schid");
  }
  if (details) {
    teacher = decryptObjData("tid");
  }

  const el = useRef(null);
  useEffect(() => {
    if (!details) {
      if (!schid) {
        navigate.push("/logout");
      }
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    document.title = "AWC Sports App:Dashboard";

    const typed = new Typed(el.current, {
      strings: [
        `Welcome ${
          teacher?.circle === "admin"
            ? `Circle Admin ${teacher?.tname}, ${teacher?.desig} of ${teacher?.school}`
            : teacher?.convenor === "admin"
            ? `${teacher?.tname}, GP Convenor of ${teacher?.gp} and ${teacher?.desig} of ${teacher?.school}`
            : teacher?.convenor === "taw"
            ? `${teacher?.tname}, ${teacher?.desig} of ${teacher?.school}`
            : `${schid ? `${schid.hoi}, HOI of ${schid.school}` : ""}`
        }
        
        `,
      ],
      typeSpeed: 50,
      loop: true,
      loopCount: Infinity,
      showCursor: true,
      cursorChar: "|",
      autoInsertCss: true,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };

    // eslint-disable-next-line
  }, []);

  return (
    <div className="container my-2" suppressHydrationWarning={true}>
      <div className="mx-auto my-2" style={{ height: "120px" }}>
        <span
          suppressHydrationWarning={true}
          className="text-primary text-center fs-3 mb-3 web-message"
          ref={el}
        />
      </div>
      {details ? (
        teacher?.convenor === "taw" ? (
          <div className="my-4">
            <h3 className="text-center">You Can Use The following Section</h3>
            <button
              type="button"
              className="btn btn-success m-1 "
              onClick={() => {
                navigate.push("/GPStudentNameEntry");
              }}
            >
              {`Go to Student's Name Entry For ${teacher?.gp} GP Sports`}
            </button>
            <button
              type="button"
              className="btn btn-info m-1 "
              onClick={() => {
                navigate.push("/SetConvenors");
              }}
            >
              Know Our Convenors
            </button>
          </div>
        ) : null
      ) : null}
      {schid ? (
        <div className="my-4">
          <h3 className="text-center">You Can Use The following Section</h3>
          <button
            type="button"
            className="btn btn-success m-1 "
            onClick={() => {
              navigate.push("/GPStudentNameEntry");
            }}
          >
            {`Go to Student's Name Entry For ${schid.gp} GP Sports`}
          </button>
          <button
            type="button"
            className="btn btn-info m-1 "
            onClick={() => {
              navigate.push("/SetConvenors");
            }}
          >
            Know Our Convenors
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
