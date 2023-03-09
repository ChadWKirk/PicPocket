import React, { useState, useEffect, useRef } from "react";
import NavbarComponent from "../components/NavbarComponent";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faQuestion,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

const NotFoundPage = ({
  domain,
  curUser_hyphenated,
  curUser_real,
  isLoggedIn,
}) => {
  return (
    <div>
      <NavbarComponent
        domain={domain}
        curUser_real={curUser_real}
        curUser_hyphenated={curUser_hyphenated}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"black"}
      />
      <div className="not-found-page__contents-container">
        <div className="not-found-page__icon">
          <FontAwesomeIcon icon={faQuestionCircle} />
        </div>
        <div className="not-found-page__message">
          Sorry, this page could not be found.
        </div>
        <div className="not-found-page__link">
          <a href="/">Go Back Home</a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
