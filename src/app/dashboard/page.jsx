"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from "../../context/Store";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

import Typed from "typed.js";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { titleCase } from "@/modules/calculatefunctions";
import { updateDocument } from "../../firebase/firestoreHelper";

const Dashboard = () => {
  const {
    state,
    setState,
    gpSportsDateState,
    appUpdateState,
    setAppUpdateState,
  } = useGlobalContext();
  const user = state.USER;
  const gp = user?.gp;
  const navigate = useRouter();
  const [showAppUpdate, setShowAppUpdate] = useState(false);
  const [appSettings, setAppSettings] = useState(appUpdateState);
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
  const [gpSpDate, setGpSpDate] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const el = useRef(null);
  useEffect(() => {
    if (!details) {
      if (!schid) {
        navigate.push("/logout");
      }
    }
    const spDate = gpSportsDateState.filter((item) => item.gp === gp)[0].date;
    setGpSpDate(spDate);
    // eslint-disable-next-line
  }, []);
  const updateAppSettings = async () => {
    setShowLoader(true);
    await updateDocument("appUpdate", appSettings.id, appSettings);
    setAppUpdateState(appSettings);
    setShowLoader(false);
    toast.success("App Settings Updated Successfully");
  };
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
      {gpSpDate && (
        <h5 className="text-center text-primary">
          {titleCase(gp)} GP Sports Date: {gpSpDate}
        </h5>
      )}
      {teacher?.circle === "admin" && (
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => setShowAppUpdate(true)}
        >
          Flag Settings
        </button>
      )}
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
      {showAppUpdate && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
          aria-modal="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="addNoticeLabel">
                  App Update Settings
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowAppUpdate(false);
                  }}
                ></button>
              </div>
              <div className="modal-body modal-xl">
                <div className="container"></div>
                <div className="mb-3">
                  <label className="form-label">App Version</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="App Version"
                    value={appSettings.appVersion}
                    onChange={(e) => {
                      setAppSettings({
                        ...appSettings,
                        appVersion: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Site Link</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Site Link"
                    value={appSettings.site}
                    onChange={(e) => {
                      setAppSettings({
                        ...appSettings,
                        site: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Update Available</label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={appSettings.update}
                    onChange={(e) => {
                      setAppSettings({
                        ...appSettings,
                        update: e.target.value,
                      });
                    }}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Show Nav Flag</label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={appSettings.showFlag}
                    onChange={(e) => {
                      setAppSettings({
                        ...appSettings,
                        showFlag: e.target.value === "true",
                      });
                    }}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Admin Login Show</label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={appSettings.showAdminLogin}
                    onChange={(e) => {
                      setAppSettings({
                        ...appSettings,
                        showAdminLogin: e.target.value === "true",
                      });
                    }}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">App Id</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="App Id"
                    value={appSettings.id}
                    onChange={(e) => {
                      setAppSettings({
                        ...appSettings,
                        id: e.target.value,
                      });
                    }}
                    disabled
                    readOnly
                  />
                </div>
              </div>
              <div className="modal-footer d-flex flex-column">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    updateAppSettings();
                    setShowAppUpdate(false);
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAppUpdate(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showLoader && <Loader />}
    </div>
  );
};

export default Dashboard;
