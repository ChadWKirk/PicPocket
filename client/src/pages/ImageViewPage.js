import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import WhiteNavBar from "../components/WhiteNavBar";
import { useParams } from "react-router-dom";

import { AiFillLike } from "react-icons/ai";

const ImageViewPage = ({ curUser, loggedIn }) => {
  const { imageTitle } = useParams();

  //sticky nav bar
  const [navPosition, setNavPosition] = useState("gone");

  useEffect(() => {
    window.addEventListener("scroll", setNavToFixed);

    return () => {
      window.removeEventListener("scroll", setNavToFixed);
    };
  }, []);

  function setNavToFixed() {
    if (window !== undefined) {
      let windowHeight = window.scrollY;
      windowHeight > 0 ? setNavPosition("fixed") : setNavPosition("gone");
    }
  }
  //variables
  let imageSRC;
  let imageTitlee;
  let imageDescription;
  let imageLikes;
  let imageTags;
  let searchQuery;
  let imageURL;
  const [imageFetchID, setImageFetchID] = useState();

  //img array to display
  const [imgGallery, setImgGallery] = useState([]);
  //fetch img array
  const [fetchArr, setFetchArr] = useState([]);
  //isLiked just to re render array
  const [isLiked, setIsLiked] = useState(false);
  //array of results from mongoDB that you can grab stuff from like title or likedBy etc.
  const [searchArr, setSearchArr] = useState([]);
  //array of stuff you decide to keep from mongoDB search (push from searchArr into resultsArr)
  var resultsArr = [];

  const [resultsMap, setResultsMap] = useState();

  var mapArr;

  let mainLikeBtn;

  //on load, pull image using public id in url
  useEffect(() => {
    console.log("run");
    console.log(imageTitle);

    async function getImages() {
      await fetch(`http://localhost:5000/image/${imageTitle}`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => setImageFetchID(parsedJSON))
      );
    }
    getImages();
  }, []);

  useEffect(() => {}, [imageFetchID, isLiked]);

  //wait for fetch to be true (or complete) before assigning to variable
  if (imageFetchID) {
    imageSRC = imageFetchID[0].secure_url;
    imageTitlee = imageFetchID[0].title;
    if (imageFetchID[0].description == "") {
      imageDescription = <em>No Description Given</em>;
    } else {
      imageDescription = imageFetchID[0].description;
    }

    imageLikes = imageFetchID[0].likes;

    imageURL = imageFetchID[0].secure_url;

    imageTags = imageFetchID[0].tags;

    searchQuery = imageTags.join(" ") + " " + imageTitlee;

    if (imageFetchID[0].likedBy.includes(curUser)) {
      mainLikeBtn = (
        <button className="imgViewLikeBtn" onClick={(e) => handleMainLike(e)}>
          <FontAwesomeIcon
            icon={faHeart}
            className="likeButtonHeart2 likeButtonLikedFill2"
          ></FontAwesomeIcon>
          <div>Unlike</div>
          <div>{imageFetchID[0].likedBy.length}</div>
        </button>
      );
    } else {
      mainLikeBtn = (
        <button className="imgViewLikeBtn" onClick={(e) => handleMainLike(e)}>
          <FontAwesomeIcon
            icon={farHeart}
            className="likeButtonHeart2"
          ></FontAwesomeIcon>
          <div>Like</div>
          <div>{imageFetchID[0].likedBy.length}</div>
        </button>
      );
    }
  }

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
            <a className="downloadButtonCont1">
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

  async function handleMainLike(e) {
    if (imageFetchID[0].likedBy.includes(curUser)) {
      await fetch(
        `http://localhost:5000/removeLikedBy/${imageFetchID[0].asset_id}/${curUser}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
        }
      ).then((res) => {
        imageFetchID[0].likedBy = imageFetchID[0].likedBy.filter((user) => {
          return user !== curUser;
        });
      });
    } else if (!imageFetchID[0].likedBy.includes(curUser)) {
      await fetch(
        `http://localhost:5000/addLikedBy/${imageFetchID[0].asset_id}/${curUser}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
        }
      ).then((res) => {
        imageFetchID[0].likedBy.push(curUser);
      });
    }
    setIsLiked(!isLiked);
  }

  //download
  async function downloadMain() {
    await fetch("/download", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
      },
    }).then((response) =>
      response.blob().then((resBLOB) => {
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL({
          asset_id: "8c0d0a5315663ca529e71fcd1dd07c66",
          public_id: "picpocket/Berries",
          format: "jpg",
          version: 1673903815,
          resource_type: "image",
          type: "upload",
          created_at: "2023-01-16T21:16:55Z",
          bytes: 5366988,
          width: 6000,
          height: 4000,
          folder: "picpocket",
          access_mode: "public",
          url: "http://res.cloudinary.com/dtyg4ctfr/image/upload/v1673903815/picpocket/Berries.jpg",
          secure_url:
            "https://res.cloudinary.com/dtyg4ctfr/image/upload/v1673903815/picpocket/Berries.jpg",
          last_updated: {
            public_id_updated_at: "2023-01-16T21:17:50+00:00",
            updated_at: "2023-01-16T21:17:50+00:00",
          },
        });
        a.download = "FILENAME";
        a.click();
      })
    );
  }

  return (
    <div>
      <WhiteNavBar curUser={curUser} loggedIn={loggedIn} />
      <div className="fixed">
        <WhiteNavBar curUser={curUser} loggedIn={loggedIn} />
      </div>
      <div className="subBarCont1">
        <div className="subBarAuthor1">
          <img
            src={require("./nature-4k-pc-full-hd-wallpaper-preview.jpg")}
            className="profilePic"
          ></img>
          <h5>{curUser}</h5>
        </div>
        <div className="subBarLikeDownload1">
          {mainLikeBtn}
          {/* <a className="imgViewDLBtn" href={imageURL} download="image"> */}
          <button onClick={() => downloadMain()}>Download</button>
          {/* </a> */}
        </div>
      </div>

      <div className="imageViewContainer">
        <div className="imageViewDetailsContainer">
          <img
            className="imageViewPageMainImg"
            alt="broken"
            src={imageSRC}
          ></img>
          <div className="imgViewPageTitleLikesCont">
            <div className="imgViewPageTitle">{imageTitlee}</div>
            <div className="imgViewPageLikes">
              <div className="likeCounter">♥ {imageLikes} Likes</div>
            </div>
          </div>
          <div className="imgViewPageDescription">{imageDescription}</div>
        </div>
      </div>
      <div className="relatedImagesContainer">
        <div className="relatedImagesTitle">Related Images</div>
        <div>Tags</div>
        <div className="imgGalleryCont1">{resultsMap}</div>
      </div>
    </div>
  );
};

export default ImageViewPage;
