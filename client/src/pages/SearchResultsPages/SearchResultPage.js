import React, { useState, useEffect, useRef } from "react";
import NavbarComponent from "../../components/NavbarComponent";
import { useNavigate } from "react-router-dom";
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

  //sort and filter values to do get requests
  const [sort, setSort] = useState("most-recent");
  const [filter, setFilter] = useState("all-types");
  //sort and filter values to change the titles of the dropdown menus
  const [sortTitle, setSortTitle] = useState("Most Recent");
  const [filterTitle, setFilterTitle] = useState("All Types");

  return (
    <div>
      <NavbarComponent
        curUser={curUser}
        loggedIn={loggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      <div className="imgGalleryCont1">
        <div className="photosByContainer">
          <div>
            <h1
              className="freeStockPhotosHeading searchHeading"
              style={{ fontSize: "3rem", color: "rgba(0, 0, 0, 0.65)" }}
            >
              {searchQuery} Images
            </h1>
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
        </div>
        <div>
          <h4>{imgGalleryLength} results</h4>
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
