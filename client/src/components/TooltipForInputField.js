import { React, useState, useEffect } from "react";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";

const TooltipForInputField = ({ Message, Type }) => {
  let backgroundColor;
  if (Type == "Yellow Warning") {
    backgroundColor = "orange";
  }
  return (
    <div className="sign-in-page__input-block-please-fill-out-field-tooltip">
      <FontAwesomeIcon
        icon={faExclamation}
        style={{ backgroundColor: backgroundColor }}
        className="sign-in-page__input-block-tooltip-exclamation-icon"
      />
      <div>{Message}</div>
    </div>
  );
};

export default TooltipForInputField;
