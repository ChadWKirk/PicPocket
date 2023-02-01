import { React, useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faDownload } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

const ImageGallery = ({
  curUser,
  loggedIn,
  sort,
  filter,
  type,
  imgGalleryLength,
  setImgGalleryLength,
}) => {
  //username for user page (not current logged in user's username)
  const { username } = useParams();
  //the thing you searched to use for fetch request (if being used for search results page)
  const { searchQuery } = useParams();

  //img array to display
  const [imgGallery, setImgGallery] = useState([]);
  //fetch img array to map over
  const [imgData, setImgData] = useState([]);
  //isLiked to re render array upon liking or unliking a pic
  const [isLiked, setIsLiked] = useState(false);

  let imgDataMapOutcome;

  //fetch image data
  useEffect(() => {
    //depending on what the type prop is set to, use one of these routes to fetch img data
    let fetchRoute;
    if (type == "userPage") {
      fetchRoute = `http://localhost:5000/${username}/${sort}/${filter}`;
    } else if (type == "likes") {
      fetchRoute = `http://localhost:5000/${username}/likes/${sort}/${filter}`;
    } else if (type == "search") {
      fetchRoute = `http://localhost:5000/search/${searchQuery}/${sort}/${filter}`;
    }
    async function fetchImgData() {
      await fetch(fetchRoute, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => setImgData(parsedJSON))
      );
    }
    fetchImgData();
  }, []);

  //map over image data to create img items for img gallery
  useEffect(() => {
    imgDataMapOutcome = imgData.map((element, index) => {
      let likeButton;

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
        //each of these is one image item in the image gallery. Includes overlay with like, download and pfp buttons
        <div key={index} className="imgGalleryImgCont1">
          <a href={`http://localhost:3000/image/${element.title}`}>
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
    setImgGallery(imgDataMapOutcome);
  }, [sort, filter, isLiked, imgData]);

  //set this to get the amount of results to use in headings like "x search results" or "x images liked by user". It's being sent up to whatever parent page is using this component.
  setImgGalleryLength(imgGallery.length);

  async function handleLike(e, element, index) {
    let imgDataCopy = imgData;

    if (imgDataCopy[index].likedBy.includes(curUser)) {
      await fetch(
        `http://localhost:5000/removeLikedBy/${element.asset_id}/${curUser}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
        }
      ).then((res) => {
        imgDataCopy[index].likedBy = imgDataCopy[index].likedBy.filter(
          (user) => {
            return user !== curUser;
          }
        );
        setImgData(imgDataCopy);
      });
    } else if (!imgDataCopy[index].likedBy.includes(curUser)) {
      await fetch(
        `http://localhost:5000/addLikedBy/${element.asset_id}/${curUser}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
        }
      ).then((res) => {
        imgDataCopy[index].likedBy.push(curUser);
        setImgData(imgDataCopy);
      });
    }
    setIsLiked(!isLiked);
  }

  return (
    <div>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 900: 2, 901: 3 }}
        // className="imgGalleryCont1"
      >
        <Masonry>{imgGallery}</Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default ImageGallery;
