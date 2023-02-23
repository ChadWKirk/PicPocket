import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
//components
import TooltipForInputField from "../../components/TooltipForInputField";
import NavbarComponent from "../../components/NavbarComponent";

const ChangePasswordPage = ({ domain, curUser, isLoggedIn }) => {
  let navigate = useNavigate();

  //fields
  const { username } = useParams();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  //tooltips
  const [currentPasswordTooltip, setCurrentPasswordTooltip] = useState();
  const [newPasswordTooltip, setNewPasswordTooltip] = useState();
  const [confirmNewPasswordTooltip, setConfirmNewPasswordTooltip] = useState();

  //Input Classes (to toggle between red border and regular)
  const [currentPasswordInputClass, setCurrentPasswordInputClass] = useState();
  const [newPasswordInputClass, setNewPasswordInputClass] = useState();
  const [confirmNewPasswordInputClass, setConfirmNewPasswordInputClass] =
    useState();

  //Error texts
  const [currentPasswordErrorText, setCurrentPasswordErrorText] = useState();
  const [newPasswordErrorText, setNewPasswordErrorText] = useState();
  const [confirmNewPasswordErrorText, setConfirmNewPasswordErrorText] =
    useState();

  async function onSubmit(e) {
    e.preventDefault();

    if (currentPassword.length === 0) {
      setCurrentPasswordTooltip(
        <TooltipForInputField
          Message={"Please fill out this field."}
          Type={"Yellow Warning"}
        />
      );
    } else if (newPassword.length === 0) {
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
      await fetch(`${domain}/change-password`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          username: username,
          currentPassword: currentPassword,
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
              console.log("password changed");
            } else if (parsedJSON == "password too weak") {
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
              setNewPasswordInputClass("red-input-border");
              setNewPasswordErrorText(
                <div className="sign-in-page__already-exists-message">
                  New password cannot match current password.
                </div>
              );
            } else if (
              parsedJSON == "New Password and Confirm New Password must match."
            ) {
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
            } else {
              setCurrentPasswordInputClass("red-input-border");
              setCurrentPasswordErrorText(
                <div className="sign-in-page__already-exists-message">
                  Incorrect current password.
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
        setCurrentPasswordTooltip();
        setNewPasswordTooltip();
        setConfirmNewPasswordErrorText();
        setCurrentPasswordErrorText();
        setNewPasswordErrorText();
        setConfirmNewPasswordInputClass();
        setNewPasswordInputClass();
        setCurrentPasswordInputClass();
      }}
    >
      <NavbarComponent
        domain={domain}
        curUser={curUser}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      <div className="change-password-page__form-container">
        <h1>Change Password</h1>
        <div>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="change-password-page__input-container">
              <label htmlFor="currentPassInput">
                Current Password: {currentPasswordErrorText}
              </label>
              <input
                id="currentPassInput"
                className={currentPasswordInputClass}
                onChange={(e) => setCurrentPassword(e.target.value)}
              ></input>
              {currentPasswordTooltip}
            </div>
            <div className="change-password-page__input-container">
              <label htmlFor="newPassInput">
                New Password: {newPasswordErrorText}
              </label>
              <input
                id="newPassInput"
                className={newPasswordInputClass}
                onChange={(e) => setNewPassword(e.target.value)}
              ></input>
              {newPasswordTooltip}
            </div>
            <div className="change-password-page__input-container">
              <label htmlFor="confirmNewPassInput">
                Confirm New Password: {confirmNewPasswordErrorText}
              </label>
              <input
                id="confirmNewPassInput"
                className={confirmNewPasswordInputClass}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              ></input>
              {confirmNewPasswordTooltip}
            </div>
            <button type="submit">Change Password</button>
            <button
              onClick={() => navigate(`/Account/${curUser}`)}
              className="change-password-page__cancel-button"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
