import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelopeCircleCheck,
  faEnvelope,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const EmailVerifyPage = ({ domain, isLoggedIn, curUser }) => {
  //if use params token is same as :username's token, set :username's verified status to true
  //if :username is already verified, don't do anything and just bring them to the home page
  //if :username is not signed in or another user is signed in already, bring them to sign in page to sign in
  //signing in removes all other tokens and signs that user in
  //if the token or name doesn't match, give an error message
  let navigate = useNavigate();
  const { username } = useParams();
  const { token } = useParams();

  //what content to show based on success or error
  const [emailIcon, setEmailIcon] = useState();
  const [message, setMessage] = useState();

  //fetch
  async function verifyPostRequest() {
    await fetch(`${domain}/${username}/verify/${token}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username: username, token: token }),
    }).then((response) =>
      response
        .json()
        .then((resJSON) => JSON.stringify(resJSON))
        .then((stringJSON) => JSON.parse(stringJSON))
        .then((parsedJSON) => {
          if (parsedJSON == "verified has been set to true") {
            setEmailIcon(
              <div className="email-verify-page__email-image">
                <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
              </div>
            );
            setMessage(
              <div className="email-verify-page__message-container">
                <h1>Your email has been verified!</h1>
                <h3>You can now upload pics!</h3>
                <h4 style={{ marginTop: "3.75rem" }}>
                  Redirecting to upload page...
                </h4>
              </div>
            );
            setTimeout(() => {
              navigate(`/${username}/upload`);
            }, 2000);
          } else if (parsedJSON == "already verified") {
            navigate("/");
          } else if (parsedJSON == "user does not match") {
            setEmailIcon(
              <div className="email-verify-page__email-image-fail-container">
                <div className="email-verify-page__email-image-fail-envelope">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div className="email-verify-page__email-image-fail-x">
                  <FontAwesomeIcon icon={faXmark} />
                </div>
              </div>
            );
            setMessage(
              <div className="email-verify-page__message-fail-container">
                <h1>
                  We can not find a user that matches the username and/or token
                  in this verification link.
                </h1>
                <h3>
                  Please log in to your account and resend the verifiation link.
                </h3>
                <h3>
                  If this is your second time trying a new link, please contact
                  us at administrator@picpoccket.com
                </h3>
              </div>
            );
          }
        })
    );
  }

  useEffect(() => {
    verifyPostRequest();
  }, []);

  return (
    <div className="email-verify-page__container">
      {emailIcon}
      {message}
    </div>
  );
};

export default EmailVerifyPage;
