import React, { useState, useEffect, useRef } from "react";
import NavbarComponent from "../components/NavbarComponent";

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
        <div>eye icon</div>
        <div>Sorry, this page could not be found.</div>
        <div>Here are some helpful links instead:</div>
        <ul>
          <li>
            <a>link 1</a>
          </li>
          <li>
            <a>link 1</a>
          </li>
          <li>
            <a>link 1</a>
          </li>
          <li>
            <a>link 1</a>
          </li>
          <li>
            <a>link 1</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NotFoundPage;
