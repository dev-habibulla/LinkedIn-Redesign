import React, { useEffect, useState } from "react";
import Image from "./../components/Images";
import Logo from "../assets/Logo.png";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logedUser } from "../slices/userSlice";

const Registration = () => {
  const auth = getAuth();
  const db = getDatabase();
  let navigate = useNavigate();
  
  let userInfo = useSelector((state) => state.logedUser.value);


  useEffect(() => {
    if (userInfo) {
      navigate("/feed");
    }
  }, []);

  let [fromData, setFromData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  let [fullNameError, setFullNameError] = useState("");
  let [emailError, setEmailError] = useState("");
  let [passwordError, setPasswordError] = useState("");
  let [open, setOpen] = useState(false);
  let [btnLoad, setBtnLoad] = useState(false);

  let handleChange = (e) => {
    setFromData({
      ...fromData,
      [e.target.name]: e.target.value,
    });
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    // if (e.target.name == "fullName") {
    //   setFullNameError("")
    // }
    // if (e.target.name == "email") {
    //   setEmailError("")
    // }
    // if (e.target.name == "password") {
    //   setPasswordError("")
    // }
  };

  let handleRegistrastion = () => {
    if (!fromData.fullName) {
      setFullNameError("Full name Required");
    }
    if (!fromData.email) {
      setEmailError("Email Required");
    }
    if (!fromData.password) {
      setPasswordError("Password Required");
    }

    let emailPattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let passwordPattern =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (fromData.fullName && fromData.email && fromData.password) {
      if (fromData.fullName.length < 3) {
        setFullNameError("Full Name must be 3 characters or more");
      } else if (!emailPattern.test(fromData.email)) {
        setEmailError("Invalid email");
      } else if (!passwordPattern.test(fromData.password)) {
        setPasswordError(
          "Password must be at least 8 characters long and should include a combination of uppercase letters, lowercase letters, numbers, and symbols."
        );
      } else {
        setBtnLoad(true);

        createUserWithEmailAndPassword(auth, fromData.email, fromData.password)
          .then((user) => {
            updateProfile(auth.currentUser, {
              displayName: fromData.fullName,
              location: "",
              photoURL:
                "https://firebasestorage.googleapis.com/v0/b/chating-app-16608.appspot.com/o/profile.jpg?alt=media&token=91390ab6-6ce8-4918-a0f8-d5755f58d56b",
            }).then(() => {
              sendEmailVerification(auth.currentUser)
                .then(() => {
                  setFromData({
                    fullName: "",
                    email: "",
                    password: "",
                  });
                  setBtnLoad(false);
                  toast.success(
                    "Registration Successful Please Verify Your Email",
                    {
                      position: "bottom-center",
                      autoClose: 1000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    }
                  );
                  setTimeout(() => {
                    navigate("/login");
                  }, 1000);
                })
                .then(() => {
                  set(ref(db, "users/" + user.user.uid), {
                    userUid: user.user.uid,
                    username: fromData.fullName,
                    email: fromData.email,
                    location: "",
                    bio: "",
                    about: "",
                    profile_picture:
                      "https://firebasestorage.googleapis.com/v0/b/chating-app-16608.appspot.com/o/profile.jpg?alt=media&token=91390ab6-6ce8-4918-a0f8-d5755f58d56b",
                  });
                });
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode.includes("email")) {
              toast.error("Email Already exists!", {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            }
            setBtnLoad(false);
          });
      }
    }
  };

  return (
    <div className="registrationPage">
      <div className="text_container">
        <Image src={Logo} className="logo" />
        <h4>Get started with easily register</h4>
        <p>Free register and you can enjoy it</p>
        <TextField
          onChange={handleChange}
          name="email"
          className="inputcss"
          type="email"
          id="outlined-basic"
          label="Email Address"
          variant="outlined"
          value={fromData.email}
        />
        {emailError && (
          <Alert className="alert" variant="filled" severity="error">
            {" "}
            {emailError}{" "}
          </Alert>
        )}

        <TextField
          onChange={handleChange}
          name="fullName"
          className="inputcss"
          type="text"
          id="outlined-basic"
          label="Fulname"
          variant="outlined"
          value={fromData.fullName}
        />
        {fullNameError && (
          <Alert className="alert" variant="filled" severity="error">
            {" "}
            {fullNameError}{" "}
          </Alert>
        )}

        <TextField
          onChange={handleChange}
          name="password"
          className="inputcss"
          type={open ? "text" : "password"}
          id="outlined-basic"
          label="Password"
          variant="outlined"
          value={fromData.password}
        />

        {passwordError && (
          <Alert className="alert" variant="filled" severity="error">
            {" "}
            {passwordError}{" "}
          </Alert>
        )}
        {btnLoad ? (
          <Button variant="contained" className="regBtn">
            <RotatingLines
              strokeColor="white"
              strokeWidth="3"
              animationDuration="0.75"
              width="25"
              visible={true}
            />
          </Button>
        ) : (
          <Button
            onClick={handleRegistrastion}
            variant="contained"
            className="regBtn"
          >
            Sign up
          </Button>
        )}

        <p className="focusText">
          Alredy have an account ?
          <Link to="/login" className="focus">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
