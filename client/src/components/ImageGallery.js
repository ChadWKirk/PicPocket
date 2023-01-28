import { React, useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faDownload } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

const ImageGallery = ({ curUser, loggedIn }) => {
  //img array to display
  const [imgGallery, setImgGallery] = useState([]);
  //fetch img array to map over
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
          <FontAwesomeIcon
            icon={faHeart}
            className="likeButtonHeart1 likeButtonLikedFill1"
          ></FontAwesomeIcon>
        );
      } else {
        likeButton = (
          <FontAwesomeIcon
            icon={farHeart}
            className="likeButtonHeart1"
          ></FontAwesomeIcon>
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
                <img src={element.test[0].pfp} className="profilePicAuthor" />
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
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 900: 2, 901: 3 }}
      className="imgGalleryCont1"
    >
      <h1 className="freeStockPhotosHeading">Free Stock Photos</h1>
      <Masonry>{imgGallery}</Masonry>
    </ResponsiveMasonry>
  );
};

export default ImageGallery;
