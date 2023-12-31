import React, { useEffect, useState } from "react";
import Logo from "../assets/Logo.png";
import Cover from "../assets/cover.png";
import CoverLogo from "../assets/coverLogo.png";
import ProfilePic from "../assets/profile.jpg";
import Image from "./../components/Images";
import { BsSend } from "react-icons/bs";
import { GoImage } from "react-icons/go";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logedUser } from "../slices/userSlice";
import { Link } from "react-router-dom";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  update,
} from "firebase/database";

import {
  getStorage,
  ref as imgref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { ColorRing } from "react-loader-spinner";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { IoSendSharp } from "react-icons/io5";

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
  const storage = getStorage();
  let [loader, setLoader] = useState(false);
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [userProfileInfo, setUserProfileInfo] = useState([]);
  let userInfo = useSelector((state) => state.logedUser.value);
  let [postList, setPostList] = useState([]);
  let [commentList, setCommentList] = useState([]);
  let [newPost, setNewPost] = useState("");
  let [imgUpload, setImgUpload] = useState("");
  let [inputComment, setInputComment] = useState("");
  let [postUpdate, setPostUpdate] = useState({
    post: "",
  });

  let [commentOpen, setCommentOpen] = useState(false);
  let [likedList, setLikedList] = useState([]);
  const getCommentCount = (postId) => {
    return commentList.filter((item) => item.postId === postId).length;
  };

  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleOpen = (item) => {
    setImgUpload(item.img); // Corrected line
    setOpen(true);
    setSelectedPost(item);
    setPostUpdate({
      post: item.post,
    });
  };

  const handlePostUpdate = () => {
    if (selectedPost && postUpdate.post) {
      update(ref(db, `post/${selectedPost.postId}`), {
        post: postUpdate.post,
        img: imgUpload,
      }).then(() => {
        setImgUpload("");
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

  useEffect(() => {
    const commentRef = ref(db, "comment");
    onValue(commentRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), commentId: item.key });
      });
      setCommentList(arr);
    });
  }, [db]);

  useEffect(() => {
    const likeRef = ref(db, "like");
    onValue(likeRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), likeId: item.key });
      });
      setLikedList(arr);
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

  let hangleImageUpload = (e) => {
    setLoader(true);
    const storageRef = imgref(storage, e.target.files[0].name + Date.now());

    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
      console.log("Uploaded a blob or file!");
      getDownloadURL(storageRef)
        .then((downloadURL) => {
          setImgUpload(downloadURL);
        })
        .then(() => {
          setLoader(false);
        });
    });
  };

  let handleNewPost = (item) => {
    if (newPost) {
      set(push(ref(db, "post")), {
        post: newPost,
        img: imgUpload,
        PosterUid: item.userUid,
        PosterName: item.username,
        PosterPic: item.profile_picture,
        PosterProfession: item.bio,
      });
      setNewPost("");
      setImgUpload("");
    } else {
      toast.error("Please Write Something", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
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

  let handleLike = (item) => {
    const likeRef = ref(db, "like");
    const isLiked = likedList.some(
      (like) => like.postId === item.postId && like.whoLikeId === userInfo.uid
    );

    if (!isLiked) {
      set(push(ref(db, "like")), {
        postId: item.postId,
        liked: 1,
        whoLikeId: userInfo.uid,
        whoLikeName: userInfo.displayName,
        whoLikePic: userInfo.photoURL,
      });
    } else {
      const likeToRemove = likedList.find(
        (like) => like.postId === item.postId && like.whoLikeId === userInfo.uid
      );
      if (likeToRemove) {
        remove(ref(db, `like/${likeToRemove.likeId}`));
      }
    }
  };

  let handleComments = (item) => {
    set(push(ref(db, "comment")), {
      postId: item.postId,
      comment: inputComment,
      whoCommentId: userInfo.uid,
      whoCommentName: userInfo.displayName,
      whoCommentPic: userInfo.photoURL,
    }).then(() => {
      setInputComment("");
    });
    // console.log({
    //   postId: item.postId,
    //   comment: inputComment,
    //   whoCommentId:userInfo.uid,
    //   whoCommentName:userInfo.displayName,
    //   whoCommentPic:userInfo.photoURL,
    // });
  };

  return (
    <div className="feedPart">
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
                  <label>
                    <input type="file" hidden onChange={hangleImageUpload} />
                    <GoImage className="postUploadImg" />
                  </label>

                  {loader ? (
                    <button className="loaderr">
                      <ColorRing
                        visible={true}
                        height="40"
                        width="40"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        colors={[
                          "#e15b64",
                          "#f47e60",
                          "#f8b26a",
                          "#abbd81",
                          "#849b87",
                        ]}
                      />
                    </button>
                  ) : (
                    <BsSend
                      onClick={() => handleNewPost(item)}
                      className="newPostBtn"
                    />
                  )}
                </div>
              </div>
            </>
          ))}

          {postList.map(
            (item) =>
              item.post && (
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
                          onChange={(e) =>
                            setPostUpdate({ post: e.target.value })
                          }
                          value={postUpdate.post}
                        ></textarea>
                        <label>
                          <input
                            type="file"
                            hidden
                            onChange={hangleImageUpload}
                          />
                          <GoImage className="updateUploadImg" />
                        </label>

                        {loader ? (
                          <button className="loaderr">
                            <ColorRing
                              visible={true}
                              height="40"
                              width="40"
                              ariaLabel="blocks-loading"
                              wrapperStyle={{}}
                              wrapperClass="blocks-wrapper"
                              colors={[
                                "#e15b64",
                                "#f47e60",
                                "#f8b26a",
                                "#abbd81",
                                "#849b87",
                              ]}
                            />
                          </button>
                        ) : (
                          <button
                            onClick={handlePostUpdate}
                            className="updatePosttbtn"
                          >
                            Update
                          </button>
                        )}
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

                    <div className="postImageBox">
                      {item.img && <Image src={item.img} className="postImg" />}
                    </div>

                    <div className="likeComents">
                      <div className="likes">
                        {likedList.some(
                          (like) =>
                            like.postId === item.postId &&
                            like.whoLikeId === userInfo.uid
                        ) ? (
                          <AiFillLike
                            onClick={() => handleLike(item)}
                            className="likedd"
                          />
                        ) : (
                          <AiOutlineLike onClick={() => handleLike(item)} />
                        )}
                        <p className="likeCount">
                          {
                            likedList.filter(
                              (like) => like.postId === item.postId
                            ).length
                          }
                        </p>
                        <p>Likes</p>
                      </div>

                      <div
                        onClick={() =>
                          setCommentOpen((prevValue) => !prevValue)
                        }
                        className="Coments"
                      >
                        <FaRegComment />
                        <p className="commentCount">
                          {getCommentCount(item.postId)}
                        </p>
                        <p>Comments</p>
                      </div>
                    </div>

                    {commentOpen && (
                      <>
                        {commentList.map(
                          (citem) =>
                            citem.postId == item.postId && (
                              <div className="showComent">
                                <Image src={citem.whoCommentPic} />
                                <div className="comentsBox">
                                  <h4>{citem.whoCommentName}</h4>
                                  <p>{citem.comment}</p>
                                </div>
                              </div>
                            )
                        )}
                        <div className="inputComents">
                          <input
                            onChange={(e) => setInputComment(e.target.value)}
                            className="inputComment"
                            type="text"
                            value={inputComment}
                          />
                          <IoSendSharp
                            onClick={() => handleComments(item)}
                            className="submitComentbtn"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
