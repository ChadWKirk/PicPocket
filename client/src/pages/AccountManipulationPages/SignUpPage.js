import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Google OAuth
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
// axios
import axios from "axios";
//components
import TooltipForInputField from "../../components/TooltipForInputField";
import ModalForYesOrNo from "../../components/ModalForYesOrNo";
import { useAuthContext } from "../../context/useAuthContext";
//images
import googleOAuthIcon from "../../images/google-logo-oauth.png";
import facebookOauthIcon from "../../images/facebook-logo-oauth.png";
import signInPageCollageImg from "../../images/PicPocket-SignIn-Collage2.png";

const SignUpPage = ({ domain, setIsJustSignedUp }) => {
  let navigate = useNavigate();
  const { dispatch } = useAuthContext();
  //if user is already logged in, redirect to their account page
  // useEffect(() => {
  //   if (loggedIn) {
  //     navigate(`/Account/user`);
  //   }
  // }, []);

  //Google OAuth
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      //get user info from google account
      try {
        const data = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        console.log(data);
        //sign in/up
        console.log("oauth sign fetch sent");
        await fetch(`${domain}/oauth/sign`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(data),
        }).then((response) =>
          response
            .json()
            .then((resJSON) => JSON.stringify(resJSON))
            .then((stringJSON) => JSON.parse(stringJSON))
            .then((parsedJSON) => {
              if (parsedJSON.status === 404) {
                //if sign in fails
                setInvalidCredentialsAlert(
                  <div className="sign-in-page__invalid-username-or-password-alert-box">
                    Invalid username or password.
                  </div>
                );
              } else {
                console.log("ok");
                localStorage.setItem("user", JSON.stringify(parsedJSON));
                dispatch({ type: "LOGIN", payload: parsedJSON });
                window.location.href = "/";
                //navigate("/");
              }
            })
        );
      } catch (err) {
        console.log(err);
      }
    },
  });

  //states for username, email and password input values
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //classes for username and email input elements to switch to red border when using special chars in username or if username/email already exist
  const [usernameInputClass, setUsernameInputClass] = useState();
  const [emailInputClass, setEmailInputClass] = useState();
  const [passwordInputClass, setPasswordInputClass] = useState();

  //don't accept special characters for username
  const [isSpecialCharacter, setIsSpecialCharacter] = useState(false);
  useEffect(() => {
    if (/[~`!#$%\^&*+=\\[\]\\;,/{}|\\":<>\?]/g.test(username)) {
      setUsernameInputClass("red-input-border");
      setIsSpecialCharacter(true);
    } else {
      setUsernameInputClass("");
      setIsSpecialCharacter(false);
    }
  }, [username]);

  let specialMessage;
  if (/[~`!#$%\^&*+=\\[\]\\;,/{}|\\":<>()-._@\?]/g.test(username)) {
    console.log("special");
    specialMessage = " No Special Characters";
  } else {
    console.log("no special");
    specialMessage = "";
  }

  // function onChangeName(event) {
  //   //when name input changes,pass a para to be the event object then assign target.value to name. event parameter is always first parameter passed in a function called by an event.
  //   newUser.username = event.target.value;
  // }

  function onChangePW(event) {
    newUser.password = event.target.value;
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

  const [invalidCredentialstAlert, setInvalidCredentialsAlert] = useState();

  const [yesOrNoModal, setYesOrNoModal] = useState();
  const [yesOrNoModalAnswer, setYesOrNoModalAnswer] = useState();

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    // signedIn: false,
  });

  let newUser = {
    username: username,
    password: password,
    email: email,
    // signedIn: false,
  }; //blank newUser

  const [usernameAlreadyExistsText, setUsernameAlreadyExistsText] = useState();
  const [emailAlreadyExistsText, setEmailAlreadyExistsText] = useState();
  const [passwordNotStrongEnoughText, setPasswordNotStrongEnoughText] =
    useState();

  async function onSubmit(e) {
    e.preventDefault();
    if (isSpecialCharacter) {
      return;
    }
    // setNewUser({})
    console.log(newUser);

    setForm(newUser);

    if (username.length === 0) {
      setUsernameTooltip(
        <TooltipForInputField
          Message={"Please fill out this field."}
          Type={"Yellow Warning"}
        />
      );
    } else if (email.length === 0) {
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
      await fetch(`${domain}/signup`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newUser),
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => {
            if (parsedJSON == "Both") {
              setUsernameInputClass("red-input-border");
              setEmailInputClass("red-input-border");
              setUsernameAlreadyExistsText(
                <p className="sign-in-page__already-exists-message">
                  Username already exists.
                </p>
              );
              setEmailAlreadyExistsText(
                <p className="sign-in-page__already-exists-message">
                  Email already exists.
                </p>
              );
            } else if (parsedJSON == "Username") {
              setUsernameInputClass("red-input-border");
              setUsernameAlreadyExistsText(
                <p className="sign-in-page__already-exists-message">
                  Username already exists.
                </p>
              );
            } else if (parsedJSON == "Email") {
              setEmailInputClass("red-input-border");
              setEmailAlreadyExistsText(
                <div className="sign-in-page__already-exists-message">
                  Email already exists.
                </div>
              );
            } else if (parsedJSON == "Email is not valid") {
              setEmailInputClass("red-input-border");
              setEmailAlreadyExistsText(
                <div className="sign-in-page__already-exists-message">
                  Email is not a valid Email address.
                </div>
              );
            } else if (parsedJSON == "Password is not strong enough") {
              setPasswordInputClass("red-input-border");
              setPasswordNotStrongEnoughText(
                <div className="sign-in-page__already-exists-message">
                  Password is not strong enough. (Requirements - 8 characters,
                  one uppercase letter, one number and one special character).
                </div>
              );
            } else {
              //save token to local storage
              localStorage.setItem("user", JSON.stringify(parsedJSON));
              //update useAuthContext
              dispatch({ type: "LOGIN", payload: parsedJSON });
              //send email verification email
              fetch(`${domain}/send-verification-email`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(newUser),
              }).then((response) => {
                console.log(response);
                //navigate to success page
                setIsJustSignedUp(true);
                navigate(
                  `/SignUp/${newUser.username.split(" ").join("-")}/Success`
                );
              });
            }
          })
      );
      // .catch(() => {

      // }); //if sign up fails
    }
  }

  return (
    <div
      className="sign-in-page__container"
      onClick={() => {
        resetToolTipOnClick();
        setEmailAlreadyExistsText();
        setUsernameAlreadyExistsText();
        setEmailInputClass();
        if (!isSpecialCharacter) {
          setUsernameInputClass();
        }
      }}
    >
      {yesOrNoModal}
      <div className="sign-in-page__contents-container">
        <div className="sign-in-page__form-container">
          <div style={{ fontSize: "1rem", fontWeight: "300" }}>PicPocket</div>
          <div
            style={{ fontSize: "2rem", color: "#f5c000", fontWeight: "500" }}
          >
            Join PicPocket
          </div>
          <button
            onClick={() => login()}
            className="sign-in-page__oauth-button"
          >
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
                {usernameAlreadyExistsText}
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
                {emailAlreadyExistsText}
              </label>
              <input
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                className={emailInputClass}
              ></input>
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
                {passwordNotStrongEnoughText}
              </label>

              <input
                id="password"
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                className={passwordInputClass}
              ></input>
              {passwordTooltip}
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "1rem",
                fontSize: "0.85rem",
              }}
            >
              <div>Already have an account?</div>
              <a href="/SignIn">Sign In</a>
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
