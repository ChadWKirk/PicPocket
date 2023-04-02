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
  setIsPasswordJustChanged,
}) => {
  let navigate = useNavigate();
  const { username } = useParams();

  //if user tries to go to a user's change pw page that they aren't logged in as
  //change url to url with their curUser name
  //if user tries to get to change pw page and they aren't logged in at all, app.js takes cares of it by using Navigate element
  useEffect(() => {
    if (username !== curUser_hyphenated) {
      navigate(`/Account/${curUser_hyphenated}/Change-Password`);
    }
  }, []);

  const { dispatch } = useAuthContext();

  //fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  //input type
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmNewPasswordVisible, setIsConfirmNewPasswordVisible] =
    useState(false);
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
          username: curUser_real,
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
              setIsPasswordJustChanged(true);
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
        //when clicking anywhere, make all tooltips dissappear and if input is red due to error return it to default
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
      <header>
        <NavbarComponent
          domain={domain}
          curUser_real={curUser_real}
          curUser_hyphenated={curUser_hyphenated}
          isLoggedIn={isLoggedIn}
          navPositionClass={"fixed"}
          navColorClass={"black"}
        />
        <nav className="site-tree__container">
          <a
            className="site-tree__past-link"
            href={`/Account/${curUser_hyphenated}`}
          >
            Account
          </a>
          <div>{">"}</div>
          <div style={{ fontWeight: "500" }}>Change Password</div>
        </nav>
      </header>
      <main className="change-password-page__form-container">
        <header>
          <h1>Change Password</h1>
        </header>
        <div style={{ width: "100%" }}>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="change-password-page__input-container">
              <label htmlFor="currentPassInput">
                Current Password: {currentPasswordErrorText}
              </label>
              <input
                id="currentPassInput"
                className={currentPasswordInputClass}
                type={isCurrentPasswordVisible ? "text" : "password"}
                onChange={(e) => setCurrentPassword(e.target.value)}
              ></input>
              <div
                className="change-password-page__eye-icon-container"
                onClick={() =>
                  setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
                }
              >
                <FontAwesomeIcon
                  icon={faEye}
                  className={"change-password-page__eye-icon"}
                />
              </div>
              {currentPasswordTooltip}
            </div>
            <div className="change-password-page__input-container">
              <label htmlFor="newPassInput">
                New Password: {newPasswordErrorText}
              </label>
              <input
                id="newPassInput"
                className={newPasswordInputClass}
                type={isNewPasswordVisible ? "text" : "password"}
                onChange={(e) => setNewPassword(e.target.value)}
              ></input>
              <div
                className="change-password-page__eye-icon-container"
                onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
              >
                <FontAwesomeIcon
                  icon={faEye}
                  className={"change-password-page__eye-icon"}
                />
              </div>
              {newPasswordTooltip}
            </div>
            <div className="change-password-page__input-container">
              <label htmlFor="confirmNewPassInput">
                Confirm New Password: {confirmNewPasswordErrorText}
              </label>
              <input
                id="confirmNewPassInput"
                className={confirmNewPasswordInputClass}
                type={isConfirmNewPasswordVisible ? "text" : "password"}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              ></input>
              <div
                className="change-password-page__eye-icon-last-container"
                onClick={() =>
                  setIsConfirmNewPasswordVisible(!isConfirmNewPasswordVisible)
                }
              >
                <FontAwesomeIcon
                  icon={faEye}
                  className={"change-password-page__eye-icon-last"}
                />
              </div>

              {confirmNewPasswordTooltip}

              <div className="change-password-page__buttons-container">
                <div className="change-password-page__buttons-container-subcontainer">
                  {changePasswordButton}
                  <a
                    href={`/Account/${curUser_hyphenated}`}
                    className="change-password-page__cancel-button"
                  >
                    Cancel
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChangePasswordPage;
