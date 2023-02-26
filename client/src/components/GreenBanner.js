import { React, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const GreenBanner = ({ Message }) => {
  return (
    <div className="green-banner__container">
      <div className="green-banner__contents-container">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="green-banner__exclamation-icon"
        />
        <div>{Message}</div>
      </div>
    </div>
  );
};

export default GreenBanner;
