import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import NavBar from "../components/NavBar";
import NavbarComponent from "../components/NavbarComponent";
import ImageGallerySortFilterAndSubheadingComponent from "../components/ImageGallerySortFilterAndSubheadingComponent";
import ImageGallery from "../components/ImageGallery";

const UserPage = ({
  domain,
  curUser,
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

  useEffect(() => {
    async function fetchUserInfo() {
      await fetch(`${domain}/${username}/info`, {
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
        curUser={curUser}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      <div className="galleryContainer">
        <div className="galleryHeadingAndSortContainer">
          <div className="galleryHeading">
            <img src={pfp} className="profilePicBig" />
            <h2>{username}</h2>
            <p>{bio}</p>
          </div>
        </div>

        <div className="image-gallery__container">
          {/* <div className="image-gallery__dropdown-and-subheading-container"> */}
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
            username={username}
            page={"userPage"}
          />
          {/* </div> */}
          <ImageGallery
            domain={domain}
            curUser={curUser}
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
    </div>
  );
};

export default UserPage;
