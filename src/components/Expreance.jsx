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
import moment from "moment/moment";
import { toast } from "react-toastify";
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

function ExperienceForm() {
  const db = getDatabase();
  let [experienceList, setExperienceList] = useState([]);
  let userInfo = useSelector((state) => state.logedUser.value);

  let [exDelId, setExDelId] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = (item) => {
    setOpen(true);
    
    setExDelId(item.experienceId);
    setExperience({
      title: item.title,
      company: item.company,
      location: item.location,
      startDate: item.startDate,
      description: item.description,
      experienceId: item.experienceId,
    });
  };

  const handleClose = () => setOpen(false);

  const [addModalopen, setAddModalopen] = useState(false);
  const handleAddexOpen = () => setAddModalopen(true);

  const handleAddClose = () => setAddModalopen(false);

  useEffect(() => {
    const experienceListRef = ref(db, "experienceList");
    onValue(experienceListRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().uid == userInfo.uid) {
          arr.push({ ...item.val(), experienceId: item.key });
        }
      });
      setExperienceList(arr);
    });
  }, []);

  let [experience, setExperience] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    description: "",
  });

  let handleChange = (e) => {
    setExperience({
      ...experience,
      [e.target.name]: e.target.value,
    });
  };

  let handleAddExperience = () => {
    if (
      experience.title &&
      experience.company &&
      experience.location &&
      experience.startDate &&
      experience.description
    ) {
      set(push(ref(db, "experienceList")), {
        uid: userInfo.uid,
        title: experience.title,
        company: experience.company,
        location: experience.location,
        startDate: experience.startDate,
        description: experience.description,
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

      // setExperience({
      //   title: "",
      //   company: "",
      //   location: "",
      //   startDate: "",
      //   endDate: "",
      //   description: "",
      // });

      setAddModalopen(false);
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

  let handleExperienceEdit = (item) => {
    if (
      experience.title &&
      experience.company &&
      experience.location &&
      experience.startDate &&
      experience.experienceId &&
      experience.description
    ) {
      update(ref(db, "experienceList/" + item.experienceId), {
        title: experience.title,
        company: experience.company,
        location: experience.location,
        startDate: experience.startDate,
        description: experience.description,
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

      // setExperience({
      //   title: "",
      //   company: "",
      //   location: "",
      //   startDate: "",
      //   endDate: "",
      //   description: "",
      // });
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


   // Move useEffect hook outside the function
  //  useEffect(() => {
  //   let deleteId;

  //   deleteId = exDelId;
    

  //   if (!deleteId) {

  //     setExDelId("");
  //   }
  // }, [exDelId]);



  let handleExperienceDelete = (item) => {


    

    // Watch for changes in the fMsg state
    console.log(item);
    console.log(item.title);
    console.log(exDelId);

    // console.log(item);
    // console.log(item.title);
    // console.log(localFMsg); // Use the local variable

   
    remove(ref(db, "experienceList/" + exDelId));
    setExperience({
      title: "",
      company: "",
      location: "",
      startDate: "",
      description: "",
    });
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
        open={addModalopen}
        onClose={handleAddClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Experience Information
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div className="updateEdittest">
              <TextField
                onChange={handleChange}
                name="title"
                className="modalexInputcss"
                id="outlined-basic"
                label="Title"
                value={experience.title}
              />
              <TextField
                onChange={handleChange}
                name="company"
                className="modalexInputcss"
                id="outlined-basic"
                label="Company Name"
                value={experience.company}
              />
              <TextField
                onChange={handleChange}
                name="location"
                className="modalexInputcss"
                id="outlined-basic"
                label="Company Location"
                value={experience.location}
              />
              <input
                type="date"
                onChange={handleChange}
                id="dateInput"
                name="startDate"
                pattern="\d{4}-\d{2}-\d{2}"
                required
                value={experience.startDate}
              ></input>

              <TextField
                onChange={handleChange}
                name="description"
                className="modalexInputcss"
                id="outlined-basic"
                label="Description"
                value={experience.description}
              />

              <Button
                onClick={handleAddExperience}
                className="inputUpdateBtn"
                variant="contained"
              >
                Add Experience
              </Button>
            </div>
          </Typography>
        </Box>
      </Modal>

      <div className="experiencePart">
        <h4>Experience</h4>
        <button onClick={handleAddexOpen} className="addExBtn">
          Add
        </button>
        {experienceList.map((item) => (
          <>
            <div className="experienceName">
              <Image src={ExperinceLogo} className="experinceLogo" />
              <div className="experienceDetails">
                <button onClick={() => handleOpen(item)} className="exEditBtn">
                  Edit
                </button>
                <h4>{item.title}</h4>
                <div className="experienceLocation">
                  <p className="LocaComName">{item.company}</p>
                  <p className="LocaName">{item.location}</p>
                </div>
                <div className="experienceTime">
                  <p className="expYear">{item.startDate}</p>
                  <p className="exTime">
                    {moment(item.startDate, "YYYYMMDD hh:mm").fromNow(true)}
                  </p>
                </div>
                <p className="exSummery">{item.description}</p>
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
                    Edit or Delete Experience Information
                    <Button
                      onClick={() => handleExperienceDelete(item)}
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
                      name="title"
                      className="modalexInputcss"
                      id="outlined-basic"
                      label="Title"
                      value={experience.title}
                    />
                    <TextField
                      onChange={handleChange}
                      name="company"
                      className="modalexInputcss"
                      id="outlined-basic"
                      label="Company Name"
                      value={experience.company}
                    />
                    <TextField
                      onChange={handleChange}
                      name="location"
                      className="modalexInputcss"
                      id="outlined-basic"
                      label="Company Location"
                      value={experience.location}
                    />

                    <input
                      type="date"
                      onChange={handleChange}
                      id="dateInput"
                      name="startDate"
                      pattern="\d{4}-\d{2}-\d{2}"
                      required
                      value={experience.startDate}
                    ></input>

                    <TextField
                      onChange={handleChange}
                      name="description"
                      className="modalexInputcss"
                      id="outlined-basic"
                      label="Description"
                      value={experience.description}
                    />

                    <Button
                      onClick={() => handleExperienceEdit(item)}
                      className="inputUpdateBtn"
                      variant="contained"
                    >
                      Update
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
}

export default ExperienceForm;
