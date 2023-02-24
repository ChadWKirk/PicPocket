import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//components
import TooltipForInputField from "../components/TooltipForInputField";
import NavbarComponent from "../components/NavbarComponent";
//auth
import { useAuthContext } from "../context/useAuthContext";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";

const ContactUsPage = ({ domain, curUser, isLoggedIn }) => {
  let navigate = useNavigate();
  const { dispatch } = useAuthContext();

  //fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  //tooltips
  const [nameTooltip, setNameTooltip] = useState();
  const [emailTooltip, setEmailTooltip] = useState();
  const [messageTooltip, setMessageTooltip] = useState();

  //Input Classes (to toggle between red border and regular)
  const [nameInputClass, setNameInputClass] = useState();
  const [emailInputClass, setEmailInputClass] = useState();
  const [messageInputClass, setMessageInputClass] = useState();

  //Error texts
  const [nameErrorText, setNameErrorText] = useState();
  const [emailErrorText, setEmailErrorText] = useState();
  const [messageErrorText, setMessageErrorText] = useState();

  //loading, failure and success badges
  const [loadingSuccessOrFailure, setLoadingSuccessOrFailure] = useState();

  async function onSubmit(e) {
    e.preventDefault();

    //tooltips
    if (name.length === 0) {
      setNameTooltip(
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
    } else if (message.length === 0) {
      setMessageTooltip(
        <TooltipForInputField
          Message={"Please fill out this field."}
          Type={"Yellow Warning"}
        />
      );
    }
    //if all fields are filled, run fetch request
    else {
      await fetch(`${domain}/contact`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
        }),
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => {
            if (parsedJSON == "send message") {
              console.log("message sent");
              setLoadingSuccessOrFailure(
                <button
                  className="contact-page__success-or-failure-message-success"
                  id="loadingSucFailBtn"
                >
                  <div>
                    <FontAwesomeIcon icon={faCheck} />
                  </div>

                  <div style={{ color: "black" }}>Message sent!</div>
                </button>
              );
              //after animation runs in css, make it disappear from DOM
              setTimeout(() => {
                setLoadingSuccessOrFailure();
              }, 5000);
            } else if (parsedJSON == "Email is not valid") {
              setEmailInputClass("red-input-border");
              setEmailErrorText(
                <div className="sign-in-page__already-exists-message">
                  Invalid email address.
                </div>
              );
            } else if (!parsedJSON.ok) {
              console.log("error");
              setLoadingSuccessOrFailure(
                <button
                  className="contact-page__success-or-failure-message-fail"
                  id="loadingSucFailBtn"
                >
                  <div>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>

                  <div style={{ color: "black" }}>Error.</div>
                </button>
              );
              //after animation runs in css, make it disappear from DOM
              setTimeout(() => {
                setLoadingSuccessOrFailure();
              }, 5000);
            }
          })
      );
    }
  }
  return (
    <div
      onClick={() => {
        setMessageTooltip();
        setNameTooltip();
        setEmailTooltip();
        setMessageErrorText();
        setNameErrorText();
        setEmailErrorText();
        setMessageInputClass();
        setEmailInputClass();
        setNameInputClass();
      }}
    >
      <NavbarComponent
        domain={domain}
        curUser={curUser}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"black"}
      />

      <div className="change-password-page__form-container">
        <h1>Contact Us</h1>
        <div style={{ width: "100%" }}>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="change-password-page__input-container">
              <label htmlFor="nameInput">Name: {nameErrorText}</label>
              <input
                id="nameInput"
                className={nameInputClass}
                onChange={(e) => setName(e.target.value)}
              ></input>

              {nameTooltip}
            </div>
            <div className="change-password-page__input-container">
              <label htmlFor="emailInput">Email: {emailErrorText}</label>
              <input
                id="emailInput"
                className={emailInputClass}
                onChange={(e) => setEmail(e.target.value)}
              ></input>

              {emailTooltip}
            </div>
            <div className="change-password-page__input-container">
              <label htmlFor="messageInput">Message: {messageErrorText}</label>
              <textarea
                id="messageInput"
                className={messageInputClass}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>

              {messageTooltip}
              <div className="change-password-page__buttons-container">
                <button
                  onClick={() => navigate(`/`)}
                  className="change-password-page__cancel-button"
                >
                  Cancel
                </button>
                <button type="submit">Send Message</button>
                {loadingSuccessOrFailure}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
