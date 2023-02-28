import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//components
import TooltipForInputField from "../../components/TooltipForInputField";
import { useAuthContext } from "../../context/useAuthContext";
//images
import signInPageCollageImg from "../../images/PicPocket-SignIn-Collage2.png";
import googleOAuthIcon from "../../images/google-logo-oauth.png";
import facebookOauthIcon from "../../images/facebook-logo-oauth.png";
import { parse } from "@fortawesome/fontawesome-svg-core";

const SignInPage = ({
  domain,
  curUser,
  isLoggedIn,
  resetPasswordLinkJustSent,
}) => {
  const { dispatch } = useAuthContext();
  let navigate = useNavigate();
  //if user is already logged in, redirect to their account page
  // useEffect(() => {
  //   if (loggedIn) {
  //     navigate(`/Account/${curUser}`);
  //   }
  // }, []);

  //states for username, email and password input values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameTooltip, setUsernameTooltip] = useState();
  const [passwordTooltip, setPasswordTooltip] = useState();

  //if any tool tip is open, clicking anywhere makes it disappear
  function resetToolTipOnClick() {
    if (usernameTooltip !== undefined || passwordTooltip !== undefined) {
      setUsernameTooltip();
      setPasswordTooltip();
    }
  }

  const [invalidCredentialstAlert, setInvalidCredentialsAlert] = useState();

  var [curUser2, setCurUser] = useState({
    username: "",
    password: "",
    signedIn: false,
  });

  let signInUser = {
    username: username,
    password: password,
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

    if (username.length === 0) {
      setUsernameTooltip(
        <TooltipForInputField
          Message={"Please fill out this field."}
          Type={"Yellow Warning"}
        />
      );
    } else if (password.length === 0) {
      setPasswordTooltip(
        <TooltipForInputField
          Message={"Please fill out this field."}
          Type={"Yellow Warning"}
        />
      );
    } else {
      console.log("Sign in fetch sent");
      await fetch(`${domain}/SignIn`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(signInUser),
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
              // window.alert("Account does not exist. Sign in failed.");
            } else {
              console.log("ok");
              localStorage.setItem("user", JSON.stringify(parsedJSON));
              dispatch({ type: "LOGIN", payload: parsedJSON });
              window.location.href = "/";
              //navigate("/");
            }
          })
      );
    }
  }

  return (
    <div
      className="sign-in-page__container"
      onClick={() => {
        resetToolTipOnClick();
      }}
    >
      <div className="sign-in-page__contents-container">
        <div className="sign-in-page__form-container">
          <div style={{ fontSize: "1rem", fontWeight: "300" }}>PicPocket</div>
          <div
            style={{ fontSize: "2rem", color: "#f5c000", fontWeight: "500" }}
          >
            Log in to your account
          </div>
          {resetPasswordLinkJustSent && (
            <div className="sign-in-page__reset-password-link-sent-banner">
              You will receive an email with instructions on how to reset your
              password shortly.
            </div>
          )}
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
          {invalidCredentialstAlert}
          <form onSubmit={onSubmit}>
            <div className="sign-in-page__input-block">
              <label htmlFor="username">Username: </label>
              <input
                id="username"
                onChange={(event) => setUsername(event.target.value)}
              ></input>
              {usernameTooltip}
            </div>
            <div className="sign-in-page__input-block">
              <label htmlFor="password">Password: </label>
              <input
                id="password"
                onChange={(event) => setPassword(event.target.value)}
              ></input>
              {passwordTooltip}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                  fontSize: "0.85rem",
                }}
              >
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div>Don't have an account?</div>
                  <a href="#">Sign Up</a>
                </div>
                <div>
                  <a href="/send-forgot">Forgot Password?</a>
                </div>
              </div>
            </div>
            <button type="submit" className="sign-in-page__sign-in-button">
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
