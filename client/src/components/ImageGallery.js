import { React, useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faDownload } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

const ImageGallery = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
  sort,
  filter,
  page,
  imgGalleryLength,
  setImgGalleryLength,
  isShowingImageSelectModal,
  setIsShowingImageSelectModal,
  imgGalleryScrollPosition,
  setImgGalleryScrollPosition,
  setImgTitleArrState,
  imgTitleArrState,
  setImgToLoadInFirstModal,
}) => {
  // used to navigate to imageViewPage and isShowingImageSelectModal state to show modal on first navigate
  let navigate = useNavigate();

  //subheading for Main Page
  let mainPageSubheading;
  if (page == "mainPageMostRecent" || page == "mainPageMostPopular") {
    mainPageSubheading = (
      <h2 className="image-gallery__main-page-subheading">Free Stock Photos</h2>
    );
  } else {
    mainPageSubheading = <div className="displayNone"></div>;
  }
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
    if (page == "userPage") {
      fetchRoute = `${domain}/${username
        .split("-")
        .join(" ")}/${sort}/${filter}`;
    } else if (page == "likesPage") {
      fetchRoute = `${domain}/${curUser_real}/likes/${sort}/${filter}`;
    } else if (page == "searchPage") {
      fetchRoute = `${domain}/search/${searchQuery}/${sort}/${filter}`;
    } else if (page == "mainPageMostRecent") {
      fetchRoute = `${domain}/most-recent-images`;
    } else if (page == "mainPageMostPopular") {
      fetchRoute = `${domain}/most-popular`;
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
  }, [sort, filter]);

  //map over image data to create img items for img gallery
  // array to put all img titles into to use for imageSelectModal to be able to get img src
  // and be able to go to previous or next img by altering the url with the next or previous
  // title in array. put array in state const once map is done that is in app.js to give to
  // imageviewpage
  let titleArr = [];
  useEffect(() => {
    imgDataMapOutcome = imgData.map((element, index) => {
      // use this for paddingTop of skeleton loading div to get aspect ratio
      let aspectRatio = element.height / element.width;
      let paddingTop = aspectRatio * 100; //turn aspect ratio into percentage for paddingTop
      let elementBGColor = element.colors[0][0]; //use image (element) primary color as background color
      //create array of titles to use for imageSelectModal
      let givenPublic_Id = element.public_id.slice(10); //give titleArr the public_id of element, minus the "picpocket/" part
      titleArr.push(givenPublic_Id);
      let likeButton;
      //for first img modal to load like button without fetch
      let isImgLiked;

      if (element.likedBy.includes(curUser_real)) {
        likeButton = (
          <div>
            <FontAwesomeIcon
              icon={faHeart}
              className="image-gallery__like-button-icon image-gallery__like-button-icon-filled"
            ></FontAwesomeIcon>
          </div>
        );
        isImgLiked = true;
      } else {
        likeButton = (
          <div>
            <FontAwesomeIcon
              icon={farHeart}
              className="image-gallery__like-button-icon"
            ></FontAwesomeIcon>
          </div>
        );
        isImgLiked = false;
      }

      // function navigateToImageViewPage() {
      //   navigate(`/image/${element.title}`);
      // }

      return (
        //each of these is one image item in the image gallery. Includes overlay with like, download and pfp buttons
        <div key={index} className="image-gallery__image-container">
          {/* Skeleton loading background. has background color of primary color of image (element). Uses paddingTop to maintain aspect ratio of image (see start of useEffect) */}
          <div
            style={{
              width: `${element.width}px`,
              paddingTop: `${paddingTop}%`,
              height: "100px", //add height that is smaller than the image's height so bottom of background doesn't stick out.
              background: `${elementBGColor}`,
              color: `${elementBGColor}`,
            }}
          >
            placeholder text for background of image
            <a
              onClick={() => {
                setIsShowingImageSelectModal(true);
                setImgToLoadInFirstModal({
                  imgAuthorPFP: element.test[0].pfp,
                  imgAuthorName: element.uploadedBy,
                  imgSrc:
                    element.secure_url.slice(0, 50) +
                    "q_60/c_scale,w_700/dpr_auto/" +
                    element.secure_url.slice(
                      50,
                      element.secure_url.lastIndexOf(".")
                    ) +
                    ".jpg",
                  imgTitle: element.title,
                  imgDescription: element.description,
                  imgLikes: element.likes,
                  imgDownloadURL:
                    element.secure_url.slice(0, 50) +
                    "q_100/fl_attachment/" +
                    element.secure_url.slice(
                      50,
                      element.secure_url.lastIndexOf(".")
                    ),
                  imgTags: element.tags,
                  isImgLiked: isImgLiked,
                });
                let scrollYPos = window.scrollY;
                setImgGalleryScrollPosition({
                  top: scrollYPos,
                  left: 0,
                  behavior: "instant",
                });
                navigate(`/image/${element.public_id.slice(10)}`); //removes the picpocket/ part of public_id so only name is there like "lady-540923"
              }}
              //  href={`http://localhost:3000/image/${element.title}`}
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "0",
                display: "block",
                // opacity: "0",
                // zIndex: "2",
              }}
            >
              <img
                src={
                  element.secure_url.slice(0, 50) +
                  "q_60/c_scale,w_700/dpr_auto/" +
                  element.secure_url.slice(
                    50,
                    element.secure_url.lastIndexOf(".")
                  ) +
                  ".jpg"
                }
                className="image-gallery__image"
                loading="lazy"
                onLoad={() => console.log("loaded")}
              ></img>
            </a>
            <div className="image-gallery__image-overlay-container">
              <a
                className="image-gallery__like-button-container"
                onClick={(e) => handleLike(e, element, index)}
              >
                {likeButton}
              </a>
              <a
                className="image-gallery__download-button-container"
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
                  className="image-gallery__download-button-icon"
                ></FontAwesomeIcon>
              </a>
              <div>
                <a
                  className="image-gallery__image-author-link-container"
                  href={`/User/${element.uploadedBy.split(" ").join("-")}`}
                >
                  <img
                    src={element.test[0].pfp}
                    className="image-gallery__image-author-profile-pic"
                  />
                  {element.uploadedBy}
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    });
    setImgGallery(imgDataMapOutcome);
    setImgTitleArrState(titleArr);
  }, [sort, filter, isLiked, imgData]);

  //set this to get the amount of results to use in headings like "x search results" or "x images liked by user". It's being sent up to whatever parent page is using this component.
  setImgGalleryLength(imgGallery.length);

  async function handleLike(e, element, index) {
    if (!isLoggedIn) {
      window.location.href = "/SignUp";
    } else {
      let imgDataCopy = imgData;

      if (imgDataCopy[index].likedBy.includes(curUser_real)) {
        await fetch(
          `${domain}/removeLikedBy/${element.asset_id}/${curUser_real}`,
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
          }
        ).then((res) => {
          imgDataCopy[index].likedBy = imgDataCopy[index].likedBy.filter(
            (user) => {
              return user !== curUser_real;
            }
          );
          setImgData(imgDataCopy);
        });
      } else if (!imgDataCopy[index].likedBy.includes(curUser_real)) {
        await fetch(
          `${domain}/addLikedBy/${element.asset_id}/${curUser_real}`,
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
          }
        ).then((res) => {
          imgDataCopy[index].likedBy.push(curUser_real);
          setImgData(imgDataCopy);
        });
      }
      setIsLiked(!isLiked);
    }
  }

  return (
    <div>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 900: 2, 901: 3 }}
        // className="imgGalleryCont1"
      >
        {mainPageSubheading}
        <Masonry>{imgGallery}</Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default ImageGallery;
