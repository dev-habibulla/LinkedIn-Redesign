import React, { useEffect, useState } from "react";
import Image from "./Images";
import ExperinceLogo from "../assets/explogo.png";
import EduLogo from "../assets/eduLogo.png";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { toast } from "react-toastify";
import { AiFillPlusSquare } from "react-icons/ai";
import {
  getDatabase,
  set,
  ref,
  onValue,
  remove,
  push,
  update,
} from "firebase/database";

const style = {
  position: "absolute",
  top: "40%",
  left: "40%",
  transform: "translate(-40%, -40%)",
  width: 750,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Educations = () => {
  const db = getDatabase();
  let [educationList, setEducationList] = useState([]);
  let userInfo = useSelector((state) => state.logedUser.value);

  let [education, setEducation] = useState({
    institute: "",
    degree: "",
    startDate: "",
    endDate: "",
    additionalDetails: "",
  });

  const [open, setOpen] = useState(false);
  const handleOpen = (item) => {
    setOpen(true);
    setEducation({
      institute: item.institute,
      degree: item.degree,
      startDate: item.startDate,
      endDate: item.endDate,
      additionalDetails: item.additionalDetails,
    });
  };
  const handleClose = () => setOpen(false);

  const [addOpen, setAddOpen] = useState(false);
  const handleAddOpen = () => {
    setAddOpen(true);
    setEducation({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };
  const handleAddClose = () => setAddOpen(false);

  useEffect(() => {
    const educationsListRef = ref(db, "educationsList");
    onValue(educationsListRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().uid == userInfo.uid) {
          arr.push({ ...item.val(), educationId: item.key });
        }
      });
      setEducationList(arr);
    });
  }, []);

  let handleChange = (e) => {
    setEducation({
      ...education,
      [e.target.name]: e.target.value,
    });
  };

  let handleAddEducation = () => {
    console.log("2222", education.dateInput);
    if (
      education.institute &&
      education.degree &&
      education.startDate &&
      education.endDate &&
      education.additionalDetails
    ) {
      set(push(ref(db, "educationsList")), {
        uid: userInfo.uid,
        institute: education.institute,
        degree: education.degree,
        startDate: education.startDate,
        endDate: education.endDate,
        additionalDetails: education.additionalDetails,
      });
      toast.success("Add Successful", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setAddOpen(false);
    } else {
      toast.warn("Kindly Complete All The Fields", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  let handleUpdateEducation = (item) => {
    if (
      education.institute &&
      education.degree &&
      education.startDate &&
      education.endDate &&
      education.additionalDetails
    ) {
      update(ref(db, "educationsList/" + item.educationId), {
        institute: education.institute,
        degree: education.degree,
        startDate: education.startDate,
        endDate: education.endDate,
        additionalDetails: education.additionalDetails,
      });
      toast.success("Update Successful", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setOpen(false);
    } else {
      toast.warn("Kindly Complete All The Fields", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  let handleEducatonDelete = (item) => {
    remove(ref(db, "educationsList/" + item.educationId));
    toast.success("Delete Successful", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setOpen(false);
  };

  return (
    <div>
      <Modal
        open={addOpen}
        onClose={handleAddClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Educations Information
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div className="updateEdittest">
              <TextField
                onChange={handleChange}
                name="institute"
                className="modalexInputcss"
                id="outlined-basic"
                label="Institute"
                value={education.institute}
              />
              <TextField
                onChange={handleChange}
                name="degree"
                className="modalexInputcss"
                id="outlined-basic"
                label="Degree Details"
                value={education.degree}
              />
              <TextField
                onChange={handleChange}
                type="number"
                name="startDate"
                className="modalexInputcss"
                id="outlined-basic"
                label="Start Year"
                value={education.startDate}
              />
              <TextField
                onChange={handleChange}
                name="endDate"
                type="number"
                className="modalexInputcss"
                id="outlined-basic"
                label="End Year"
                value={education.endDate}
              />

              <input
                type="date"
                onChange={handleChange}
                id="dateInput"
                name="dateInput"
                pattern="\d{4}-\d{2}-\d{2}"
                required
                value={education.dateInput}
              ></input>

              <TextField
                onChange={handleChange}
                name="additionalDetails"
                className="modalexInputcss"
                id="outlined-basic"
                label="Additional Details"
                value={education.additionalDetails}
              />

              <Button
                onClick={handleAddEducation}
                className="inputUpdateBtn"
                variant="contained"
              >
                Add Education
              </Button>
            </div>
          </Typography>
        </Box>
      </Modal>

      <div className="EducationPart">
        <h4 className="eduHeadingText">Education</h4>
        <button onClick={handleAddOpen} className="addExBtn">
          Add
        </button>
        {educationList.map((item) => (
          <>
            <div className="educationName">
              <Image src={EduLogo} className="EducationLogo" />
              <div className="EducationDetails">
                <button onClick={() => handleOpen(item)} className="eduEditBtn">
                  Edit
                </button>
                <h4 className="eduInsText">{item.institute}</h4>
                <p className="eduDegreeName">{item.degree}</p>
                <p className="eduYear">
                  {item.startDate} — {item.endDate}
                </p>
                <p className="eduYearAddiText">{item.additionalDetails}</p>
              </div>
            </div>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  <div className="modalTitleDelbtn">
                    Edit or Delete Educations Information
                    <Button
                      onClick={() => handleEducatonDelete(item)}
                      className="inputdeleteBtn"
                      variant="contained"
                      color="error"
                    >
                      Delete
                    </Button>
                  </div>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <div className="updateEdittest">
                    <TextField
                      onChange={handleChange}
                      name="institute"
                      className="modalexInputcss"
                      id="outlined-basic"
                      label="Institute"
                      value={education.institute}
                    />
                    <TextField
                      onChange={handleChange}
                      name="degree"
                      className="modalexInputcss"
                      id="outlined-basic"
                      label="Degree Details"
                      value={education.degree}
                    />
                    <TextField
                      onChange={handleChange}
                      name="startDate"
                      type="number"
                      className="modalexInputcss"
                      id="outlined-basic"
                      label="Start Year"
                      value={education.startDate}
                    />
                    <TextField
                      onChange={handleChange}
                      name="endDate"
                      type="number"
                      className="modalexInputcss"
                      id="outlined-basic"
                      label="End Year"
                      value={education.endDate}
                    />

                    <TextField
                      onChange={handleChange}
                      name="additionalDetails"
                      className="modalexInputcss"
                      id="outlined-basic"
                      label="Additional Details"
                      value={education.additionalDetails}
                    />

                    <Button
                      onClick={() => handleUpdateEducation(item)}
                      className="inputUpdateBtn"
                      variant="contained"
                    >
                      Update Education
                    </Button>
                  </div>
                </Typography>
              </Box>
            </Modal>
          </>
        ))}
      </div>
    </div>
  );
};

export default Educations;
