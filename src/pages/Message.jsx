import React from "react";
import Logo from "../assets/Logo.png";
import Image from "../components/Images";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import GroupMessageList from './../components/GroupMessageList';
import FriendMessegeList from './../components/FriendMessegeList';
import Msg from './../components/Msg';



const Message = () => {
  return (
    <div>
      <div className="logo">
        <Image src={Logo} className="logoImg" />
        <Link to="/feed" className="feedLink">
          Feed
        </Link>
        <Link to="/message" className="feedLink">
          Message
        </Link>
        <button
          //  onClick={handleLogout}
          className="feedBtn"
        >
          Log Out
        </button>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={3}>
     
      <GroupMessageList/>
      <FriendMessegeList/>
      
        </Grid>
        <Grid item xs={9}>
        <Msg/>
        </Grid>
      </Grid>


    </div>
  );
};

export default Message;
