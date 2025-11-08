"use client";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../context/FirbaseContext";
import { firestore } from "../../context/FirbaseContext";
import {
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  collection,
  updateDoc,
} from "firebase/firestore";
import Loader from "../../components/Loader";
import { v4 as uuid } from "uuid";
import { decryptObjData, getCookie } from "../../modules/encryption";
import {
  createDownloadLink,
  findEmptyValues,
} from "../../modules/calculatefunctions";
const Downloads = () => {
  let teacherdetails = {
    convenor: "",
    gp: "",
    school: "",
    circle: "",
    tname: "",
    udise: "",
  };

  let details = getCookie("tid");
  if (details) {
    teacherdetails = decryptObjData("tid");
  }
  const [allData, setAllData] = useState([]);
  const [folder, setFolder] = useState("downloads");
  const [loader, setLoader] = useState(false);
  const [file, setFile] = useState({});
  const [fileName, setFileName] = useState("");
  const [editFileName, setEditFileName] = useState("");
  const [editFileId, setEditFileId] = useState("");
  const [showPercent, setShowPercent] = useState(false);
  const [percent, setPercent] = useState(0);
  const docId = uuid();
  const getData = async () => {
    setLoader(true);
    const q = query(collection(firestore, "downloads"));

    const querySnapshot = await getDocs(q);
    const datas = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setLoader(false);
    setAllData(datas);
  };

  const uploadFiles = () => {
    if (file == null) {
      return;
    } else {
      setShowPercent(true);
      const filestorageRef = ref(storage, `/${folder}/${file.name}`);
      const uploadTask = uploadBytesResumable(filestorageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setPercent(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          );
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            // console.log(url);
            try {
              await setDoc(doc(firestore, "downloads", docId), {
                id: docId,
                date: Date.now(),
                addedBy: teacherdetails.tname,
                url: url,
                downloadUrl: url,
                fileName: fileName,
                storageFileName: file.name,
                fileType: file.type,
                isRelease: false,
              });
              toast.success("Congrats! File Uploaded Successfully!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setShowPercent(false);
              getData();
              setFile({});
              setFileName("");
              document.getElementById("fileInp").value = "";
            } catch (e) {
              toast.success("File Upload Failed!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setShowPercent(false);
              console.log(e);
            }
          });
        }
      );
    }
  };
  const updateFileName = async () => {
    const docRef = doc(firestore, "downloads", editFileId);
    await updateDoc(docRef, {
      fileName: editFileName,
    });

    toast.success("Congrats! File Name Changed Successfully!", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setLoader(false);
    getData();
  };
  const deleteFile = async (name, id) => {
    setLoader(true);

    await deleteDoc(doc(firestore, "downloads", id))
      .then(async () => {
        try {
          const desertRef = ref(storage, `${folder}/${name}`);
          await deleteObject(desertRef).then(() => {
            // File deleted successfully
            toast.success("Congrats! File Deleted Successfully!", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setLoader(false);
            getData();
          });
        } catch (e) {
          console.log(e);
          // File deleted successfully
          toast.success("Congrats! File Deleted Successfully!", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setLoader(false);
          getData();
        }
      })

      .catch((error) => {
        setLoader(false);
        // Uh-oh, an error occurred!
        toast.error("Something Went Wrong!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log(error);
      });
  };

  useEffect(() => {
    document.title = "AWC Sports App:Downloads";
    getData();
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    //eslint-disable-next-line
  }, [percent]);
  return (
    <div className="container my-5">
      <h3 className="text-primary text-center">Downloads</h3>

      {loader ? <Loader /> : null}
      {teacherdetails.circle === "admin" && (
        <div className="col-md-6 mx-auto">
          <div className="my-3">
            <button
              className="btn btn-dark"
              onClick={() => createDownloadLink(allData, "downloads")}
            >
              Download Data
            </button>
          </div>
          <h3 className="text-primary text-center">Upload Files</h3>
          <div className="col-md-6 mx-auto mb-3">
            <h5 className="text-center text-primary mb-3">
              Select Folder Location
            </h5>
            <select
              className="form-select"
              defaultValue={folder}
              onChange={(e) => {
                setFolder(e.target.value);
              }}
              aria-label="Default select example"
            >
              <option value="">Select Foder Name</option>
              <option value="downloads">Downloads</option>
              <option value="files">Files</option>
              <option value="databases">Databases</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div className="mb-3">
            <h5 className="text-center text-primary">Upload File</h5>
            <input
              type="file"
              id="fileInp"
              className="form-control"
              placeholder="Upload Document"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter File Name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          {showPercent && (
            <div
              className="bg-success"
              style={{ width: `${percent}%`, height: 10, borderRadius: 3 }}
            ></div>
          )}
          <div className="my-3">
            <button
              type="button"
              className="btn btn-success my-3"
              onClick={() => {
                if (fileName !== "") {
                  uploadFiles();
                } else {
                  toast.error("Please Enter File Name!", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                }
              }}
            >
              Upload File
            </button>
            <button
              type="button"
              className="btn btn-danger my-3 mx-2"
              onClick={() => {
                setFile({});
                document.getElementById("fileInp").value = "";
                setFileName("");
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
      {allData.length > 0 ? (
        <div className="container overflow-auto col-md-6 d-flex">
          <table className="table table-responsive table-hover table-striped table-success  px-lg-3 py-lg-2 ">
            <thead>
              <tr>
                <th>Sl</th>
                <th>File Name</th>
                <th>Format</th>
                <th>Download</th>
                {teacherdetails.circle === "admin" && (
                  <>
                    <th>Edit File Name</th>
                    <th>Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {allData.map((el, ind) => {
                return (
                  <tr key={ind}>
                    <td>{ind + 1}</td>
                    <td>{el.fileName.toUpperCase()}</td>
                    <td>
                      {el.fileType === "application/vnd.android.package-archive"
                        ? "APK"
                        : el.fileType === "application/pdf"
                        ? "PDF"
                        : el.fileType === "application/msword"
                        ? "WORD"
                        : el.fileType ===
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        ? "WORD"
                        : el.fileType ===
                          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                        ? "POWERPOINT"
                        : el.fileType === "application/vnd.ms-excel"
                        ? "EXCEL"
                        : el.fileType ===
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        ? "EXCEL"
                        : el.fileType ===
                          "application/vnd.ms-excel.sheet.macroEnabled.12"
                        ? "EXCEL"
                        : el.fileType === "application/vnd.ms-powerpoint"
                        ? "EXCEL"
                        : el.fileType === "application/zip"
                        ? "ZIP"
                        : el.fileType === "application/vnd.rar"
                        ? "RAR"
                        : el.fileType === "text/csv"
                        ? "CSV"
                        : el.fileType ===
                          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                        ? "POWERPOINT"
                        : ""}
                    </td>
                    <td>
                      <a
                        href={el.url}
                        className="btn btn-success rounded text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>
                    </td>
                    {teacherdetails.circle === "admin" && (
                      <>
                        <td>
                          <button
                            type="button"
                            className="btn btn-warning "
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop"
                            onClick={() => {
                              setEditFileId(el.id);
                              setEditFileName(el.fileName);
                            }}
                          >
                            Edit File Name
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger "
                            onClick={() => {
                              // eslint-disable-next-line
                              let conf = confirm(
                                `Are you sure you want to Delete This File?`
                              );
                              if (conf) {
                                deleteFile(el.storageFileName, el.id);
                              } else {
                                toast.success("File Not Deleted!!!");
                              }
                            }}
                          >
                            Delete Uploaded Files
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <h3 className="modal-title fs-5">No Downloadable File Exists</h3>
      )}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Edit File Name
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setEditFileId("");
                  setEditFileName("");
                }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter File Name"
                  value={editFileName}
                  onChange={(e) => setEditFileName(e.target.value)}
                />
              </div>
              <div className="my-3">
                <button
                  type="button"
                  className="btn btn-success my-3"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    if (editFileName !== "") {
                      updateFileName();
                    } else {
                      toast.error("Please Enter File Name!", {
                        position: "top-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                    }
                  }}
                >
                  Update File Name
                </button>
                <button
                  type="button"
                  className="btn btn-danger  mx-3"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    setEditFileId("");
                    setEditFileName("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
