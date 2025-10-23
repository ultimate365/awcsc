"use client";
import React, { useEffect, useState } from "react";
import Typed from "typed.js";
import useWindowSize from "@rooks/use-window-size";
import { decryptObjData, getCookie } from "../modules/encryption";
import { collection, getDocs, query } from "firebase/firestore";
import { firestore } from "../context/FirbaseContext";
import { useGlobalContext } from "../context/Store";
import Loader from "../components/Loader";
export default function Home() {
  const { outerWidth } = useWindowSize();
  const el = React.useRef(null);
  const {
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
  useEffect(() => {
    const details = getCookie("tid");
    const schdetails = getCookie("schid");
    if (details) {
      const tea = decryptObjData("tid");
      setState({
        USER: tea,
        ACCESS: tea?.circle,
        LOGGEDAT: Date.now(),
        TYPE: "teacher",
      });
    } else if (schdetails) {
      const sch = decryptObjData("schid");
      setState({
        USER: sch,
        ACCESS: sch?.convenor,
        LOGGEDAT: Date.now(),
        TYPE: "school",
      });
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.title = "AWC Sports App:Homepage";
    const typed = new Typed(el.current, {
      strings: ["Welcome To Amta West Circle's Sports Committee's Website."],
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
    <div className="container my-2">
      <div className="my-3" style={{ height: "70px" }}>
        {outerWidth < 780 ? (
          <span
            className="text-primary text-center fs-6 mb-3 web-message"
            ref={el}
            suppressHydrationWarning={true}
          />
        ) : (
          <span
            className="text-primary text-center fs-3 mb-3 web-message"
            ref={el}
            suppressHydrationWarning={true}
          />
        )}
      </div>
      {showLoader && <Loader />}
    </div>
  );
}
