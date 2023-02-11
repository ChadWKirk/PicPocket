import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import WhiteNavBar from "../components/WhiteNavBar";
import { useParams } from "react-router-dom";
import Modal__ImageSelect from "../components/Modal__ImageSelect";
import NavbarComponent from "../components/NavbarComponent";
import { AiFillLike } from "react-icons/ai";

const ImageViewPage = ({
  curUser,
  loggedIn,
  isShowingImageSelectModal,
  setIsShowingImageSelectModal,
  imgTitleArrState,
}) => {
  //variables
  let imageSRC;
  let imageTitlee;
  let imageDescription;
  let imageLikes;
  let imageTags;
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

  //to refetch imgInfo and userInfo for modal on prev or next img arrow click
  const [isPrevOrNextClicked, setIsPrevOrNextClicked] = useState(false);

  //on load, pull img from url parameter :imageTitle (see app.js), and get user info for img author pfp and name
  useEffect(() => {
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
  }, [isLiked, isPrevOrNextClicked]);

  //fetch user info for pfp and author name
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
  let mainImgLikeBtn;
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
      mainImgLikeBtn = (
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
      mainImgLikeBtn = (
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

  //handle like for main image
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

  //on load, pull image using public id in url
  // useEffect(() => {
  //   console.log("run");
  //   console.log(imageTitle);

  //   async function getImages() {
  //     await fetch(`http://localhost:5000/image/${imageTitle}`, {
  //       method: "GET",
  //       headers: { "Content-type": "application/json" },
  //     }).then((response) =>
  //       response
  //         .json()
  //         .then((resJSON) => JSON.stringify(resJSON))
  //         .then((stringJSON) => JSON.parse(stringJSON))
  //         .then((parsedJSON) => setImageFetchID(parsedJSON))
  //     );
  //   }
  //   getImages();
  // }, []);

  // useEffect(() => {}, [imageFetchID, isLiked]);

  //wait for fetch to be true (or complete) before assigning to variable
  // if (imageFetchID) {
  //   imageSRC = imageFetchID[0].secure_url;
  //   imageTitlee = imageFetchID[0].title;
  //   if (imageFetchID[0].description == "") {
  //     imageDescription = <em>No Description Given</em>;
  //   } else {
  //     imageDescription = imageFetchID[0].description;
  //   }

  //   imageLikes = imageFetchID[0].likes;

  //   imageURL =
  //     imageFetchID[0].secure_url.slice(0, 50) +
  //     "q_100/fl_attachment/" +
  //     imageFetchID[0].secure_url.slice(
  //       50,
  //       imageFetchID[0].secure_url.lastIndexOf(".")
  //     );

  //   imageTags = imageFetchID[0].tags;

  //   searchQuery = imageTags.join(" ") + " " + imageTitlee;

  //   if (imageFetchID[0].likedBy.includes(curUser)) {
  //     mainLikeBtn = (
  //       <button className="imgViewLikeBtn" onClick={(e) => handleMainLike(e)}>
  //         <FontAwesomeIcon
  //           icon={faHeart}
  //           className="likeButtonHeart2 likeButtonLikedFill2"
  //         ></FontAwesomeIcon>
  //         <div>Unlike</div>
  //         <div>{imageFetchID[0].likedBy.length}</div>
  //       </button>
  //     );
  //   } else {
  //     mainLikeBtn = (
  //       <button className="imgViewLikeBtn" onClick={(e) => handleMainLike(e)}>
  //         <FontAwesomeIcon
  //           icon={farHeart}
  //           className="likeButtonHeart2"
  //         ></FontAwesomeIcon>
  //         <div>Like</div>
  //         <div>{imageFetchID[0].likedBy.length}</div>
  //       </button>
  //     );
  //   }
  // }

  //get related images
  //perform a search for title and tags and return an array of results
  //map over results array
  useEffect(() => {
    console.log(searchQuery);

    async function searchFetch() {
      await fetch(
        `http://localhost:5000/search/${searchQuery}/most-recent/all-types`,
        {
          method: "GET",
          headers: { "Content-type": "application/json" },
        }
      ).then((response) =>
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

      if (element.likedBy.includes(curUser)) {
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
            href={`http://localhost:3000/image/${element.title}`}
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

    if (searchArrCopy[index].likedBy.includes(curUser)) {
      await fetch(
        `http://localhost:5000/removeLikedBy/${element.asset_id}/${curUser}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
        }
      ).then((res) => {
        searchArrCopy[index].likedBy = searchArrCopy[index].likedBy.filter(
          (user) => {
            return user !== curUser;
          }
        );
        setFetchArr(searchArrCopy);
        console.log("run 3");
      });
    } else if (!searchArrCopy[index].likedBy.includes(curUser)) {
      await fetch(
        `http://localhost:5000/addLikedBy/${element.asset_id}/${curUser}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
        }
      ).then((res) => {
        searchArrCopy[index].likedBy.push(curUser);
        setFetchArr(searchArrCopy);
        console.log("run 4");
      });
    }
    setIsLiked(!isLiked);
  }

  return (
    <div>
      {/* conditionally render modal based on state of isShowingImageSelectModal in app.js */}
      {isShowingImageSelectModal && (
        <Modal__ImageSelect
          curUser={curUser}
          imgTitleArrState={imgTitleArrState}
          setIsShowingImageSelectModal={setIsShowingImageSelectModal}
          imgInfo={imgInfo}
          userInfo={userInfo}
          mainLikeBtn={mainLikeBtn}
          imageURL={imageURL}
          isPrevOrNextClicked={isPrevOrNextClicked}
          setIsPrevOrNextClicked={setIsPrevOrNextClicked}
        />
      )}
      <NavbarComponent
        curUser={curUser}
        loggedIn={loggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      <div className="image-view-page__container">
        <div className="image-view-page__top-bar-container">
          <div className="image-view-page__author-info-container">
            <a
              className="image-view-page__image-author-link-container"
              href={`http://localhost:3000/User/${imgAuthorName}`}
            >
              <img
                src={imgAuthorPFP}
                className="image-view-page__image-author-pfp"
              />
              {imgAuthorName}
            </a>
          </div>
          <div className="image-view-page__top-bar-buttons-container">
            {mainImgLikeBtn}
            <a className="imgViewDLBtn" href={imgDownloadURL}>
              Download
            </a>
          </div>
        </div>
        <div className="image-view-page__img-container">
          <img src={imgSrc}></img>
        </div>
        <div className="image-view-page__img-info-container">
          <div className="image-view-page__img-title">{imgTitle}</div>
          <div className="image-view-page__img-description">
            {imgDescription}
          </div>
          <div className="imgViewPageLikes">
            <div className="likeCounter">♥ {imgLikes} Likes</div>
          </div>
        </div>
        <div className="image-view-page__img-tags-container">
          {/* <div className="image-select-modal__img-tags-heading">Tags:</div> */}
          <div className="image-view-page__img-tags-list">
            <ul>{imgTags}</ul>
          </div>
        </div>
        <div className="relatedImagesContainer">
          <div className="relatedImagesTitle">Related Images</div>
          <div className="imgGalleryCont1">{resultsMap}</div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewPage;
