import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const PasswordChangeSuccessPage = () => {
  let navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/SignIn";
    }, 500);
  });
  return (
    <div
      className="password-success-page__container"
      style={{ textAlign: "center" }}
    >
      <div className="password-success-page__check-icon">
        <FontAwesomeIcon icon={faCheckCircle} />
      </div>
      <h1>Password successfully changed.</h1>
      <h3>Redirecting to Log In Page...</h3>
    </div>
  );
};

export default PasswordChangeSuccessPage;
