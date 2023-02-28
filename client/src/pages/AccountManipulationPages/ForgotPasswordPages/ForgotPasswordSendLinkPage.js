import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//components
import TooltipForInputField from "../../../components/TooltipForInputField";
import { useAuthContext } from "../../../context/useAuthContext";
//images
import signInPageCollageImg from "../../../images/PicPocket-SignIn-Collage2.png";
import googleOAuthIcon from "../../../images/google-logo-oauth.png";
import facebookOauthIcon from "../../../images/facebook-logo-oauth.png";
import { parse } from "@fortawesome/fontawesome-svg-core";

const ForgotPasswordSendLinkPage = ({ domain, curUser, isLoggedIn }) => {
  const { dispatch } = useAuthContext();
  let navigate = useNavigate();
  //if user is already logged in, redirect to their account page
  // useEffect(() => {
  //   if (loggedIn) {
  //     navigate(`/Account/${curUser}`);
  //   }
  // }, []);

  //state for email input value
  const [email, setEmail] = useState("");

  const [emailTooltip, setEmailTooltip] = useState();

  const [invalidCredentialstAlert, setInvalidCredentialsAlert] = useState();

  var [curUser2, setCurUser] = useState({
    email: "",
  });

  let signInUser = {
    email: email,
  }; //this is the user the customer is ATTEMPTING to sign in with (does not pass name as prop on fail)

  async function onSubmit(e) {
    curUser = { email: "" };
    e.preventDefault();
    console.log("submitted");

    if (email.length === 0) {
      setEmailTooltip(
        <TooltipForInputField
          Message={"Please fill out this field."}
          Type={"Yellow Warning"}
        />
      );
    } else {
      console.log("fetch sent");
      await fetch(`${domain}/send-forgot-password-link`, {
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
                <div className="sign-in-page__invalid-email-or-password-alert-box">
                  Invalid email or password.
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
      className="forgot-password-send-link-page__container"
      onClick={() => {
        setEmailTooltip();
      }}
    >
      <div className="forgot-password-send-link-page__contents-container">
        <div className="forgot-password-send-link-page__form-container">
          <div style={{ fontSize: "1rem", fontWeight: "300" }}>PicPocket</div>
          <div className="forgot-password-send-link-page__heading">
            Reset your password
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              marginTop: "0.7rem",
              maxWidth: "70ch",
            }}
          >
            To reset your password, enter your email below and submit. An email
            will be sent to you with instructions about how to complete the
            process.
          </div>
          {invalidCredentialstAlert}
          <form onSubmit={onSubmit}>
            <div
              className="forgot-password-send-link-page__input-block"
              style={{ marginTop: "2.5rem" }}
            >
              <label htmlFor="email">Email Address: </label>
              <input
                id="email"
                onChange={(event) => setEmail(event.target.value)}
              ></input>
              {emailTooltip}
            </div>
            <button
              type="submit"
              className="forgot-password-send-link-page__sign-in-button"
            >
              Reset Password
            </button>
          </form>
        </div>
        <div className="forgot-password-send-link-page__collage-image-container">
          <img
            className="forgot-password-send-link-page__collage-image"
            src={signInPageCollageImg}
          ></img>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSendLinkPage;
