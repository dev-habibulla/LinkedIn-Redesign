import React, { useEffect, useState } from "react";
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
  getDatabase,
  ref,
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
  const auth = getAuth();
  const db = getDatabase();
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

  let [profileUpdateFromData, setProfileUpdateFromData] = useState({
    name: "",
    location: "",
    bio: "",
    about: "",
  });

  let userInfo = useSelector((state) => state.logedUser.value);

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

  const handleChange = (e) => {
    setProfileUpdateFromData({
      ...profileUpdateFromData,
      [e.target.name]: e.target.value,
    });
  };

  let handleProfileUpdate = (item) => {
    update(ref(db, "users/" + item.userUid), {
      username: profileUpdateFromData.name,
      location: profileUpdateFromData.location,
      bio: profileUpdateFromData.bio,
      about: profileUpdateFromData.about,
    });

    setOpen(false);
  };

  return (
    <div className="profile">
      <div className="logo">
        <Image src={Logo} className="logoImg" />
        <Link to="/feed" className="feedLink">
          Feed
        </Link>
        <Link to="/message" className="feedLink">
          Message
        </Link>
        <button onClick={handleLogout} className="feedBtn">
          Log Out
        </button>
      </div>

      <div className="profileContent">
        <div className="cover">
          <Image src={Cover} />
          <button className="editCoverbtn">
            <BiEdit className="editicon" />
            Edit profile
          </button>
        </div>
        <div className="profileInfo">
          <div className="aboutPicContent">
            {userProfileInfo.map((item) => (
              <>
                <div className="profilePic">
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
