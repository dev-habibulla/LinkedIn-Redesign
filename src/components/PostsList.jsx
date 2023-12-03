import React, { useEffect, useState } from "react";
import Image from "./Images";
import ProfilePic from "../assets/profile.jpg";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

const PostsList = () => {
  const db = getDatabase();
  const [open, setOpen] = useState(false);
  const handleOpen = (item) => {
    setOpen(true);
    setPostUpdate({
      post: item.post,
    });
  };
  const handleClose = () => setOpen(false);

  let userInfo = useSelector((state) => state.logedUser.value);
  let [postList, setPostList] = useState([]);
  let [postUpdate, setPostUpdate] = useState({
    post: "",
  });

  useEffect(() => {
    const postRef = ref(db, "post");
    onValue(postRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().PosterUid == userInfo.uid) {
          arr.push({ ...item.val(), postId: item.key });
        }
      });
      setPostList(arr);
    });
  }, []);

  let handleChange = (e) => {
    setPostUpdate({
      ...postUpdate,
      [e.target.name]: e.target.value,
    });
  };

  let handlePostUpdate = (item) => {
    if (postUpdate.post) {
      update(ref(db, "post/" + item.postId), {
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

  let handleDelete = (item) => {
    remove(ref(db, "post/" + item.postId));
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
      {postList.map((item) => (
        <>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
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
                  onChange={handleChange}
                  name="post"
                  value={postUpdate.post}
                ></textarea>
                <button
                  onClick={() => handlePostUpdate(item)}
                  className="updatePosttbtn"
                >
                  Update
                </button>
              </Typography>
            </Box>
          </Modal>

          <div className="postBoxFeed">
            <div className="postEditDel">
              <button onClick={() => handleOpen(item)} className="editPosttbtn">
                Edit
              </button>
            </div>
            <div className="postAdminInfo">
              <Image src={item.PosterPic} className="profileImg" />
              <div className="titleInfo">
                <h4>{item.PosterName}</h4>
                <p>{item.PosterProfession}</p>
              </div>
            </div>
            <p className="postText">{item.post}</p>
            <div className="postImageBox">
              {item.img && <Image src={item.img} className="postImg" />}
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default PostsList;
