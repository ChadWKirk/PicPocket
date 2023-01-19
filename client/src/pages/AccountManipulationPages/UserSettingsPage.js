import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Logo from "../../components/Logo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import DropDown from "../../components/DropDown";

const UserSettingsPage = ({ curUser, loggedIn }) => {
  const navigate = useNavigate();
  console.log(curUser + " this is username in url");
  async function delAcc(e) {
    e.preventDefault();

    if (
      window.confirm(
        `Are you sure you would like to permanantely delete your account "${curUser}"?`
      )
    ) {
      await fetch(`http://localhost:5000/Account/${curUser}/delUser`, {
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

  //upload profile pic
  //cloudinary preset and file for formData
  var CLOUDINARY_UPLOAD_PRESET = "qpexpq57";
  var targetFilesArray = [];

  async function uploadHandler(e) {
    e.preventDefault();

    for (var i = 0; i < e.target.files.length; i++) {
      const image = e.target.files[i];
      image.isUploading = true;
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
      await fetch("https://api.cloudinary.com/v1_1/dtyg4ctfr/upload", {
        method: "POST",
        body: formData,
      })
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
        fetch(`http://localhost:5000/upload/pfp/${curUser}`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(uploadToMongoBody),
        })
          .then((res) => {
            image.isUploading = false;
            setPFP(uploadToMongoBody.secure_url);
            image.secure_url = uploadToMongoBody.secure_url;
            image.publicId = uploadToMongoBody.public_id;
            image.assetId = uploadToMongoBody.asset_id;
            // setImagesToUpload((imagesToUpload) => [...imagesToUpload]);
            // console.log(imagesToUpload);
          })
          .catch((err) => {
            console.error(err);
            // removeImageFromUpload(image.name);
          });
      } else {
        image.isError = true;
        image.isUploading = false;
        // setImageError(!imageError);
      }
    }
  }

  return (
    <div>
      <NavBar curUser={curUser} loggedIn={loggedIn} />
      <div>
        <img src={userPFP} className="profilePicBig" />
        <div>
          <input type="file" onChange={(e) => uploadHandler(e)} />
          <button className="navbarClickThisButton">Change Image</button>
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
