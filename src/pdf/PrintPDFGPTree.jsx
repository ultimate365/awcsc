"use client";
import React, { useEffect } from "react";
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
  sliceArrayIntoChunks,
  GPkeysData,
  getSubmitDateInput,
} from "../modules/calculatefunctions";
const width = 2480;
const height = 3508;

export default function PrintPDFGPTree({ data, title }) {
  const pages = sliceArrayIntoChunks(data, 30);
  const getColWidth = (key) => {
    switch (key) {
      case "sl":
        return "3%";
      case "chestNo":
        return "5%";
      case "school":
        return "20%";
      case "name":
        return "18%";
      case "gurdiansName":
        return "15%";
      case "birthday":
        return "9%";
      case "sclass":
        return "5%";
      case "group":
        return "10%";
      case "event":
        return "15%";
      default:
        return "10%";
    }
  };
  const GetViewValues = (firstArray, secondArray) => {
    return secondArray.map((obj, index) => {
      const { id } = obj;
      return (
        <View
          style={[
            styles.rowStartView,
            {
              padding: 0,
              borderBottomWidth: index === secondArray?.length - 1 ? 0 : 1,
            },
          ]}
          key={index}
        >
          {firstArray.map((key, i) => {
            let t = "";
            if (key?.keyName === "sl") {
              t = data.findIndex((tid) => tid.id === id) + 1;
            } else if (key?.keyName === "birthday") {
              t = getSubmitDateInput(obj[key?.keyName]);
            } else if (key?.keyName === "event") {
              t = `${obj?.event1}${
                obj?.event2 ? `${obj?.event1 ? ", " : ""} ${obj?.event2}` : ""
              }`;
            } else if (key?.keyName === "group") {
              t = `${obj?.group}, (${obj?.gender})`;
            } else {
              t = obj[key?.keyName];
            }
            return (
              <View
                style={{
                  borderRightWidth: i === firstArray.length - 1 ? 0 : 1,
                  width: getColWidth(key?.keyName),
                  height: 30,
                  justifyContent: "center",
                }}
                key={i}
              >
                <Text style={styles.smallText}>{t}</Text>
              </View>
            );
          })}
        </View>
      );
    });
  };
  const THead = ({ borderRightWidth, width, height, justifyContent, Name }) => {
    return (
      <View
        style={{
          borderRightWidth: borderRightWidth,
          width: width,
          height: height,
          justifyContent: justifyContent,
        }}
      >
        <Text style={styles.smallText}>{Name}</Text>
      </View>
    );
  };
  return (
    // <PDFViewer
    //   style={{
    //     width: width / 3,
    //     height: height / 3,
    //   }}
    // >
    <Document style={{ margin: 2, padding: 2 }} title={title}>
      {pages.map((page, index) => (
        <Page size="A4" orientation="portrait" style={styles.page} key={index}>
          <View style={styles.pageMainView}>
            <Text style={[styles.title, { marginBottom: 3 }]}>
              {title ? title?.split("_")?.join(" ") : title}
            </Text>
            <View style={styles.tableStartBorderView}>
              <View style={styles.rowStartBorderView}>
                {GPkeysData.map((el, ind) => {
                  return (
                    <THead
                      borderRightWidth={ind === GPkeysData.length - 1 ? 0 : 1}
                      width={getColWidth(el?.keyName)}
                      height={20}
                      justifyContent={"center"}
                      Name={el?.displayName}
                      key={ind}
                    />
                  );
                })}
              </View>
              {GetViewValues(GPkeysData, page)}
            </View>
            {index !== pages.length - 1 ? (
              <Text style={[styles.text, { marginVertical: 2 }]}>
                {`Generated on: ${new Date()
                  .toISOString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("-")} at ${new Date().toLocaleTimeString()}, Page ${
                  index + 1
                } of ${pages.length}`}
              </Text>
            ) : (
              <Text
                style={[
                  styles.text,
                  {
                    marginVertical: 2,
                    position: "absolute",
                    left: "20%",
                    right: "20%",
                    bottom: 0,
                  },
                ]}
              >
                {`Generated on: ${new Date()
                  .toISOString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("-")} at ${new Date().toLocaleTimeString()}, Page ${
                  index + 1
                } of ${pages.length}`}
              </Text>
            )}
          </View>
        </Page>
      ))}
    </Document>
    // </PDFViewer>
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
    // margin: 5,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
    width: "98%",
    height: "98%",
  },
  title: {
    fontSize: 12,
    fontFamily: "TimesBold",
    textAlign: "center",
  },
  text: {
    fontSize: 8,
    fontFamily: "Times",
    textAlign: "center",
  },
  smallText: {
    fontSize: 6,
    fontFamily: "Times",
    textAlign: "center",
    padding: 2,
  },
  tableStartBorderView: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    width: "100%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  rowStartView: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0.5,
    width: "100%",
    height: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  rowStartBorderView: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0.5,
    width: "100%",
    height: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    alignContent: "center",
  },
  underLineText: {
    marginTop: 5,
    textDecoration: "underline",
    textDecorationStyle: "dotted",
    fontSize: 16,
    fontFamily: "Times",
    textAlign: "left",
    lineHeight: 1.5,
  },
  checkImage: {
    width: 10,
    height: 10,
    position: "absolute",
    marginTop: -7,
  },
  tdView: {
    borderRightWidth: 0,
    width: "15%",
    height: 20,
    justifyContent: "center",
  },
});
Font.register({
  family: "Times",
  src: "https://raw.githubusercontent.com/amtawestwbtpta/awwbtptadata/main/times.ttf",
});

Font.register({
  family: "TimesBold",
  src: "https://raw.githubusercontent.com/amtawestwbtpta/awwbtptadata/main/timesBold.ttf",
});
