import { React, useState, useEffect, useRef } from "react";
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
  isShowingImageSelectModal,
  setIsShowingImageSelectModal,
  imgInfo,
  userInfo,
  setIsPrevOrNextClicked,
  isPrevOrNextClicked,
}) => {
  //when modal is open, set body overflow to hidden. for some reason classlist.add wasn't working it was glitching on and off
  document.body.style.overflow = "hidden";

  //to navigate
  let navigate = useNavigate();

  //img info
  const { imageTitle } = useParams();
  // const [imgInfo, setImgInfo] = useState();

  //user info to get author name and pfp
  // const [userInfo, setUserInfo] = useState();

  //refetch img info to update like button to either liked or not liked
  const [isLiked, setIsLiked] = useState();

  //on load, pull img from url parameter :imageTitle (see app.js), and get user info for img author pfp and name
  // useEffect(() => {
  //   async function fetchImgInfo() {
  //     await fetch(`http://localhost:5000/image/${imageTitle}`, {
  //       method: "GET",
  //       headers: { "Content-type": "application/json" },
  //     }).then((response) =>
  //       response
  //         .json()
  //         .then((resJSON) => JSON.stringify(resJSON))
  //         .then((stringJSON) => JSON.parse(stringJSON))
  //         .then((parsedJSON) => setImgInfo(parsedJSON[0]))
  //     );
  //   }
  //   fetchImgInfo();
  // }, [isPrevOrNextClicked, isLiked]);

  //fetch user info for pfp and author name
  // useEffect(() => {
  //   if (imgInfo) {
  //     async function fetchUserInfo() {
  //       await fetch(`http://localhost:5000/${imgInfo.uploadedBy}/info`, {
  //         method: "GET",
  //         headers: { "Content-type": "application/json" },
  //       }).then((response) =>
  //         response
  //           .json()
  //           .then((resJSON) => JSON.stringify(resJSON))
  //           .then((stringJSON) => JSON.parse(stringJSON))
  //           .then((parsedJSON) => setUserInfo(parsedJSON[0]))
  //       );
  //     }

  //     fetchUserInfo();
  //   }
  // }, [imgInfo]);

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
  //for tag list scroll animation
  let tagListIDWidth;
  let scrollByPxAmount;
  const [tagListScrollPosition, setTagListScrollPosition] = useState(0);

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
          <a href={`/search/${imgInfo.tags[i]}/most-recent/all-types`}>
            {imgInfo.tags[i]}
          </a>
        </li>
      );
    }

    // searchQuery = imageTags.join(" ") + " " + imageTitlee;

    if (imgInfo.likedBy.includes(curUser)) {
      imageSelectModalLikeBtn = (
        <button
          className="image-view-page__like-button"
          onClick={(e) => handleMainLike(e)}
        >
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
        <button
          className="image-view-page__like-button"
          onClick={(e) => handleMainLike(e)}
        >
          <FontAwesomeIcon
            icon={farHeart}
            className="likeButtonHeart2"
          ></FontAwesomeIcon>
          <div>Like</div>
          <div>{imgInfo.likedBy.length}</div>
        </button>
      );
    }
    //for tag list scroll animation
    tagListIDWidth = document.querySelector("#tagListID").clientWidth;
    scrollByPxAmount = tagListIDWidth + tagListScrollPosition;
  }

  //tag list scrolling
  //every time tag list is scrolled, fire useEffect to decide whether to show arrows or not
  //left arrow only shows when not at scroll position 0 (all the way to the left)
  //right arrow only shows when scroll position is under max scroll
  const [tagListMaxScroll, setTagListMaxScroll] = useState();

  useEffect(() => {
    showTagListArrowsBasedOnScrollPosition(
      tagListScrollPosition,
      tagListMaxScroll
    );
  }, [tagListScrollPosition]);

  const [tagLeftArrowClass, setTagLeftArrowClass] = useState("opacity0");
  const [tagRightArrowClass, setTagRightArrowClass] = useState("opacity0");

  //if tag list is scrollable, show right arrow. by default right arrow is opacity0.
  //fires once imgInfo is done fetching, therefore tag list actually exists
  useEffect(() => {
    const tagListID = document.querySelector("#tagListID");

    if (tagListID.clientWidth < tagListID.scrollWidth) {
      setTagRightArrowClass("image-select-modal__img-tags-overflowArrowRight");
    } else {
      setTagRightArrowClass("opacity0");
    }
  }, [imgInfo]);

  function showTagListArrowsBasedOnScrollPosition(
    tagListScrollPosition,
    tagListMaxScroll
  ) {
    //set to < 1 rather than == 0 because when using the left arrow button it would sit at 0.6666777 for some reason
    if (tagListScrollPosition < 1) {
      setTagLeftArrowClass(
        "image-select-modal__img-tags-overflowArrowLeft opacity0"
      );
    } else {
      setTagLeftArrowClass("image-select-modal__img-tags-overflowArrowLeft");
    }
    if (tagListScrollPosition > tagListMaxScroll) {
      setTagRightArrowClass(
        "image-select-modal__img-tags-overflowArrowRight opacity0"
      );
    } else {
      setTagRightArrowClass("image-select-modal__img-tags-overflowArrowRight");
    }
  }

  //tag list scroll animation

  //left animation
  const element_left = document.querySelector("#tagListID");
  let start_left, previousTimeStamp_left;
  let done_left = false;

  function step_left(timestamp_left) {
    if (start_left === undefined) {
      start_left = timestamp_left;
    }
    const elapsed_left = timestamp_left - start_left;

    if (previousTimeStamp_left !== timestamp_left) {
      const count_left = Math.min(0.1 * elapsed_left, scrollByPxAmount);
      element_left.scrollBy(-count_left, 0);
      if (count_left === 1000) {
        done_left = true;
      }
    }

    if (elapsed_left < 1000) {
      previousTimeStamp_left = timestamp_left;
      if (!done_left) {
        window.requestAnimationFrame(step_left);
      }
    }
  }

  //right animation
  const element = document.querySelector("#tagListID");
  let start, previousTimeStamp;
  let done = false;

  function step(timestamp) {
    if (start === undefined) {
      start = timestamp;
    }
    const elapsed = timestamp - start;

    if (previousTimeStamp !== timestamp) {
      const count = Math.min(0.1 * elapsed, scrollByPxAmount);
      element.scrollBy(count, 0);
      if (count === scrollByPxAmount) {
        done = true;
      }
    }

    if (elapsed < 1000) {
      previousTimeStamp = timestamp;
      if (!done) {
        window.requestAnimationFrame(step);
      }
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

  //img zoom stuff
  //change this on click of the main img to change it's class to either zoomed in or zoomed out class and style ternary for transform
  //zoomed out by default
  const [isImgZoomedIn, setIsImgZoomedIn] = useState(false);

  //get boundingclientrect of img when zoomed out and storing it so it doesn't change once it is zoomed in (scale 3)
  //waits for imgInfo to fetch so img is actually there to get the rect from
  //uses useRef to maintain original (zoomed out) rect
  let imgRect = useRef();
  let imgRectVal;
  //get modal contents container height to use for black background's height
  let modal = useRef();
  let modalVal;
  useEffect(() => {
    if (imgInfo) {
      imgRectVal = document.querySelector("#mainImg").getBoundingClientRect();
      imgRect.current = imgRectVal;
      modalVal = document.querySelector("#modal").getBoundingClientRect();
      modal.current = modalVal.height;
    }
  }, [imgInfo, isImgZoomedIn]);

  //set transformOrigin to click position relative to the image element by subtrcting width/height from click position when clicking. top left is 0,0
  const [transformOriginState, setTransformOriginState] = useState();
  useEffect(() => {}, [imgInfo]);
  function handleImgClick(event) {
    setIsImgZoomedIn(!isImgZoomedIn);
    setTransformOriginState(
      `${event.clientX - imgRect.current.left}px ${
        event.clientY - imgRect.current.top
      }px`
    );
    console.log(event);
  }

  //get mouse position for inital transformOriginState
  const [mousePos, setMousePos] = useState({});
  function handleMouseMoveInitialOriginState(event) {
    setMousePos({ X: event.clientX, y: event.clientY });
  }

  //reset rect when zooming out so the img doesn't fly off the screen
  //set transformOrigin for first click using mousePos
  useEffect(() => {
    if (!isImgZoomedIn) {
      imgRect.current = document
        .querySelector("#mainImg")
        .getBoundingClientRect();
    } else if (isImgZoomedIn) {
      setTransformOriginState(
        `${mousePos.X - imgRect.current.left}px ${
          mousePos.y - imgRect.current.top
        }px`
      );
      imgRect.current = document
        .querySelector("#mainImg")
        .getBoundingClientRect();
    }
  }, [isImgZoomedIn]);

  //set transformOrigin once image is clicked (zoomed in) when mouse moves. this makes you able to look over the image with moving the mouse
  function handleMouseMove(event) {
    setTransformOriginState(
      `${event.clientX - imgRect.current.left}px ${
        event.clientY - imgRect.current.top
      }px`
    );
    // console.log(event.target.clientWidth);
  }

  //reset zoom stuff when prev or next arrow is clicked to go to a different image
  useEffect(() => {
    setIsImgZoomedIn(false);
    setTransformOriginState();
  }, [isPrevOrNextClicked]);

  //index of current img in title array to get prev and next links for next and previous arrow links (see html conditional rendering)
  let currentImgIndex = imgTitleArrState.indexOf(`${imageTitle}`);

  return (
    <div
      className="image-select-modal__container"
      onMouseMove={(event) => handleMouseMove(event)}
    >
      <div
        className="image-select-modal__background"
        onClick={() => {
          navigate("/");
          document.body.style.overflow = "auto"; //set body overflow back to auto when closing modal
        }}
        style={{ height: `${modal.current + 28}px` }} //get height of modal contents container and use that for height of black bg
      ></div>
      <div className="image-select-modal__contents-container" id="modal">
        <FontAwesomeIcon
          icon={faXmark}
          className="image-select-modal__x-icon"
          onClick={() => {
            navigate("/");
            document.body.style.overflow = "auto"; //set body overflow back to auto when closing modal
          }}
          style={{ cursor: "pointer" }}
        />
        {currentImgIndex > 0 && (
          <a
            onClick={() => {
              navigate(`/image/${imgTitleArrState[currentImgIndex - 1]}`);
              setIsPrevOrNextClicked(!isPrevOrNextClicked);
              setIsShowingImageSelectModal(true);
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
              setIsShowingImageSelectModal(true);
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
          <div className="image-select-modal__image-author-link-container">
            <div className="image-select-modal__image-author-pfp-div">
              <a
                className="image-select-modal__image-author-pfp"
                href={`http://localhost:3000/User/${imgAuthorName}`}
              >
                <img
                  src={imgAuthorPFP}
                  className="image-select-modal__image-author-pfp"
                />
              </a>
            </div>

            <a
              href={`http://localhost:3000/User/${imgAuthorName}`}
              className="image-select-modal__image-author-name"
            >
              {imgAuthorName}
            </a>
          </div>
          <div className="image-select-modal__top-bar-buttons-container">
            {imageSelectModalLikeBtn}
            <a
              className="image-view-page__download-button"
              href={imgDownloadURL}
            >
              Download
            </a>
          </div>
        </div>
        <div className="image-select-modal__img-container">
          <img
            id="mainImg"
            src={imgSrc}
            className={`${
              isImgZoomedIn
                ? "image-select-modal__img-zoomed-in"
                : "image-select-modal__img-zoomed-out"
            }`}
            onClick={(event) => {
              handleImgClick(event);
            }}
            onMouseMove={(event) => {
              handleMouseMoveInitialOriginState(event);
            }}
            style={{
              // transform: isImgZoomedIn ? `scale(3)` : "scale(1)",
              transformOrigin: transformOriginState,
            }}
          ></img>
        </div>
        <div className="image-select-modal__img-info-container">
          <div className="image-select-modal__img-title">{imgTitle}</div>
          <div className="image-select-modal__img-description">
            {imgDescription}
          </div>
        </div>
        <div style={{ width: "100%", position: "relative" }}>
          <div
            className={tagLeftArrowClass}
            onClick={() => window.requestAnimationFrame(step_left)}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="image-select-modal__img-tags-arrowIcon"
            />
          </div>
          <div
            className={tagRightArrowClass}
            onClick={() => window.requestAnimationFrame(step)}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className="image-select-modal__img-tags-arrowIcon"
            />
          </div>
          <div
            id="tagListID"
            className="image-select-modal__img-tags-container"
            onScroll={(e) => {
              setTagListScrollPosition(e.target.scrollLeft);
              setTagListMaxScroll(
                e.target.scrollWidth - e.target.clientWidth - 1
              );
            }}
          >
            <div className="image-select-modal__img-tags-list">
              <ul>{imgTags}</ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal__ImageSelect;
