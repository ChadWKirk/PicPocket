import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faXmark,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

const Modal__ImageSelect = ({ imgTitleArrState }) => {
  const { imageTitle } = useParams();
  const [imgSrc, setImgSrc] = useState();
  //on load, pull img from url
  useEffect(() => {
    async function getImage() {
      await fetch(`http://localhost:5000/image/${imageTitle}`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => setImgSrc(parsedJSON[0].secure_url))
      );
    }
    getImage();
  }, []);

  let currentImgIndex = imgTitleArrState.indexOf(`${imageTitle}`);
  return (
    <div className="image-select-modal__container">
      <div className="image-select-modal__contents-container">
        <FontAwesomeIcon
          icon={faXmark}
          className="image-select-modal__x-icon"
        />
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="image-select-modal__left-arrow-icon"
        />
        <FontAwesomeIcon
          icon={faChevronRight}
          className="image-select-modal__right-arrow-icon"
        />
        <div className="image-select-modal__top-bar-container">
          <div className="image-select-modal__author-info-container">
            {/* <a
              className="image-gallery__image-author-link-container"
              href={`http://localhost:3000/User/${element.uploadedBy}`}
            >
              <img
                src={element.test[0].pfp}
                className="image-gallery__image-author-profile-pic"
              />
              {element.uploadedBy}
            </a> */}
          </div>
          <div className="image-select-modal__top-bar-buttons-container">
            <a>
              <FontAwesomeIcon icon={farHeart} />
              Like
            </a>
            <a>Free Download</a>
          </div>
        </div>
        <div className="image-select-modal__img-container">
          <img src={imgSrc}></img>
        </div>
      </div>
    </div>
  );
};

export default Modal__ImageSelect;
