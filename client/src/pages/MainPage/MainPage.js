import React, { useState, useEffect, useRef } from "react";
import MainPageNavBar from "../../components/MainPageNavBar";
import MainPageHeroImage from "../../components/MainPageHeroImage";
import MainPageImageGallery from "../../components/MainPageImageGallery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const MainPage = ({ curUser, loggedIn }) => {
  //sticky nav bar
  const [navPositionClass, setNavPositionClass] = useState();
  const [navColorClass, setNavColorClass] = useState("transparent");

  useEffect(() => {
    window.addEventListener("scroll", setNavDisplayFunction);

    return () => {
      window.removeEventListener("scroll", setNavDisplayFunction);
    };
  }, []);

  function setNavDisplayFunction() {
    if (window !== undefined) {
      let windowHeight = window.scrollY;
      windowHeight > 425 ? setNavPositionClass("fixed") : setNavPositionClass();
      windowHeight > 425
        ? setNavColorClass("white")
        : setNavColorClass("transparent");
    }
  }

  //img array to display
  const [imgGallery, setImgGallery] = useState([]);
  //fetch img array
  const [fetchArr, setFetchArr] = useState([]);
  //isLiked just to re render array
  const [isLiked, setIsLiked] = useState(false);

  var mapArr;

  const [userInfo, setUserInfo] = useState();
  const [userPFP, setPFP] = useState([]);
  let pfpArray = [];

  //get images
  useEffect(() => {
    console.log("run");

    async function getImages() {
      fetch("http://localhost:5000/most-recent-images", {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => {
            setFetchArr(parsedJSON);
            console.log(parsedJSON);
          })
      );
    }
    getImages();
  }, []);
  //map over img array
  useEffect(() => {
    mapArr = fetchArr.map((element, index) => {
      var likeButton;
      console.log(fetchArr[index].uploadedBy);
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
            href={
              element.secure_url.slice(0, 50) +
              "q_60/c_scale,w_1600/dpr_auto/" +
              element.secure_url.slice(
                50,
                element.secure_url.lastIndexOf(".")
              ) +
              ".jpg"
            }
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
            <div>
              <a
                className="imgAuthor1"
                href={`http://localhost:3000/User/${element.uploadedBy}`}
              >
                <img src={element.test[0].pfp} className="profilePicSmall" />
                {element.uploadedBy}
              </a>
            </div>
          </div>
        </div>
      );
    });
    setImgGallery(mapArr);
  }, [fetchArr, userPFP, isLiked]);

  async function handleLike(e, element, index) {
    var fetchArrCopy = fetchArr;

    if (fetchArrCopy[index].likedBy.includes(curUser)) {
      await fetch(
        `http://localhost:5000/removeLikedBy/${element.asset_id}/${curUser}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
        }
      ).then((res) => {
        fetchArrCopy[index].likedBy = fetchArrCopy[index].likedBy.filter(
          (user) => {
            return user !== curUser;
          }
        );
        setFetchArr(fetchArrCopy);
        console.log("run 3");
      });
    } else if (!fetchArrCopy[index].likedBy.includes(curUser)) {
      await fetch(
        `http://localhost:5000/addLikedBy/${element.asset_id}/${curUser}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
        }
      ).then((res) => {
        fetchArrCopy[index].likedBy.push(curUser);
        setFetchArr(fetchArrCopy);
        console.log("run 4");
      });
    }
    setIsLiked(!isLiked);
  }

  return (
    <div>
      <div className="mainPage__heroPicture">
        <MainPageNavBar
          curUser={curUser}
          loggedIn={loggedIn}
          navPositionClass={navPositionClass}
          navColorClass={navColorClass}
        />
        <MainPageHeroImage />
      </div>
      <div className="sortingBarCont1">
        <a>
          <button className="buttonClicked">Most Recent</button>
        </a>
        <a href="/most-popular">
          <button className="buttonNotClicked">Most Popular</button>
        </a>
      </div>
      <div className="imgGallerySectionCont1">
        {/* <div className="imgGalleryCont1">{imgGallery}</div> */}
        <MainPageImageGallery curUser={curUser} loggedIn={loggedIn} />
      </div>

      <div className="joinNowContainer">
        <h1>Want to contribute?</h1>
        <h3>Upload your own stock photos in minutes.</h3>
        <button>
          <a href="/signup">Join Now</a>
        </button>
      </div>
    </div>
  );
};

export default MainPage;
