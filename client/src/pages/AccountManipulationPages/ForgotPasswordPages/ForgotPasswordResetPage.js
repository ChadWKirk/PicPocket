import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
//components
import TooltipForInputField from "../../../components/TooltipForInputField";
import NavbarComponent from "../../../components/NavbarComponent";
//auth
import { useAuthContext } from "../../../context/useAuthContext";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSpinner } from "@fortawesome/free-solid-svg-icons";

const ForgotPasswordResetPage = ({ domain, curUser, isLoggedIn }) => {
  let navigate = useNavigate();
  const { dispatch } = useAuthContext();

  //fields
  const { username } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  //input type

  const [newPasswordInputType, setNewPasswordInputType] = useState("password");
  const [confirmNewPasswordInputType, setConfirmNewPasswordInputType] =
    useState("password");

  //tooltips
  const [newPasswordTooltip, setNewPasswordTooltip] = useState();
  const [confirmNewPasswordTooltip, setConfirmNewPasswordTooltip] = useState();

  //Input Classes (to toggle between red border and regular)
  const [newPasswordInputClass, setNewPasswordInputClass] = useState();
  const [confirmNewPasswordInputClass, setConfirmNewPasswordInputClass] =
    useState();

  //Error texts
  const [newPasswordErrorText, setNewPasswordErrorText] = useState();
  const [confirmNewPasswordErrorText, setConfirmNewPasswordErrorText] =
    useState();

  //Change Password button
  const [changePasswordButton, setChangePasswordButton] = useState(
    <button type="submit">Reset Password</button>
  );

  async function onSubmit(e) {
    e.preventDefault();

    if (newPassword.length === 0) {
      setNewPasswordTooltip(
        <TooltipForInputField
          Message={"Please fill out this field."}
          Type={"Yellow Warning"}
        />
      );
    } else if (confirmNewPassword.length === 0) {
      setConfirmNewPasswordTooltip(
        <TooltipForInputField
          Message={"Please fill out this field."}
          Type={"Yellow Warning"}
        />
      );
    } else {
      setChangePasswordButton(
        <button type="submit" id="loadingSucFailBtn">
          Reset Password
          <div className="contact-page__send-button-loading-icon">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
          </div>
        </button>
      );
      await fetch(`${domain}/change-password`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          username: username,
          newPassword: newPassword,
          confirmNewPassword: confirmNewPassword,
        }),
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => {
            if (parsedJSON == "change password") {
              //remove user from local storage
              localStorage.removeItem("user");
              //dispatch logout action
              dispatch({ type: "LOGOUT" });
              //navigate to success page
              navigate("/Change-Password-Success");
            } else if (parsedJSON == "password too weak") {
              setChangePasswordButton(
                <button type="submit">Reset Password</button>
              );
              setConfirmNewPasswordInputClass("red-input-border");
              setConfirmNewPasswordErrorText(
                <div className="sign-in-page__already-exists-message">
                  Password is not strong enough. (Requirements - 8 characters,
                  one uppercase letter, one number and one special character).
                </div>
              );
              setNewPasswordInputClass("red-input-border");
              setNewPasswordErrorText(
                <div className="sign-in-page__already-exists-message">
                  Password is not strong enough. (Requirements - 8 characters,
                  one uppercase letter, one number and one special character).
                </div>
              );
            } else if (
              parsedJSON == "new password cannot match current password"
            ) {
              setChangePasswordButton(
                <button type="submit">Reset Password</button>
              );
              setNewPasswordInputClass("red-input-border");
              setNewPasswordErrorText(
                <div className="sign-in-page__already-exists-message">
                  New password cannot match current password.
                </div>
              );
            } else if (
              parsedJSON == "New Password and Confirm New Password must match."
            ) {
              setChangePasswordButton(
                <button type="submit">Reset Password</button>
              );
              setConfirmNewPasswordInputClass("red-input-border");
              setConfirmNewPasswordErrorText(
                <div className="sign-in-page__already-exists-message">
                  New Password and Confirm New Password must match.
                </div>
              );
              setNewPasswordInputClass("red-input-border");
              setNewPasswordErrorText(
                <div className="sign-in-page__already-exists-message">
                  New Password and Confirm New Password must match.
                </div>
              );
            }
          })
      );
    }
  }
  return (
    <div
      onClick={() => {
        setConfirmNewPasswordTooltip();
        setNewPasswordTooltip();
        setConfirmNewPasswordErrorText();
        setNewPasswordErrorText();
        setConfirmNewPasswordInputClass();
        setNewPasswordInputClass();
      }}
    >
      <NavbarComponent
        domain={domain}
        curUser={curUser}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"black"}
      />
      <div className="change-password-page__form-container">
        <h1>Reset Password</h1>
        <div style={{ width: "100%" }}>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="change-password-page__input-container">
              <label htmlFor="newPassInput">
                New Password: {newPasswordErrorText}
              </label>
              <input
                id="newPassInput"
                className={newPasswordInputClass}
                type={newPasswordInputType}
                onChange={(e) => setNewPassword(e.target.value)}
              ></input>
              <FontAwesomeIcon
                icon={faEye}
                className={"change-password-page__eye-icon"}
                onMouseDown={() => setNewPasswordInputType("text")}
                onMouseUp={() => setNewPasswordInputType("password")}
              />
              {newPasswordTooltip}
            </div>
            <div className="change-password-page__input-container">
              <label htmlFor="confirmNewPassInput">
                Confirm New Password: {confirmNewPasswordErrorText}
              </label>
              <input
                id="confirmNewPassInput"
                className={confirmNewPasswordInputClass}
                type={confirmNewPasswordInputType}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              ></input>
              <FontAwesomeIcon
                icon={faEye}
                className={"change-password-page__eye-icon-last"}
                onMouseDown={() => setConfirmNewPasswordInputType("text")}
                onMouseUp={() => setConfirmNewPasswordInputType("password")}
              />
              {confirmNewPasswordTooltip}

              <div className="change-password-page__buttons-container">
                <div className="change-password-page__buttons-container-subcontainer">
                  {changePasswordButton}
                  <button
                    onClick={() => navigate(`/`)}
                    className="change-password-page__cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordResetPage;
