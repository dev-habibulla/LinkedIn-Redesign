import React, { useEffect, useState } from "react";
import gimg from "../assets/grimg.png";
import Image from './Images';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const GroupList = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let userInfo = useSelector((state) => state.logedUser.value);
  const db = getDatabase();

  let [gName, setGname] = useState("");
  let [gTag, setGtag] = useState("");
  let [groupPic, setGroupPic] = useState("");
  let [groupList, setGroupList] = useState([]);
  let [gReqList, setGReqList] = useState([]);
  let [groupMemberList, setGroupMemberList] = useState([]);

  let handleGroupCreate = () => {
    set(push(ref(db, "group")), {
      groupName: gName,
      groupTag: gTag,
      groupPic: groupPic,
      adminUid: userInfo.uid,
      adminName: userInfo.displayName,
    }).then(() => {
      setOpen(false);
    });
  };

  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((iteam) => {
        if (iteam.val().adminUid != userInfo.uid) {
          arr.push({ ...iteam.val(), groupId: iteam.key });
        }
      });
      setGroupList(arr);
    });
  }, []);

  useEffect(() => {
    const groupRequestRef = ref(db, "groupRequest");
    onValue(groupRequestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((iteam) => {
        if (iteam.val().whoSenderID == userInfo.uid) {
          arr.push(iteam.val().whoSenderID + iteam.val().groupId);
        }
      });
      setGReqList(arr);
    });
  }, []);

  useEffect(() => {
    const groupsMemberRef = ref(db, "groupsMember");
    onValue(groupsMemberRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((gmiteam) => {
        // if (gmiteam.val().groupId == iteam.groupId) {
        //   arr.push({ ...gmiteam.val(), groupsMemberId: gmiteam.key });
        // }

        arr.push(gmiteam.val().whoSenderID + gmiteam.val().groupId);
      });
      setGroupMemberList(arr);
    });
  }, []);

  let handleGroupReqSend = (iteam) => {
    set(push(ref(db, "groupRequest")), {
      ...iteam,
      whoSenderName: userInfo.displayName,
      whoSenderID: userInfo.uid,
      whoSenderPicture: userInfo.photoURL,
    });
  };

  let handleGReqCancel = (iteam) => {
    const groupRequestRef = ref(db, "groupRequest");
    let groupRQId = "";
    onValue(groupRequestRef, (snapshot) => {
      snapshot.forEach((giteam) => {
        if (iteam.groupId == giteam.val().groupId) {
          groupRQId = giteam.key;
        }
        // console.log({ ...giteam.val(), groupRQId: giteam.key });
        // console.log(groupId , groupRQId: giteam.key );
      });

      remove(ref(db, "groupRequest/" + groupRQId));
    });
  };
  return (
    <div className="box">
      <h3>Groups List</h3>
      <Button className="grCreatebtn" onClick={handleOpen} variant="contained">
        Create Group
      </Button>
      {groupList.map((iteam) => (
        <div className="list">
          
          <Image src={gimg} className="req_profilepic" />
          <h4>{iteam.groupName}</h4>
          {gReqList.includes(userInfo.uid + iteam.groupId) ? (
            <div className="reqbtn">
              <Button className="reqlistDelbtn" variant="contained">
                pending
              </Button>
              <Button
                onClick={() => handleGReqCancel(iteam)}
                className="reqlistDelbtn"
                variant="contained"
              >
                Cancel
              </Button>
            </div>
          ) : groupMemberList.includes(userInfo.uid + iteam.groupId) ? (
            <Button className="joinedbtn" variant="contained">
              Joined
            </Button>
          ) : (
            <Button
              onClick={() => handleGroupReqSend(iteam)}
              className="reqGRSendbtn"
              variant="contained"
            >
              Join
            </Button>
          )}

          {/* <Button
              onClick={() => handleGroupReqSend(iteam)}
              className="listbtn"
              variant="contained"
            >
              Join
            </Button> */}
        </div>
      ))}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Group
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              onChange={(e) => setGname(e.target.value)}
              id="outlined-basic"
              label="Group Name"
              variant="outlined"
            />
            <br />
            <br />
            <TextField
              onChange={(e) => setGtag(e.target.value)}
              id="outlined-basic"
              label="Group Tag"
              variant="outlined"
            />
            <br />
            <br />
            <Button onClick={handleGroupCreate} variant="contained">
              Create
            </Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default GroupList;
