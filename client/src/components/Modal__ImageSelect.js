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
  curUser,
  imgTitleArrState,
  setIsShowingImageSelectModal,
}) => {
  //to navigate
  let navigate = useNavigate();

  //img info
  const { imageTitle } = useParams();
  const [imgInfo, setImgInfo] = useState();

  //user info to get author name and pfp
  const [userInfo, setUserInfo] = useState();

  //to rerender modal on prev or next img arrow click
  const [isPrevOrNextClicked, setIsPrevOrNextClicked] = useState(false);

  //refetch img info to update like button to either liked or not liked
  const [isLiked, setIsLiked] = useState();

  //on load, pull img from url parameter :imageTitle (see app.js), and get user info for img author pfp and name
  useEffect(() => {
    document.body.classList.add("overflowYHidden");
    async function fetchImgInfo() {
      await fetch(`http://localhost:5000/image/${imageTitle}`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => setImgInfo(parsedJSON[0]))
      );
    }
    fetchImgInfo();
  }, [isPrevOrNextClicked, isLiked]);

  useEffect(() => {
    if (imgInfo) {
      async function fetchUserInfo() {
        await fetch(`http://localhost:5000/${imgInfo.uploadedBy}/info`, {
          method: "GET",
          headers: { "Content-type": "application/json" },
        }).then((response) =>
          response
            .json()
            .then((resJSON) => JSON.stringify(resJSON))
            .then((stringJSON) => JSON.parse(stringJSON))
            .then((parsedJSON) => setUserInfo(parsedJSON[0]))
        );
      }

      fetchUserInfo();
    }
  }, [imgInfo]);

  //assigning user info to variables
  let imgAuthorPFP;
  let imgAuthorName;
  if (userInfo) {
    imgAuthorPFP =
      userInfo.pfp.slice(0, 50) +
      "q_60/c_scale,w_200/dpr_auto/" +
      userInfo.pfp.slice(50, userInfo.pfp.lastIndexOf(".")) +
      ".jpg";
    imgAuthorName = userInfo.username;
  }

  //assigning img info to variables
  let imgSrc;
  let imgTitle;
  let imgDescription;
  let imgLikes;
  let imgDownloadURL;
  let imgTags = [];
  let imageSelectModalLikeBtn;
  if (imgInfo) {
    imgSrc = imgInfo.secure_url;
    imgTitle = imgInfo.title;
    if (imgInfo.description == "") {
      imgDescription = <em>No Description Given</em>;
    } else {
      imgDescription = imgInfo.description;
    }

    imgLikes = imgInfo.likes;

    imgDownloadURL =
      imgInfo.secure_url.slice(0, 50) +
      "q_100/fl_attachment/" +
      imgInfo.secure_url.slice(50, imgInfo.secure_url.lastIndexOf("."));

    for (let i = 0; i < imgInfo.tags.length; i++) {
      imgTags.push(
        <li>
          <a href={`/search/${imgInfo.tags[i]}`}>{imgInfo.tags[i]}</a>
        </li>
      );
    }

    // searchQuery = imageTags.join(" ") + " " + imageTitlee;

    if (imgInfo.likedBy.includes(curUser)) {
      imageSelectModalLikeBtn = (
        <button className="imgViewLikeBtn" onClick={(e) => handleMainLike(e)}>
          <FontAwesomeIcon
            icon={faHeart}
            className="likeButtonHeart2 likeButtonLikedFill2"
          ></FontAwesomeIcon>
          <div>Unlike</div>
          <div>{imgInfo.likedBy.length}</div>
        </button>
      );
    } else {
      imageSelectModalLikeBtn = (
        <button className="imgViewLikeBtn" onClick={(e) => handleMainLike(e)}>
          <FontAwesomeIcon
            icon={farHeart}
            className="likeButtonHeart2"
          ></FontAwesomeIcon>
          <div>Like</div>
          <div>{imgInfo.likedBy.length}</div>
        </button>
      );
    }
  }

  //handle like
  async function handleMainLike(e) {
    if (imgInfo.likedBy.includes(curUser)) {
      await fetch(
        `http://localhost:5000/removeLikedBy/${imgInfo.asset_id}/${curUser}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
        }
      ).then((res) => {
        imgInfo.likedBy = imgInfo.likedBy.filter((user) => {
          return user !== curUser;
        });
      });
    } else if (!imgInfo.likedBy.includes(curUser)) {
      await fetch(
        `http://localhost:5000/addLikedBy/${imgInfo.asset_id}/${curUser}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
        }
      ).then((res) => {
        imgInfo.likedBy.push(curUser);
      });
    }
    setIsLiked(!isLiked);
  }

  //index of current img in title array to get prev and next links for next and previous arrow links (see html conditional rendering)
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
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
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
            <a
              className="image-select-modal__image-author-link-container"
              href={`http://localhost:3000/User/${imgAuthorName}`}
            >
              <img
                src={imgAuthorPFP}
                className="image-select-modal__image-author-pfp"
              />
              {imgAuthorName}
            </a>
          </div>
          <div className="image-select-modal__top-bar-buttons-container">
            {imageSelectModalLikeBtn}
            <a className="imgViewDLBtn" href={imgDownloadURL}>
              Download
            </a>
          </div>
        </div>
        <div className="image-select-modal__img-container">
          <img src={imgSrc}></img>
        </div>
        <div className="image-select-modal__img-info-container">
          <div className="image-select-modal__img-title">{imgTitle}</div>
          <div className="image-select-modal__img-description">
            {imgDescription}
          </div>
        </div>
        <div className="image-select-modal__img-tags-container">
          {/* <div className="image-select-modal__img-tags-heading">Tags:</div> */}
          <div className="image-select-modal__img-tags-list">
            <ul>{imgTags}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal__ImageSelect;
