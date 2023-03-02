import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
//components
import TooltipForInputField from "../../components/TooltipForInputField";
import NavbarComponent from "../../components/NavbarComponent";
//auth
import { useAuthContext } from "../../context/useAuthContext";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSpinner } from "@fortawesome/free-solid-svg-icons";

const ChangePasswordPage = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
}) => {
  let navigate = useNavigate();
  const { dispatch } = useAuthContext();

  //fields
  const { username } = useParams();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  //input type
  const [currentPasswordInputType, setCurrentPasswordInputType] =
    useState("password");
  const [newPasswordInputType, setNewPasswordInputType] = useState("password");
  const [confirmNewPasswordInputType, setConfirmNewPasswordInputType] =
    useState("password");

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

  //Change Password button
  const [changePasswordButton, setChangePasswordButton] = useState(
    <button type="submit">Change Password</button>
  );

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
      setChangePasswordButton(
        <button type="submit" id="loadingSucFailBtn">
          Change Password
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
              //remove user from local storage
              localStorage.removeItem("user");
              //dispatch logout action
              dispatch({ type: "LOGOUT" });
              //navigate to success page
              navigate("/Change-Password-Success");
            } else if (parsedJSON == "password too weak") {
              setChangePasswordButton(
                <button type="submit">Change Password</button>
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
                <button type="submit">Change Password</button>
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
                <button type="submit">Change Password</button>
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
            } else {
              setChangePasswordButton(
                <button type="submit">Change Password</button>
              );
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
        curUser_real={curUser_real}
        curUser_hyphenated={curUser_hyphenated}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"black"}
      />
      <div className="site-tree__container">
        <a
          className="site-tree__past-link"
          href={`/Account/${curUser_hyphenated}`}
        >
          Account
        </a>
        <div>{">"}</div>
        <div style={{ fontWeight: "500" }}>Change Password</div>
      </div>
      <div className="change-password-page__form-container">
        <h1>Change Password</h1>
        <div style={{ width: "100%" }}>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="change-password-page__input-container">
              <label htmlFor="currentPassInput">
                Current Password: {currentPasswordErrorText}
              </label>
              <input
                id="currentPassInput"
                className={currentPasswordInputClass}
                type={currentPasswordInputType}
                onChange={(e) => setCurrentPassword(e.target.value)}
              ></input>
              <FontAwesomeIcon
                icon={faEye}
                className={"change-password-page__eye-icon"}
                onMouseDown={() => setCurrentPasswordInputType("text")}
                onMouseUp={() => setCurrentPasswordInputType("password")}
              />
              {currentPasswordTooltip}
            </div>
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
                    onClick={() => navigate(`/Account/${curUser_hyphenated}`)}
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

export default ChangePasswordPage;
