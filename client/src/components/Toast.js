import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const Toast = ({ status, message, closeToast }) => {
  let toastClass = "toast" + status;
  let icon;
  let btn;
  if (status == "Success") {
    icon = <FontAwesomeIcon icon={faCheck} />;
    btn = (
      <button
        style={{ color: "white", fontWeight: "500" }}
        onClick={() => closeToast()}
      >
        Close
      </button>
    );
  } else if (status == "Error") {
    icon = <FontAwesomeIcon icon={faXmark} />;
    btn = (
      <button
        style={{ color: "white", fontWeight: "500" }}
        onClick={() => closeToast()}
      >
        Close
      </button>
    );
  }

  return (
    <div className={toastClass}>
      {icon}
      <div>{message}</div>
      {btn}
    </div>
  );
};

export default Toast;
