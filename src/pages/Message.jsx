import React, { useEffect, useState } from "react";
import Logo from "../assets/Logo.png";
import Image from "../components/Images";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import GroupMessageList from "./../components/GroupMessageList";
import FriendMessegeList from "./../components/FriendMessegeList";
import Msg from "./../components/Msg";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  update,
} from "firebase/database";

const Message = () => {
  const db = getDatabase();
  const auth = getAuth();
  let [userProfileInfo, setUserProfileInfo] = useState([]);
  let userInfo = useSelector((state) => state.logedUser.value);
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

  return (
    <div>
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

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <GroupMessageList />
          <FriendMessegeList />
        </Grid>
        <Grid item xs={9}>
          <Msg />
        </Grid>
      </Grid>
    </div>
  );
};

export default Message;
