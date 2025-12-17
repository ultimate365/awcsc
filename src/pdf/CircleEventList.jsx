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
import { CIRCLE_SPORTS_DATE, circleBenName } from "../modules/constants";
import { enToBnNumber } from "../modules/calculatefunctions";
const width = 2480;
const height = 3508;
export default function CircleEventList({ myData }) {
  const data = myData?.data?.sort((a, b) => {
    if (a.gp < b.gp) return -1;
    if (a.gp > b.gp) return 1;
    if (a.gender < b.gender) return -1;
    if (a.gender > b.gender) return 1;
    if (a.school < b.school) return -1;
    if (a.school > b.school) return 1;
    if (a.event1rank < b.event1rank) return -1;
    if (a.event1rank > b.event1rank) return 1;
    return 0;
  });
  const BoysData = data?.filter((el) => el?.gender === "BOYS");
  const GirlsData = data?.filter((el) => el?.gender === "GIRLS");

  const { group, engEventName } = myData;

  return (
    <Document
      style={{ margin: 5, padding: 5 }}
      title={`Circle Event Sheets of ${group}, ${engEventName}`}
    >
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.pageMainView}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.titleMain}>
              {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগিতা,{" "}
              {enToBnNumber(new Date().getFullYear())}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                alignSelf: "center",
                width: "100%",
                marginVertical: 10,
              }}
            >
              <View>
                <Text style={styles.textBold}>Sl No.: </Text>
              </View>
              <View style={{ marginLeft: "70%" }}>
                <Text style={styles.textBold}>Date: {CIRCLE_SPORTS_DATE}</Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
                alignSelf: "flex-start",

                marginBottom: 10,
              }}
            >
              <Text style={styles.textBold}>Gender:- BOYS</Text>
              <Text style={styles.textBold}>Event Name:- {engEventName}</Text>
              <Text style={styles.textBold}>Age Group:- {group}</Text>
              <Text style={styles.textBold}>
                Total Boys Participants:- {BoysData?.length}{" "}
              </Text>
            </View>
            <View>
              <Text style={styles.textBold}>Participated Boys Competitors</Text>
            </View>
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
                      }}
                    >
                      <Text style={styles.text}>Chest No.</Text>
                    </View>
                    <View
                      style={{
                        width: "30%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.text}>Name</Text>
                    </View>
                    <View style={{ width: "50%" }}>
                      <Text style={styles.text}>GP</Text>
                    </View>
                  </View>
                  {BoysData?.map((el, ind) => (
                    <View
                      key={ind}
                      style={[
                        styles.rowStartView,
                        {
                          borderBottomWidth:
                            ind === BoysData?.length - 1 ? 0 : 1,
                        },
                      ]}
                    >
                      <View
                        style={{
                          width: "20%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.text}>{el?.chestNo}</Text>
                      </View>
                      <View
                        style={{
                          width: "30%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.text}>{el?.name}</Text>
                      </View>
                      <View style={{ width: "50%" }}>
                        <Text style={styles.text}>{el?.gp}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.titleMain}>
              {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগিতা,{" "}
              {enToBnNumber(new Date().getFullYear())}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                alignSelf: "center",
                width: "100%",
                marginVertical: 10,
              }}
            >
              <View>
                <Text style={styles.textBold}>Sl No.: </Text>
              </View>
              <View style={{ marginLeft: "70%" }}>
                <Text style={styles.textBold}>Date: {CIRCLE_SPORTS_DATE}</Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
                alignSelf: "flex-start",

                marginBottom: 10,
              }}
            >
              <Text style={styles.textBold}>Gender:- GIRLS</Text>
              <Text style={styles.textBold}>Event Name:- {engEventName}</Text>
              <Text style={styles.textBold}>Age Group:- {group}</Text>
              <Text style={styles.textBold}>
                Total Girls Participants:- {GirlsData?.length}{" "}
              </Text>
            </View>
            <View>
              <Text style={styles.textBold}>
                Participated Girls Competitors
              </Text>
            </View>
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
                      }}
                    >
                      <Text style={styles.text}>Chest No.</Text>
                    </View>
                    <View
                      style={{
                        width: "30%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.text}>Name</Text>
                    </View>
                    <View style={{ width: "50%" }}>
                      <Text style={styles.text}>GP</Text>
                    </View>
                  </View>
                  {GirlsData?.map((el, ind) => (
                    <View
                      key={ind}
                      style={[
                        styles.rowStartView,
                        {
                          borderBottomWidth:
                            ind === GirlsData?.length - 1 ? 0 : 1,
                        },
                      ]}
                    >
                      <View
                        style={{
                          width: "20%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.text}>{el?.chestNo}</Text>
                      </View>
                      <View
                        style={{
                          width: "30%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.text}>{el?.name}</Text>
                      </View>
                      <View style={{ width: "50%" }}>
                        <Text style={styles.text}>{el?.gp}</Text>
                      </View>
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
              {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগিতা,{" "}
              {enToBnNumber(new Date().getFullYear())}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                alignSelf: "center",
                width: "100%",
                marginVertical: 10,
              }}
            >
              <View>
                <Text style={styles.textBold}>Sl No.: </Text>
              </View>
              <View style={{ marginLeft: "70%" }}>
                <Text style={styles.textBold}>Date: {CIRCLE_SPORTS_DATE}</Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
                alignSelf: "flex-start",

                marginBottom: 10,
              }}
            >
              <Text style={styles.textBold}>Gender:- BOYS</Text>
              <Text style={styles.textBold}>Event Name:- {engEventName}</Text>
              <Text style={styles.textBold}>Age Group:- {group}</Text>
              <Text style={styles.textBold}>
                Total Boys Participants:- {BoysData?.length}{" "}
              </Text>
            </View>
            <View>
              <Text style={styles.textBold}>Participated Boys Competitors</Text>
            </View>
            {engEventName === "LONG JUMP" ||
            engEventName === "FOOTBALL THROWING" ||
            engEventName === "HIGH JUMP" ? (
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
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>Chest No.</Text>
                    </View>
                    <View
                      style={{
                        width: "30%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>Name</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>GP</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>1ST</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>2ND</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>3RD</Text>
                    </View>

                    {engEventName === "HIGH JUMP" && (
                      <React.Fragment>
                        <View
                          style={{
                            width: "10%",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 35,
                          }}
                        >
                          <Text style={styles.text}>4TH</Text>
                        </View>
                        <View
                          style={{
                            width: "10%",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 35,
                          }}
                        >
                          <Text style={styles.text}>5TH</Text>
                        </View>
                        <View
                          style={{
                            width: "10%",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 35,
                          }}
                        >
                          <Text style={styles.text}>6TH</Text>
                        </View>
                      </React.Fragment>
                    )}
                    <View
                      style={{
                        width: "10%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text4}>POSITION</Text>
                    </View>
                  </View>
                  {BoysData?.map((el, ind) => (
                    <View
                      key={ind}
                      style={[
                        styles.rowStartView,
                        {
                          borderBottomWidth:
                            ind === BoysData?.length - 1 ? 0 : 1,
                          height: 35,
                        },
                      ]}
                    >
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      >
                        <Text style={styles.title}>{el?.chestNo}</Text>
                      </View>
                      <View
                        style={{
                          width: "30%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      >
                        <Text style={styles.text}>{el?.name}</Text>
                      </View>
                      <View
                        style={{
                          width: "20%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      >
                        <Text style={styles.text}>{el?.gp}</Text>
                      </View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>

                      {engEventName === "HIGH JUMP" && (
                        <React.Fragment>
                          <View
                            style={{
                              width: "10%",
                              borderRightWidth: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              height: 35,
                            }}
                          ></View>
                          <View
                            style={{
                              width: "10%",
                              borderRightWidth: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              height: 35,
                            }}
                          ></View>
                          <View
                            style={{
                              width: "10%",
                              borderRightWidth: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              height: 35,
                            }}
                          ></View>
                        </React.Fragment>
                      )}
                      <View
                        style={{
                          width: "10%",
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                    </View>
                  ))}
                </View>
              </View>
            ) : engEventName === "YOGA" || engEventName === "GYMNASTICS" ? (
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
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>Chest No.</Text>
                    </View>
                    <View
                      style={{
                        width: "30%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>Name</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>GP</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>1ST</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>2ND</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>3RD</Text>
                    </View>

                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>4TH</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>5TH</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>6TH</Text>
                    </View>
                    {engEventName === "GYMNASTICS" && (
                      <React.Fragment>
                        <View
                          style={{
                            width: "10%",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 35,
                          }}
                        >
                          <Text style={styles.text}>7TH</Text>
                        </View>
                        <View
                          style={{
                            width: "10%",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 35,
                          }}
                        >
                          <Text style={styles.text}>8TH</Text>
                        </View>
                      </React.Fragment>
                    )}
                    <View
                      style={{
                        width: "10%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text4}>TOTAL</Text>
                    </View>
                  </View>
                  {BoysData?.map((el, ind) => (
                    <View
                      key={ind}
                      style={[
                        styles.rowStartView,
                        {
                          borderBottomWidth:
                            ind === BoysData?.length - 1 ? 0 : 1,
                          height: 35,
                        },
                      ]}
                    >
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      >
                        <Text style={styles.title}>{el?.chestNo}</Text>
                      </View>
                      <View
                        style={{
                          width: "30%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      >
                        <Text style={styles.text}>{el?.name}</Text>
                      </View>
                      <View
                        style={{
                          width: "20%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      >
                        <Text style={styles.text}>{el?.gp}</Text>
                      </View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>

                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                      {engEventName === "GYMNASTICS" && (
                        <React.Fragment>
                          <View
                            style={{
                              width: "10%",
                              borderRightWidth: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              height: 35,
                            }}
                          ></View>
                          <View
                            style={{
                              width: "10%",
                              borderRightWidth: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              height: 35,
                            }}
                          ></View>
                        </React.Fragment>
                      )}
                      <View
                        style={{
                          width: "10%",
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
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
                      }}
                    >
                      <Text style={styles.text}>Chest No.</Text>
                    </View>
                    <View
                      style={{
                        width: "30%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.text}>Name</Text>
                    </View>
                    <View style={{ width: "50%" }}>
                      <Text style={styles.text}>GP</Text>
                    </View>
                  </View>
                  {BoysData?.map((el, ind) => (
                    <View
                      key={ind}
                      style={[
                        styles.rowStartView,
                        {
                          borderBottomWidth:
                            ind === BoysData?.length - 1 ? 0 : 1,
                        },
                      ]}
                    >
                      <View
                        style={{
                          width: "20%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.text}>{el?.chestNo}</Text>
                      </View>
                      <View
                        style={{
                          width: "30%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.text}>{el?.name}</Text>
                      </View>
                      <View style={{ width: "50%" }}>
                        <Text style={styles.text}>{el?.gp}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View>
            <Text style={styles.textBold}>
              Result (For use Finishing Judge)
            </Text>
          </View>
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
                    width: "30%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text}>Position</Text>
                </View>
                <View
                  style={{
                    width: "70%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRightWidth: 0,
                  }}
                >
                  <Text style={styles.text}>Name with Chest No.</Text>
                </View>
              </View>
              <View style={styles.rowStartView}>
                <View
                  style={{
                    width: "30%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 35,
                  }}
                >
                  <Text style={styles.titleMain}>1ST</Text>
                </View>
                <View
                  style={{
                    width: "70%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRightWidth: 0,
                    height: 35,
                  }}
                ></View>
              </View>
              <View style={styles.rowStartView}>
                <View
                  style={{
                    width: "30%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 35,
                  }}
                >
                  <Text style={styles.titleMain}>2ND</Text>
                </View>
                <View
                  style={{
                    width: "70%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRightWidth: 0,
                    height: 35,
                  }}
                ></View>
              </View>
              <View style={styles.rowStartView}>
                <View style={styles.rowStartView}>
                  <View
                    style={{
                      width: "30%",
                      borderRightWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 35,
                    }}
                  >
                    <Text style={styles.titleMain}>3RD</Text>
                  </View>
                  <View
                    style={{
                      width: "70%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRightWidth: 0,
                      height: 35,
                    }}
                  ></View>
                </View>
              </View>
              <View style={styles.rowStartView}>
                <View style={styles.rowStartView}>
                  <View
                    style={{
                      width: "30%",
                      borderRightWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 35,
                    }}
                  >
                    <Text style={styles.titleMain}>4th</Text>
                  </View>
                  <View
                    style={{
                      width: "70%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRightWidth: 0,
                      height: 35,
                    }}
                  ></View>
                </View>
              </View>
              <View style={[styles.rowStartView, { borderBottomWidth: 0 }]}>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    height: 60,
                    paddingRight: 20,
                  }}
                >
                  <Text style={styles.text}>SIGNATURE OF THE JUDGE</Text>
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
              {circleBenName} বার্ষিক ক্রীড়া প্রতিযোগিতা,{" "}
              {enToBnNumber(new Date().getFullYear())}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                alignSelf: "center",
                width: "100%",
                marginVertical: 10,
              }}
            >
              <View>
                <Text style={styles.textBold}>Sl No.: </Text>
              </View>
              <View style={{ marginLeft: "70%" }}>
                <Text style={styles.textBold}>Date: {CIRCLE_SPORTS_DATE}</Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
                alignSelf: "flex-start",

                marginBottom: 10,
              }}
            >
              <Text style={styles.textBold}>Gender:- GIRLS</Text>
              <Text style={styles.textBold}>Event Name:- {engEventName}</Text>
              <Text style={styles.textBold}>Age Group:- {group}</Text>
              <Text style={styles.textBold}>
                Total Girls Participants:- {GirlsData?.length}{" "}
              </Text>
            </View>
            <View>
              <Text style={styles.textBold}>
                Participated Girls Competitors
              </Text>
            </View>
            {engEventName === "LONG JUMP" ||
            engEventName === "FOOTBALL THROWING" ||
            engEventName === "HIGH JUMP" ? (
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
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>Chest No.</Text>
                    </View>
                    <View
                      style={{
                        width: "30%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>Name</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>GP</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>1ST</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>2ND</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>3RD</Text>
                    </View>

                    {engEventName === "HIGH JUMP" && (
                      <React.Fragment>
                        <View
                          style={{
                            width: "10%",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 35,
                          }}
                        >
                          <Text style={styles.text}>4TH</Text>
                        </View>
                        <View
                          style={{
                            width: "10%",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 35,
                          }}
                        >
                          <Text style={styles.text}>5TH</Text>
                        </View>
                        <View
                          style={{
                            width: "10%",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 35,
                          }}
                        >
                          <Text style={styles.text}>6TH</Text>
                        </View>
                      </React.Fragment>
                    )}
                    <View
                      style={{
                        width: "10%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text4}>POSITION</Text>
                    </View>
                  </View>
                  {GirlsData?.map((el, ind) => (
                    <View
                      key={ind}
                      style={[
                        styles.rowStartView,
                        {
                          borderBottomWidth:
                            ind === GirlsData?.length - 1 ? 0 : 1,
                          height: 35,
                        },
                      ]}
                    >
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      >
                        <Text style={styles.title}>{el?.chestNo}</Text>
                      </View>
                      <View
                        style={{
                          width: "30%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      >
                        <Text style={styles.text}>{el?.name}</Text>
                      </View>
                      <View
                        style={{
                          width: "20%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      >
                        <Text style={styles.text}>{el?.gp}</Text>
                      </View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>

                      {engEventName === "HIGH JUMP" && (
                        <React.Fragment>
                          <View
                            style={{
                              width: "10%",
                              borderRightWidth: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              height: 35,
                            }}
                          ></View>
                          <View
                            style={{
                              width: "10%",
                              borderRightWidth: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              height: 35,
                            }}
                          ></View>
                          <View
                            style={{
                              width: "10%",
                              borderRightWidth: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              height: 35,
                            }}
                          ></View>
                        </React.Fragment>
                      )}
                      <View
                        style={{
                          width: "10%",
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                    </View>
                  ))}
                </View>
              </View>
            ) : engEventName === "YOGA" || engEventName === "GYMNASTICS" ? (
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
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>Chest No.</Text>
                    </View>
                    <View
                      style={{
                        width: "30%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>Name</Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>GP</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>1ST</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>2ND</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>3RD</Text>
                    </View>

                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>4TH</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>5TH</Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text}>6TH</Text>
                    </View>
                    {engEventName === "GYMNASTICS" && (
                      <React.Fragment>
                        <View
                          style={{
                            width: "10%",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 35,
                          }}
                        >
                          <Text style={styles.text}>7TH</Text>
                        </View>
                        <View
                          style={{
                            width: "10%",
                            borderRightWidth: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 35,
                          }}
                        >
                          <Text style={styles.text}>8TH</Text>
                        </View>
                      </React.Fragment>
                    )}
                    <View
                      style={{
                        width: "10%",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 35,
                      }}
                    >
                      <Text style={styles.text4}>TOTAL</Text>
                    </View>
                  </View>
                  {GirlsData?.map((el, ind) => (
                    <View
                      key={ind}
                      style={[
                        styles.rowStartView,
                        {
                          borderBottomWidth:
                            ind === GirlsData?.length - 1 ? 0 : 1,
                          height: 35,
                        },
                      ]}
                    >
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      >
                        <Text style={styles.title}>{el?.chestNo}</Text>
                      </View>
                      <View
                        style={{
                          width: "30%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      >
                        <Text style={styles.text}>{el?.name}</Text>
                      </View>
                      <View
                        style={{
                          width: "20%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      >
                        <Text style={styles.text}>{el?.gp}</Text>
                      </View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>

                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                      <View
                        style={{
                          width: "10%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                      {engEventName === "GYMNASTICS" && (
                        <React.Fragment>
                          <View
                            style={{
                              width: "10%",
                              borderRightWidth: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              height: 35,
                            }}
                          ></View>
                          <View
                            style={{
                              width: "10%",
                              borderRightWidth: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              height: 35,
                            }}
                          ></View>
                        </React.Fragment>
                      )}
                      <View
                        style={{
                          width: "10%",
                          justifyContent: "center",
                          alignItems: "center",
                          height: 35,
                        }}
                      ></View>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
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
                      }}
                    >
                      <Text style={styles.text}>Chest No.</Text>
                    </View>
                    <View
                      style={{
                        width: "30%",
                        borderRightWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.text}>Name</Text>
                    </View>
                    <View style={{ width: "50%" }}>
                      <Text style={styles.text}>GP</Text>
                    </View>
                  </View>
                  {GirlsData?.map((el, ind) => (
                    <View
                      key={ind}
                      style={[
                        styles.rowStartView,
                        {
                          borderBottomWidth:
                            ind === GirlsData?.length - 1 ? 0 : 1,
                        },
                      ]}
                    >
                      <View
                        style={{
                          width: "20%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.text}>{el?.chestNo}</Text>
                      </View>
                      <View
                        style={{
                          width: "30%",
                          borderRightWidth: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.text}>{el?.name}</Text>
                      </View>
                      <View style={{ width: "50%" }}>
                        <Text style={styles.text}>{el?.gp}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View>
            <Text style={styles.textBold}>
              Result (For use Finishing Judge)
            </Text>
          </View>
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
                    width: "30%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.text}>Position</Text>
                </View>
                <View
                  style={{
                    width: "70%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRightWidth: 0,
                  }}
                >
                  <Text style={styles.text}>Name with Chest No.</Text>
                </View>
              </View>
              <View style={styles.rowStartView}>
                <View
                  style={{
                    width: "30%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 35,
                  }}
                >
                  <Text style={styles.titleMain}>1ST</Text>
                </View>
                <View
                  style={{
                    width: "70%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRightWidth: 0,
                    height: 35,
                  }}
                ></View>
              </View>
              <View style={styles.rowStartView}>
                <View
                  style={{
                    width: "30%",
                    borderRightWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 35,
                  }}
                >
                  <Text style={styles.titleMain}>2ND</Text>
                </View>
                <View
                  style={{
                    width: "70%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRightWidth: 0,
                    height: 35,
                  }}
                ></View>
              </View>
              <View style={styles.rowStartView}>
                <View style={styles.rowStartView}>
                  <View
                    style={{
                      width: "30%",
                      borderRightWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 35,
                    }}
                  >
                    <Text style={styles.titleMain}>3RD</Text>
                  </View>
                  <View
                    style={{
                      width: "70%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRightWidth: 0,
                      height: 35,
                    }}
                  ></View>
                </View>
              </View>
              <View style={styles.rowStartView}>
                <View style={styles.rowStartView}>
                  <View
                    style={{
                      width: "30%",
                      borderRightWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 35,
                    }}
                  >
                    <Text style={styles.titleMain}>4th</Text>
                  </View>
                  <View
                    style={{
                      width: "70%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRightWidth: 0,
                      height: 35,
                    }}
                  ></View>
                </View>
              </View>
              <View style={[styles.rowStartView, { borderBottomWidth: 0 }]}>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    height: 60,
                    paddingRight: 20,
                  }}
                >
                  <Text style={styles.text}>SIGNATURE OF THE JUDGE</Text>
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
  secondTableStartView: {
    borderWidth: 1,
    width: "100%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  view88H20: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "8.78%",
    height: 20,
  },
  SecondView16: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "16%",
    height: 15,
  },
  SecondView10: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "10%",
    height: 15,
  },
  view5: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "5%",
    height: 68,
    justifyContent: "center",
    alignItems: "center",
  },
  view5H0: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "5%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  view125Text0: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "13%",
    height: 60,
  },
  view125H40: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "12.5%",
    height: 68,
    justifyContent: "center",
    alignItems: "center",
  },
  view25: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    width: "27%",
    justifyContent: "center",
    alignItems: "center",
  },
  view25Height0: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "27%",
    justifyContent: "center",
    alignItems: "center",
  },
  view25Text0: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "25%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  view16: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "25%",
    height: 20,
  },
  view16H0: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "16%",
  },
  view25H30: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "25%",
    height: 30,
  },
  view20: {
    paddingRight: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 20,
  },
  view20Sec: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 1,
    width: "20%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 20,
  },
  view125: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "12.5%",
    height: 30,
  },

  view125H30: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "12.5%",
    height: 30,
  },

  view80H20: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    paddingRight: 1,
    width: "80%",
    height: 20,
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
    paddingRight: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  rowFlexView: {
    paddingRight: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  rowFlexViewEvenly: {
    paddingRight: 1,
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
