import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelopeCircleCheck,
  faEnvelope,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const EmailVerifyPage = ({
  domain,
  isLoggedIn,
  curUser,
  setIsJustVerified,
}) => {
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
              <div className="email-verify-page__email-image-success">
                <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
              </div>
            );
            setMessage(
              <div className="email-verify-page__message-container-success">
                <h1>Your email has been verified!</h1>
                <h3>You can now upload pics!</h3>
                <h4 style={{ marginTop: "3.75rem" }}>
                  Redirecting to upload page...
                </h4>
              </div>
            );
            setIsJustVerified(true);
            setTimeout(() => {
              navigate(`/${username}/upload`);
            }, 2000);
          } else if (parsedJSON == "already verified") {
            navigate("/");
          } else if (parsedJSON == "user does not match") {
            setEmailIcon(
              <div className="email-verify-page__email-image-container-fail">
                <div className="email-verify-page__email-image-envelope-fail">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div className="email-verify-page__email-image-x-fail">
                  <FontAwesomeIcon icon={faXmark} />
                </div>
              </div>
            );
            setMessage(
              <div className="email-verify-page__message-container-fail">
                <h1>
                  We can not find a user that matches the username and/or token
                  in this verification link.
                </h1>
                <h3 style={{ marginTop: "2rem" }}>
                  Please go to your{" "}
                  <a href={`/Account/${username}`}>User Settings</a> page and
                  resend the verifiation link next to the "Change Email" button.
                </h3>
                <h3 style={{ marginTop: "4rem" }}>
                  If this is your second time trying a new link, please{" "}
                  <a href={`/Contact`}>Contact Us</a> at
                  administrator@picpoccket.com
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
      <div className="email-verify-page__contents-container">
        {emailIcon}
        {message}
      </div>
    </div>
  );
};

export default EmailVerifyPage;
