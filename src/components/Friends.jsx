import React, { useEffect, useState } from "react";
import ProfilePic from "../assets/profile.jpg";
import Button from "@mui/material/Button";
import Image from "./Images";
import { useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";

const Friends = () => {
  const db = getDatabase();
  let userInfo = useSelector((state) => state.logedUser.value);
  let [frList, setFRList] = useState([]);

  useEffect(() => {
    const friendstRef = ref(db, "friends");
    onValue(friendstRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((iteam) => {
        if (
          iteam.val().whoSenderID == userInfo.uid ||
          iteam.val().whoReceverID == userInfo.uid
        ) {
          arr.push({ ...iteam.val(), frid: iteam.key });
        }
      });
      setFRList(arr);
    });
  }, []);

  let handleBlock = (iteam) => {
    if (userInfo.uid == iteam.whoSenderID) {
      set(push(ref(db, "block")), {
        blockId: iteam.whoReceverID,
        blockName: iteam.whoReceverName,
        blockPic: iteam.whoReceverPicture,
        whoBlockerById: iteam.whoSenderID,
        whoBlockedByName: iteam.whoSenderName,
        whoBlockedBypic: iteam.whoSenderPicture,
      }).then(() => {
        remove(ref(db, "friends/" + iteam.frid));
      });
    } else {
      set(push(ref(db, "block")), {
        blockId: iteam.whoSenderID,
        blockName: iteam.whoSenderName,
        blockPic: iteam.whoSenderPicture,
        whoBlockerById: iteam.whoReceverID,
        whoBlockedByName: iteam.whoReceverName,
        whoBlockedBypic: iteam.whoReceverPicture,
      }).then(() => {
        remove(ref(db, "friends/" + iteam.frid));
      });
    }
  };

  return (
    <div className="box">
      <h3>Friends</h3>
      {frList.map((item) => (
        <div className="list">
          <Image
            src={
              item.whoSenderID == userInfo.uid
                ? item.whoReceverPicture
                : item.whoSenderPicture
            }
            className="profilepic"
          />
          <h4>
            {item.whoSenderID == userInfo.uid
              ? item.whoReceverName
              : item.whoSenderName}
          </h4>
          <Button
            onClick={() => handleBlock(item)}
            className="frlistbtn"
            variant="contained"
            color="error"
          >
            Block
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Friends;
