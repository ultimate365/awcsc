"use client";
import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
  PDFViewer,
} from "@react-pdf/renderer";
import { circleBenName, gpNames } from "../modules/constants";
import {
  enToBnNumber,
  getSubmitDateInput,
} from "../modules/calculatefunctions";

const width = 2480;
const height = 3508;

export default function CircleResultSheet({ studentData }) {
  const data = studentData?.sort((a, b) => {
    if (a.group < b.group) return -1;
    if (a.group > b.group) return 1;
    if (a.event1rank < b.event1rank) return -1;
    if (a.event1rank > b.event1rank) return 1;
    return 0;
  });
  const BoysData = data?.filter((el) => el?.gender === "BOYS");
  const GirlsData = data?.filter((el) => el?.gender === "GIRLS");
  const BoysGRAData = BoysData.filter((el) => el.group === "GROUP-A");
  const BoysGRBData = BoysData.filter((el) => el.group === "GROUP-B");
  const BoysGRCData = BoysData.filter((el) => el.group === "GROUP-C");
  const GirlsGRAData = GirlsData.filter((el) => el.group === "GROUP-A");
  const GirlsGRBData = GirlsData.filter((el) => el.group === "GROUP-B");
  const GirlsGRCData = GirlsData.filter((el) => el.group === "GROUP-C");
  return (
    // <PDFViewer width={width / 3.5} height={height / 3}>
    <Document
      style={{ margin: 5, padding: 5 }}
      title={`Circle Sports Result Sheet`}
    >
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.pageMainView}>
          <Text style={styles.title}>
            {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগিতা রেজাল্ট,{" "}
            {enToBnNumber(new Date().getFullYear())}
          </Text>

          <View style={styles.headingView}>
            <View
              style={[
                styles.tableStartView,
                { borderLeftWidth: 0, borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "10%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>RANK</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Chest No</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Participant's Name</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Father's / Gurdians Name</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>SCHOOL</Text>
              </View>

              <View
                style={{
                  width: "20%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>GP</Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - A, 75 METER RUN</Text>
              </View>
              {BoysGRAData.filter(
                (el) =>
                  el?.event1 === "75 METER RUN" || el?.event2 === "75 METER RUN"
              )
                ?.sort((a, b) => {
                  const eventName = "75 METER RUN";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "75 METER RUN"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - A, SHUTTLE RACE</Text>
              </View>
              {BoysGRAData.filter(
                (el) =>
                  el?.event1 === "SHUTTLE RACE" || el?.event2 === "SHUTTLE RACE"
              )
                ?.sort((a, b) => {
                  const eventName = "SHUTTLE RACE";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "SHUTTLE RACE"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - A, LONG JUMP</Text>
              </View>
              {BoysGRAData.filter(
                (el) => el?.event1 === "LONG JUMP" || el?.event2 === "LONG JUMP"
              )
                ?.sort((a, b) => {
                  const eventName = "LONG JUMP";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "LONG JUMP"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - A, YOGA</Text>
              </View>
              {BoysGRAData.filter(
                (el) => el?.event1 === "YOGA" || el?.event2 === "YOGA"
              )
                ?.sort((a, b) => {
                  const eventName = "YOGA";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "YOGA" ? el?.position1 : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </View>
      </Page>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.pageMainView}>
          <Text style={styles.title}>
            {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগিতা রেজাল্ট,{" "}
            {enToBnNumber(new Date().getFullYear())}
          </Text>

          <View style={styles.headingView}>
            <View
              style={[
                styles.tableStartView,
                { borderLeftWidth: 0, borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "10%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>RANK</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Chest No</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Participant's Name</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Father's / Gurdians Name</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>SCHOOL</Text>
              </View>

              <View
                style={{
                  width: "20%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>GP</Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - B, 100 METER RUN</Text>
              </View>
              {BoysGRBData.filter(
                (el) =>
                  el?.event1 === "100 METER RUN" ||
                  el?.event2 === "100 METER RUN"
              )
                ?.sort((a, b) => {
                  const eventName = "100 METER RUN";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "100 METER RUN"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - B, 200 METER RUN</Text>
              </View>
              {BoysGRBData.filter(
                (el) =>
                  el?.event1 === "200 METER RUN" ||
                  el?.event2 === "200 METER RUN"
              )
                ?.sort((a, b) => {
                  const eventName = "200 METER RUN";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "200 METER RUN"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - B, LONG JUMP</Text>
              </View>
              {BoysGRBData.filter(
                (el) => el?.event1 === "LONG JUMP" || el?.event2 === "LONG JUMP"
              )
                ?.sort((a, b) => {
                  const eventName = "LONG JUMP";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "LONG JUMP"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - B, HIGH JUMP</Text>
              </View>
              {BoysGRBData.filter(
                (el) => el?.event1 === "HIGH JUMP" || el?.event2 === "HIGH JUMP"
              )
                ?.sort((a, b) => {
                  const eventName = "HIGH JUMP";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "HIGH JUMP"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - B, YOGA</Text>
              </View>
              {BoysGRBData.filter(
                (el) => el?.event1 === "YOGA" || el?.event2 === "YOGA"
              )
                ?.sort((a, b) => {
                  const eventName = "YOGA";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "YOGA" ? el?.position1 : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - B, GYMNASTICS</Text>
              </View>
              {BoysGRBData.filter(
                (el) =>
                  el?.event1 === "GYMNASTICS" || el?.event2 === "GYMNASTICS"
              )
                ?.sort((a, b) => {
                  const eventName = "GYMNASTICS";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View
                    key={ind}
                    style={[
                      styles.rowStartView,
                      {
                        borderBottomWidth:
                          ind === BoysGRBData.length - 1 ? 0 : 1,
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "GYMNASTICS"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </View>
      </Page>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.pageMainView}>
          <Text style={styles.title}>
            {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগিতা রেজাল্ট,{" "}
            {enToBnNumber(new Date().getFullYear())}
          </Text>

          <View style={styles.headingView}>
            <View
              style={[
                styles.tableStartView,
                { borderLeftWidth: 0, borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "10%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text2}>RANK</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text2}>Chest No</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text2}>Participant's Name</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text2}>Father's / Gurdians Name</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text2}>SCHOOL</Text>
              </View>

              <View
                style={{
                  width: "20%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text2}>GP</Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - C, 100 METER RUN</Text>
              </View>
              {BoysGRCData.filter(
                (el) =>
                  el?.event1 === "100 METER RUN" ||
                  el?.event2 === "100 METER RUN"
              )
                ?.sort((a, b) => {
                  const eventName = "100 METER RUN";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>
                        {el?.event1 === "100 METER RUN"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - C, 200 METER RUN</Text>
              </View>
              {BoysGRCData.filter(
                (el) =>
                  el?.event1 === "200 METER RUN" ||
                  el?.event2 === "200 METER RUN"
              )
                ?.sort((a, b) => {
                  const eventName = "200 METER RUN";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>
                        {el?.event1 === "200 METER RUN"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - C, LONG JUMP</Text>
              </View>
              {BoysGRCData.filter(
                (el) => el?.event1 === "LONG JUMP" || el?.event2 === "LONG JUMP"
              )
                ?.sort((a, b) => {
                  const eventName = "LONG JUMP";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>
                        {el?.event1 === "LONG JUMP"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - C, HIGH JUMP</Text>
              </View>
              {BoysGRCData.filter(
                (el) => el?.event1 === "HIGH JUMP" || el?.event2 === "HIGH JUMP"
              )
                ?.sort((a, b) => {
                  const eventName = "HIGH JUMP";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>
                        {el?.event1 === "HIGH JUMP"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - C, YOGA</Text>
              </View>
              {BoysGRCData.filter(
                (el) => el?.event1 === "YOGA" || el?.event2 === "YOGA"
              )
                ?.sort((a, b) => {
                  const eventName = "YOGA";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>
                        {el?.event1 === "YOGA" ? el?.position1 : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>BOYS GROUP - C, GYMNASTICS</Text>
              </View>
              {BoysGRCData.filter(
                (el) =>
                  el?.event1 === "GYMNASTICS" || el?.event2 === "GYMNASTICS"
              )
                ?.sort((a, b) => {
                  const eventName = "GYMNASTICS";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>
                        {el?.event1 === "GYMNASTICS"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>
                  BOYS GROUP - C, FOOTBALL THROWING
                </Text>
              </View>
              {BoysGRCData.filter(
                (el) =>
                  el?.event1 === "FOOTBALL THROWING" ||
                  el?.event2 === "FOOTBALL THROWING"
              )
                ?.sort((a, b) => {
                  const eventName = "FOOTBALL THROWING";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View
                    key={ind}
                    style={[
                      styles.rowStartView,
                      {
                        borderBottomWidth:
                          ind === BoysGRCData.length - 1 ? 0 : 1,
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>
                        {el?.event1 === "FOOTBALL THROWING"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </View>
      </Page>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.pageMainView}>
          <Text style={styles.title}>
            {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগিতা রেজাল্ট,{" "}
            {enToBnNumber(new Date().getFullYear())}
          </Text>

          <View style={styles.headingView}>
            <View
              style={[
                styles.tableStartView,
                { borderLeftWidth: 0, borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "10%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>RANK</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Chest No</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Participant's Name</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Father's / Gurdians Name</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>SCHOOL</Text>
              </View>

              <View
                style={{
                  width: "20%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>GP</Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>Girls GROUP - A, 75 METER RUN</Text>
              </View>
              {GirlsGRAData.filter(
                (el) =>
                  el?.event1 === "75 METER RUN" || el?.event2 === "75 METER RUN"
              )
                ?.sort((a, b) => {
                  const eventName = "75 METER RUN";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "75 METER RUN"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>Girls GROUP - A, SHUTTLE RACE</Text>
              </View>
              {GirlsGRAData.filter(
                (el) =>
                  el?.event1 === "SHUTTLE RACE" || el?.event2 === "SHUTTLE RACE"
              )
                ?.sort((a, b) => {
                  const eventName = "SHUTTLE RACE";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "SHUTTLE RACE"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>Girls GROUP - A, LONG JUMP</Text>
              </View>
              {GirlsGRAData.filter(
                (el) => el?.event1 === "LONG JUMP" || el?.event2 === "LONG JUMP"
              )
                ?.sort((a, b) => {
                  const eventName = "LONG JUMP";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "LONG JUMP"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>Girls GROUP - A, YOGA</Text>
              </View>
              {GirlsGRAData.filter(
                (el) => el?.event1 === "YOGA" || el?.event2 === "YOGA"
              )
                ?.sort((a, b) => {
                  const eventName = "YOGA";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "YOGA" ? el?.position1 : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </View>
      </Page>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.pageMainView}>
          <Text style={styles.title}>
            {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগিতা রেজাল্ট,{" "}
            {enToBnNumber(new Date().getFullYear())}
          </Text>

          <View style={styles.headingView}>
            <View
              style={[
                styles.tableStartView,
                { borderLeftWidth: 0, borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "10%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>RANK</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Chest No</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Participant's Name</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Father's / Gurdians Name</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>SCHOOL</Text>
              </View>

              <View
                style={{
                  width: "20%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>GP</Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>
                  GIRLS GROUP - B, 100 METER RUN
                </Text>
              </View>
              {GirlsGRBData.filter(
                (el) =>
                  el?.event1 === "100 METER RUN" ||
                  el?.event2 === "100 METER RUN"
              )
                ?.sort((a, b) => {
                  const eventName = "100 METER RUN";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "100 METER RUN"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>
                  GIRLS GROUP - B, 200 METER RUN
                </Text>
              </View>
              {GirlsGRBData.filter(
                (el) =>
                  el?.event1 === "200 METER RUN" ||
                  el?.event2 === "200 METER RUN"
              )
                ?.sort((a, b) => {
                  const eventName = "200 METER RUN";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "200 METER RUN"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>GIRLS GROUP - B, LONG JUMP</Text>
              </View>
              {GirlsGRBData.filter(
                (el) => el?.event1 === "LONG JUMP" || el?.event2 === "LONG JUMP"
              )
                ?.sort((a, b) => {
                  const eventName = "LONG JUMP";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "LONG JUMP"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>GIRLS GROUP - B, HIGH JUMP</Text>
              </View>
              {GirlsGRBData.filter(
                (el) => el?.event1 === "HIGH JUMP" || el?.event2 === "HIGH JUMP"
              )
                ?.sort((a, b) => {
                  const eventName = "HIGH JUMP";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "HIGH JUMP"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>GIRLS GROUP - B, YOGA</Text>
              </View>
              {GirlsGRBData.filter(
                (el) => el?.event1 === "YOGA" || el?.event2 === "YOGA"
              )
                ?.sort((a, b) => {
                  const eventName = "YOGA";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "YOGA" ? el?.position1 : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>GIRLS GROUP - B, GYMNASTICS</Text>
              </View>
              {GirlsGRBData.filter(
                (el) =>
                  el?.event1 === "GYMNASTICS" || el?.event2 === "GYMNASTICS"
              )
                ?.sort((a, b) => {
                  const eventName = "GYMNASTICS";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View
                    key={ind}
                    style={[
                      styles.rowStartView,
                      {
                        borderBottomWidth:
                          ind === GirlsGRBData.length - 1 ? 0 : 1,
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>
                        {el?.event1 === "GYMNASTICS"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                      }}
                    >
                      <Text style={styles.text}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </View>
      </Page>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.pageMainView}>
          <Text style={styles.title}>
            {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগিতা রেজাল্ট,{" "}
            {enToBnNumber(new Date().getFullYear())}
          </Text>

          <View style={styles.headingView}>
            <View
              style={[
                styles.tableStartView,
                { borderLeftWidth: 0, borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "10%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text2}>RANK</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text2}>Chest No</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text2}>Participant's Name</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text2}>Father's / Gurdians Name</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text2}>SCHOOL</Text>
              </View>

              <View
                style={{
                  width: "20%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text2}>GP</Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>
                  GIRLS GROUP - C, 100 METER RUN
                </Text>
              </View>
              {GirlsGRCData.filter(
                (el) =>
                  el?.event1 === "100 METER RUN" ||
                  el?.event2 === "100 METER RUN"
              )
                ?.sort((a, b) => {
                  const eventName = "100 METER RUN";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>
                        {el?.event1 === "100 METER RUN"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>
                  GIRLS GROUP - C, 200 METER RUN
                </Text>
              </View>
              {GirlsGRCData.filter(
                (el) =>
                  el?.event1 === "200 METER RUN" ||
                  el?.event2 === "200 METER RUN"
              )
                ?.sort((a, b) => {
                  const eventName = "200 METER RUN";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>
                        {el?.event1 === "200 METER RUN"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>GIRLS GROUP - C, LONG JUMP</Text>
              </View>
              {GirlsGRCData.filter(
                (el) => el?.event1 === "LONG JUMP" || el?.event2 === "LONG JUMP"
              )
                ?.sort((a, b) => {
                  const eventName = "LONG JUMP";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>
                        {el?.event1 === "LONG JUMP"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>GIRLS GROUP - C, HIGH JUMP</Text>
              </View>
              {GirlsGRCData.filter(
                (el) => el?.event1 === "HIGH JUMP" || el?.event2 === "HIGH JUMP"
              )
                ?.sort((a, b) => {
                  const eventName = "HIGH JUMP";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>
                        {el?.event1 === "HIGH JUMP"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>GIRLS GROUP - C, YOGA</Text>
              </View>
              {GirlsGRCData.filter(
                (el) => el?.event1 === "YOGA" || el?.event2 === "YOGA"
              )
                ?.sort((a, b) => {
                  const eventName = "YOGA";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>
                        {el?.event1 === "YOGA" ? el?.position1 : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>GIRLS GROUP - C, GYMNASTICS</Text>
              </View>
              {GirlsGRCData.filter(
                (el) =>
                  el?.event1 === "GYMNASTICS" || el?.event2 === "GYMNASTICS"
              )
                ?.sort((a, b) => {
                  const eventName = "GYMNASTICS";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View key={ind} style={styles.rowStartView}>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>
                        {el?.event1 === "GYMNASTICS"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center",
                  borderBottomWidth: 1,
                }}
              >
                <Text style={styles.title2}>
                  GIRLS GROUP - C, FOOTBALL THROWING
                </Text>
              </View>
              {GirlsGRCData.filter(
                (el) =>
                  el?.event1 === "FOOTBALL THROWING" ||
                  el?.event2 === "FOOTBALL THROWING"
              )
                ?.sort((a, b) => {
                  const eventName = "FOOTBALL THROWING";
                  const posA =
                    a?.event1 === eventName ? a?.position1 : a?.position2;
                  const posB =
                    b?.event1 === eventName ? b?.position1 : b?.position2;
                  if (!posA) return 1;
                  if (!posB) return -1;
                  return posA.localeCompare(posB);
                })
                .map((el, ind) => (
                  <View
                    key={ind}
                    style={[
                      styles.rowStartView,
                      {
                        borderBottomWidth:
                          ind === GirlsGRCData.length - 1 ? 0 : 1,
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>
                        {el?.event1 === "FOOTBALL THROWING"
                          ? el?.position1
                          : el?.position2}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.chestNo}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el.gurdiansName}</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.school}</Text>
                    </View>

                    <View
                      style={{
                        width: "20%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text2}>{el?.gp}</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
    // </PDFViewer>
  );
}
const styles = StyleSheet.create({
  page: {
    padding: 5,
    // margin: 5,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: width,
    height: height,
  },
  pageMainView: {
    alignSelf: "center",
    width: "99%",
    height: "99%",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Tiro",
    textAlign: "center",
  },
  title2: {
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "Times",
    textAlign: "center",
  },
  text: {
    fontSize: 10,
    fontFamily: "Times",
    textAlign: "center",
    padding: 2,
  },
  text2: {
    fontSize: 8,
    fontFamily: "Times",
    textAlign: "center",
    padding: 2,
  },
  textBold: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Tiro",
    textAlign: "center",
    padding: 2,
    marginVertical: 2,
  },

  headingView: {
    // border: "1px solid",
    borderWidth: 1,
    width: "100%",
  },
  tableStartView: {
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },

  rowStartView: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
});

Font.register({
  family: "Kalpurush",
  src: "https://raw.githubusercontent.com/usprys/usprysdata/main/kalpurush.ttf",
});
Font.register({
  family: "Tiro",
  src: "https://raw.githubusercontent.com/amtawestwbtpta/awwbtptadata/main/TiroBangla-Regular.ttf",
});
Font.register({
  family: "Times",
  src: "https://raw.githubusercontent.com/usprys/usprysdata/main/times.ttf",
});
Font.register({
  family: "TimesBold",
  src: "https://raw.githubusercontent.com/amtawestwbtpta/awwbtptadata/main/timesBold.ttf",
});
