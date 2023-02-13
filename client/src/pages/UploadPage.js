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
      <div className="uploadPageContainer">
        <div className="uploadFormListContainer">
          <UploadForm
            curUser={curUser}
            imagesToUpload={imagesToUpload}
            imageError={imageError}
            setImageError={setImageError}
            setImagesToUpload={setImagesToUpload}
            removeImageFromUploadFrontEnd={removeImageFromUploadFrontEnd}
          />
          <FileList
            imagesToUpload={imagesToUpload}
            removeImageFromUploadFrontEnd={removeImageFromUploadFrontEnd}
          />
          <div>
            All done? Edit in{" "}
            <a href={`/Account/${curUser}/My-Pics/most-recent/all-types`}>
              My Pics
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
