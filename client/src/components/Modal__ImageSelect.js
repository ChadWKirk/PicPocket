import { React, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faXmark,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

const Modal__ImageSelect = () => {
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
        <div className="image-select-modal__img-container">img</div>
      </div>
    </div>
  );
};

export default Modal__ImageSelect;
