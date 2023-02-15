import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignUpNavBar from "../../components/SignUpNavBar";
// import MainPageNavBar from "../../components/MainPageNavBar";
import googleOAuthIcon from "../../images/google-logo-oauth.png";
import facebookOauthIcon from "../../images/facebook-logo-oauth.png";
import signInPageCollageImg from "../../images/PicPocket-SignIn-Collage2.png";

const SignUpPage = ({ curUser, loggedIn }) => {
  let navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    signedIn: false,
  });

  let newUser = {
    username: form.username,
    password: form.password,
    email: form.email,
    signedIn: false,
  }; //blank newUser

  function onChangeName(event) {
    //when name input changes,pass a para to be the event object then assign target.value to name. event parameter is always first parameter passed in a function called by an event.
    newUser.username = event.target.value;
  }

  function onChangePW(event) {
    newUser.password = event.target.value;
  }

  function onChangeEmail(event) {
    newUser.email = event.target.value;
  }

  async function onSubmit(e) {
    e.preventDefault();
    console.log("submitted");

    setForm(newUser);

    if (newUser.username.length === 0) {
      window.alert("Name is blank. Sign up failed.");
    } else if (newUser.password.length === 0) {
      window.alert("Password is blank. Sign up failed.");
    } else {
      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newUser),
      })
        .then((response) => {
          if (response.status === 500) {
            //if already signed in
            let yesOrNo = window.confirm(
              `This will sign you out of your account, ${curUser}. Are you sure you want to continue signing up as ${newUser.username}?`
            );
            console.log(yesOrNo);
            if (yesOrNo) {
              console.log("yes");
              fetch("http://localhost:5000/users", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                  username: newUser.username,
                  password: newUser.password,
                  signedIn: false,
                  try: "2",
                }),
              }).then(() => {
                navigate(`/SignUp/${newUser.username}/Success`);
              });
            } else {
              console.log("no");
            }
          } else if (response.ok) {
            //if user is new
            navigate(`/SignUp/${newUser.username}/Success`);
          }
        })
        .catch(() => {
          window.alert("Username already exists. Sign up failed.");
        }); //if sign up fails

      console.log(newUser);
    }
  }

  return (
    <div className="sign-in-page__container">
      <div className="signInPage--contentsContainer">
        <div className="signInPage--formContainer">
          <div style={{ fontSize: "1rem", fontWeight: "300" }}>PicPocket</div>
          <div
            style={{ fontSize: "2rem", color: "#f5c000", fontWeight: "500" }}
          >
            Join PicPocket
          </div>
          <button className="sign-in-page__oauth-button">
            <div>
              <img src={googleOAuthIcon}></img>
              Google
            </div>
          </button>
          <button className="sign-in-page__oauth-button">
            <div>
              <img src={facebookOauthIcon}></img>Facebook
            </div>
          </button>
          <div className="signInPage--or">
            <div className="orLine"></div>
            <div>or</div>
            <div className="orLine"></div>
          </div>
          <form onSubmit={onSubmit}>
            <div className="signInPage--inputBlock">
              <label htmlFor="username">Username: </label>
              <input id="username" onChange={onChangeName}></input>
            </div>
            <div className="signInPage--inputBlock">
              <label htmlFor="email">Email: </label>
              <input id="email" onChange={onChangeEmail}></input>
            </div>
            <div className="signInPage--inputBlock">
              <label htmlFor="password">Password: </label>
              <input id="password" onChange={onChangePW}></input>
            </div>
            <button type="submit" className="signInPage--signInBtn">
              Sign Up
            </button>
          </form>
        </div>
        <div className="sign-in-page__collage-image-container">
          <img
            className="sign-in-page__collage-image"
            src={signInPageCollageImg}
          ></img>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
