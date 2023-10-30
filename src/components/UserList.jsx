import React, { useEffect, useState } from "react";
import ProfilePic from "../assets/profile.jpg";
import Button from "@mui/material/Button";
import Image from "./Images";
import { userSlice } from "./../slices/userSlice";
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

const UserList = () => {
  const db = getDatabase();
  let [usersList, setUsersList] = useState([]);
  let [reqList, setReqList] = useState([]);
  let [friendList, setFriendList] = useState([]);
  let [blockList, setBlockList] = useState([]);

  let userInfo = useSelector((state) => state.logedUser.value);

  useEffect(() => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.key !== userInfo.uid) {
          arr.push({ ...item.val(), userId: item.key });
        }
      });
      setUsersList(arr);
    });
  }, []);


  useEffect(() => {
    const friendRequestRef = ref(db, "friendRequest");
    onValue(friendRequestRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((iteam) => {
        arr.push(iteam.val().whoReceverID + iteam.val().whoSenderID);
      
      });

      setReqList(arr);
    });
  }, []);


  useEffect(() => {
    const friendRef = ref(db, "friends");
    onValue(friendRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((iteam) => {
        arr.push(iteam.val().whoReceverID + iteam.val().whoSenderID);
        // arr.push({frid: iteam.key})
      });
      setFriendList(arr);
    });
  }, []);

  useEffect(() => {
    const blockRef = ref(db, "block");
    onValue(blockRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((iteam) => {
        arr.push(iteam.val().blockId + iteam.val().whoBlockerById);
      });
      setBlockList(arr);
    });
  }, []);

  let handleFriendRequestSend = (info) => {
    //     console.log("info",userInfo.uid,userInfo.displayName);
    // console.log(userInfo);
    //     setReqBtnLoad(true);

    set(push(ref(db, "friendRequest")), {
      whoSenderName: userInfo.displayName,
      whoSenderID: userInfo.uid,
      whoSenderPicture: userInfo.photoURL,
      whoReceverName: info.username,
      whoReceverID: info.userId,
      whoReceverPicture: info.profile_picture,
    })
  };

  let handleReqCancle = (item) => {
    const friendRequestRef = ref(db, "friendRequest");
    onValue(friendRequestRef, (snapshot) => {
      snapshot.forEach((fRQitem) => {
        if (
          fRQitem.val().whoSenderID === userInfo.uid &&
          fRQitem.val().whoReceverID === item.userId
        ) {
          
          const frRQId = fRQitem.key;
          remove(ref(db, "friendRequest/" + frRQId));
        }
      });
    });
  };


  return (
    <div className="box">
      <h3>User List</h3>
      {usersList.map((item) => (
        <div className="list">
          <Image src={item.profile_picture} className="profilepic" />
          <h4>{item.username}</h4>
  
          {reqList.includes(item.userId + userInfo.uid) ? (
            <Button
              onClick={() => handleReqCancle(item)}
              className="frlistbtn"
              variant="contained"
            >
              Cancel
            </Button>
          ) : reqList.includes(userInfo.uid + item.userId) ? (
            <Button className="frlistbtn" variant="contained" color="error">
              pending
            </Button>
          ) : friendList.includes(item.userId + userInfo.uid) ||
          friendList.includes(userInfo.uid + item.userId) ? (
            <Button className="frlistbtn" variant="contained" color="success">
              Friend
            </Button>
          ) : blockList.includes(item.userId + userInfo.uid) ||
          blockList.includes(userInfo.uid + item.userId) ? (
            <Button className="frlistbtn" variant="contained" color="error">
              Block
            </Button>
          ) : (
            <Button
              onClick={() => handleFriendRequestSend(item)}
              className="frlistbtn"
              variant="contained"
            >
              Add
            </Button>
          )}
        </div>
      ))}
    </div>
  );
  

};

export default UserList;
