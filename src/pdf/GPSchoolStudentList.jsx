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
import { gpNames } from "../modules/constants";
import {
  enToBnNumber,
  getSubmitDateInput,
} from "../modules/calculatefunctions";
const width = 2480;
const height = 3508;

export default function GPSchoolStudentList({ studentData, gp, school }) {
  const data = studentData?.sort((a, b) => {
    if (a.event1rank < b.event1rank) return -1;
    if (a.event1rank > b.event1rank) return 1;
    return 0;
  });
  const BoysData = data?.filter((el) => el?.gender === "BOYS");
  const GirlsData = data?.filter((el) => el?.gender === "GIRLS");
  const [thisGp, setThisGp] = useState("");
  useEffect(() => {
    setThisGp(gpNames.filter((el) => el.englishName === gp)[0]?.bengaliName);
    // eslint-disable-next-line
  }, []);
  return (
    // <PDFViewer width={width / 3.5} height={height / 3}>
    <Document
      style={{ margin: 5, padding: 5 }}
      title={`${school} GP Sports Student List`}
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.pageMainView}>
          <Text style={styles.title}>
            {thisGp} গ্রাম পঞ্চায়েত বার্ষিক ক্রীড়া প্রতিযোগিতা,{" "}
            {enToBnNumber(new Date().getFullYear())}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              alignSelf: "center",
              width: "90%",
              marginVertical: 10,
            }}
          >
            <View>
              <Text style={styles.textBold}>বিদ্যালয়ের নামঃ {school} </Text>
            </View>
            <View style={{ marginLeft: "70%" }}>
              <Text style={styles.textBold}>BOYS</Text>
            </View>
          </View>

          <View style={styles.headingView}>
            <View
              style={[
                styles.tableStartView,
                { borderLeftWidth: 0, borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "5%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>SL</Text>
              </View>
              <View
                style={{
                  width: "5%",
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
                  width: "10%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>BSP STUDENT ID</Text>
              </View>
              <View
                style={{
                  width: "7%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Birthday</Text>
              </View>
              <View
                style={{
                  width: "8%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Class</Text>
              </View>
              <View
                style={{
                  width: "8%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Group</Text>
              </View>
              <View
                style={{
                  width: "17%",
                  borderRightWidth: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Participated Events</Text>
              </View>
            </View>
            {BoysData?.map((el, ind) => (
              <View
                key={ind}
                style={[
                  styles.rowStartView,
                  {
                    borderBottomWidth: ind === BoysData?.length - 1 ? 0 : 1,
                  },
                ]}
              >
                <View
                  style={{
                    width: "5%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                >
                  <Text style={styles.text}>{ind + 1}</Text>
                </View>
                <View
                  style={{
                    width: "5%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
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
                    height: 30,
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
                    height: 30,
                  }}
                >
                  <Text style={styles.text}>{el.gurdiansName}</Text>
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
                  <Text style={styles.text}>{el?.studentId}</Text>
                </View>
                <View
                  style={{
                    width: "7%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                >
                  <Text style={styles.text}>
                    {getSubmitDateInput(el?.birthday)}
                  </Text>
                </View>
                <View
                  style={{
                    width: "8%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                >
                  <Text style={styles.text}>{el?.sclass}</Text>
                </View>
                <View
                  style={{
                    width: "8%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                >
                  <Text style={styles.text}>{el?.group}</Text>
                </View>
                <View
                  style={{
                    width: "17%",
                    borderRightWidth: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                >
                  <Text style={styles.text}>
                    {el?.event1}
                    {el?.event2 !== "" ? `, ${el?.event2}` : ""}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              alignSelf: "center",
              width: "90%",
              marginTop: 40,
            }}
          >
            <View>
              <Text style={styles.textBold}>
                {" "}
                তারিখঃ{" "}
                {`${new Date().getDate()}-${
                  new Date().getMonth() + 1
                }-${new Date().getFullYear()}`}
              </Text>
            </View>
            <View style={{ marginLeft: "70%" }}>
              <Text style={styles.textBold}>
                {" "}
                বিদ্যালয় প্রধানের সীলসহ স্বাক্ষর
              </Text>
            </View>
          </View>
        </View>
      </Page>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.pageMainView}>
          <Text style={styles.title}>
            {thisGp} গ্রাম পঞ্চায়েত বার্ষিক ক্রীড়া প্রতিযোগিতা,{" "}
            {enToBnNumber(new Date().getFullYear())}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              alignSelf: "center",
              width: "90%",
              marginVertical: 10,
            }}
          >
            <View>
              <Text style={styles.textBold}>বিদ্যালয়ের নামঃ {school} </Text>
            </View>
            <View style={{ marginLeft: "70%" }}>
              <Text style={styles.textBold}>GIRLS</Text>
            </View>
          </View>

          <View style={styles.headingView}>
            <View
              style={[
                styles.tableStartView,
                { borderLeftWidth: 0, borderRightWidth: 0 },
              ]}
            >
              <View
                style={{
                  width: "5%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>SL</Text>
              </View>
              <View
                style={{
                  width: "5%",
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
                  width: "10%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>BSP STUDENT ID</Text>
              </View>
              <View
                style={{
                  width: "7%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Birthday</Text>
              </View>
              <View
                style={{
                  width: "8%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Class</Text>
              </View>
              <View
                style={{
                  width: "8%",
                  borderRightWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Group</Text>
              </View>
              <View
                style={{
                  width: "17%",
                  borderRightWidth: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 30,
                }}
              >
                <Text style={styles.text}>Events Participated</Text>
              </View>
            </View>
            {GirlsData?.map((el, ind) => (
              <View
                key={ind}
                style={[
                  styles.rowStartView,
                  {
                    borderBottomWidth: ind === GirlsData?.length - 1 ? 0 : 1,
                  },
                ]}
              >
                <View
                  style={{
                    width: "5%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                >
                  <Text style={styles.text}>{ind + 1}</Text>
                </View>
                <View
                  style={{
                    width: "5%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
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
                    height: 30,
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
                    height: 30,
                  }}
                >
                  <Text style={styles.text}>{el.gurdiansName}</Text>
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
                  <Text style={styles.text}>{el?.studentId}</Text>
                </View>
                <View
                  style={{
                    width: "7%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                >
                  <Text style={styles.text}>
                    {getSubmitDateInput(el?.birthday)}
                  </Text>
                </View>
                <View
                  style={{
                    width: "8%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                >
                  <Text style={styles.text}>{el?.sclass}</Text>
                </View>
                <View
                  style={{
                    width: "8%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                >
                  <Text style={styles.text}>{el?.group}</Text>
                </View>
                <View
                  style={{
                    width: "17%",
                    borderRightWidth: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 30,
                  }}
                >
                  <Text style={styles.text}>
                    {el?.event1}
                    {el?.event2 !== "" ? `, ${el?.event2}` : ""}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              alignSelf: "center",
              width: "90%",
              marginTop: 40,
            }}
          >
            <View>
              <Text style={styles.textBold}>
                {" "}
                তারিখঃ{" "}
                {`${new Date().getDate()}-${
                  new Date().getMonth() + 1
                }-${new Date().getFullYear()}`}
              </Text>
            </View>
            <View style={{ marginLeft: "70%" }}>
              <Text style={styles.textBold}>
                {" "}
                বিদ্যালয় প্রধানের সীলসহ স্বাক্ষর
              </Text>
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
  text: {
    fontSize: 10,
    fontFamily: "Times",
    textAlign: "center",
    padding: 2,
  },
  textBold: {
    fontSize: 13,
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
