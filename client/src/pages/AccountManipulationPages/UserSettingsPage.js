import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//components
import NavbarComponent from "../../components/NavbarComponent";
import TooltipForInputField from "../../components/TooltipForInputField";
import { useAuthContext } from "../../context/useAuthContext";
import ChangePFPBtn from "../../components/ChangePFPBtn";
import Toast from "../../components/Toast";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateRight,
  faCheck,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const UserSettingsPage = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
  isJustDeleted,
  setIsJustDeleted,
  setLoggedIn,
}) => {
  //navigate
  const navigate = useNavigate();

  //if user tries to go to a user's account settings page that they aren't logged in as
  //change url to url with their curUser name
  //if user tries to get to user settings page and they aren't logged in at all, app.js takes cares of it by using Navigate element
  useEffect(() => {
    navigate(`/Account/${curUser_hyphenated}`);
  }, []);

  //auth
  const { dispatch } = useAuthContext();

  //whether user is able to submit form. Disabled after one successful change email, and while loading (to prevent user from being able to press enter on form while loading or success)
  const [canSubmit, setCanSubmit] = useState(true);

  //input classes for red border on error
  const [emailInputClass, setEmailInputClass] = useState(
    "user-settings-page__email-input"
  );
  const [passwordInputClass, setPasswordInputClass] = useState(
    "user-settings-page__email-input"
  );

  //error messages for email/password fields
  const [emailErrorText, setEmailErrorText] = useState();
  const [passwordErrorText, setPasswordErrorText] = useState();

  //tooltip for empty email or password field
  const [emailTooltip, setEmailTooltip] = useState();
  const [passwordTooltip, setPasswordTooltip] = useState();

  //account type. if oauth don't display change email or change password stuff
  const [isOAuthAccountType, setIsOAuthAccountType] = useState();

  //get user's info
  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    console.log(process.env);
    async function userInfoFetch() {
      await fetch(`${domain}/${curUser_real}/info`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => {
            setUserInfo(parsedJSON[0]);
            setEmailValue(parsedJSON[0].email);
            setBioValue(parsedJSON[0].bio);
            setPFP(parsedJSON[0].pfp);
            if (parsedJSON[0].type == "normal") {
              setIsOAuthAccountType(false);
            } else {
              setIsOAuthAccountType(true);
            }
          })
      );
    }

    userInfoFetch();
  }, []);

  //change password, change email and resend verification buttons to toggle between loading, success and error
  const [submitNewBioButton, setSubmitNewBioButton] = useState(
    <button type="submit" className="user-settings-page__change-bio-email-btn">
      Change Bio
    </button>
  );
  const [changeEmailButton, setChangeEmailButton] = useState(
    <button
      type="submit"
      onClick={(e) => console.log(emailValue)}
      className="user-settings-page__change-bio-email-btn"
    >
      Change Email
    </button>
  );
  const [resendVerificationButton, setResendVerificationButton] = useState(
    <div
      onClick={(e) => console.log(emailValue)}
      className="user-settings-page__change-bio-email-btn"
    >
      Resend Verification Link
    </div>
  );
  //rerender these once userinfo is fetched (above useEffect) so the bio and email values are accurate
  useEffect(() => {
    setSubmitNewBioButton(
      <button
        type="submit"
        className="user-settings-page__change-bio-email-btn"
      >
        Change Bio
      </button>
    );
    setChangeEmailButton(
      <button
        type="submit"
        className="user-settings-page__change-bio-email-btn"
      >
        Change Email
      </button>
    );
    setResendVerificationButton(
      <div
        onClick={(e) => resendVerificationLink(e)}
        className="user-settings-page__change-bio-email-btn"
      >
        Resend Verification Link
      </div>
    );
  }, [userInfo]);

  //bio and email value
  const [emailValue, setEmailValue] = useState("");
  const [bioValue, setBioValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  //button to allow user to change bio again after change attempt
  const [changeBioAgainButton, setChangeBioAgainButton] = useState();

  const [toastMessage, setToastMessage] = useState();
  const [toastStatus, setToastStatus] = useState("Invisible");
  function toastDissappear() {
    setTimeout(() => {
      setToastStatus("Invisible");
      setToastMessage();
    }, 3000);
  }

  const [pfpToUpload, setPfpToUpload] = useState("");
  const [isDone, setIsDone] = useState(false);

  async function delAcc(e) {
    e.preventDefault();

    if (
      window.confirm(
        `Are you sure you would like to permanantely delete your account "${curUser_real}"?`
      )
    ) {
      await fetch(`${domain}/Account/${curUser_real}/delUser/${pfpID}`, {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      }).then(() =>
        setTimeout(() => {
          setIsJustDeleted(true);
          //remove user from local storage
          localStorage.removeItem("user");
          //dispatch logout action
          dispatch({ type: "LOGOUT" });
          navigate("/");
        }, 500)
      );
    } else {
      console.log("nothing happened");
    }
  }

  const [userPFP, setPFP] = useState();

  //bio textarea char count - maxLength is in HTML on textarea element
  const [bioCharCount, setBioCharCount] = useState(bioValue.length);

  useEffect(() => {
    setBioCharCount(bioValue.length);
  }, [bioValue]);

  //slicing secure url to exclude the picpocket part and the extension at the end
  //to add picpocket/ back to in the back end. had to remove the slash part because it messed up the route
  let pfpID;
  if (userPFP) {
    pfpID = userPFP.slice(72, userPFP.length - 4);
    console.log(pfpID);
  }

  //upload profile pic
  // file for formData
  var targetFilesArray = [];

  async function uploadHandler(e) {
    e.preventDefault();
    let fileTypeArr = ["image/png", "image/jpeg", "image/jpg"];
    setIsDone(false);
    for (var i = 0; i < e.target.files.length; i++) {
      const image = e.target.files[i];
      console.log(image);
      //if user tries to upload image that isn't allowed
      if (fileTypeArr.indexOf(e.target.files[i].type.toLowerCase()) < 0) {
        image.isUploading = true;
        setPfpToUpload(image);
        setTimeout(() => {
          image.isUploading = false;
          image.isError = true;
          setPfpToUpload(image);
          setIsDone(true);
          setToastStatus("Error");
          setToastMessage("Error. Only JPEG, JPG and PNG files allowed.");
          toastDissappear();
          // notify_pfp_upload_failure();
        }, 80);

        console.log(e.target.files[i].type);
        image.isError = false;
        return;
      } else {
        image.isUploading = true;
        setPfpToUpload(image);
        targetFilesArray.push(image);
        // setImagesToUpload((imagesToUpload) => [...imagesToUpload, image]);
        console.log(targetFilesArray + " target files");

        //to send in fetch
        const formData = new FormData();
        formData.append("file", image);
        formData.append("uploaderName", curUser_real);

        await fetch(`${domain}/pfpUpload/${curUser_real}/${pfpID}`, {
          method: "POST",
          body: formData,
        })
          .then((response) =>
            response
              .json()
              .then((resJSON) => JSON.stringify(resJSON))
              .then((stringJSON) => JSON.parse(stringJSON))
              .then((parsedJSON) => {
                setToastStatus("Success");
                setToastMessage("Your avatar was updated successfully.");
                toastDissappear();
                console.log(toastMessage);
                image.isUploading = false;
                setPfpToUpload(image);
                setPFP(parsedJSON.secure_url);
                // notify_pfp_upload_success();

                image.secure_url = parsedJSON.secure_url;
                image.publicId = parsedJSON.public_id;
                image.assetId = parsedJSON.asset_id;
                pfpID = parsedJSON.secure_url.slice(
                  72,
                  parsedJSON.secure_url.length - 4
                );
              })
          )
          .catch((err) => {
            console.error(err);
            // removeImageFromUpload(image.name);
          });
      }
    }
  }

  //change bio
  async function submitNewBio(e) {
    e.preventDefault();
    setSubmitNewBioButton(
      <button className="user-settings-page__change-bio-email-btn">
        Change Bio
        <div className="user-settings-page__change-button-loading-icon">
          <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
        </div>
      </button>
    );
    await fetch(`${domain}/submit-new-bio`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username: curUser_real, newBio: bioValue }),
    }).then((response) =>
      response
        .json()
        .then((resJSON) => JSON.stringify(resJSON))
        .then((stringJSON) => JSON.parse(stringJSON))
        .then((parsedJSON) => {
          if (parsedJSON === "bio changed") {
            setSubmitNewBioButton(
              <button className="user-settings-page__change-bio-email-btn-success">
                Bio Changed!
                <div>
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              </button>
            );
            setChangeBioAgainButton(
              <div
                onClick={() => {
                  setSubmitNewBioButton(
                    <button
                      type="submit"
                      className="user-settings-page__change-bio-email-btn"
                    >
                      Change Bio
                    </button>
                  );
                  setChangeBioAgainButton();
                }}
                className="user-settings-page__change-bio-email-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon icon={faArrowRotateRight} />
              </div>
            );
          } else {
            setSubmitNewBioButton(
              <button className="user-settings-page__change-bio-email-btn-fail">
                Error
                <div>
                  <FontAwesomeIcon icon={faXmark} />
                </div>
              </button>
            );
            setChangeBioAgainButton(
              <div
                onClick={() => {
                  setSubmitNewBioButton(
                    <button
                      type="submit"
                      className="user-settings-page__change-bio-email-btn"
                    >
                      Change Bio
                    </button>
                  );
                  setChangeBioAgainButton();
                }}
                className="user-settings-page__change-bio-email-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon icon={faArrowRotateRight} />
              </div>
            );
          }
        })
    );
  }

  //change email
  async function changeEmail(e) {
    e.preventDefault();
    if (!canSubmit) {
      return;
    } else if (emailValue.length === 0) {
      setEmailTooltip(
        <TooltipForInputField
          Message={"Please fill out this field."}
          Type={"Yellow Warning"}
        />
      );
    } else if (passwordValue.length === 0) {
      setPasswordTooltip(
        <TooltipForInputField
          Message={"Please fill out this field."}
          Type={"Yellow Warning"}
        />
      );
    } else {
      setChangeEmailButton(
        <button
          className="user-settings-page__change-bio-email-btn"
          style={{ pointerEvents: "none" }}
        >
          Change Email
          <div className="user-settings-page__change-button-loading-icon">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
          </div>
        </button>
      );
      setCanSubmit(false);
      await fetch(`${domain}/change-email`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          username: curUser_real,
          email: emailValue,
          password: passwordValue,
        }),
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => {
            if (parsedJSON === "email changed") {
              setChangeEmailButton(
                <button className="user-settings-page__change-bio-email-btn-success">
                  Email Changed!
                  <div>
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                </button>
              );
              //rerender verification button to get new email value
              setResendVerificationButton(
                <button className="user-settings-page__change-bio-email-btn-success">
                  Verification Link Sent!
                  <div>
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                </button>
              );
            } else if (parsedJSON === "email already exists") {
              console.log("email already exists");
              setEmailInputClass(
                "user-settings-page__email-input red-input-border"
              );
              setEmailErrorText("Email already exists");
              setChangeEmailButton(
                <button
                  type="submit"
                  className="user-settings-page__change-bio-email-btn"
                >
                  Change Email
                </button>
              );
              setCanSubmit(true);
            } else if (parsedJSON === "email is not valid") {
              console.log("email is not valid");
              setEmailInputClass(
                "user-settings-page__email-input red-input-border"
              );
              setEmailErrorText("Email is not a valid email address");
              setChangeEmailButton(
                <button
                  type="submit"
                  className="user-settings-page__change-bio-email-btn"
                >
                  Change Email
                </button>
              );
              setCanSubmit(true);
            } else if (parsedJSON === "Incorrect password.") {
              setPasswordErrorText("Incorrect password.");
              setPasswordInputClass(
                "user-settings-page__email-input red-input-border"
              );
              setChangeEmailButton(
                <button
                  type="submit"
                  className="user-settings-page__change-bio-email-btn"
                >
                  Change Email
                </button>
              );
              setCanSubmit(true);
            } else {
              setChangeEmailButton(
                <button className="user-settings-page__change-bio-email-btn-fail">
                  Error
                  <div>
                    <FontAwesomeIcon icon={faXmark} />
                  </div>
                </button>
              );
              setCanSubmit(true);
            }
          })
      );
    }
  }

  //resend verification link
  async function resendVerificationLink(e) {
    e.preventDefault();
    setResendVerificationButton(
      <button className="user-settings-page__change-bio-email-btn">
        Resend Verification Link
        <div className="user-settings-page__change-button-loading-icon">
          <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
        </div>
      </button>
    );
    await fetch(`${domain}/resend-verification-link`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username: curUser_real, email: emailValue }),
    }).then((response) =>
      response
        .json()
        .then((resJSON) => JSON.stringify(resJSON))
        .then((stringJSON) => JSON.parse(stringJSON))
        .then((parsedJSON) => {
          if (parsedJSON === "verification resent") {
            setResendVerificationButton(
              <button className="user-settings-page__change-bio-email-btn-success">
                Verification Link Sent!
                <div>
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              </button>
            );
          } else {
            setResendVerificationButton(
              <button className="user-settings-page__change-bio-email-btn-fail">
                Error
                <div>
                  <FontAwesomeIcon icon={faXmark} />
                </div>
              </button>
            );
          }
        })
    );
  }

  function closeToast() {
    setToastMessage();
    setToastStatus();
  }

  // let emailValue = email;
  // function onChangeEmail(e) {
  //   emailValue = e.target.value;
  // }

  return (
    <div
      onClick={() => {
        setEmailErrorText();
        setEmailInputClass("user-settings-page__email-input");
        setEmailTooltip();
        setPasswordErrorText();
        setPasswordInputClass("user-settings-page__email-input");
        setPasswordTooltip();
      }}
    >
      <NavbarComponent
        domain={domain}
        curUser_real={curUser_real}
        curUser_hyphenated={curUser_hyphenated}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      <div className="user-settings-page__contents-container">
        <h1>Profile Settings</h1>
        <h3
          style={{
            margin: "auto",
            marginTop: "1rem",
            color: "#2C343E",
            fontSize: "4rem",
            lineHeight: "1.2",
          }}
        >
          {curUser_real}
        </h3>
        <div className="user-settings-page__change-pfp-container">
          <img src={userPFP} className="profilePicBig" />
          <form>
            <button className="user-settings-page__change-pfp-btn">
              <input
                className="user-settings-page__change-pfp-input"
                type="file"
                name="file"
                onChange={(e) => uploadHandler(e)}
              />
              <ChangePFPBtn
                pfpToUpload={pfpToUpload}
                setPfpToUpload={setPfpToUpload}
              />
            </button>
          </form>

          <Toast
            status={toastStatus}
            message={toastMessage}
            closeToast={closeToast}
          />
        </div>
        <div className="user-settings-page__change-bio-container">
          <form onSubmit={(e) => submitNewBio(e)}>
            <h2>Short Bio:</h2>
            <textarea
              maxLength={70}
              className="user-settings-page__bio-textarea"
              value={bioValue}
              onChange={(e) => {
                setBioValue(e.target.value);
                console.log(bioValue);
              }}
            ></textarea>
            <p className="user-settings-page__bio-char-count">
              {bioCharCount}/{70}
            </p>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              {submitNewBioButton}
              {changeBioAgainButton}
            </div>
          </form>
        </div>
        {!isOAuthAccountType && (
          <div className="user-settings-page__change-email-container">
            <form onSubmit={(e) => changeEmail(e)}>
              <div style={{ position: "relative" }}>
                <h2>
                  Email:{" "}
                  <p className="sign-in-page__already-exists-message">
                    {emailErrorText}
                  </p>
                </h2>

                <input
                  value={emailValue}
                  className={emailInputClass}
                  onChange={(e) => {
                    setEmailValue(e.target.value);
                  }}
                ></input>
                {emailTooltip}
              </div>

              <div
                className="user-settings-page__email-buttons-container"
                style={{ display: "flex", gap: "0.8rem" }}
              ></div>
              <div style={{ position: "relative" }}>
                <h2
                  style={{
                    display: "flex",
                    gap: "0.1rem",
                    fontSize: "1rem",
                    marginBottom: "-0.25rem",
                    marginTop: "1rem",
                  }}
                >
                  Password
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "red",
                      display: "inline",
                    }}
                  >
                    *
                  </p>
                  :{" "}
                  <p className="sign-in-page__already-exists-message">
                    {passwordErrorText}
                  </p>
                </h2>

                <input
                  type="password"
                  value={passwordValue}
                  className={passwordInputClass}
                  onChange={(e) => {
                    setPasswordValue(e.target.value);
                  }}
                ></input>
                {passwordTooltip}
              </div>

              <div
                className="user-settings-page__email-buttons-container"
                style={{ display: "flex", gap: "0.8rem" }}
              >
                {changeEmailButton}
                {resendVerificationButton}
              </div>
            </form>
          </div>
        )}
        <div className="user-settings-page__change-pw-del-acc-btn-container">
          {!isOAuthAccountType && (
            <a
              href={`/Account/${curUser_hyphenated}/Change-Password`}
              className="changePWBtn"
            >
              Change Password
            </a>
          )}
          <button className="deleteAccountBtn" onClick={delAcc}>
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
