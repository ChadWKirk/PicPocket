import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SignUpSuccessPage = ({ curUser_real, curUser_hyphenated, loggedIn }) => {
  let navigate = useNavigate();
  const { username } = useParams();

  useEffect(() => {
    if (loggedIn) {
      navigate(`/Account/${curUser_hyphenated}`);
    }
  }, []);

  return (
    <div>
      <h1>Congratulations! You've signed up!</h1>
      <a href={`/Account/${username}`}>
        <h3>Click here to access your account.</h3>
      </a>
    </div>
  );
};

export default SignUpSuccessPage;
