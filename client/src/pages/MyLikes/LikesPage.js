import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import NavBar from "../../components/NavBar";
import NavbarComponent from "../../components/NavbarComponent";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ImageGallery from "../../components/ImageGallery";

const LikesPage = ({ curUser, loggedIn }) => {
  const { username } = useParams();
  let navigate = useNavigate();

  //to get profile picture of user's like page you are seeing
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    async function fetchUserInfo() {
      await fetch(`http://localhost:5000/${username}/info`, {
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

  //to get number of images in array for "x pics liked by user" or "x search results" heading
  const [imgGalleryLength, setImgGalleryLength] = useState();

  //sort and filter values to do get requests
  const [sort, setSort] = useState("most-recent");
  const [filter, setFilter] = useState("all-types");
  //sort and filter values to change the titles of the dropdown menus
  const [sortTitle, setSortTitle] = useState("Most Recent");
  const [filterTitle, setFilterTitle] = useState("All Types");

  // useEffect(() => {
  //   navigate(`/Account/${curUser}/Likes/${sort}/${filter}`);
  // }, []);

  let whosLikesIsItHeading;

  if (username == curUser) {
    whosLikesIsItHeading = <h2>Your Likes</h2>;
  } else {
    whosLikesIsItHeading = <h2>{username}'s Likes</h2>;
  }
  return (
    <div>
      {/* <NavBar curUser={curUser} loggedIn={loggedIn} /> */}
      <NavbarComponent
        curUser={curUser}
        loggedIn={loggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      <div className="galleryContainer">
        <div className="galleryHeadingAndSortContainer">
          <div className="galleryHeading">
            {whosLikesIsItHeading}
            <p>
              {imgGalleryLength} images liked by {username}
            </p>
          </div>
        </div>

        <div className="imgGalleryCont1">
          <div className="photosByContainer">
            <h1 className="freeStockPhotosHeading">
              <div className="hoverThisForPFPOverlay">
                <a
                  href={`http://localhost:3000/Account/${username}`}
                  className="freeStockPhotosHeadingImg"
                >
                  <img src={pfp} className="profilePic" />
                </a>
              </div>

              <a
                href={`http://localhost:3000/Account/${username}`}
                className="likesPageHeadingUsernameLink"
              >
                {username}
              </a>
            </h1>
            <div className="gallerySortBar d-flex">
              <DropdownButton
                className="galleryDropDownButton"
                title={`${sortTitle}`}
              >
                <Dropdown.Item
                  className="galleryDropDownItem"
                  onClick={() => {
                    setSort("most-recent");
                    setSortTitle("Most Recent");
                  }}
                >
                  Most Recent
                </Dropdown.Item>
                <Dropdown.Item
                  className="galleryDropDownItem"
                  onClick={() => {
                    setSort("oldest");
                    setSortTitle("Oldest");
                  }}
                >
                  Oldest
                </Dropdown.Item>
                <Dropdown.Item
                  className="galleryDropDownItem"
                  onClick={() => {
                    setSort("aToz");
                    setSortTitle("A - Z");
                  }}
                >
                  A - Z
                </Dropdown.Item>
                <Dropdown.Item
                  className="galleryDropDownItem"
                  onClick={() => {
                    setSort("zToa");
                    setSortTitle("Z - A");
                  }}
                >
                  Z - A
                </Dropdown.Item>
                <Dropdown.Item
                  className="galleryDropDownItem"
                  onClick={() => {
                    setSort("leastLikes");
                    setSortTitle("Least Popular");
                  }}
                >
                  Least Popular
                </Dropdown.Item>
                <Dropdown.Item
                  className="galleryDropDownItem"
                  onClick={() => {
                    setSort("mostLikes");
                    setSortTitle("Popular");
                  }}
                >
                  Popular
                </Dropdown.Item>
              </DropdownButton>
              <DropdownButton
                className="galleryDropDownButton"
                title={`${filterTitle}`}
              >
                <Dropdown.Item
                  className="galleryDropDownItem"
                  onClick={() => {
                    setFilter("all-types");
                    setFilterTitle("All Types");
                  }}
                >
                  All types
                </Dropdown.Item>
                <Dropdown.Item
                  className="galleryDropDownItem"
                  onClick={() => {
                    setFilter("Photo");
                    setFilterTitle("Photo");
                  }}
                >
                  Photo
                </Dropdown.Item>
                <Dropdown.Item
                  className="galleryDropDownItem"
                  onClick={() => {
                    setFilter("Illustration");
                    setFilterTitle("Illustration");
                  }}
                >
                  Illustration
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
          {/* {resultsMap} */}
          <ImageGallery
            curUser={curUser}
            loggedIn={loggedIn}
            type={"likes"}
            filter={filter}
            sort={sort}
            imgGalleryLength={imgGalleryLength}
            setImgGalleryLength={setImgGalleryLength}
          />
        </div>
      </div>
    </div>
  );
};

export default LikesPage;
