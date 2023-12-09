import React, { useState, useRef, useEffect, createRef } from "react";
import Logo from "../assets/Logo.png";
import Cover from "../assets/cover.png";
import ProfilePic from "../assets/profile.jpg";
import CoverLogo from "../assets/coverLogo.png";
import Image from "./../components/Images";
import Button from "@mui/material/Button";
import { BiEdit } from "react-icons/bi";
import { FaLocationArrow } from "react-icons/fa";
import PostsList from "../components/PostsList";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logedUser } from "../slices/userSlice";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import {
  getStorage,
  ref as storef,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

import {
  getDatabase,
  ref,
  // ref as secondref,
  set,
  onValue,
  child,
  push,
  update,
} from "firebase/database";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ProfileDetails from "./../components/ProfileDetails";
import FriendsDetails from "./../components/FriendsDetails";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const style = {
  position: "absolute",
  top: "40%",
  left: "40%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Profile = () => {
  let userInfo = useSelector((state) => state.logedUser.value);
  const auth = getAuth();
  const db = getDatabase();
  const storage = getStorage();
  const storageRef = storef(storage, userInfo.uid);
  const storageCoverRef = storef(storage, userInfo.uid + 1);
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [showProfile, setShowProfile] = useState(true);
  let [showFriendsDetails, setShowFriendsDetails] = useState(false);
  let [showPostLists, setShowPostLists] = useState(false);
  let [activeTab, setActiveTab] = useState("profile");
  let [userProfileInfo, setUserProfileInfo] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = (item) => {
    setOpen(true);
    setProfileUpdateFromData({
      name: item.username,
      location: item.location,
      bio: item.bio,
      about: item.about,
    });
  };
  const handleClose = () => setOpen(false);

  const [imgOpen, setImgOpen] = React.useState(false);
  const handleprofifleImgOpen = () => setImgOpen(true);
  const handleProfifleImgClose = () => setImgOpen(false);

  const [coverOpen, setCoverOpen] = React.useState(false);
  const handleCoverPicOpen = () => setCoverOpen(true);
  const handleCoverClose = () => setCoverOpen(false);

  const defaultSrc =
    "https://firebasestorage.googleapis.com/v0/b/linkedin-redesign-ae4ef.appspot.com/o/Screenshot_4.png1700151365336?alt=media&token=db7ba60c-a591-47c3-a8ce-a2b72612b3fd";

  const [image, setImage] = useState(defaultSrc);
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();

  let [profileUpdateFromData, setProfileUpdateFromData] = useState({
    name: "",
    location: "",
    bio: "",
    about: "",
  });

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, []);

  let handleProfileDetails = () => {
    setActiveTab("profile");
    setShowProfile(true);
    setShowPostLists(false);
    setShowFriendsDetails(false);
  };

  let handleFriendsDetails = () => {
    setActiveTab("friends");
    setShowProfile(false);
    setShowPostLists(false);
    setShowFriendsDetails(true);
  };

  let handlePostList = () => {
    setActiveTab("posts");
    setShowProfile(false);
    setShowPostLists(true);
    setShowFriendsDetails(false);
  };

  useEffect(() => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.key == userInfo.uid) {
          arr.push(item.val());
        }
      });
      setUserProfileInfo(arr);
    });
  }, []);

  let handleLogout = () => {
    signOut(auth).then(() => {
      toast.success("Sign-out successful", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        dispatch(logedUser(null));
        localStorage.removeItem("user");
        navigate("/login");
      }, 1000);
    });
  };

  let handleChange = (e) => {
    setProfileUpdateFromData({
      ...profileUpdateFromData,
      [e.target.name]: e.target.value,
    });
  };

  let handleProfileUpdate = (item) => {
    update(ref(db, "users/" + userInfo.uid), {
      username: profileUpdateFromData.name,
      location: profileUpdateFromData.location,
      bio: profileUpdateFromData.bio,
      about: profileUpdateFromData.about,
    }).then(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userInfo,
          username: profileUpdateFromData.name,
          location: profileUpdateFromData.location,
          bio: profileUpdateFromData.bio,
          about: profileUpdateFromData.about,
        })
      );
      dispatch(
        logedUser({
          ...userInfo,
          username: profileUpdateFromData.name,
          location: profileUpdateFromData.location,
          bio: profileUpdateFromData.bio,
          about: profileUpdateFromData.about,
        })
      );
    });

    setOpen(false);
  };

  let onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());

      // Data URL string
      const message2 = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(storageRef, message2, "data_url").then((snapshot) => {
        console.log("Uploaded a data_url string!");
      });

      uploadString(storageRef, message2, "data_url").then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          set(ref(db, "users/" + userInfo.uid), {
            username: userInfo.displayName,
            email: userInfo.email,
            location: userInfo.location,
            bio: userInfo.bio,
            about: userInfo.about,
            coverPic: userInfo.coverPic,
            profile_picture: downloadURL,
          }).then(() => {
            console.log("done");
            localStorage.setItem(
              "user",
              JSON.stringify({ ...userInfo, photoURL: downloadURL })
            );
            dispatch(logedUser({ ...userInfo, photoURL: downloadURL }));
            setImgOpen(false);
          });
        });
      });
    }
  };

  const getCoverCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());

      // Data URL string
      const message2 = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(storageCoverRef, message2, "data_url").then((snapshot) => {
        console.log("Uploaded a data_url string!");
      });

      uploadString(storageCoverRef, message2, "data_url").then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          set(ref(db, "users/" + userInfo.uid), {
            username: userInfo.displayName,
            email: userInfo.email,
            location: userInfo.location,
            bio: userInfo.bio,
            about: userInfo.about,
            profile_picture: userInfo.photoURL,
            coverPic: downloadURL,
          }).then(() => {
            console.log("done");
            localStorage.setItem(
              "user",
              JSON.stringify({ ...userInfo, coverPic: downloadURL })
            );
            dispatch(logedUser({ ...userInfo, coverPic: downloadURL }));
            setCoverOpen(false);
          });
        });
      });
    }
  };

  let handleCropData = () => {
    getCropData();
  };
  let handleCoverCropData = () => {
    console.log("aci");
    getCoverCropData();
  };

  return (
    <div className="profile">
      {userProfileInfo.map((item) => (
        <div className="feedLogo">
          <Image src={Logo} className="logoImg" />

          <div>
            <Link to="/feed" className="feedLink">
              Home
            </Link>
            <Link to="/profile" className="feedLink">
              Profile
            </Link>
            <Link to="/message" className="feedLink">
              Message
            </Link>
          </div>

          <div className="profileNAmePic">
            <Link to="/profile" className="profileNAmePic">
              <Image src={item.profile_picture} />
              <p>{item.username}</p>
            </Link>
            <button onClick={handleLogout} className="feedBtn">
              Log Out
            </button>
          </div>
        </div>
      ))}

      <div className="profileContent">
        <div className="cover">
          <Image src={userInfo.coverPic} />
          <button onClick={handleCoverPicOpen} className="editCoverbtn">
            <BiEdit className="editicon" />
            Update Cover
          </button>

          <Modal
            open={coverOpen}
            onClose={handleCoverClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <input type="file" onChange={onChange} />
                <Cropper
                  ref={cropperRef}
                  style={{ height: 400, width: "100%" }}
                  zoomTo={0.5}
                  initialAspectRatio={1}
                  preview=".img-preview"
                  src={image}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  guides={true}
                />

                <Button onClick={handleCoverCropData}>Update</Button>
              </Typography>
            </Box>
          </Modal>
        </div>
        <div className="profileInfo">
          <div className="aboutPicContent">
            {userProfileInfo.map((item) => (
              <>
                <Modal
                  open={imgOpen}
                  onClose={handleProfifleImgClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                       <h4 className="previewText"> profile picture preview</h4>
            <div className="img-preview" />
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      <input type="file" onChange={onChange} />
                      <Cropper
                        ref={cropperRef}
                        style={{ height: 400, width: "100%" }}
                        zoomTo={0.5}
                        initialAspectRatio={1}
                        preview=".img-preview"
                        src={image}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        guides={true}
                      />

                      <Button onClick={handleCropData}>Update</Button>
                    </Typography>
                  </Box>
                </Modal>

                <div onClick={handleprofifleImgOpen} className="profilePic">
                  <Image src={item.profile_picture} />
                </div>
                <div className="profileNameAbout">
                  <button
                    onClick={() => handleOpen(item)}
                    className="editInfotbtn"
                  >
                    Edit info
                  </button>

                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        Edit Profile Info
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div className="updateEdittest">
                          <TextField
                            onChange={handleChange}
                            name="name"
                            className="modalinputcss"
                            id="outlined-basic"
                            label="Full Name"
                            value={profileUpdateFromData.name}
                          />
                          <TextField
                            onChange={handleChange}
                            name="location"
                            className="modalinputcss"
                            id="outlined-basic"
                            label="Location"
                            value={profileUpdateFromData.location}
                          />
                          <TextField
                            onChange={handleChange}
                            className="modalinputcss"
                            id="outlined-basic"
                            label="Profession"
                            variant="outlined"
                            name="bio"
                            value={profileUpdateFromData.bio}
                          />
                          <TextField
                            onChange={handleChange}
                            className="modalinputcss"
                            id="outlined-basic"
                            label="About"
                            variant="outlined"
                            name="about"
                            value={profileUpdateFromData.about}
                          />

                          <Button
                            onClick={() => handleProfileUpdate(item)}
                            className="inputUpdateBtn"
                            variant="contained"
                          >
                            Update
                          </Button>
                        </div>
                      </Typography>
                    </Box>
                  </Modal>

                  <div className="namelocation">
                    <Grid className="namelocation" container spacing={2}>
                      <Grid item xs={7}>
                        <div className="nameIcon">
                          <h4 className="profileName">{item.username}</h4>
                          <Image src={CoverLogo} className="coverproLogo" />
                        </div>
                      </Grid>
                      <Grid item xs={5}>
                        <p>
                          {item.location && (
                            <>
                              <FaLocationArrow className="locaIcon" />
                              {item.location}
                            </>
                          )}
                        </p>
                      </Grid>
                    </Grid>
                  </div>

                  <p>{item.bio}</p>
                  <button className="contactbtn">Contact info</button>
                </div>
              </>
            ))}
          </div>
        </div>
        <div className="menuTab">
          <button
            onClick={handleProfileDetails}
            type="button"
            className={`profileBtn ${activeTab === "profile" ? "active" : ""}`}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={handleFriendsDetails}
            className={`friends ${activeTab === "friends" ? "active" : ""}`}
          >
            Friends
          </button>
          <button
            onClick={handlePostList}
            type="button"
            className={`post ${activeTab === "posts" ? "active" : ""}`}
          >
            Post
          </button>

          <div className="profileDetails">
            {showProfile && <ProfileDetails />}
          </div>
          <div className="friendsDetails">
            {showFriendsDetails && <FriendsDetails />}
          </div>
          <div className="postsList">{showPostLists && <PostsList />}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
