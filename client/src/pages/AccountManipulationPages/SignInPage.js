import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import signInPageCollageImg from "../../images/PicPocket-SignIn-Collage2.png";

const SignInPage = ({ curUser, loggedIn }) => {
  var [curUser2, setCurUser] = useState({
    username: "",
    password: "",
    signedIn: false,
  });

  var navigate = useNavigate();

  let signInUser = {
    username: "",
    password: "",
    signedIn: false,
  }; //this is the user the customer is ATTEMPTING to sign in with (does not pass name as prop on fail)

  function onChangeName(event) {
    //when name input changes,pass a para to be the event object then assign target.value to name. event parameter is always first parameter passed in a function called by an event.
    signInUser.username = event.target.value;
  }

  function onChangePW(event) {
    signInUser.password = event.target.value;
  }

  async function onSubmit(e) {
    curUser = { username: "" };
    e.preventDefault();
    console.log("submitted");

    if (signInUser.username.length === 0) {
      window.alert("Name is blank. Sign in failed.");
    } else if (signInUser.password.length === 0) {
      window.alert("Password is blank. Sign in failed.");
    } else {
      console.log("Sign in fetch sent");
      await fetch("http://localhost:5000/SignIn", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(signInUser),
      }).then((response) => {
        if (response.ok) {
          setCurUser({
            //set curUser (current signed in user since sign in was successful. passes name as prop to navbar)
            username: signInUser.username,
            password: signInUser.password,
            signedIn: false,
          });
          window.location.href = "/";
          //navigate("/");
        } else if (response.status === 404) {
          //if sign in fails
          window.alert("Account does not exist. Sign in failed.");
        } else {
          window.alert("User is already signed in. Sign in failed.");
        }
      });
    }
  }

  return (
    <div>
      {/* <NavBar curUser={curUser} loggedIn={loggedIn} /> */}
      <div className="signInPage--contentsContainer">
        <div className="signInPage--formContainer">
          <div style={{ fontSize: "1rem", fontWeight: "300" }}>PicPocket</div>
          <div
            style={{ fontSize: "2rem", color: "#f5c000", fontWeight: "500" }}
          >
            Log in to your account
          </div>
          <button>Google</button>
          <button>Facebook</button>
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
              <label htmlFor="password">Password: </label>
              <input id="password" onChange={onChangePW}></input>
            </div>
            <button type="submit" className="signInPage--signInBtn">
              Sign In
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

export default SignInPage;
