import { React, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const RedBanner = ({ Message }) => {
  return (
    <div className="red-banner__container">
      <div className="red-banner__contents-container">
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="red-banner__exclamation-icon"
        />
        <div>{Message}</div>
      </div>
    </div>
  );
};

export default RedBanner;
