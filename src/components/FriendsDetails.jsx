import React from "react";
import ProfilePic from "../assets/profile.jpg";
import Button from "@mui/material/Button";
import Image from "./Images";
import Grid from "@mui/material/Grid";
import UserList from "./UserList";
import Friends from "./Friends";
import MyGroup from "./MyGroups";
import FriendRequest from "./FriendRequest"
import BlockedUsers from "./BlockUser"
import GroupList from "./GroupList"

const FriendsDetails = () => {
  return (
    <>
      <div className="frDetailsBox">
        <Friends />
        <UserList />
      </div>
      <div className="frDetailsBox">
        <FriendRequest />
        <BlockedUsers />
      </div>
      <div className="frDetailsBox">
        <GroupList />
        <MyGroup />
      </div>
    </>
  );
};

export default FriendsDetails;
