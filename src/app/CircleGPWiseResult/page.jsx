"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../../context/Store";
import { gpEngNames } from "../../modules/constants";
export default function Page() {
  const { stateArray } = useGlobalContext();
  return (
    <div className="container-fluid">
      {gpEngNames?.map((gpEngName, i) => (
        <div key={i}>
          <h3>{gpEngName}</h3>
          {stateArray
            ?.filter((el) => el.gp === gpEngName)
            ?.map((student, index) => (
              <div key={index}>
                {index === 0 && (
                  <div>
                    <h4>
                      Total Prize:{" "}
                      {stateArray?.filter((el) => el.gp === gpEngName)?.length}
                    </h4>
                    <h4>
                      Total First Prize:{" "}
                      {
                        stateArray
                          ?.filter((el) => el.gp === gpEngName)
                          ?.filter(
                            (el) =>
                              el.position1 === "FIRST" ||
                              el.position2 === "FIRST"
                          )?.length
                      }
                    </h4>
                    <h4>
                      Total SECOND Prize:{" "}
                      {
                        stateArray
                          ?.filter((el) => el.gp === gpEngName)
                          ?.filter(
                            (el) =>
                              el.position1 === "SECOND" ||
                              el.position2 === "SECOND"
                          )?.length
                      }
                    </h4>
                    <h4>
                      Total THIRD Prize:{" "}
                      {
                        stateArray
                          ?.filter((el) => el.gp === gpEngName)
                          ?.filter(
                            (el) =>
                              el.position1 === "THIRD" ||
                              el.position2 === "THIRD"
                          )?.length
                      }
                    </h4>
                  </div>
                )}
                <h5>{`${index + 1}) ${student?.name}`}</h5>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
