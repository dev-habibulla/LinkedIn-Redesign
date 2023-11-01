import React, { useEffect, useState } from "react";
import Logo from "../assets/Logo.png";
import Cover from "../assets/cover.png";
import CoverLogo from "../assets/coverLogo.png";
import ProfilePic from "../assets/profile.jpg";
import Image from "./../components/Images";
import { Link } from "react-router-dom";
import { BsSend } from "react-icons/bs";
import { GoImage } from "react-icons/go";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logedUser } from "../slices/userSlice";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  update,
} from "firebase/database";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "40%",
  left: "40%",
  transform: "translate(-40%, -40%)",
  width: 650,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Feed = () => {
  const auth = getAuth();
  const db = getDatabase();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [userProfileInfo, setUserProfileInfo] = useState([]);
  let userInfo = useSelector((state) => state.logedUser.value);
  let [postList, setPostList] = useState([]);
  let [newPost, setNewPost] = useState("");
  let [postUpdate, setPostUpdate] = useState({
    post: "",
  });

  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleOpen = (item) => {
    setSelectedPost(item);
    setPostUpdate({
      post: item.post,
    });
    setOpen(true);
  };

  const handlePostUpdate = () => {
    if (selectedPost && postUpdate.post) {
      update(ref(db, `post/${selectedPost.postId}`), {
        post: postUpdate.post,
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
      setSelectedPost(null);
      setOpen(false);
    } else {
      toast.warn("Kindly Complete The Fields", {
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

  const handleClose = () => {
    setSelectedPost(null);
    setOpen(false);
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

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
  }, [db, userInfo]);

  useEffect(() => {
    const postRef = ref(db, "post");
    onValue(postRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), postId: item.key });
      });
      setPostList(arr);
    });
  }, [db]);

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

  let handleNewPost = (item) => {
    set(push(ref(db, "post")), {
      post: newPost,
      PosterUid: item.userUid,
      PosterName: item.username,
      PosterPic: item.profile_picture,
      PosterProfession: item.bio,
    });
    setNewPost("");
  };

  let handleDelete = (item) => {
    remove(ref(db, `post/${item.postId}`));
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
    setSelectedPost(null);
    setOpen(false);
  };

  return (
    <div className="feedPart">
      {userProfileInfo.map((item) => (
        <div className="feedLogo">
          <Image src={Logo} className="logoImg" />
          <div className="profileNAmePic">
            <Link to="/profile" className="profileNAmePic">
              <Image src={item.profile_picture} />
              <p>{item.username}</p>
            </Link>
          </div>
          <button onClick={handleLogout} className="feedBtn">
            Log Out
          </button>
        </div>
      ))}

      <div className="feedContent">
        <div className="feedContainer">
          {userProfileInfo.map((item) => (
            <>
              <div className="profileHighLight">
                <div className="profiledetailsRightSide">
                  <div className="rightCover">
                    <Image src={Cover} />
                  </div>
                  <div className="rightCoverContent">
                    <Image src={ProfilePic} className="rightProPic" />
                    <div className="rightCoverText">
                      <h4>{item.username}</h4>
                      <Image src={CoverLogo} className="rightCoverLogo" />
                    </div>
                    <p className="rightBioText">{item.bio}</p>
                  </div>
                </div>
              </div>

              <div className="newPost">
                <p>new post</p>
                <div className="postInputCss">
                  <textarea
                    onChange={(e) => setNewPost(e.target.value)}
                    className="textarea"
                    rows="1"
                    cols="76"
                    placeholder="What’s on your mind?"
                    value={newPost}
                  ></textarea>
                  <GoImage className="postUploadImg" />
                  <BsSend
                    onClick={() => handleNewPost(item)}
                    className="newPostBtn"
                  />
                </div>
              </div>
            </>
          ))}

          {postList.map((item) => (
            <>
              <Modal
                open={selectedPost === item}
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
                    Edit Your Post
                    <button
                      onClick={() => handleDelete(item)}
                      className="delPosttbtn"
                    >
                      Delete
                    </button>
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <textarea
                      rows="4"
                      cols="80"
                      onChange={(e) => setPostUpdate({ post: e.target.value })}
                      value={postUpdate.post}
                    ></textarea>
                    <button
                      onClick={handlePostUpdate}
                      className="updatePosttbtn"
                    >
                      Update
                    </button>
                  </Typography>
                </Box>
              </Modal>

              <div className="postBoxFeed">
                <div className="postEditDel">
                  {item.PosterUid == userInfo.uid ? (
                    <button
                      onClick={() => handleOpen(item)}
                      className="editPosttbtn"
                    >
                      Edit
                    </button>
                  ) : null}
                </div>
                <div className="postAdminInfo">
                  <Image src={item.PosterPic} className="profileImg" />
                  <div className="titleInfo">
                    <h4>{item.PosterName}</h4>
                    <p>{item.PosterProfession}</p>
                  </div>
                </div>
                <p className="postText">{item.post}</p>
                {/* <Image src={ProfilePic} /> */}
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
