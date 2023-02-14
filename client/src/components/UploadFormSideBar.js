import { React, useState, useEffect } from "react";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const UploadFormSideBar = ({ imagesToUpload }) => {
  return (
    <div className="upload-page__upload-form-side-bar-container">
      <button>
        <FontAwesomeIcon
          icon={faPlus}
          className="upload-page__upload-form-side-bar-add-icon"
        />
      </button>
      {imagesToUpload?.map((image) => (
        <a href="#">
          <img src={image.secure_url}></img>
        </a>
      ))}
    </div>
  );
};

export default UploadFormSideBar;
