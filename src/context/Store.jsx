"use client";
import React, { createContext, useContext, useState } from "react";

import { FirebaseProvider } from "./FirbaseContext";
import GP_LOCK_DATA from "@/helpers/gpLockData.json";
import CIRCLE_LOCK_DATA from "@/helpers/circleLockData.json";
import SCHOOL_DATA from "@/helpers/schools.json";
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
  gpStudentStateUpdateTime: "",
  setGpStudentStateUpdateTime: () => [],
  selectedGpStudentState: [],
  setSelectedGpStudentState: () => [],
  selectedGpStudentStateUpdateTime: "",
  setSelectedGpStudentStateUpdateTime: () => "",
  circleStudentState: [],
  setCircleStudentState: () => [],
  convenorsState: [],
  setConvenorsState: () => [],
  slideState: [],
  setSlideState: () => [],
  userState: [],
  setUserState: () => [],
  userUpdateTime: "",
  setUserUpdateTime: () => "",
  noticeState: [],
  setNoticeState: () => [],
  gpLockState: GP_LOCK_DATA,
  setGpLockState: () => [],
  gpLockUpdateTime: "",
  setGpLockUpdateTime: () => "",
  circleLockState: CIRCLE_LOCK_DATA,
  setCircleLockState: () => [],
  circleLockUpdateTime: "",
  setCircleLockUpdateTime: () => "",
  teacherUpdateTime: "",
  setTeacherUpdateTime: () => "",
  convenorsUpdateTime: "",
  setConvenorsUpdateTime: () => "",
  slideUpdateTime: "",
  setSlideUpdateTime: () => "",
  noticeUpdateTime: "",
  setNoticeUpdateTime: () => "",
  userUpdateTime: "",
  setUserUpdateTime: () => "",
  allGPFirstsState: [],
  setAllGPFirstsState: () => [],
  allGPFirstsStateUpdateTime: "",
  setAllGPFirstsStateUpdateTime: () => "",
  AmtaWestCircleAllResultState: [],
  setAmtaWestCircleAllResultState: () => [],
  AmtaWestCircleAllResultUpdateTime: "",
  setAmtaWestCircleAllResultUpdateTime: () => "",
  allGPAssistantsState: [],
  setAllGPAssistantsState: () => [],
  userSchoolState: [],
  setUserSchoolState: () => [],
  userSchoolStateUpdateTime: "",
  setUserSchoolStateUpdateTime: () => "",
  circleAssistantState: [],
  setCircleAssistantState: () => [],
  GPResultState: [],
  setGPResultState: () => [],
  circleResultState: [],
  setCircleResultState: () => [],
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
  const [teacherUpdateTime, setTeacherUpdateTime] = useState(
    Date.now() - 600000
  );
  const [convenorsUpdateTime, setConvenorsUpdateTime] = useState(
    Date.now() - 600000
  );
  const [slideUpdateTime, setSlideUpdateTime] = useState(Date.now() - 600000);
  const [noticeUpdateTime, setNoticeUpdateTime] = useState(Date.now() - 600000);
  const [userUpdateTime, setUserUpdateTime] = useState(Date.now() - 600000);
  const [gpLockState, setGpLockState] = useState(GP_LOCK_DATA);
  const [schoolState, setSchoolState] = useState(SCHOOL_DATA);
  const [gpStudentState, setGpStudentState] = useState([]);
  const [gpStudentStateUpdateTime, setGpStudentStateUpdateTime] = useState(
    Date.now() - 600000
  );
  const [circleStudentState, setCircleStudentState] = useState([]);
  const [gpLockUpdateTime, setGpLockUpdateTime] = useState(Date.now() - 600000);
  const [allGPFirstsState, setAllGPFirstsState] = useState([]);
  const [allGPFirstsStateUpdateTime, setAllGPFirstsStateUpdateTime] = useState(
    Date.now() - 600000
  );
  const [AmtaWestCircleAllResultState, setAmtaWestCircleAllResultState] =
    useState([]);
  const [
    AmtaWestCircleAllResultUpdateTime,
    setAmtaWestCircleAllResultUpdateTime,
  ] = useState(Date.now() - 600000);
  const [allGPAssistantsState, setAllGPAssistantsState] = useState([]);
  const [userSchoolState, setUserSchoolState] = useState([]);
  const [userSchoolStateUpdateTime, setUserSchoolStateUpdateTime] = useState(
    Date.now() - 600000
  );
  const [selectedGpStudentState, setSelectedGpStudentState] = useState([]);
  const [
    selectedGpStudentStateUpdateTime,
    setSelectedGpStudentStateUpdateTime,
  ] = useState(Date.now() - 600000);
  const [circleAssistantState, setCircleAssistantState] = useState([]);
  const [circleLockState, setCircleLockState] = useState(CIRCLE_LOCK_DATA);
  const [circleLockUpdateTime, setCircleLockUpdateTime] = useState(
    Date.now() - 600000
  );
  const [GPResultState, setGPResultState] = useState([]);
  const [circleResultState, setCircleResultState] = useState([]);

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
        gpStudentStateUpdateTime,
        setGpStudentStateUpdateTime,
        circleStudentState,
        setCircleStudentState,
        AmtaWestCircleAllResultState,
        setAmtaWestCircleAllResultState,
        AmtaWestCircleAllResultUpdateTime,
        setAmtaWestCircleAllResultUpdateTime,
        gpLockState,
        setGpLockState,
        gpLockUpdateTime,
        setGpLockUpdateTime,
        convenorsUpdateTime,
        convenorsState,
        setConvenorsState,
        slideState,
        setSlideState,
        userState,
        setUserState,
        noticeState,
        setNoticeState,
        teacherUpdateTime,
        setTeacherUpdateTime,
        convenorsUpdateTime,
        setConvenorsUpdateTime,
        slideUpdateTime,
        setSlideUpdateTime,
        noticeUpdateTime,
        setNoticeUpdateTime,
        userUpdateTime,
        setUserUpdateTime,
        allGPFirstsState,
        setAllGPFirstsState,
        allGPFirstsStateUpdateTime,
        setAllGPFirstsStateUpdateTime,
        allGPAssistantsState,
        setAllGPAssistantsState,
        userSchoolState,
        setUserSchoolState,
        userSchoolStateUpdateTime,
        setUserSchoolStateUpdateTime,
        selectedGpStudentState,
        setSelectedGpStudentState,
        selectedGpStudentStateUpdateTime,
        setSelectedGpStudentStateUpdateTime,
        circleAssistantState,
        setCircleAssistantState,
        circleLockState,
        setCircleLockState,
        circleLockUpdateTime,
        setCircleLockUpdateTime,
        GPResultState,
        setGPResultState,
        circleResultState,
        setCircleResultState,
      }}
    >
      <FirebaseProvider>{children}</FirebaseProvider>
    </GlobalContext.Provider>
  );
};
export const useGlobalContext = () => useContext(GlobalContext);
