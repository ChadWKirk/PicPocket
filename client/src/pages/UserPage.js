import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import NavBar from "../components/NavBar";
import NavbarComponent from "../components/NavbarComponent";
import ImageGallerySortFilterAndSubheadingComponent from "../components/ImageGallerySortFilterAndSubheadingComponent";
import ImageGallery from "../components/ImageGallery";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const UserPage = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
  imgTitleArrState,
  setImgTitleArrState,
  isShowingImageSelectModal,
  setIsShowingImageSelectModal,
}) => {
  const { username } = useParams();

  //to get number of images in array for "x pics liked by user" or "x search results" heading
  const [imgGalleryLength, setImgGalleryLength] = useState();

  //sort and filter values to do get requests
  const [sort, setSort] = useState("most-recent");
  const [filter, setFilter] = useState("all-types");
  //sort and filter values to change the titles of the dropdown menus
  const [sortTitle, setSortTitle] = useState("Most Recent");
  const [filterTitle, setFilterTitle] = useState("All Types");

  const [userInfo, setUserInfo] = useState();

  // whether a user is found by fetchUserInfo() or not. Determines whether "page not found" content is display or normal userPage content is displayed
  const [isUserFound, setIsUserFound] = useState(true);

  //whether page content is being loaded or not. changes to false once fetchUserInfo() is done fetching so blank user page content doesn't show for a split second before Page Not Found content is displayed
  const [isLoading, setIsLoading] = useState(true);

  console.log(sort);

  useEffect(() => {
    async function fetchUserInfo() {
      await fetch(`${domain}/${username.split("-").join(" ")}/info`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => {
            if (parsedJSON === "no user found") {
              setIsUserFound(false);
              setIsLoading(false);
            } else {
              setUserInfo(parsedJSON[0]);
              setIsLoading(false);
            }
          })
      );
    }

    fetchUserInfo();
  }, []);

  let pfp;
  let bio;
  if (userInfo) {
    pfp =
      userInfo.pfp.slice(0, 50) +
      "q_60/c_scale,w_200/dpr_auto/" +
      userInfo.pfp.slice(50, userInfo.pfp.lastIndexOf(".")) +
      ".jpg";
    bio = userInfo.bio;
  }

  return (
    <div>
      {/* <NavBar curUser={curUser} loggedIn={loggedIn} /> */}
      <NavbarComponent
        domain={domain}
        curUser_real={curUser_real}
        curUser_hyphenated={curUser_hyphenated}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      {!isLoading && !isUserFound && (
        <div className="not-found-page__contents-container">
          <div className="not-found-page__icon">
            <FontAwesomeIcon icon={faQuestionCircle} />
          </div>
          <div className="not-found-page__message">
            Sorry, this page could not be found.
          </div>
          <div className="not-found-page__link">
            <a href="/">Go Back Home</a>
          </div>
        </div>
      )}
      {!isLoading && isUserFound && (
        <div className="galleryContainer">
          <div className="galleryHeadingAndSortContainer">
            <div className="galleryHeading">
              <img src={pfp} className="profilePicBig" />
              <h2>{username.split("-").join(" ")}</h2>
              <p>{bio}</p>
            </div>
          </div>

          <div className="image-gallery__container">
            {/* <div className="image-gallery__dropdown-and-subheading-container"> */}
            <ImageGallerySortFilterAndSubheadingComponent
              domain={domain}
              username={username}
              sort={sort}
              setSort={setSort}
              sortTitle={sortTitle}
              setSortTitle={setSortTitle}
              filter={filter}
              setFilter={setFilter}
              filterTitle={filterTitle}
              setFilterTitle={setFilterTitle}
              imgGalleryLength={imgGalleryLength}
              curUser_real={curUser_real}
              curUser_hyphenated={curUser_hyphenated}
              page={"userPage"}
            />
            {/* </div> */}
            <ImageGallery
              domain={domain}
              username={username}
              curUser_real={curUser_real}
              curUser_hyphenated={curUser_hyphenated}
              isLoggedIn={isLoggedIn}
              sort={sort}
              filter={filter}
              imgGalleryLength={imgGalleryLength}
              setImgGalleryLength={setImgGalleryLength}
              isShowingImageSelectModal={isShowingImageSelectModal}
              setIsShowingImageSelectModal={setIsShowingImageSelectModal}
              imgTitleArrState={imgTitleArrState}
              setImgTitleArrState={setImgTitleArrState}
              page={"userPage"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
