import React, { useState } from "react";
import Image from "./../components/Images";
import Logo from "../assets/Logo.png";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logedUser } from "../slices/userSlice";

const Login = () => {
  const auth = getAuth();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [emailError, setEmailError] = useState("");
  let [passwordError, setPasswordError] = useState("");
  let [btnLoad, setBtnLoad] = useState(false);

  let userInfo = useSelector((state) => state.logedUser.value);

  let [fromData, setFromData] = useState({
    email: "",
    password: "",
  });

  let handleChange = (e) => {
    setFromData({
      ...fromData,
      [e.target.name]: e.target.value,
    });
    setEmailError("");
    setPasswordError("");
  };

  let handleLogin = () => {
    if (!fromData.email) {
      setEmailError("Email Required");
    }
    if (!fromData.password) {
      setPasswordError("Password Required");
    }
    if (fromData.email && fromData.password) {
      setBtnLoad(true)
      signInWithEmailAndPassword(auth, fromData.email, fromData.password)
        .then((user) => {
          // Signed in

          if (user.user.emailVerified) {
            toast.success("Login Successful", {
              position: "bottom-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setBtnLoad(false)
            setTimeout(() => {
              navigate("/feed");
              dispatch(logedUser(user.user));
              localStorage.setItem("user", JSON.stringify(user.user));
            }, 1000);
          } else {
            setBtnLoad(false)
            toast.error("Please Verify Your Email", {
              position: "bottom-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setLoad(false);
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setBtnLoad(false)
          if (errorCode.includes("invalid-login")) {
            toast.error("Invalid Email or Password", {
              position: "bottom-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
          setBtnLoad(false)
        });
    }
  };

  return (
    <div className="login">
      <div className="text_container">
        <Image src={Logo} className="logo" />
        <h4>Login</h4>
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
          name="password"
          className="inputcss"
          type="password"
          // type={open ? "text" : "password"}
          id="outlined-basic"
          label="Password"
          variant="outlined"
          value={fromData.password}
        />
        {passwordError && (
          <Alert className="alert" variant="filled" severity="error">
            {passwordError}
          </Alert>
        )}

        {btnLoad ? (
          <Button variant="contained" className="loginBtn">
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
            onClick={handleLogin}
            variant="contained"
            className="loginBtn"
          >
            Sign In
          </Button>
        )}

        <p>
          Don’t have an account ?{" "}
          <Link to="/" className="focus">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
