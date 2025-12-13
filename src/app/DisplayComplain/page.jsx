"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import DataTable from "react-data-table-component";
import "react-toastify/dist/ReactToastify.css";
import { firestore } from "../../context/FirbaseContext";
import {
  query,
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../components/Loader";
import { decryptObjData, getCookie } from "../../modules/encryption";
import { BsClipboard, BsClipboard2Check } from "react-icons/bs";
const DisplayComplain = () => {
  const navigate = useRouter();
  let teacherdetails = {
    convenor: "",
    gp: "",
    school: "",
    circle: "",
    tname: "",
  };
  let details = getCookie("tid");
  if (details) {
    teacherdetails = decryptObjData("tid");
  }
  useEffect(() => {
    if (teacherdetails.circle !== "admin") {
      navigate.push("/Login");
    }
    // eslint-disable-next-line
  }, []);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [complainId, setComplainId] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentComplain, setCurrentComplain] = useState({
    tname: "",
    school: "",
    sis: "",
    email: "",
    mobile: "",
    complain: "",
    status: "",
    complainTime: "",
    id: "",
    solvedOn: "",
    remarks: "",
  });
  const [remark, setRemark] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [date, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const columns = [
    {
      name: "Sl",
      selector: (row, index) => index + 1,
      wrap: +true,
      center: +true,
    },
    {
      name: "Id",
      selector: (row) => row.id,
      wrap: +true,
      center: +true,
    },
    {
      name: "View",
      selector: (row) => (
        <button
          type="button"
          className="btn btn-sm btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          onClick={(e) => {
            setComplainId(row.id);
            setCurrentComplain(row);
            setDate(new Date(row.complainTime));
            setDate2(new Date(row.solvedOn));
          }}
        >
          Show
        </button>
      ),

      wrap: +true,
      center: +true,
    },
    {
      name: "Teacher Name",
      selector: (row) => row.tname,
      wrap: +true,
      center: +true,
    },
    {
      name: "School",
      selector: (row) => row.school,
      wrap: +true,
      center: +true,
    },
    {
      name: "Circle",
      selector: (row) => row.sis,
      wrap: +true,
      center: +true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      wrap: +true,
      center: +true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      wrap: +true,
      center: +true,
    },

    {
      name: "Registered On",
      selector: (row) => DateValueToString(row.complainTime),
      wrap: +true,
      center: +true,
    },
    {
      name: "Delete",
      selector: (row) => (
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => {
            let conf = confirm("Are You Sure to Delete This Complain?"); //eslint-disable-line
            if (conf) {
              deleteComplain(row.id);
            }
          }}
        >
          Delete
        </button>
      ),
      wrap: +true,
      center: +true,
    },
  ];
  const noticed = async () => {
    let x = currentComplain;
    x.status = "Solved";
    x.solvedOn = Date.now();
    x.remarks = remark;
    const entry = {
      status: "Solved",
      solvedOn: Date.now(),
      remarks: remark,
    };
    // await axios.post("/api/updateComplain", x);
    const docRef = doc(firestore, "sportscomplains", complainId);
    await updateDoc(docRef, entry);
    toast.success("Complain Noticed!");
    getComplains();
  };

  const getComplains = async () => {
    try {
      const q = query(collection(firestore, "sportscomplains"));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        ...doc.data(),
        id: doc.id,
      }));
      setData(data);
      setShowTable(true);
    } catch (error) {
      // await axios.post("/api/getComplains").then((data) => {
      //   const res = data.data.data;
      //   setData(res);
      //   setShowTable(true);
      // });
      toast.error("Something went Wrong");
      console.log(error);
    }
  };

  const deleteComplain = async (id) => {
    setShowTable(false);
    // await axios.post("/api/delComplain", { id });
    await deleteDoc(doc(firestore, "sportscomplains", id));
    toast.success("Complain Deleted Successfully!");
    getComplains();
    setShowTable(true);

    // console.log(user.teachersID);
    // console.log(res);
  };
  const DateValueToString = (dateValue) => {
    let date = new Date(dateValue);
    return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} At ${
      date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
    }:${date.getMinutes()}:${date.getSeconds()} ${
      date.getHours() > 12 ? "PM" : "AM"
    }`;
  };
  useEffect(() => {
    document.title = "AWC Sports App:Requests";
    getComplains();
  }, []);

  useEffect(() => {
    const result = data.filter((el) => {
      return el.tname.toLowerCase().match(search.toLowerCase());
    });
    setFilteredData(result);
  }, [search, complainId, remark, data]);

  return (
    <div className="container my-5">
      {showTable ? (
        <>
          <h3 className="text-center text-primary mb-3">
            Displaying Complains
          </h3>

          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            fixedHeader
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search"
                className="w-25 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
            subHeaderAlign="right"
          />
          <div
            className="modal fade"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">
                    Complain of Visitor {currentComplain.tname}
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <div className="float-end">
                      {!success ? (
                        <BsClipboard
                          onClick={() => {
                            navigator.clipboard.writeText(currentComplain.id);
                            setSuccess(true);
                            setTimeout(() => setSuccess(false), 1500);
                          }}
                          size={30}
                          color="skyblue"
                        />
                      ) : (
                        <BsClipboard2Check
                          onClick={() => {
                            navigator.clipboard.writeText(currentComplain.id);
                            setSuccess(true);
                            setTimeout(() => setSuccess(false), 1500);
                          }}
                          size={30}
                          color="skyblue"
                        />
                      )}
                    </div>
                    <h3 className="text-primary text-center">
                      {currentComplain.id}
                    </h3>
                    {success && (
                      <h6 className="text-success">
                        Token Coppied to Clipboard
                      </h6>
                    )}
                    <h5 className="text-center" id="name">
                      Complain of Visitor {currentComplain.tname}
                    </h5>
                  </div>
                  <div className="mb-3">
                    <h5 className="text-center" id="school">
                      School of Visitor:-
                      <br /> {currentComplain.school}
                    </h5>
                  </div>
                  <div className="mb-3">
                    <h5 className="text-center" id="sis">
                      Circle of Visitor:-
                      <br /> {currentComplain.sis}
                    </h5>
                  </div>
                  <div className="mb-3">
                    <h5 className="text-center" id="email">
                      Email of Visitor:-
                      <br /> {currentComplain.email}
                    </h5>
                  </div>
                  <div className="mb-3">
                    <h5 className="text-center" id="mobile">
                      Mobile No. of Visitor:-
                      <br /> {currentComplain.mobile}
                    </h5>
                  </div>
                  <div className="mb-3">
                    <h5 className="text-center" id="complain">
                      Complain of Visitor:-
                      <br /> {currentComplain.complain}
                    </h5>
                  </div>
                  <div className="mb-3">
                    <h5 className="text-center" id="reg">
                      Complain Registered On:-
                      <br /> {date.getDate()}-{date.getMonth()}-
                      {date.getFullYear()} At{" "}
                      {date.getHours() > 12
                        ? date.getHours() - 12
                        : date.getHours()}
                      :{date.getMinutes()}:{date.getSeconds()}{" "}
                      {date.getHours() > 12 ? "PM" : "AM"}
                    </h5>
                  </div>
                  <div className="mb-3">
                    <h5 className="text-center" id="noticed">
                      Status of Complain:-
                      <br />
                      {currentComplain.status !== "Not Solved"
                        ? `${
                            currentComplain.status
                          } at ${date2.getDate()}-${date2.getMonth()}-${date2.getFullYear()} At ${
                            date2.getHours() > 12
                              ? date2.getHours() - 12
                              : date2.getHours()
                          }:${date2.getMinutes()}:${date2.getSeconds()} ${
                            date2.getHours() > 12 ? "PM" : "AM"
                          }`
                        : "Not Solved"}
                    </h5>
                  </div>
                  <div className="mb-3">
                    <textarea
                      name="remark"
                      id="remark"
                      cols="5"
                      rows="5"
                      className="form-control"
                      placeholder="Give Response to this complain"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={noticed}
                  >
                    Request Noticed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default DisplayComplain;
