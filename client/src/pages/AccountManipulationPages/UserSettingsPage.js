import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//components
import NavbarComponent from "../../components/NavbarComponent";
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
  curUser,
  isLoggedIn,
  isJustDeleted,
  setIsJustDeleted,
  setLoggedIn,
}) => {
  //navigate
  const navigate = useNavigate();

  //auth
  const { dispatch } = useAuthContext();

  //bio and email value
  const [emailValue, setEmailValue] = useState("");
  const [bioValue, setBioValue] = useState("");

  //change password and email buttons to toggle between loading, success and error
  const [submitNewBioButton, setSubmitNewBioButton] = useState(
    <button type="submit" className="user-settings-page__change-bio-email-btn">
      Change Bio
    </button>
  );
  const [submitNewEmailButton, setSubmitNewEmailButton] = useState(
    <button type="submit" className="user-settings-page__change-bio-email-btn">
      Change Email
    </button>
  );

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
        `Are you sure you would like to permanantely delete your account "${curUser}"?`
      )
    ) {
      await fetch(`${domain}/Account/${curUser}/delUser/${pfpID}`, {
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

  const [userInfo, setUserInfo] = useState();
  const [userPFP, setPFP] = useState();

  useEffect(() => {
    console.log(process.env);
    async function userInfoFetch() {
      await fetch(`${domain}/${curUser}/info`, {
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
          })
      );
    }

    userInfoFetch();
  }, []);

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
  //cloudinary preset and file for formData
  var CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
  var targetFilesArray = [];
  var CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

  async function uploadHandler(e) {
    e.preventDefault();
    let fileTypeArr = ["image/png", "image/jpeg", "image/jpg"];
    setIsDone(false);
    for (var i = 0; i < e.target.files.length; i++) {
      const image = e.target.files[i];
      console.log(e.target.files);
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
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        formData.append("folder", "picpocket");

        var uploadToMongoBody;

        //send post request to cloudinary api upload endpoint url (have to use admin API
        //from cloudinary for multi upload). Upload preset only allows jpg, jpeg or png files.
        await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        )
          .then((result) =>
            result.json().then((resJSON) => (uploadToMongoBody = resJSON))
          )
          .catch((err) => {
            console.log(err);
          });
        //if file type is jpg, png or jpeg and successfully gets uploaded to cloudinary,
        //send to mongoDB
        if (uploadToMongoBody.public_id) {
          //add fields to fetch response to get ready to send to MongoDB
          uploadToMongoBody.likes = 0;
          uploadToMongoBody.likedBy = [];
          uploadToMongoBody.uploadedBy = curUser;
          uploadToMongoBody.title = image.name
            .replace(".jpg", "")
            .replace(".png", "")
            .replace(".jpeg", "");
          uploadToMongoBody.description = "";
          uploadToMongoBody.price = "$0.00";
          uploadToMongoBody.imageType = "Photo";

          //send to mongoDB
          fetch(`${domain}/upload/pfp/${curUser}/${pfpID}`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(uploadToMongoBody),
          })
            .then((res) => {
              setToastStatus("Success");
              setToastMessage("Your avatar was updated successfully.");
              toastDissappear();
              console.log(toastMessage);
              image.isUploading = false;
              setPfpToUpload(image);
              setPFP(uploadToMongoBody.secure_url);
              // notify_pfp_upload_success();

              image.secure_url = uploadToMongoBody.secure_url;
              image.publicId = uploadToMongoBody.public_id;
              image.assetId = uploadToMongoBody.asset_id;
              pfpID = uploadToMongoBody.secure_url.slice(
                72,
                uploadToMongoBody.secure_url.length - 4
              );
              // setImagesToUpload((imagesToUpload) => [...imagesToUpload]);
              // console.log(imagesToUpload);
            })
            .catch((err) => {
              console.error(err);
              // removeImageFromUpload(image.name);
            });
        } //else {
        //   image.isError = true;

        //   image.isUploading = false;
        //   setPfpToUpload(image);
        //   setIsDone(true);

        // setImageError(!imageError);
        // }
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
      body: JSON.stringify({ username: curUser, newBio: bioValue }),
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
  async function submitNewEmail(e) {
    e.preventDefault();
    setSubmitNewEmailButton(
      <button className="user-settings-page__change-bio-email-btn">
        Change Email
        <div className="contact-page__send-button-loading-icon">
          <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
        </div>
      </button>
    );
    await fetch(`${domain}/submit-new-email`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username: curUser, newEmail: emailValue }),
    }).then((response) =>
      response
        .json()
        .then((resJSON) => JSON.stringify(resJSON))
        .then((stringJSON) => JSON.parse(stringJSON))
        .then((parsedJSON) => {
          if (parsedJSON === "email changed") {
            setSubmitNewEmailButton(
              <button className="user-settings-page__change-bio-email-btn-success">
                Email Changed!
                <div>
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              </button>
            );
          } else {
            setSubmitNewEmailButton(
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
    <div>
      <NavbarComponent
        domain={domain}
        curUser={curUser}
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
          {curUser}
        </h3>
        <div className="user-settings-page__change-pfp-container">
          <img src={userPFP} className="profilePicBig" />
          <button className="user-settings-page__change-pfp-btn">
            <input
              className="user-settings-page__change-pfp-input"
              type="file"
              onChange={(e) => uploadHandler(e)}
            />
            <ChangePFPBtn
              pfpToUpload={pfpToUpload}
              setPfpToUpload={setPfpToUpload}
            />
          </button>
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
        <div className="user-settings-page__change-email-container">
          <form onSubmit={(e) => submitNewEmail(e)}>
            <h2>Email:</h2>
            <input
              value={emailValue}
              className="user-settings-page__email-input"
              onChange={(e) => {
                setEmailValue(e.target.value);
              }}
            ></input>
            {submitNewEmailButton}
          </form>
        </div>
        <div className="user-settings-page__change-pw-del-acc-btn-container">
          <a
            href={`/Account/${curUser}/Change-Password`}
            className="changePWBtn"
          >
            Change Password
          </a>
          <button className="deleteAccountBtn" onClick={delAcc}>
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
