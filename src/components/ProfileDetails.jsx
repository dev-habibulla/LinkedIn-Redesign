import React, { useEffect, useState } from "react";
import Image from "./Images";
import ProjectImg1 from "../assets/projectPicOne.png";
import ProjectImg2 from "../assets/projectPicTwo.png";
import ProjectImg3 from "../assets/projectPicthree.png";
import ExperinceLogo from "../assets/explogo.png";
import EduLogo from "../assets/eduLogo.png";
import { useDispatch, useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  onValue,
  child,
  push,
  update,
} from "firebase/database";
import ExperienceForm from "./Expreance";
import Educations from "./Educations";

const ProfileDetails = () => {
  const db = getDatabase();
  let [userProfileInfo, setUserProfileInfo] = useState([]);
  let userInfo = useSelector((state) => state.logedUser.value);
  let [experienceList, setExperienceList] = useState([]);

  useEffect(() => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.key == userInfo.uid) {
          arr.push(item.val());
        }
      });
      setUserProfileInfo(arr);
    });
  }, []);

  useEffect(() => {
    const experienceListRef = ref(db, "experienceList");
    onValue(experienceListRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().uid == userInfo.uid) {
          arr.push({ ...item.val(), experienceId: item.key });
        }
      });
      setExperienceList(arr);
    });
  }, []);

  // let handleExperienceEdit = (item) => {
  //   console.log("aci",item.experienceId);
  //  }

  return (
    <div className="ProfileDetailsContain">
      <div className="aboutPart">
        <h3>About</h3>
        {userProfileInfo.map((item) => (
          <p>{item.about}</p>
        ))}

        <button className="seeMorebtn">See more</button>
      </div>
      <div className="projectsPart">
        <div className="projectTile">
          <div className="innerTextPro">
            <h4>Projects</h4>
            <p>3 of 12</p>
          </div>
          <button className="editprojectsbtn">Edit</button>
        </div>
        <div className="projectImages">
          <Image src={ProjectImg1} className="projectImg" />
          <Image src={ProjectImg2} className="projectImg" />
          <Image src={ProjectImg3} className="projectImg" />
        </div>
      </div>

      <ExperienceForm />
      <Educations />
    </div>
  );
};

export default ProfileDetails;
