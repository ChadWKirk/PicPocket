import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import WhiteNavBar from "../components/WhiteNavBar";
import { useParams } from "react-router-dom";
import Modal__ImageSelect from "../components/Modal__ImageSelect";
import NavbarComponent from "../components/NavbarComponent";
import { AiFillLike } from "react-icons/ai";

const ImageViewPage = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
  isShowingImageSelectModal,
  setIsShowingImageSelectModal,
  imgTitleArrState,
}) => {
  //variables for related images
  let searchQuery;
  let imageURL;
  const [imageFetchID, setImageFetchID] = useState();

  //img info
  const { imageTitle } = useParams();
  const [imgInfo, setImgInfo] = useState();

  //user info to get author name and pfp
  const [userInfo, setUserInfo] = useState();

  //refetch img info to update like button to either liked or not liked
  const [isLiked, setIsLiked] = useState();

  //img array to display
  const [imgGallery, setImgGallery] = useState([]);
  //fetch img array
  const [fetchArr, setFetchArr] = useState([]);

  //array of results from mongoDB that you can grab stuff from like title or likedBy etc.
  const [searchArr, setSearchArr] = useState([]);
  //array of stuff you decide to keep from mongoDB search (push from searchArr into resultsArr)
  var resultsArr = [];

  const [resultsMap, setResultsMap] = useState();

  var mapArr;

  let mainLikeBtn;

  //to rerender modal on prev or next img arrow click
  const [isPrevOrNextClicked, setIsPrevOrNextClicked] = useState(false);

  //on load, pull img from url parameter :imageTitle (see app.js), and get user info for img author pfp and name
  useEffect(() => {
    async function fetchImgInfo() {
      await fetch(`${domain}/image/${imageTitle}`, {
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
  }, [isLiked, isPrevOrNextClicked]);

  //fetch user info for pfp and author name
  useEffect(() => {
    if (imgInfo) {
      async function fetchUserInfo() {
        await fetch(`${domain}/${imgInfo.uploadedBy}/info`, {
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
  let mainImgLikeBtn;
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

    if (imgInfo.likedBy.includes(curUser_real)) {
      mainImgLikeBtn = (
        <button
          className="image-view-page__main-like-button"
          onClick={(e) => handleMainLike(e)}
        >
          <FontAwesomeIcon
            icon={faHeart}
            className="image-view-page__main-like-button-icon-unliked image-view-page__main-like-button-icon-liked"
          ></FontAwesomeIcon>
          <div className="image-view-page__main-like-button-text">Unlike</div>
          <div className="image-view-page__main-like-button-text">
            {imgInfo.likedBy.length}
          </div>
        </button>
      );
    } else {
      mainImgLikeBtn = (
        <button
          className="image-view-page__main-like-button"
          onClick={(e) => handleMainLike(e)}
        >
          <FontAwesomeIcon
            icon={farHeart}
            className="image-view-page__main-like-button-icon-unliked"
          ></FontAwesomeIcon>
          <div className="image-view-page__main-like-button-text">Like</div>
          <div className="image-view-page__main-like-button-text">
            {imgInfo.likedBy.length}
          </div>
        </button>
      );
    }

    //for tag list scroll animation
    tagListIDWidth = document.querySelector("#tagListID").clientWidth;
    scrollByPxAmount = tagListIDWidth + tagListScrollPosition;
  }

  //handle like for main image
  async function handleMainLike(e) {
    if (imgInfo.likedBy.includes(curUser_real)) {
      await fetch(
        `${domain}/removeLikedBy/${imgInfo.asset_id}/${curUser_real}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
        }
      ).then((res) => {
        imgInfo.likedBy = imgInfo.likedBy.filter((user) => {
          return user !== curUser_real;
        });
      });
    } else if (!imgInfo.likedBy.includes(curUser_real)) {
      await fetch(`${domain}/addLikedBy/${imgInfo.asset_id}/${curUser_real}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
      }).then((res) => {
        imgInfo.likedBy.push(curUser_real);
      });
    }
    setIsLiked(!isLiked);
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
      setTagRightArrowClass("image-view-page__img-tags-overflowArrowRight");
    } else {
      setTagRightArrowClass("opacity0");
    }
  }, [imgInfo]);

  const [tagsPaddingLeft, setTagsPaddingLeft] = useState();

  function showTagListArrowsBasedOnScrollPosition(
    tagListScrollPosition,
    tagListMaxScroll
  ) {
    //set to < 1 rather than == 0 because when using the left arrow button it would sit at 0.6666777 for some reason
    if (tagListScrollPosition < 1) {
      setTagLeftArrowClass(
        "image-view-page__img-tags-overflowArrowLeft opacity0"
      );
      setTagsPaddingLeft("padding-left-0");
    } else {
      setTagLeftArrowClass("image-view-page__img-tags-overflowArrowLeft");
      setTagsPaddingLeft();
    }
    if (tagListScrollPosition > tagListMaxScroll) {
      setTagRightArrowClass(
        "image-view-page__img-tags-overflowArrowRight opacity0"
      );
    } else {
      setTagRightArrowClass("image-view-page__img-tags-overflowArrowRight");
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

  //get related images
  //perform a search for title and tags and return an array of results
  //map over results array
  useEffect(() => {
    console.log(searchQuery);

    async function searchFetch() {
      await fetch(`${domain}/search/${searchQuery}/most-recent/all-types`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => setSearchArr(parsedJSON))
      );
    }
    searchFetch();
  }, [searchQuery]);

  useEffect(() => {
    console.log(searchArr);
    //use split to get an array split by the /
    //only output the public_id after the last /. last index of array meaning length-1
    //replace all spaces with dashes

    mapArr = searchArr.map((element, index) => {
      let parts = element.public_id.split("/");
      let result = parts[parts.length - 1];
      var likeButton;
      var count = -1;

      if (element.likedBy.includes(curUser_real)) {
        likeButton = (
          <div>
            <FontAwesomeIcon
              icon={faHeart}
              className="likeButtonHeart1 likeButtonLikedFill1"
            ></FontAwesomeIcon>
          </div>
        );
      } else {
        likeButton = (
          <div>
            <FontAwesomeIcon
              icon={farHeart}
              className="likeButtonHeart1"
            ></FontAwesomeIcon>
          </div>
        );
      }
      return (
        <div key={index} className="imgGalleryImgCont1">
          <a
            // onClick={() => {
            //   navigate(`/image/${element.title}`);
            // }}
            href={`https://picpoccket.com/image/${element.title}`}
          >
            <img
              src={
                element.secure_url.slice(0, 50) +
                "q_60/c_scale,w_1600/dpr_auto/" +
                element.secure_url.slice(
                  50,
                  element.secure_url.lastIndexOf(".")
                ) +
                ".jpg"
              }
              className="imgGalleryImg1"
            ></img>
          </a>

          <div className="imgGalleryImgOverlay1">
            <a
              className="likeButtonContainer1"
              onClick={(e) => handleLike(e, element, index)}
            >
              {likeButton}
            </a>
            <a
              className="downloadButtonCont1"
              href={
                element.secure_url.slice(0, 50) +
                "q_100/fl_attachment/" +
                element.secure_url.slice(
                  50,
                  element.secure_url.lastIndexOf(".")
                )
              }
            >
              <FontAwesomeIcon
                icon={faDownload}
                className="downloadButton1"
              ></FontAwesomeIcon>
            </a>
            <a className="imgAuthor1">{element.uploadedBy}</a>
          </div>
        </div>
      );
    });
    setResultsMap(mapArr);
  }, [searchArr, isLiked]);

  //handle likes for related images
  async function handleLike(e, element, index) {
    var searchArrCopy = searchArr;
    console.log(searchArrCopy);

    if (searchArrCopy[index].likedBy.includes(curUser_real)) {
      await fetch(
        `${domain}/removeLikedBy/${element.asset_id}/${curUser_real}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
        }
      ).then((res) => {
        searchArrCopy[index].likedBy = searchArrCopy[index].likedBy.filter(
          (user) => {
            return user !== curUser_real;
          }
        );
        setFetchArr(searchArrCopy);
        console.log("run 3");
      });
    } else if (!searchArrCopy[index].likedBy.includes(curUser_real)) {
      await fetch(`${domain}/addLikedBy/${element.asset_id}/${curUser_real}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
      }).then((res) => {
        searchArrCopy[index].likedBy.push(curUser_real);
        setFetchArr(searchArrCopy);
        console.log("run 4");
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
  useEffect(() => {
    if (imgInfo) {
      imgRectVal = document.querySelector("#mainImg").getBoundingClientRect();
      imgRect.current = imgRectVal;
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

  //get click position for inital transformOriginState
  const [clickPos, setClickPos] = useState({});
  function handleMouseMoveInitialOriginState(event) {
    setClickPos({ X: event.clientX, y: event.clientY });
  }

  //reset rect when zooming out so the img doesn't fly off the screen
  //set transformOrigin for first click using clickPos
  useEffect(() => {
    if (!isImgZoomedIn) {
      imgRect.current = document
        .querySelector("#mainImg")
        .getBoundingClientRect();
      setTransformOriginState(
        `${clickPos.X - imgRect.current.left}px ${
          clickPos.y - imgRect.current.top
        }px`
      );
      console.log("zoomed out");
    } else if (isImgZoomedIn) {
      setTransformOriginState(
        `${clickPos.X - imgRect.current.left}px ${
          clickPos.y - imgRect.current.top
        }px`
      );
      console.log("zomed in");
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

  return (
    <div onMouseMove={(event) => handleMouseMove(event)}>
      {/* conditionally render modal based on state of isShowingImageSelectModal in app.js */}
      {isShowingImageSelectModal && (
        <Modal__ImageSelect
          domain={domain}
          curUser_real={curUser_real}
          curUser_hyphenated={curUser_hyphenated}
          imgTitleArrState={imgTitleArrState}
          isShowingImageSelectModal={isShowingImageSelectModal}
          setIsShowingImageSelectModal={setIsShowingImageSelectModal}
          mainLikeBtn={mainLikeBtn}
          imageURL={imageURL}
          imgInfo={imgInfo}
          userInfo={userInfo}
          isPrevOrNextClicked={isPrevOrNextClicked}
          setIsPrevOrNextClicked={setIsPrevOrNextClicked}
        />
      )}
      <NavbarComponent
        domain={domain}
        curUser_real={curUser_real}
        curUser_hyphenated={curUser_hyphenated}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      <div className="image-view-page__top-bar-height-margin">margin</div>
      <div className="image-view-page__top-bar-container">
        <div className="image-view-page__top-bar-contents">
          <div className="image-view-page__image-author-link-container">
            <div className="image-view-page__image-author-pfp-div">
              <a
                className="image-view-page__image-author-pfp"
                href={`https://picpoccket.com/User/${imgAuthorName}`}
              >
                <img
                  src={imgAuthorPFP}
                  className="image-view-page__image-author-pfp"
                />
              </a>
            </div>

            <a
              href={`https://picpoccket.com/User/${imgAuthorName}`}
              className="image-view-page__image-author-name"
            >
              {imgAuthorName}
            </a>
          </div>
          <div className="image-view-page__top-bar-buttons-container">
            {mainImgLikeBtn}
            <a
              className="image-view-page__download-button"
              href={imgDownloadURL}
            >
              Free Download
            </a>
          </div>
        </div>
      </div>
      <div className="image-view-page__container">
        <div className="image-view-page__img-container">
          <img
            id="mainImg"
            src={imgSrc}
            className={`${
              isImgZoomedIn
                ? "image-view-page__img-zoomed-in"
                : "image-view-page__img-zoomed-out"
            }`}
            onClick={(event) => {
              handleImgClick(event);
              handleMouseMoveInitialOriginState(event);
            }}
            // onClick={(event) => {

            // }}
            style={{
              // transform: isImgZoomedIn ? `scale(3)` : "scale(1)",
              transformOrigin: transformOriginState,
            }}
          ></img>
        </div>
        <div className="image-view-page__img-info-container">
          <div className="image-view-page__img-title">{imgTitle}</div>
          <div className="image-view-page__img-description">
            {imgDescription}
          </div>
          {/* <div className="imgViewPageLikes">
            <div className="likeCounter">♥ {imgLikes} Likes</div>
          </div> */}
        </div>
        <div className={`image-view-page__tag-arrow-bounds padding-left-0`}>
          <div
            className={tagLeftArrowClass}
            onClick={() => window.requestAnimationFrame(step_left)}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="image-view-page__img-tags-arrowIcon"
            />
          </div>
          <div
            className={tagRightArrowClass}
            onClick={() => window.requestAnimationFrame(step)}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className="image-view-page__img-tags-arrowIcon"
            />
          </div>
          <div
            id="tagListID"
            className="image-view-page__img-tags-container"
            onScroll={(e) => {
              setTagListScrollPosition(e.target.scrollLeft);
              setTagListMaxScroll(
                e.target.scrollWidth - e.target.clientWidth - 1
              );
            }}
          >
            <div className="image-view-page__img-tags-list">
              <ul>{imgTags}</ul>
            </div>
          </div>
        </div>
        {/* <div className="relatedImagesContainer">
          <div className="relatedImagesTitle">Related Images</div>
          <div className="imgGalleryCont1">{resultsMap}</div>
        </div> */}
      </div>
    </div>
  );
};

export default ImageViewPage;
