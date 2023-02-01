import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ImageGallery from "../components/ImageGallery";

const UserPage = ({ curUser, loggedIn }) => {
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

  return (
    <div>
      <NavBar curUser={curUser} loggedIn={loggedIn} />

      <div className="galleryContainer">
        <div className="galleryHeadingAndSortContainer">
          <div className="galleryHeading">
            <img src={pfp} className="profilePicBig" />
            <h2>{username}</h2>
            <p>{bio} okokoko bio</p>
          </div>
        </div>

        <div className="imgGallerySectionCont1">
          <div className="photosByContainer">
            <h1 className="freeStockPhotosHeading">Photos By {username}</h1>
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
          <ImageGallery
            curUser={curUser}
            loggedIn={loggedIn}
            sort={sort}
            filter={filter}
            imgGalleryLength={imgGalleryLength}
            setImgGalleryLength={setImgGalleryLength}
            type={"userPage"}
          />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
