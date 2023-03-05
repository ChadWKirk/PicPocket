import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const SignUpSuccessPage = ({ curUser_real, curUser_hyphenated }) => {
  let navigate = useNavigate();
  const { username } = useParams();

  return (
    <div
      className="password-success-page__container"
      style={{ textAlign: "center" }}
    >
      <div className="password-success-page__check-icon">
        <FontAwesomeIcon icon={faCheckCircle} />
      </div>
      <h1>Congratulations! You've signed up!</h1>
      <a href={`/Account/${username}`}>
        <h3>Click here to access your account.</h3>
      </a>
    </div>
  );
};

export default SignUpSuccessPage;
