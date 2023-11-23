import React, { useEffect, useState } from "react";
import gimg from "../assets/grimg.png";
import Image from "./Images";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { activeChat } from "../slices/activeChatSlice";

import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";

const GroupMessageList = () => {

    const db = getDatabase();
  let dispatch = useDispatch();
  let userInfo = useSelector((state) => state.logedUser.value);
  let activeInfo = useSelector((state) => state.activeChat.value);
  let [groupList, setGroupList] = useState([]);
  let [groupssList, setGroupsssList] = useState([]);
  let [groupMemberList, setGroupMemberList] = useState([]);

  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((iteam) => {
        if (iteam.val().adminUid == userInfo.uid) {
          arr.push({ ...iteam.val(), groupId: iteam.key });
        }
      });
      setGroupList(arr);
    });
  }, []);

  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((iteam) => {
        if (iteam.val().adminUid != userInfo.uid) {
          arr.push({ ...iteam.val(), groupId: iteam.key });
        }
      });
      setGroupsssList(arr);
      console.log("setGroupsssList", arr);
    });
  }, []);

  useEffect(() => {
    const groupsMemberRef = ref(db, "groupsMember");
    onValue(groupsMemberRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((gmiteam) => {
        arr.push(gmiteam.val().whoSenderID + gmiteam.val().groupId);
      });
      setGroupMemberList(arr);
    });
  }, []);

  let handleActiveChat = (iteam) => {
    if (userInfo.uid == iteam.whoSenderID) {
      dispatch(
        activeChat({
          type: "group",
          activeUid: iteam.groupId,
          activeName: iteam.groupName,
          // activePic: iteam.groupPic,
          activePic: gimg,
        })
      );
    } else {
      dispatch(
        activeChat({
          type: "group",
          activeUid: iteam.groupId,
          activeName: iteam.groupName,
          // activePic: iteam.groupPic,
          activePic: gimg,
        })
      );
    }
  };


  return (
    <div className="box">
    <h3>Groups</h3>
    {groupList.map((iteam) => (
      <div
        className="list"
        key={iteam.groupName}
        onClick={() => handleActiveChat(iteam)}
      >
        <Image src={gimg} className="req_profilepic" />
        <h4>{iteam.groupName}</h4>
      </div>
    ))}
    {groupssList.map((giteam) =>
      groupMemberList.includes(userInfo.uid + giteam.groupId) ? (
        <div
          className="list"
          key={giteam.groupName}
          onClick={() => handleActiveChat(giteam)}
        >
          <Image src={gimg} className="req_profilepic" />
          <h4>{giteam.groupName}</h4>
        </div>
      ) : null
    )}
  </div>
  )
}

export default GroupMessageList