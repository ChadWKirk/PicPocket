import { React, useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useNavigate } from "react-router-dom";

const ImageGallerySortFilterAndSubheadingComponent = ({
  sort,
  setSort,
  sortTitle,
  setSortTitle,
  filter,
  setFilter,
  filterTitle,
  setFilterTitle,
  imgGalleryLength,
  searchQuery,
  pfp,
  username,
  page,
}) => {
  let subHeading;
  if (page == "searchPage") {
    subHeading = (
      <h1 className="image-gallery__search-results-length-subheading">
        {imgGalleryLength} results
      </h1>
    );
  } else if (page == "likesPage") {
    subHeading = (
      <h1 className="image-gallery__likes-page-subheading-container">
        <div className="image-gallery__likes-page-hover-div">
          <a
            href={`https://picpoccket.com/User/${username}`}
            className="image-gallery__likes-page-subheading-img"
          >
            <img
              src={pfp}
              className="image-gallery__likes-page-subheading-img"
            />
          </a>
        </div>

        <a
          href={`https://picpoccket.com/User/${username}`}
          className="image-gallery__likes-page-subheading-username-link"
        >
          {username.split("-").join(" ")}
        </a>
      </h1>
    );
  } else if (page == "userPage") {
    subHeading = <h1>Pics By {username}</h1>;
  }
  return (
    <div className="image-gallery__dropdown-and-subheading-container">
      {subHeading}
      <div className="image-gallery__sort-filter-dropdown-container d-flex">
        <DropdownButton
          className="image-gallery__dropdown-button"
          title={`${sortTitle}`}
        >
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setSort("most-recent");
              setSortTitle("Most Recent");
            }}
          >
            Most Recent
          </Dropdown.Item>
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setSort("oldest");
              setSortTitle("Oldest");
            }}
          >
            Oldest
          </Dropdown.Item>
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setSort("aToz");
              setSortTitle("A - Z");
            }}
          >
            A - Z
          </Dropdown.Item>
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setSort("zToa");
              setSortTitle("Z - A");
            }}
          >
            Z - A
          </Dropdown.Item>
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setSort("leastLikes");
              setSortTitle("Least Popular");
            }}
          >
            Least Popular
          </Dropdown.Item>
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setSort("mostLikes");
              setSortTitle("Popular");
            }}
          >
            Popular
          </Dropdown.Item>
        </DropdownButton>
        <DropdownButton
          className="image-gallery__dropdown-button"
          title={`${filterTitle}`}
        >
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setFilter("all-types");
              setFilterTitle("All Types");
            }}
          >
            All types
          </Dropdown.Item>
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setFilter("Photo");
              setFilterTitle("Photo");
            }}
          >
            Photo
          </Dropdown.Item>
          <Dropdown.Item
            className="image-gallery__dropdown-item"
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
  );
};

export default ImageGallerySortFilterAndSubheadingComponent;
