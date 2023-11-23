import React, { useEffect, useState } from "react";
import ProfilePic from "../assets/profile.jpg";
import Button from "@mui/material/Button";
import Image from "./Images";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  remove,
  update,
} from "firebase/database";
import { useSelector } from "react-redux";

const FriendRequest = () => {
  const db = getDatabase();
  let [frReqList, setFrReqList] = useState([]);

  let userInfo = useSelector((state) => state.logedUser.value);

  useEffect(() => {
    const friendRequestRef = ref(db, "friendRequest");
    onValue(friendRequestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().whoReceverID == userInfo.uid) {
          arr.push({ ...item.val(), frReqId: item.key });
        }
      });
      setFrReqList(arr);
    });
  }, []);

  let handleAccept = (item) => {
    set(push(ref(db, "friends")), {
      ...item,
    }).then(() => {
      remove(ref(db, "friendRequest/" + item.frReqId));
    });
  };
  let handleDelete = (item) => {
    remove(ref(db, "friendRequest/" + item.frReqId));
  };

  return (
    <div className="box">
      <h3>Friend Request</h3>
      {frReqList.map((item) => (
        <div className="list">
          <Image src={item.whoSenderPicture} className="profilepic" />
          <h4>{item.whoSenderName}</h4>
          <div className="reqbtn">
          <Button
            onClick={() => handleAccept(item)}
            className="reqAlistbtn"
            variant="contained"
          >
            Accept
          </Button>
          <Button
            onClick={() => handleDelete(item)}
            className="reqlistDelbtn"
            variant="contained"
            color="error"
          >
            Delete
          </Button>
          </div>
         
        </div>
      ))}
    </div>
  );
};

export default FriendRequest;
