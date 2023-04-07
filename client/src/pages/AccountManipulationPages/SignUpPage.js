import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
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

const SignUpPage = ({
  domain,
  isLoggedIn,
  curUser_hyphenated,
  setIsJustSignedUp,
}) => {
  let navigate = useNavigate();
  const { dispatch } = useAuthContext();
  // if user is already logged in, redirect to their account page
  useEffect(() => {
    if (isLoggedIn) {
      navigate(`/Account/${curUser_hyphenated}`);
    }
  }, []);

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
                    Invalid username or password.{" "}
                    <div>
                      <a href="/send-forgot">Forgot Password?</a>
                    </div>
                  </div>
                );
              }
              if (parsedJSON == "Email already in use by non-OAuth account.") {
                setInvalidCredentialsAlert(
                  <div className="sign-in-page__invalid-username-or-password-alert-box">
                    Email is already in use by non-OAuth account.{" "}
                    <div>
                      <a href="/send-forgot">Forgot Password?</a>
                    </div>
                  </div>
                );
                console.log("email in use");
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
                  Invalid username or password.{" "}
                  <div>
                    <a href="/send-forgot">Forgot Password?</a>
                  </div>
                </div>
              );
            }
            if (parsedJSON == "Email already in use by non-OAuth account.") {
              setInvalidCredentialsAlert(
                <div className="sign-in-page__invalid-username-or-password-alert-box">
                  Email is already in use by non-OAuth account.{" "}
                  <div>
                    <a href="/send-forgot">Forgot Password?</a>
                  </div>
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //classes for username and email input elements to switch to red border when using special chars in username or if username/email already exist
  const [usernameInputClass, setUsernameInputClass] = useState();
  const [emailInputClass, setEmailInputClass] = useState();
  const [passwordInputClass, setPasswordInputClass] = useState();

  // type for password input to toggle between text and password for eye ball functionality to view password in password field
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
    <main
      className="sign-in-page__container"
      onClick={() => {
        //when clicking anywhere, make all tooltips dissappear and if input is red due to error return it to default
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
        <section className="sign-in-page__form-container">
          <header>
            <div style={{ fontSize: "1rem", fontWeight: "300" }}>PicPocket</div>
            <h1
              style={{
                fontSize: "2rem",
                color: "#f5c000",
                fontWeight: "500",
                marginTop: "0.6rem",
              }}
            >
              Join PicPocket
            </h1>
          </header>

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
                type={isPasswordVisible ? "text" : "password"}
                onChange={(event) => setPassword(event.target.value)}
                className={passwordInputClass}
              ></input>
              <div
                className="sign-up-page__eye-icon-container"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <FontAwesomeIcon
                  icon={faEye}
                  className={"sign-up-page__eye-icon"}
                />
              </div>

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
        </section>
        <aside className="sign-in-page__collage-image-container">
          <img
            className="sign-in-page__collage-image"
            src="https://res.cloudinary.com/dtyg4ctfr/image/upload/q_40/dpr_auto/v1679877712/PicPocket-SignIn-Collage2-min_xd12qc.jpg"
          ></img>
        </aside>
      </div>
    </main>
  );
};

export default SignUpPage;
