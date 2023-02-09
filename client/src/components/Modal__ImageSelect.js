import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faXmark,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

const Modal__ImageSelect = ({
  imgTitleArrState,
  setIsShowingImageSelectModal,
}) => {
  //to navigate
  let navigate = useNavigate();
  const { imageTitle } = useParams();
  const [imgSrc, setImgSrc] = useState();

  //to rerender modal on prev or next img arrow click
  const [isPrevOrNextClicked, setIsPrevOrNextClicked] = useState(false);

  //on load, pull img from url
  useEffect(() => {
    document.body.classList.add("overflowYHidden");
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
  }, [isPrevOrNextClicked]);

  let currentImgIndex = imgTitleArrState.indexOf(`${imageTitle}`);

  return (
    <div className="image-select-modal__container">
      <div
        className="image-select-modal__background"
        onClick={() => navigate("/")}
      ></div>
      <div className="image-select-modal__contents-container">
        <FontAwesomeIcon
          icon={faXmark}
          className="image-select-modal__x-icon"
        />
        {currentImgIndex > 0 && (
          <a
            onClick={() => {
              navigate(`/image/${imgTitleArrState[currentImgIndex - 1]}`);
              setIsPrevOrNextClicked(!isPrevOrNextClicked);
            }}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="image-select-modal__left-arrow-icon"
            />
          </a>
        )}
        {currentImgIndex < imgTitleArrState.length - 1 && (
          <a
            onClick={() => {
              navigate(`/image/${imgTitleArrState[currentImgIndex + 1]}`);
              setIsPrevOrNextClicked(!isPrevOrNextClicked);
            }}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className="image-select-modal__right-arrow-icon"
            />
          </a>
        )}

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
