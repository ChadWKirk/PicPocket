import React, { useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import UploadForm from "../components/UploadForm";
import FileList from "../components/FileList";
import RedBanner from "../components/RedBanner";

const UploadPage = ({ domain, curUser, isLoggedIn }) => {
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
        curUser={curUser}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      {/* <RedBanner Message={"Please confirm your email before uploading."} /> */}
      {/* <div className="upload-page__container"> */}
      <div className="upload-page__form-and-list-container">
        <UploadForm
          domain={domain}
          curUser={curUser}
          imagesToUpload={imagesToUpload}
          imageError={imageError}
          setImageError={setImageError}
          setImagesToUpload={setImagesToUpload}
          removeImageFromUploadFrontEnd={removeImageFromUploadFrontEnd}
        />
      </div>
      {/* </div> */}
    </div>
  );
};

export default UploadPage;
