import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
//components
import TooltipForInputField from "../../../components/TooltipForInputField";
import NavbarComponent from "../../../components/NavbarComponent";
//auth
import { useAuthContext } from "../../../context/useAuthContext";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faSpinner,
  faXmark,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";

const ForgotPasswordResetPage = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
}) => {
  let navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const { token } = useParams();
  const { username } = useParams();

  //state of if token is expired or not (determined by the server in the /send-forgot-password-link post)
  const [isTokenExpired, setIsTokenExpired] = useState();

  //check if token is expired
  //display "token expired" page if token is expired
  useEffect(() => {
    console.log(token);
    async function checkIfTokenExpired() {
      await fetch(`${domain}/${username}/check-forgot-token/${token}`, {
        method: "GET",
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => {
            if (parsedJSON === "token expired") {
              console.log("token expired");
              setIsTokenExpired(true);
            } else if (parsedJSON === "no user") {
              setIsTokenExpired(true);
            } else {
              console.log("token not expired");
              setIsTokenExpired(false);
            }
          })
      );
    }
    checkIfTokenExpired();
  }, []);

  //fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // type for password input to toggle between text and password for eye ball functionality to view password in password field
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmNewPasswordVisible, setIsConfirmNewPasswordVisible] =
    useState(false);

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
        <button
          type="submit"
          id="loadingSucFailBtn"
          style={{ pointerEvents: "none" }}
        >
          Reset Password
          <div className="contact-page__send-button-loading-icon">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
          </div>
        </button>
      );
      await fetch(`${domain}/reset-password`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          username: username.split("-").join(" "),
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
        curUser_real={curUser_real}
        curUser_hyphenated={curUser_hyphenated}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"black"}
      />
      {!isTokenExpired && (
        <main className="change-password-page__form-container">
          <header>
            <h1>Reset Password</h1>
          </header>
          <div style={{ width: "100%" }}>
            <form onSubmit={(e) => onSubmit(e)}>
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
                    <a href="/" className="change-password-page__cancel-button">
                      Cancel
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      )}
      {isTokenExpired && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ color: "darkred", fontSize: "10rem" }}>
            <FontAwesomeIcon icon={faXmarkCircle} />
          </div>

          <h1 style={{ marginBottom: "3rem" }}>
            Sorry, but the token in your reset password link has expired
          </h1>
          <h3>
            Please go back to the <a href="/send-forgot">Forgot Password</a>{" "}
            page and send another link to yourself.
          </h3>
          <h3 style={{ marginTop: "2rem" }}>Thanks,</h3>
          <div
            style={{
              marginBottom: "15rem",
              fontWeight: "500",
              fontSize: "2rem",
            }}
          >
            PicPocket
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordResetPage;
