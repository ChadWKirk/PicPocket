import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import WhiteNavBar from "../../components/WhiteNavBar";
import { useParams } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ImageGallery from "../../components/ImageGallery";

const SearchResultsPage = ({ curUser, loggedIn }) => {
  let navigate = useNavigate();

  //to get number of images in array for "x pics liked by user" or "x search results" heading
  const [imgGalleryLength, setImgGalleryLength] = useState();

  //search query for heading
  const { searchQuery } = useParams();

  //sticky nav bar
  const [navPosition, setNavPosition] = useState("gone");

  useEffect(() => {
    window.addEventListener("scroll", setNavToFixed);

    return () => {
      window.removeEventListener("scroll", setNavToFixed);
    };
  }, []);

  function setNavToFixed() {
    if (window !== undefined) {
      let windowHeight = window.scrollY;
      windowHeight > 425 ? setNavPosition("fixed") : setNavPosition("gone");
    }
  }

  //sort and filter values to do get requests
  const [sort, setSort] = useState("most-recent");
  const [filter, setFilter] = useState("all-types");
  //sort and filter values to change the titles of the dropdown menus
  const [sortTitle, setSortTitle] = useState("Most Recent");
  const [filterTitle, setFilterTitle] = useState("All Types");

  return (
    <div>
      <WhiteNavBar curUser={curUser} loggedIn={loggedIn} />
      <div className={`${navPosition}`}>
        <WhiteNavBar curUser={curUser} loggedIn={loggedIn} />
      </div>
      <div className="imgGalleryCont1">
        <div className="photosByContainer">
          <h1
            className="freeStockPhotosHeading searchHeading"
            style={{ fontSize: "2.85rem", color: "rgba(0, 0, 0, 0.65)" }}
          >
            {searchQuery} Images {imgGalleryLength} results
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

        <ImageGallery
          curUser={curUser}
          loggedIn={loggedIn}
          sort={sort}
          filter={filter}
          imgGalleryLength={imgGalleryLength}
          setImgGalleryLength={setImgGalleryLength}
          type={"search"}
        />

        {/* <div className="imgGalleryCont1">{resultsMap}</div> */}
        {/* <a href="/signup">
          <button
            style={{
              backgroundColor: "blue",
              color: "white",
              fontSize: "2.5rem",
              borderRadius: "30px",
              padding: "1.5rem",
            }}
          >
            Sign Up!
          </button> */}
        {/* </a> */}
      </div>
    </div>
  );
};

export default SearchResultsPage;
