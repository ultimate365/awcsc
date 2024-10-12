"use client";
import React from "react";

const Footer = () => {
  return (
    <div className="noprint bg-white position-sticky  w-100 mt-4">
      <div className="container-fluid bg-white mt-2 p-1">
        <div
          className="container-fluid bg-dark my-2"
          style={{ height: "2px", opacity: 0.5 }}
        ></div>
        <div className="align-items-center justify-content-center p-1">
          <h5 className="container text-left">Reach Us:</h5>
          <h6 className="h-font fw-bold fs-6">
            Amta West Circle Sports Committee
          </h6>
          <h6 className="h-font fw-bold fs-6">
            Vill.- Joypur Fakirdas, P.O.- Joypur, P.S.- JoyPur, District-
            Howrah, PIN- 711401
          </h6>
        </div>
      </div>

      <div className="container m-auto pt-2 text-primary">
        <h5 className="container text-center">Important Links:</h5>
        <a
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="https://banglarshiksha.gov.in/login"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-browser-chrome"></i> Banglarsiksha Portal
        </a>
        <a
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="https://school.banglarshiksha.gov.in/sms/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-browser-chrome"></i> SMS Portal
        </a>
        <a
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="https://www.wbbpe.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-browser-chrome"></i> WBBPE
        </a>
        <a
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="https://wbbse.wb.gov.in"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-browser-chrome"></i> WBBSE
        </a>
        <a
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="https://www.wb.gov.in"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-browser-chrome"></i> West Bengal State Portal
        </a>

        <a
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="mailto: westamta@gmail.com"
        >
          <i className="bi bi-envelope-at-fill"></i> Email Us
        </a>
        <a
          className="d-inline-block m-2 text-decoration-none text-primary"
          href="https://wbresults.nic.in"
        >
          <i className="bi bi-browser-chrome"></i> WB Results
        </a>
      </div>

      <h6 className="text-center bg-primary text-white p-2 mb-0 h-font">
        © Copyright Amta West Circle Sports Committee- 2023. This Site is
        Designed and Maintained By Amta West Circle Sports Committee.
      </h6>
    </div>
  );
};

export default Footer;
