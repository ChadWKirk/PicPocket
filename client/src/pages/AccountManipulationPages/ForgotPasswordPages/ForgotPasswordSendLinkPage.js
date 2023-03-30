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
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const ForgotPasswordSendLinkPage = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
  setResetPasswordLinkJustSent,
}) => {
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

  const [emailInputClass, setEmailInputClass] = useState();

  const [emailErrorText, setEmailErrorText] = useState();

  const [resetPasswordButton, setResetPasswordButton] = useState(
    <button
      type="submit"
      className="forgot-password-send-link-page__sign-in-button"
    >
      Reset Password
    </button>
  );

  async function onSubmit(e) {
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
      setResetPasswordButton(
        <button
          type="submit"
          className="forgot-password-send-link-page__sign-in-button"
          style={{ pointerEvents: "none" }}
        >
          Reset Password
          <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
        </button>
      );
      await fetch(`${domain}/send-forgot-password-link`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email: email }),
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => {
            if (parsedJSON === "forgot password link sent") {
              console.log("forgot password link sent");
              setResetPasswordLinkJustSent(true);
              navigate("/signin");
            } else if (parsedJSON === "email does not belong to any account") {
              console.log("email does not belong to any account");
              setEmailInputClass("red-input-border");
              setEmailErrorText(
                <div className="sign-in-page__already-exists-message">
                  Email does not belong to any account.
                </div>
              );
            } else if (parsedJSON === "Email is not valid") {
              console.log(parsedJSON);
              setEmailInputClass("red-input-border");
              setEmailErrorText(
                <div className="sign-in-page__already-exists-message">
                  Email is not a valid address.
                </div>
              );
            }
          })
      );
    }
  }

  return (
    <main
      className="forgot-password-send-link-page__container"
      onClick={() => {
        setEmailTooltip();
      }}
    >
      <div className="forgot-password-send-link-page__contents-container">
        <section className="forgot-password-send-link-page__form-container">
          <header>
            <div style={{ fontSize: "1rem", fontWeight: "300" }}>PicPocket</div>
            <h1 className="forgot-password-send-link-page__heading">
              Reset your password
            </h1>
          </header>
          <p
            style={{
              fontSize: "0.8rem",
              marginTop: "0.7rem",
              maxWidth: "70ch",
            }}
          >
            To reset your password, enter your email below and submit. An email
            will be sent to you with instructions about how to complete the
            process.
          </p>
          <form onSubmit={onSubmit}>
            <div
              className="forgot-password-send-link-page__input-block"
              style={{ marginTop: "2.5rem" }}
            >
              <label htmlFor="email">Email Address: {emailErrorText}</label>
              <input
                className={emailInputClass}
                id="email"
                onChange={(event) => setEmail(event.target.value)}
              ></input>
              {emailTooltip}
            </div>
            {resetPasswordButton}
          </form>
        </section>
        <aside className="forgot-password-send-link-page__collage-image-container">
          <img
            className="forgot-password-send-link-page__collage-image"
            src={signInPageCollageImg}
          ></img>
        </aside>
      </div>
    </main>
  );
};

export default ForgotPasswordSendLinkPage;
