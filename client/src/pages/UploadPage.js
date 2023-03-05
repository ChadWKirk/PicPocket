import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
//components
import NavbarComponent from "../components/NavbarComponent";
import UploadForm from "../components/UploadForm";
import FileList from "../components/FileList";
import RedBanner from "../components/RedBanner";
import GreenBanner from "../components/GreenBanner";

const UploadPage = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
  isJustVerified,
  setIsJustVerified,
}) => {
  let navigate = useNavigate();
  const { username } = useParams();

  //if user tries to go to a user's upload page that they aren't logged in as
  //change url to url with their curUser name
  //if user tries to get to upload page and they aren't logged in at all, app.js takes cares of it by using Navigate element
  useEffect(() => {
    if (username !== curUser_hyphenated) {
      navigate(`/${curUser_hyphenated}/upload`);
    }
  }, []);

  //get user's info
  const [userInfo, setUserInfo] = useState();
  const [verifiedValue, setVerifiedValue] = useState();
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
            setVerifiedValue(parsedJSON[0].verified);
          })
      );
    }

    userInfoFetch();
  }, []);

  //set banner whether verified is false, true or just verified
  const [banner, setBanner] = useState();
  useEffect(() => {
    if (verifiedValue === false) {
      setBanner(
        <RedBanner
          Message={
            "Please confirm your email before uploading. To resend the verification link, go to User Settings and click Resend Verification Link."
          }
        />
      );
    } else if (verifiedValue === true && isJustVerified === true) {
      setBanner(
        <GreenBanner
          Message={
            "Your email has been successfully verified! You can now upload Pics!"
          }
        />
      );
    } else if (verifiedValue === true) {
      setBanner();
    }
  }, [verifiedValue]);

  const [imagesToUpload, setImagesToUpload] = useState([]);
  const [imageError, setImageError] = useState(false);

  function removeImageFromUploadFrontEnd(imageName) {
    setImagesToUpload(
      imagesToUpload.filter((image) => image.name !== imageName)
    );
  }

  return (
    <div>
      <NavbarComponent
        domain={domain}
        curUser_real={curUser_real}
        curUser_hyphenated={curUser_hyphenated}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      {banner}
      {/* <div className="upload-page__container"> */}
      <div className="upload-page__form-and-list-container">
        <UploadForm
          domain={domain}
          curUser_real={curUser_real}
          curUser_hyphenated={curUser_hyphenated}
          imagesToUpload={imagesToUpload}
          imageError={imageError}
          setImageError={setImageError}
          setImagesToUpload={setImagesToUpload}
          removeImageFromUploadFrontEnd={removeImageFromUploadFrontEnd}
          verifiedValue={verifiedValue}
        />
      </div>
      {/* </div> */}
    </div>
  );
};

export default UploadPage;
