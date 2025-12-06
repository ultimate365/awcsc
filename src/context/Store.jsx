"use client";
import { createContext, useContext, useState } from "react";

import { FirebaseProvider } from "./FirbaseContext";
import GP_LOCK_DATA from "@/helpers/gpLockData.json";
import CIRCLE_LOCK_DATA from "@/helpers/circleLockData.json";
import SCHOOL_DATA from "@/helpers/schools.json";
import GPSPORTSDATE from "@/helpers/gpSportsDate.json";
const GlobalContext = createContext({
  state: {
    USER: {},
    ACCESS: null,
    LOGGEDAT: "",
    TYPE: null,
  },
  setState: () => {},
  stateArray: [],
  setStateArray: () => [],
  stateObject: {},
  setStateObject: () => {},
  yourStateObject: {},
  setYourStateObject: () => {},
  myStateObject: {},
  setMyStateObject: () => {},
  teachersState: [],
  setTeachersState: () => [],
  schoolState: SCHOOL_DATA,
  setSchoolState: () => [],
  gpStudentState: [],
  setGpStudentState: () => [],
  selectedGpStudentState: [],
  setSelectedGpStudentState: () => [],
  circleStudentState: [],
  setCircleStudentState: () => [],
  convenorsState: [],
  setConvenorsState: () => [],
  slideState: [],
  setSlideState: () => [],
  userState: [],
  setUserState: () => [],
  noticeState: [],
  setNoticeState: () => [],
  gpLockState: GP_LOCK_DATA,
  setGpLockState: () => [],
  circleLockState: CIRCLE_LOCK_DATA,
  setCircleLockState: () => [],
  allGPFirstsState: [],
  setAllGPFirstsState: () => [],
  AmtaWestCircleAllResultState: [],
  setAmtaWestCircleAllResultState: () => [],
  allGPAssistantsState: [],
  setAllGPAssistantsState: () => [],
  userSchoolState: [],
  setUserSchoolState: () => [],
  circleAssistantState: [],
  setCircleAssistantState: () => [],
  GPResultState: [],
  setGPResultState: () => [],
  circleResultState: [],
  setCircleResultState: () => [],
  circleFirstResultState: [],
  setCircleFirstResultState: () => [],
  gpSportsDateState: GPSPORTSDATE,
  setGpSportsDateState: () => [],
  appUpdateState: {
    id: "",
    appVersion: "",
    showAdminLogin: false,
    site: "https://awcsc.vercel.app",
    update: "true",
    showFlag: true,
  },
  setAppUpdateState: () => {},
});
export const GlobalContextProvider = ({ children }) => {
  const [state, setState] = useState({
    USER: {},
    ACCESS: null,
    LOGGEDAT: "",
    TYPE: null,
  });
  const [stateArray, setStateArray] = useState([]);
  const [stateObject, setStateObject] = useState({});
  const [yourStateObject, setYourStateObject] = useState({});
  const [myStateObject, setMyStateObject] = useState({});
  const [teachersState, setTeachersState] = useState([]);
  const [userState, setUserState] = useState([]);
  const [convenorsState, setConvenorsState] = useState([]);
  const [slideState, setSlideState] = useState([]);
  const [noticeState, setNoticeState] = useState([]);
  const [gpLockState, setGpLockState] = useState(GP_LOCK_DATA);
  const [schoolState, setSchoolState] = useState(SCHOOL_DATA);
  const [gpStudentState, setGpStudentState] = useState([]);
  const [circleStudentState, setCircleStudentState] = useState([]);
  const [allGPFirstsState, setAllGPFirstsState] = useState([]);
  const [AmtaWestCircleAllResultState, setAmtaWestCircleAllResultState] =
    useState([]);
  const [allGPAssistantsState, setAllGPAssistantsState] = useState([]);
  const [userSchoolState, setUserSchoolState] = useState([]);
  const [selectedGpStudentState, setSelectedGpStudentState] = useState([]);
  const [circleAssistantState, setCircleAssistantState] = useState([]);
  const [circleLockState, setCircleLockState] = useState(CIRCLE_LOCK_DATA);
  const [GPResultState, setGPResultState] = useState([]);
  const [circleResultState, setCircleResultState] = useState([]);
  const [circleFirstResultState, setCircleFirstResultState] = useState([]);
  const [gpSportsDateState, setGpSportsDateState] = useState(GPSPORTSDATE);
  const [appUpdateState, setAppUpdateState] = useState({
    id: "",
    appVersion: "",
    showAdminLogin: false,
    site: "https://awcsc.vercel.app",
    update: "true",
    showFlag: true,
  });

  return (
    <GlobalContext.Provider
      value={{
        state,
        setState,
        stateArray,
        setStateArray,
        stateObject,
        setStateObject,
        yourStateObject,
        setYourStateObject,
        myStateObject,
        setMyStateObject,
        teachersState,
        setTeachersState,
        schoolState,
        setSchoolState,
        gpStudentState,
        setGpStudentState,
        circleStudentState,
        setCircleStudentState,
        AmtaWestCircleAllResultState,
        setAmtaWestCircleAllResultState,
        gpLockState,
        setGpLockState,
        convenorsState,
        setConvenorsState,
        slideState,
        setSlideState,
        userState,
        setUserState,
        noticeState,
        setNoticeState,
        allGPFirstsState,
        setAllGPFirstsState,
        allGPAssistantsState,
        setAllGPAssistantsState,
        userSchoolState,
        setUserSchoolState,
        selectedGpStudentState,
        setSelectedGpStudentState,
        circleAssistantState,
        setCircleAssistantState,
        circleLockState,
        setCircleLockState,
        GPResultState,
        setGPResultState,
        circleResultState,
        setCircleResultState,
        circleFirstResultState,
        setCircleFirstResultState,
        gpSportsDateState,
        setGpSportsDateState,
        appUpdateState,
        setAppUpdateState,
      }}
    >
      <FirebaseProvider>{children}</FirebaseProvider>
    </GlobalContext.Provider>
  );
};
export const useGlobalContext = () => useContext(GlobalContext);
