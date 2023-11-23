import React, { useEffect, useState } from "react";
import Image from "./Images";
import Button from "@mui/material/Button";
import { activeChat } from "../slices/activeChatSlice";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";

const FriendMessegeList = () => {
    const db = getDatabase();
    let userInfo = useSelector((state) => state.logedUser.value);
    let [frList, setFRList] = useState([]);
    let [blockList, setBlockList] = useState([]);
    let dispatch = useDispatch();
  
    useEffect(() => {
      const friendstRef = ref(db, "friends");
      onValue(friendstRef, (snapshot) => {
        let arr = [];
        snapshot.forEach((iteam) => {
          if (
            iteam.val().whoSenderID == userInfo.uid ||
            iteam.val().whoReceverID == userInfo.uid
          ) {
            arr.push({ ...iteam.val(), fid: iteam.key });
          }
        });
        setFRList(arr);
      });
    }, []);
  
    useEffect(() => {
      const blockRef = ref(db, "block");
      onValue(blockRef, (snapshot) => {
        let arr = [];
        snapshot.forEach((iteam) => {
          arr.push({ ...iteam.val(), bid: iteam.key });
        });
        setBlockList(arr);
      });
    }, []);
  
    let handleActiveChat = (iteam) => {
      if (userInfo.uid == iteam.whoSenderID) {
        dispatch(
          activeChat({
            type: "single",
            activeUid: iteam.whoReceverID,
            // wheSendSms:iteam.whoBlockerById,
            activeName: iteam.whoReceverName,
            activePic: iteam.whoReceverPicture,
          })
        );
      } else {
        dispatch(
          activeChat({
            type: "single",
            activeUid: iteam.whoSenderID,
            activeName: iteam.whoSenderName,
            activePic: iteam.whoSenderPicture,
          })
        );
      }
    };
  
  
    let handleblockActiveChat = (iteam) => {
     
      if (iteam.whoBlockerById == userInfo.uid) {
        dispatch(
          activeChat({
            type: "single",
            activeUid: iteam.blockId,
            activeName: iteam.blockName,
            activePic: iteam.blockPic,
          })
        );
      } else {
        dispatch(
          activeChat({
            type: "single",
            activeUid: iteam.whoBlockerById,
            activeName: iteam.whoBlockedByName,
            activePic: iteam.whoBlockedBypic,
          })
        );
      }
    }
  
  return (
    <div className="box">
      <h3>Friends</h3>
      {frList.map((iteam, index) => (
        <div className="list" onClick={() => handleActiveChat(iteam)}>
          <Image
            src={
              iteam.whoSenderID == userInfo.uid
                ? iteam.whoReceverPicture
                : iteam.whoSenderPicture
            }
            className="profilepic"
          />
          <h4>
            {iteam.whoSenderID == userInfo.uid
              ? iteam.whoReceverName
              : iteam.whoSenderName}
          </h4>
        </div>
      ))}

      {blockList.map((iteam) => (
        <div className="list" onClick={() => handleblockActiveChat(iteam)}>
          <Image
            src={
              iteam.whoBlockerById == userInfo.uid
                ? iteam.blockPic
                : iteam.whoBlockedBypic
            }
            className="profilepic"
          />
          <h4>
            {iteam.whoBlockerById == userInfo.uid
              ? iteam.blockName
              : iteam.whoBlockedByName}
          </h4>
        </div>
      ))}
    </div>
  
  )
}

export default FriendMessegeList