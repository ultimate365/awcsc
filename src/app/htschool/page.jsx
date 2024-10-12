"use client";
import React, { useState, useEffect } from "react";
import School from "./schools.json";
import Teacher from "./teachers.json";
import UserSchool from "./userschools.json";
import UserTeacher from "./userteachers.json";
import { collection, getDocs } from "firebase/firestore";
import { query } from "firebase/database";
import { firestore } from "@/context/FirbaseContext";
export default function page() {
  const [schools, setSchools] = useState(School);
  const [teachers, setTeachers] = useState(Teacher);
  const [userSchools, setUserSchools] = useState(UserSchool);
  const [userTeachers, setUserTeachers] = useState(UserTeacher);

  useEffect(() => {
    // let x = [];
    // Teacher.map((el) => {
    //   el.convenor = "taw";
    //   return (x = [...x, el]);
    // });
    // console.log(x);
    // teachers.map((el) => {
    //   userTeachers.map((item, index) => {
    //     if (item.empid === el.empid) {
    //       item.id = el.id;
    //       item.teachersID = el.id;
    //       return (x = [...x, item]);
    //     }
    //   });
    // });
    // console.log(x);
  }, []);
  // useEffect(() => {
  //   let x = [];
  //   userSchools.map((item, index) => {
  //     item.username = item.udise;
  //     return (x = [...x, item]);
  //   });
  //   console.log(x);
  // }, []);

  const getMonthlyData = async () => {
    const querySnapshot = await getDocs(
      query(collection(firestore, "gpLockData"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    // const newDatas = data.sort((a, b) => {
    //   // First, compare the "school" keys
    //   if (a.school < b.school) {
    //     return -1;
    //   }
    //   if (a.school > b.school) {
    //     return 1;
    //   }
    //   // If "school" keys are equal, compare the "rank" keys
    //   return a.rank - b.rank;
    // });
    console.log(data);
  };
  useEffect(() => {
    getMonthlyData();
  }, []);

  //   useEffect(() => {
  //     const newDatas = teachers.sort((a, b) => {
  //       // First, compare the "school" keys
  //       if (a.school < b.school) {
  //         return -1;
  //       }
  //       if (a.school > b.school) {
  //         return 1;
  //       }
  //       // If "school" keys are equal, compare the "rank" keys
  //       return a.rank - b.rank;
  //     });
  //     console.log(newDatas);
  //   }, []);

  return <div>page</div>;
}
