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
  gpEngNames,
  BOYS_ALL_EVENTS,
  GIRLS_ALL_EVENTS,
} from "../modules/constants";

const width = 2480;
const height = 3508;
export default function CircleChestNoSheet({ BoysData, GirlsData }) {
  return (
    <Document
      style={{ margin: 5, padding: 5 }}
      title={`Amta West Circle Sports ${new Date().getFullYear()} Eventwise All Chest No`}
    >
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.pageMainView}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.titleMain}>
              Amta West Circle Sports {new Date().getFullYear()} Eventwise All
              Chest No.
            </Text>
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
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text4}>EVENT</Text>
                    </View>
                    {gpEngNames.map((gp, i) => (
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: gpEngNames.length - 1 === i ? 0 : 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 30,
                        }}
                        key={i}
                      >
                        <Text style={styles.text4}>{gp}</Text>
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
                          width: "20%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 30,
                        }}
                      >
                        <Text style={styles.text4}>{e}</Text>
                      </View>
                      {BoysData?.filter(
                        (el) =>
                          `${el?.gender} ${el?.group} ${el?.event1}` === e ||
                          `${el?.gender} ${el?.group} ${el?.event2}` === e
                      )?.map((b, index) => (
                        <View
                          style={{
                            width: "10%",
                            borderRightWidth:
                              index ===
                              BoysData?.filter(
                                (el) =>
                                  `${el?.gender} ${el?.group} ${el?.event1}` ===
                                    e ||
                                  `${el?.gender} ${el?.group} ${el?.event2}` ===
                                    e
                              )?.length -
                                1
                                ? 0
                                : 1,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 30,
                          }}
                        >
                          <Text style={styles.title} key={index}>
                            {b?.chestNo ? b?.chestNo : "-"}
                          </Text>
                        </View>
                      ))}
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
              Amta West Circle Sports {new Date().getFullYear()} Eventwise All
              Chest No.
            </Text>
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
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 30,
                      }}
                    >
                      <Text style={styles.text4}>EVENT</Text>
                    </View>
                    {gpEngNames.map((gp, i) => (
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: gpEngNames.length - 1 === i ? 0 : 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 30,
                        }}
                        key={i}
                      >
                        <Text style={styles.text4}>{gp}</Text>
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
                          width: "20%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 30,
                        }}
                      >
                        <Text style={styles.text4}>{e}</Text>
                      </View>
                      {GirlsData?.filter(
                        (el) =>
                          `${el?.gender} ${el?.group} ${el?.event1}` === e ||
                          `${el?.gender} ${el?.group} ${el?.event2}` === e
                      )?.map((b, index) => (
                        <View
                          style={{
                            width: "10%",
                            borderRightWidth:
                              index ===
                              GirlsData?.filter(
                                (el) =>
                                  `${el?.gender} ${el?.group} ${el?.event1}` ===
                                    e ||
                                  `${el?.gender} ${el?.group} ${el?.event2}` ===
                                    e
                              )?.length -
                                1
                                ? 0
                                : 1,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 30,
                          }}
                        >
                          <Text style={styles.title} key={index}>
                            {b?.chestNo ? b?.chestNo : "-"}
                          </Text>
                        </View>
                      ))}
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
    fontSize: 8.5,
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
