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

import { enToBnNumber } from "../modules/calculatefunctions";
import { gpNames } from "../modules/constants";

const width = 2480;
const height = 3508;

export default function GPResultSheetBlank({ gp }) {
  const [thisGp, setThisGp] = useState("");
  useEffect(() => {
    setThisGp(gpNames.filter((el) => el.englishName === gp)[0]?.bengaliName);
    // eslint-disable-next-line
  }, []);
  return (
    // <PDFViewer width={width / 3.5} height={height / 3}>
    <Document
      style={{ margin: 5, padding: 5 }}
      title={`${gp} GP Sports Blank Result Sheet`}
    >
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.pageMainView}>
          <Text style={styles.title}>
            {thisGp} গ্রাম পঞ্চায়েত বার্ষিক ক্রীড়া প্রতিযোগিতা রেজাল্ট,{" "}
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
                  width: "40%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>SCHOOL</Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
            {thisGp} বার্ষিক ক্রীড়া প্রতিযোগিতা রেজাল্ট,{" "}
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
                  width: "40%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>SCHOOL</Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
            {thisGp} বার্ষিক ক্রীড়া প্রতিযোগিতা রেজাল্ট,{" "}
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
                  width: "40%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text2}>SCHOOL</Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
            {thisGp} বার্ষিক ক্রীড়া প্রতিযোগিতা রেজাল্ট,{" "}
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
                  width: "40%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>SCHOOL</Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
            {thisGp} বার্ষিক ক্রীড়া প্রতিযোগিতা রেজাল্ট,{" "}
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
                  width: "40%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>SCHOOL</Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
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
                    <Text style={styles.text}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
            {thisGp} বার্ষিক ক্রীড়া প্রতিযোগিতা রেজাল্ট,{" "}
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
                  width: "40%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text2}>SCHOOL</Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
              {["FIRST", "SECOND", "THIRD"].map((el, ind) => (
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
                    <Text style={styles.text2}>{el}</Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
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
                    <Text style={styles.text2}></Text>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 30,
                    }}
                  >
                    <Text style={styles.text}></Text>
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
