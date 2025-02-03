"use client";
import React from "react";
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
import {
  gpNames,
  BOYS_ALL_EVENTS,
  GIRLS_ALL_EVENTS,
} from "../modules/constants";
import { enToBnNumber } from "../modules/calculatefunctions";

const width = 2480;
const height = 3508;
export default function GPChestNoSheet({ BoysData, GirlsData, GPSchools, gp }) {
  return (
    <Document
      style={{ margin: 5, padding: 5 }}
      title={`${
        gpNames.filter((el) => el?.englishName === gp)[0]?.englishName
      } GP ANNUAL SPORTS -${new Date().getFullYear()}, Eventwise All Chest No`}
    >
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.pageMainView}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.titleMain}>
              {gpNames.filter((el) => el?.englishName === gp)[0]?.bengaliName}{" "}
              গ্রাম পঞ্চায়েত বার্ষিক ক্রীড়া প্রতিযোগিতা{" - "}
              {enToBnNumber(new Date().getFullYear())}
            </Text>
            <Text style={styles.titleMain}>Eventwise All Chest No.</Text>
            <Text style={styles.titleMain}>BOYS</Text>
            <View>
              <View style={styles.pageMainView}>
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
                        height: 50,
                      }}
                    >
                      <Text style={styles.text4}>EVENT</Text>
                    </View>
                    {GPSchools.map((schoolName, i) => (
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: GPSchools.length - 1 === i ? 0 : 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 50,
                        }}
                        key={i}
                      >
                        <Text style={styles.text5}>{schoolName?.school}</Text>
                      </View>
                    ))}
                  </View>
                  {BOYS_ALL_EVENTS?.map((e, ind) => (
                    <View
                      key={ind}
                      style={[
                        styles.rowStartView,
                        {
                          borderBottomWidth:
                            ind === BOYS_ALL_EVENTS?.length - 1 ? 0 : 1,
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
                        <Text style={styles.text5}>
                          {e?.split(" ")[1]} {e?.split(" ")[2]}
                        </Text>
                      </View>
                      {GPSchools?.map((b, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              width: "10%",
                              borderRightWidth:
                                index === GPSchools?.length - 1 ? 0 : 1,
                              justifyContent: "center",
                              alignItems: "center",
                              height: 30,
                            }}
                          >
                            <Text>
                              {BoysData?.filter(
                                (el) =>
                                  (`${el?.gender} ${el?.group} ${el?.event1}` ===
                                    e &&
                                    el?.udise === b?.udise) ||
                                  (`${el?.gender} ${el?.group} ${el?.event2}` ===
                                    e &&
                                    el?.udise === b?.udise)
                              )[0]?.chestNo
                                ? BoysData?.filter(
                                    (el) =>
                                      (`${el?.gender} ${el?.group} ${el?.event1}` ===
                                        e &&
                                        el?.udise === b?.udise) ||
                                      (`${el?.gender} ${el?.group} ${el?.event2}` ===
                                        e &&
                                        el?.udise === b?.udise)
                                  )[0]?.chestNo
                                : "-"}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.pageMainView}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.titleMain}>
              {gpNames.filter((el) => el?.englishName === gp)[0]?.bengaliName}{" "}
              গ্রাম পঞ্চায়েত বার্ষিক ক্রীড়া প্রতিযোগিতা{" - "}
              {enToBnNumber(new Date().getFullYear())}
            </Text>
            <Text style={styles.titleMain}>Eventwise All Chest No.</Text>
            <Text style={styles.titleMain}>GIRLS</Text>
            <View>
              <View style={styles.pageMainView}>
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
                        height: 50,
                      }}
                    >
                      <Text style={styles.text4}>EVENT</Text>
                    </View>
                    {GPSchools.map((schoolName, i) => (
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: GPSchools.length - 1 === i ? 0 : 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 50,
                        }}
                        key={i}
                      >
                        <Text style={styles.text5}>{schoolName?.school}</Text>
                      </View>
                    ))}
                  </View>
                  {GIRLS_ALL_EVENTS?.map((e, ind) => (
                    <View
                      key={ind}
                      style={[
                        styles.rowStartView,
                        {
                          borderBottomWidth:
                            ind === GIRLS_ALL_EVENTS?.length - 1 ? 0 : 1,
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
                        <Text style={styles.text5}>
                          {e?.split(" ")[1]} {e?.split(" ")[2]}
                        </Text>
                      </View>
                      {GPSchools?.map((b, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              width: "10%",
                              borderRightWidth:
                                index === GPSchools?.length - 1 ? 0 : 1,
                              justifyContent: "center",
                              alignItems: "center",
                              height: 30,
                            }}
                          >
                            <Text>
                              {GirlsData?.filter(
                                (el) =>
                                  (`${el?.gender} ${el?.group} ${el?.event1}` ===
                                    e &&
                                    el?.udise === b?.udise) ||
                                  (`${el?.gender} ${el?.group} ${el?.event2}` ===
                                    e &&
                                    el?.udise === b?.udise)
                              )[0]?.chestNo
                                ? GirlsData?.filter(
                                    (el) =>
                                      (`${el?.gender} ${el?.group} ${el?.event1}` ===
                                        e &&
                                        el?.udise === b?.udise) ||
                                      (`${el?.gender} ${el?.group} ${el?.event2}` ===
                                        e &&
                                        el?.udise === b?.udise)
                                  )[0]?.chestNo
                                : "-"}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
const styles = StyleSheet.create({
  page: {
    padding: 5,
    margin: 5,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: width,
    height: height,
  },
  pageMainView: {
    padding: 5,
    margin: 5,
    alignSelf: "center",
    width: "99%",
    height: "99%",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "Tiro",
    textAlign: "center",
  },
  title2: {
    fontSize: 12,
    fontFamily: "Tiro",
    textAlign: "center",
  },
  titleMain: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Tiro",
    textAlign: "center",
  },
  text: {
    fontSize: 10,
    fontFamily: "Tiro",
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
  text2: {
    fontSize: 9,
    fontFamily: "Tiro",
    textAlign: "center",
    transform: "rotate(-60deg)",
  },
  text3: {
    fontSize: 8,
    fontFamily: "Tiro",
    textAlign: "center",
    transform: "rotate(-60deg)",
  },
  text4: {
    fontSize: 8,
    fontFamily: "Tiro",
    textAlign: "center",
  },
  text5: {
    fontSize: 7,
    fontFamily: "Tiro",
    textAlign: "center",
  },
  headingView: {
    // border: "1px solid",
    borderWidth: 1,
    width: "100%",
    height: "auto",
  },
  tableStartView: {
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  tableStartBorderView: {
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    height: "auto",
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
  rowStartBorderView: {
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  rowWrapView: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  rowFlexView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  rowFlexViewEvenly: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center",
  },
  break: {
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    height: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  secondRowView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 5,
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
