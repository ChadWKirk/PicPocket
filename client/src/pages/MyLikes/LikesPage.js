import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import DropdownButton from "react-bootstrap/DropdownButton";
import ImageGallery from "../../components/ImageGallery";

const LikesPage = ({ curUser, loggedIn }) => {
  let navigate = useNavigate();

  //to get number of images in array for "x pics liked by user" or "x search results" heading
  const [imgGalleryLength, setImgGalleryLength] = useState();

  //sort and filter values to do get requests
  const [sort, setSort] = useState("most-recent");
  const [filter, setFilter] = useState("all-types");
  //sort and filter values to change the titles of the dropdown menus
  const [sortTitle, setSortTitle] = useState("Most Recent");
  const [filterTitle, setFilterTitle] = useState("All Types");

  useEffect(() => {
    navigate(`/Account/${curUser}/Likes/${sort}/${filter}`);
  }, []);

  // let resultsMapLength;
  // if (resultsMap) {
  //   resultsMapLength = resultsMap.length;
  // }
  return (
    <div>
      <NavBar curUser={curUser} loggedIn={loggedIn} />

      <div className="galleryContainer">
        <div className="galleryHeadingAndSortContainer">
          <div className="galleryHeading">
            <h2>Your Likes</h2>
            <p>
              {imgGalleryLength} images liked by {curUser}
            </p>
          </div>
        </div>
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
        <div
          className="imgGalleryCont1"
          style={{ marginLeft: "1rem", marginRight: "1rem" }}
        >
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
