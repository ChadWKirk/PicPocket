import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//components
import TooltipForInputField from "../../components/TooltipForInputField";
//images
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

  //don't accept special characters for username
  const [username, setUsername] = useState("");
  const [isSpecialCharacter, setIsSpecialCharacter] = useState(false);
  const [usernameInputClass, setUsernameInputClass] = useState();
  useEffect(() => {
    if (/[~`!#$%\^&*+=\\[\]\\;,/{}|\\":<>\?]/g.test(username)) {
      setUsernameInputClass("sign-in-page__input-block-username-input-red");
      setIsSpecialCharacter(true);
    } else {
      setUsernameInputClass("");
      setIsSpecialCharacter(false);
    }
  }, [username]);

  let specialMessage;
  if (/[~`!#$%\^&*+=\\[\]\\;,/{}|\\":<>\?]/g.test(username)) {
    console.log("special");
    specialMessage = " No Special Characters";
  } else {
    console.log("no special");
    specialMessage = "";
  }

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

  const [usernameTooltip, setUsernameTooltip] = useState();
  const [emailTooltip, setEmailTooltip] = useState();
  const [passwordTooltip, setPasswordTooltip] = useState();

  //if any tool tip is open, clicking anywhere makes it disappear
  function resetToolTipOnClick() {
    if (
      usernameTooltip !== undefined ||
      passwordTooltip !== undefined ||
      emailTooltip !== undefined
    ) {
      setUsernameTooltip();
      setEmailTooltip();
      setPasswordTooltip();
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (isSpecialCharacter) {
      return;
    }
    console.log("submitted");

    setForm(newUser);

    if (username.length === 0) {
      setUsernameTooltip(
        <TooltipForInputField
          Message={"Please fill out this field."}
          Type={"Yellow Warning"}
        />
      );
    } else if (newUser.email.length === 0) {
      setEmailTooltip(
        <TooltipForInputField
          Message={"Please fill out this field."}
          Type={"Yellow Warning"}
        />
      );
    } else if (newUser.password.length === 0) {
      setPasswordTooltip(
        <TooltipForInputField
          Message={"Please fill out this field."}
          Type={"Yellow Warning"}
        />
      );
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
          window.alert("Username or email already exists. Sign up failed.");
        }); //if sign up fails

      console.log(newUser);
    }
  }

  return (
    <div className="sign-in-page__container" onClick={resetToolTipOnClick}>
      <div className="sign-in-page__contents-container">
        <div className="sign-in-page__form-container">
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
          <div className="sign-in-page__or">
            <div className="sign-in-page__or-line"></div>
            <div>or</div>
            <div className="sign-in-page__or-line"></div>
          </div>
          <form onSubmit={onSubmit}>
            <div className="sign-in-page__input-block">
              <label htmlFor="username">
                Username:{" "}
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "red",
                    display: "inline",
                  }}
                >
                  *
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "red",
                    display: "inline",
                  }}
                >
                  {specialMessage}
                </p>
              </label>
              <input
                id="username"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
                className={usernameInputClass}
              ></input>
              {usernameTooltip}
            </div>
            <div className="sign-in-page__input-block">
              <label htmlFor="email">
                Email:{" "}
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "red",
                    display: "inline",
                  }}
                >
                  *
                </p>
              </label>
              <input id="email" onChange={onChangeEmail}></input>
              {emailTooltip}
            </div>
            <div className="sign-in-page__input-block">
              <label htmlFor="password">
                Password:{" "}
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "red",
                    display: "inline",
                  }}
                >
                  *
                </p>
              </label>
              <input id="password" onChange={onChangePW}></input>
              {passwordTooltip}
            </div>
            <button type="submit" className="sign-in-page__sign-in-button">
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
