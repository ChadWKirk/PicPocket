import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import NavBar from "../../components/NavBar";
import NavbarComponent from "../../components/NavbarComponent";
import ImageGallerySortFilterAndSubheadingComponent from "../../components/ImageGallerySortFilterAndSubheadingComponent";
import ImageGallery from "../../components/ImageGallery";

const LikesPage = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
  isShowingImageSelectModal,
  setIsShowingImageSelectModal,
  imgGalleryScrollPosition,
  setImgGalleryScrollPosition,
  imgTitleArrState,
  setImgTitleArrState,
  setImgToLoadInFirstModal,
}) => {
  //search parameters eg: ?sort=most-recent  ... to get params use searchParams.get("x") eg: searchParams.get("sort")
  let [searchParams, setSearchParams] = useSearchParams();

  let navigate = useNavigate();

  //url parameters
  const { username, urlSort, urlFilter } = useParams();

  // console.log(params.toString());

  //if user tries to go to a user's likes page that they aren't logged in as
  //change url to url with their curUser name
  //if user tries to get to likes page and they aren't logged in at all, app.js takes cares of it by using Navigate element
  useEffect(() => {
    if (username !== curUser_hyphenated) {
      navigate(
        `/Account/${curUser_hyphenated}/Likes/?sort=most-recent&filter=all-types`
      );
    }
  }, []);

  //to get profile picture of user's like page you are seeing
  const [userInfo, setUserInfo] = useState();

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
          .then((parsedJSON) => setUserInfo(parsedJSON[0]))
      );
    }

    fetchUserInfo();
  }, [username]);

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

  //to get number of images in array for "x pics liked by user" or "x search results" heading
  const [imgGalleryLength, setImgGalleryLength] = useState();

  //sort and filter values to do get requests
  const [sort, setSort] = useState(searchParams.get("sort"));
  const [filter, setFilter] = useState(searchParams.get("filter"));
  //sort and filter values to change the titles of the dropdown menus
  const [sortTitle, setSortTitle] = useState("Most Recent");
  const [filterTitle, setFilterTitle] = useState("All Types");

  let whosLikesIsItHeading;

  if (username == curUser_hyphenated) {
    whosLikesIsItHeading = <h2>Your Likes</h2>;
  } else {
    whosLikesIsItHeading = <h2>{username.split(" ").join("-")}'s Likes</h2>;
  }

  // prev scroll position for clicking out of image modal. to return to previous scroll position of previous page
  //runs outside of useEffect to make sure it takes effect (runs after every render. useEffect using empty dependency array wasn't working)
  window.scrollTo(imgGalleryScrollPosition);
  if (imgGalleryScrollPosition) {
    //stops scrolling to the position after 200ms just to make sure it takes effect and then stops once it does
    //without this time out it will keep scrolling back to the imgGalleryScrollPosition if you try to scroll away, because it is always running
    //but clearing the imgGalleryScrollPosition makes it not scroll to any position since nothing is there. making it window.scrollTo() (nothing)
    setTimeout(() => {
      setImgGalleryScrollPosition();
    }, 200);
  }

  return (
    <div>
      {/* <NavBar curUser={curUser} isLoggedIn={isLoggedIn} /> */}
      <NavbarComponent
        domain={domain}
        curUser_real={curUser_real}
        curUser_hyphenated={curUser_hyphenated}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      <div>
        <div className="galleryHeadingAndSortContainer">
          <div className="galleryHeading">
            {whosLikesIsItHeading}
            <p>
              {imgGalleryLength} images liked by {username.split("-").join(" ")}
            </p>
          </div>
        </div>

        <div className="image-gallery__container">
          {/* <div className="image-gallery__dropdown-and-subheading-container"> */}
          {/* <h1 className="image-gallery__likes-page-subheading-container">
              <div className="image-gallery__likes-page-hover-div">
                <a
                  href={`http://localhost:3000/User/${username}`}
                  className="image-gallery__likes-page-subheading-img"
                >
                  <img src={pfp} className="profilePic" />
                </a>
              </div>

              <a
                href={`http://localhost:3000/User/${username}`}
                className="image-gallery__likes-page-subheading-username-link"
              >
                {username}
              </a>
            </h1> */}
          <ImageGallerySortFilterAndSubheadingComponent
            domain={domain}
            sort={sort}
            setSort={setSort}
            sortTitle={sortTitle}
            setSortTitle={setSortTitle}
            filter={filter}
            setFilter={setFilter}
            filterTitle={filterTitle}
            setFilterTitle={setFilterTitle}
            imgGalleryLength={imgGalleryLength}
            pfp={pfp}
            curUser_real={curUser_real}
            curUser_hyphenated={curUser_hyphenated}
            page={"likesPage"}
          />
          {/* </div> */}
          {/* {resultsMap} */}
          <ImageGallery
            domain={domain}
            curUser_real={curUser_real}
            curUser_hyphenated={curUser_hyphenated}
            isLoggedIn={isLoggedIn}
            page={"likesPage"}
            filter={filter}
            sort={sort}
            imgGalleryLength={imgGalleryLength}
            setImgGalleryLength={setImgGalleryLength}
            isShowingImageSelectModal={isShowingImageSelectModal}
            setIsShowingImageSelectModal={setIsShowingImageSelectModal}
            imgGalleryScrollPosition={imgGalleryScrollPosition}
            setImgGalleryScrollPosition={setImgGalleryScrollPosition}
            imgTitleArrState={imgTitleArrState}
            setImgTitleArrState={setImgTitleArrState}
            setImgToLoadInFirstModal={setImgToLoadInFirstModal}
          />
        </div>
      </div>
    </div>
  );
};

export default LikesPage;
