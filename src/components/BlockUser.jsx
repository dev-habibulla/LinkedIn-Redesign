import React, { useEffect, useState } from "react";
import ProfilePic from "../assets/profile.jpg";
import Button from "@mui/material/Button";
import Image from "./Images";
import { useDispatch, useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";

const BlockedUsers = () => {
  const db = getDatabase();
  let userInfo = useSelector((state) => state.logedUser.value);
  let [blockList, setBlockList] = useState([]);

  useEffect(() => {
    const blockRef = ref(db, "block");
    onValue(blockRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), bid: item.key });
      });
      setBlockList(arr);
    });
  }, []);

  let handleUnblockUser = (item) => {
    remove(ref(db, "block/" + item.bid));
  };

  return (
    <div className="box">
      <h3>Blocked Users</h3>
      {blockList.map((item) =>
        item.whoBlockerById == userInfo.uid ? (
          <div className="list">
            <Image src={item.blockPic} className="profilepic" />
            <h4>{item.blockName}</h4>
            <Button
              onClick={() => handleUnblockUser(item)}
              className="frlistbtn"
              variant="contained"
            >
              Unblock
            </Button>
          </div>
        ) : item.blockId == userInfo.uid ? (
          <div className="list">
            <Image src={item.whoBlockedBypic} className="profilepic" />
            <h4>{item.whoBlockedByName}</h4>
          </div>
        ) : null
      )}
    </div>
  );
};

export default BlockedUsers;
