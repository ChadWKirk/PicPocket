import React, { useState } from "react";
import NavbarComponent from "../components/NavbarComponent";
import UploadForm from "../components/UploadForm";
import FileList from "../components/FileList";

const UploadPage = ({ curUser, loggedIn }) => {
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
        curUser={curUser}
        loggedIn={loggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      {/* <div className="upload-page__container"> */}
      <div className="upload-page__form-and-list-container">
        <UploadForm
          curUser={curUser}
          imagesToUpload={imagesToUpload}
          imageError={imageError}
          setImageError={setImageError}
          setImagesToUpload={setImagesToUpload}
          removeImageFromUploadFrontEnd={removeImageFromUploadFrontEnd}
        />

        {imagesToUpload[0] && (
          <div className="upload-page__all-done-banner-container">
            All done?
            <a href={`/Account/${curUser}/My-Pics/most-recent/all-types`}>
              Edit Images
            </a>
          </div>
        )}
      </div>
      {/* </div> */}
    </div>
  );
};

export default UploadPage;
