"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteAllCookies } from "../../modules/encryption";
import { useGlobalContext } from "../../context/Store";
const LogOut = () => {
  const navigate = useRouter();
  const { setState } = useGlobalContext();
  useEffect(() => {
    deleteAllCookies();
    navigate.push("/Login");
    setState({
      USER: {},
      ACCESS: null,
      LOGGEDAT: "",
      TYPE: null,
    });
    // eslint-disable-next-line
  }, []);
  return <div className="container"></div>;
};

export default LogOut;
