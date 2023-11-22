import React, { useEffect, useState } from "react";
import gimg from "../assets/grimg.png";
// import Image from "./Image";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Image from './Images';
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

const MyGroups = () => {
  const [open, setOpen] = React.useState(false);
  const [memmberOpen, setMemmberOpen] = React.useState(false);
  const [gName, setGname] = useState("");
  const [groupsId, setGroupsId] = useState("");
  let [groupReqList, setGroupReqList] = useState([]);
  let [groupMemberList, setGroupMemberList] = useState([]);
  const handleOpen = (iteam) => {
    setGname(iteam.groupName);

    setGroupsId(iteam.groupId);
    const groupRef = ref(db, "groupRequest");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((giteam) => {
      
        if (
          userInfo.uid == giteam.val().adminUid &&
          iteam.groupId == giteam.val().groupId
        ) {
          arr.push({ ...giteam.val(), groupReqId: giteam.key });
        }
      });
      setGroupReqList(arr);
    });
    setOpen(true);
  };

  const handleMemberList = (iteam) => {
    setGname(iteam.groupName);

    const groupsMemberRef = ref(db, "groupsMember");
    onValue(groupsMemberRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((gmiteam) => {
        // if (
        //   gmiteam.val().groupId == iteam.groupId &&
        //   userInfo.uid == gmiteam.val().adminUid
        // )
        if (gmiteam.val().groupId == iteam.groupId) {
          arr.push({ ...gmiteam.val(), groupsMemberId: gmiteam.key });
          //arr.push(gmiteam.val());
        }
      });
      setGroupMemberList(arr);
    });
    setMemmberOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleMemberModalClose = () => setMemmberOpen(false);
  const db = getDatabase();
  let userInfo = useSelector((state) => state.logedUser.value);
  let [groupList, setGroupList] = useState([]);

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


  let handleGroupDel = (iteam) => {
    remove(ref(db, "group/" + iteam.groupId));
  };

  let handleAccept = (iteam) => {
    set(push(ref(db, "groupsMember")), {
      ...iteam,
      groupId: groupsId,
    }).then(() => {
      remove(ref(db, "groupRequest/" + iteam.groupReqId));
    });
  };

  let handleDelete = (iteam) => {
    remove(ref(db, "groupRequest/" + iteam.groupReqId));
  };
  let handleRemoveMember = (groupsMemberId) => {
    remove(ref(db, "groupsMember/" + groupsMemberId));
  };

  return (
    <div className="box">
      <h3>My Groups</h3>
      {groupList.map((iteam) => (
        <div className="list">
          <Image src={gimg} className="req_profilepic"/>
          <h4>{iteam.groupName}</h4>
          <div className="mygrBtnbox">
            <Button
              onClick={() => handleOpen(iteam)}
              className="reqAlistbtn"
              variant="contained"
            >
              request
            </Button>
            <Button
              onClick={() => handleMemberList(iteam)}
              className="reqAlistbtn"
              variant="contained"
            >
              Member
            </Button>
            <Button
              onClick={() => handleGroupDel(iteam)}
              className="greqlistDelbtn"
              variant="contained"
            >
              Delete
            </Button>
          </div>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                These People Want To Join {gName} Group
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  {groupReqList.map((iteam) => (
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                      <Image
                        src={iteam.whoSenderPicture}
                        className="req_GR_profilepic"
                      />
                      </ListItemAvatar>

                      <ListItemText className="groupReq"
                        primary={iteam.whoSenderName}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {iteam.whoSenderName}
                            </Typography>
                            {`  Want To Join ${gName} Group`}

                            <Button
                              onClick={() => handleAccept(iteam)}
                              className="reqAlistbtn"
                              variant="contained"
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleDelete(iteam)}
                              className="reqlistDelbtn"
                              variant="contained"
                            >
                              Delete
                            </Button>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Typography>
            </Box>
          </Modal>

          <Modal
            open={memmberOpen}
            onClose={handleMemberModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {gName} Group Member List
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {groupMemberList.map((iteam) => (
                  <div className="reqlist">
                    <div className="req_profilepic">
                      <Image
                        src={iteam.whoSenderPicture}
                        className="profilepic"
                      />
                    </div>
                    <h4>{iteam.whoSenderName}</h4>
                    <Button
                      onClick={() =>
                        handleRemoveMember(iteam.groupsMemberId, iteam)
                      }
                      className="frlistbtn"
                      variant="contained"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </Typography>
            </Box>
          </Modal>
        </div>
      ))}
    </div>
  );
};

export default MyGroups;
