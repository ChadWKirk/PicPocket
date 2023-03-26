import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
// Google OAuth
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
// axios
import axios from "axios";
// jwt decode
import jwt_decode from "jwt-decode";
//components
import TooltipForInputField from "../../components/TooltipForInputField";
import { useAuthContext } from "../../context/useAuthContext";
//images
import signInPageCollageImg from "../../images/PicPocket-SignIn-Collage2.png";
import googleOAuthIcon from "../../images/google-logo-oauth.png";
import facebookOauthIcon from "../../images/facebook-logo-oauth.png";

const SignInPage = ({
  domain,
  curUser_real,
  curUser_hyphenated,
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

  //Google OAuth
  const googleLogin = useGoogleLogin({
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
        await fetch(`${domain}/oauth/sign/google`, {
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

  // Facebook OAuth
  // get prettier to not say fb is undefined
  /*global FB*/
  //import facebook's javascript sdk
  window.fbAsyncInit = function () {
    FB.init({
      appId: "790444795516757",
      xfbml: true,
      version: "v2.6",
    });

    FB.getLoginStatus(function (response) {
      //this.statusChangeCallback(response);
    });
  };

  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
  // log in with facebook log in button
  async function fbLoginFetch(response) {
    console.log("oauth sign fetch sent");
    fetch(`${domain}/oauth/sign/facebook`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(response),
    })
      .then((response) =>
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
      )
      .catch((err) => console.log(err));
  }
  function FBLogin() {
    FB.login(
      function (response) {
        if (response.status === "connected") {
          // Logged into your webpage and Facebook.
          console.log(response);
          FB.api("/me", { fields: "name,email" }, function (response) {
            console.log(response);
            fbLoginFetch(response);
          });
        } else {
          // The person is not logged into your webpage or we are unable to tell.
          console.log("they didnt log in with fb");
        }
      },
      { scope: "public_profile, email" }
    );
  }

  //states for username, email and password input values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameTooltip, setUsernameTooltip] = useState();
  const [passwordTooltip, setPasswordTooltip] = useState();

  // type for password input to toggle between text and password for eye ball functionality to view password in password field
  const [currentPasswordInputType, setCurrentPasswordInputType] =
    useState("password");

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
    // curUser = { username: "" };
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
            if (parsedJSON == "no user exists") {
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
          <button
            onClick={() => googleLogin()}
            className="sign-in-page__oauth-button"
          >
            <div>
              <img src={googleOAuthIcon}></img>
              Google
            </div>
          </button>
          <button
            className="sign-in-page__oauth-button"
            onClick={() => FBLogin()}
          >
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
                type={currentPasswordInputType}
                onChange={(event) => setPassword(event.target.value)}
              ></input>
              <FontAwesomeIcon
                icon={faEye}
                className={"sign-in-page__eye-icon"}
                onMouseDown={() => setCurrentPasswordInputType("text")}
                onMouseUp={() => setCurrentPasswordInputType("password")}
              />
              {passwordTooltip}
              <div
                className="sign-in-page__dont-have-account-container"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                  fontSize: "0.85rem",
                }}
              >
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div>Don't have an account?</div>
                  <a href="/SignUp">Sign Up</a>
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
