import React from "react";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faSpinner,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const changePFPBtn = ({ pfpToUpload, setPfpToUpload, image }) => {
  let imageStatusIcon;
  let imageBanner = "Change Image";

  if (pfpToUpload.isUploading) {
    imageBanner = (
      <FontAwesomeIcon
        icon={faSpinner}
        className="fa-spin"
        style={{ width: "107px" }}
      />
    );
  } else if (!pfpToUpload.isUploading && !pfpToUpload.isError) {
    imageBanner = "Change Image";
  } else if (!pfpToUpload.isUploading && pfpToUpload.isError) {
    imageBanner = "Change Image";
  }

  return <div>{imageBanner}</div>;
};

export default changePFPBtn;
