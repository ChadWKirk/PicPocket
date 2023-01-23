import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import ChangePFPBtn from "../../components/ChangePFPBtn";
import Toast from "../../components/Toast";
import { useNavigate } from "react-router-dom";

const UserSettingsPage = ({ curUser, loggedIn }) => {
  const [toastMessage, setToastMessage] = useState();
  const [toastStatus, setToastStatus] = useState();
  function toastDissappear() {
    setTimeout(() => {
      setToastStatus();
      setToastMessage();
    }, 3000);
  }
  const navigate = useNavigate();

  const [pfpToUpload, setPfpToUpload] = useState("");
  const [isDone, setIsDone] = useState(false);

  async function delAcc(e) {
    e.preventDefault();

    if (
      window.confirm(
        `Are you sure you would like to permanantely delete your account "${curUser}"?`
      )
    ) {
      await fetch(`http://localhost:5000/Account/${curUser}/delUser/${pfpID}`, {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      }).then(() =>
        setTimeout(() => {
          window.location.href = "/delSuccess";
        }, 500)
      );
    } else {
      console.log("nothing happened");
    }
  }

  const [userInfo, setUserInfo] = useState();
  const [userPFP, setPFP] = useState();

  useEffect(() => {
    async function userInfoFetch() {
      await fetch(`http://localhost:5000/${curUser}/info`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => {
            setUserInfo(parsedJSON[0]);
            setPFP(parsedJSON[0].pfp);
          })
      );
    }

    userInfoFetch();
  }, []);

  let bio;
  let email;
  if (userInfo) {
    bio = userInfo.bio;
    email = userInfo.email;
  }
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
  let CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

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
          fetch(`http://localhost:5000/upload/pfp/${curUser}/${pfpID}`, {
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

  function closeToast() {
    setToastMessage();
    setToastStatus();
  }

  return (
    <div>
      <NavBar curUser={curUser} loggedIn={loggedIn} />
      <div>
        <img src={userPFP} className="profilePicBig" />
        <div>
          <button className="changePFPBtn">
            <input
              className="changePFPInput"
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
      </div>
      <div>
        <h2>bio:</h2>
        <textarea className="textArea1" placeholder={bio}></textarea>
        <button className="navbarClickThisButton">Change bio</button>
      </div>
      <div>
        <h2>Email:</h2>
        <input placeholder={email}></input>
        <button className="navbarClickThisButton">Change Email</button>
      </div>

      <button className="changePWBtn">Change Password</button>
      <a href="" onClick={delAcc}>
        <button className="deleteAccountBtn">Delete account</button>
      </a>
    </div>
  );
};

export default UserSettingsPage;
