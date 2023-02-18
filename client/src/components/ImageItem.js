import { React, useEffect, useState } from "react";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faSpinner,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const ImageItem = ({
  image,
  deleteImageFromBackEnd,
  identifierForScroll,
  newItemRef,
}) => {
  let imageStatusIcon;
  let imageBanner;

  if (image.isUploading) {
    imageStatusIcon = <FontAwesomeIcon icon={faSpinner} className="fa-spin" />;
    imageBanner = (
      <li className="upload-page__image-item" key={image.name} ref={newItemRef}>
        <div className="upload-page__image-item-div">
          <img src={image.secure_url}></img>
        </div>

        <div className="upload-page__image-item-title">
          {image.name
            .replace(".jpg", "")
            .replace(".png", "")
            .replace(".jpeg", "")}
        </div>
        <div className="upload-page__uploading-icon">{imageStatusIcon}</div>
      </li>
    );
  } else if (!image.isUploading && !image.isError) {
    imageStatusIcon = (
      <FontAwesomeIcon
        className="upload-page__trash-icon"
        icon={faTrash}
        fontSize={20}
        onClick={() => deleteImageFromBackEnd(image.name, image.publicId)}
      />
    );
    imageBanner = (
      <li className="upload-page__image-item" key={image.name}>
        <img
          src={
            image.secure_url.slice(0, 50) +
            "q_60/c_scale,w_400/dpr_auto/" +
            image.secure_url.slice(50, image.secure_url.lastIndexOf(".")) +
            ".jpg"
          }
        ></img>
        <div className="upload-page__image-item-title">
          {image.name
            .replace(".jpg", "")
            .replace(".png", "")
            .replace(".jpeg", "")}
        </div>
        <div className="upload-page__trash-icon">{imageStatusIcon}</div>
      </li>
    );
  } else if (!image.isUploading && image.isError) {
    imageStatusIcon = (
      <FontAwesomeIcon
        icon={faXmark}
        fontSize={30}
        onClick={() => deleteImageFromBackEnd(image.name, image.publicId)}
        className="upload-page__image-item-error-x-icon"
      />
    );
    imageBanner = (
      <li
        className="upload-page__image-item-error-helper upload-page__image-item"
        key={image.name}
      >
        {/* <img src={image.secure_url} width={100} height={100}></img> */}
        <div>JPG, JPEG or PNG Only</div>
        <div className="upload-page__image-item-title">
          {image.name
            .replace(".jpg", "")
            .replace(".png", "")
            .replace(".jpeg", "")}
        </div>
        <div className="upload-page__uploading-icon">{imageStatusIcon}</div>
      </li>
    );
  }

  return <div>{imageBanner}</div>;
};

export default ImageItem;
