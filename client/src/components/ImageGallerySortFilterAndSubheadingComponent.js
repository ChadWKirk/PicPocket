import { React, useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { createSearchParams, useNavigate } from "react-router-dom";

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
  curUser_hyphenated,
  curUser_real,
  page,
}) => {
  //useNavigate hook to change sort and filter parameters in url when clicking dropdown menu
  const navigate = useNavigate();

  //check for sort/filter value from url to show proper title in dropdown menu
  switch (sort.toLowerCase()) {
    case "most-recent":
      setSortTitle("Most Recent");
      break;
    case "oldest":
      setSortTitle("Oldest");
      break;
    case "atoz":
      setSortTitle("A - Z");
      break;
    case "ztoa":
      setSortTitle("Z - A");
      break;
    case "leastlikes":
      setSortTitle("Least Popular");
      break;
    case "mostlikes":
      setSortTitle("Popular");
      break;
  }
  switch (filter.toLowerCase()) {
    case "all-types":
      setFilterTitle("All Types");
      break;
    case "photo":
      setFilterTitle("Photo");
      break;
    case "illustration":
      setFilterTitle("Illustration");
      break;
  }

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
            href={`/User/${curUser_hyphenated}`}
            className="image-gallery__likes-page-subheading-img"
          >
            <img
              src={pfp}
              className="image-gallery__likes-page-subheading-img"
            />
          </a>
        </div>

        <a
          href={`/User/${curUser_hyphenated}`}
          className="image-gallery__likes-page-subheading-username-link"
        >
          {curUser_real}
        </a>
      </h1>
    );
  } else if (page == "userPage") {
    subHeading = <h1>Pics By {curUser_real}</h1>;
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
              navigate({
                search: createSearchParams({
                  sort: "most-recent",
                  filter: filter,
                }).toString(),
              });
            }}
          >
            Most Recent
          </Dropdown.Item>
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setSort("oldest");
              setSortTitle("Oldest");
              navigate({
                search: createSearchParams({
                  sort: "oldest",
                  filter: filter,
                }).toString(),
              });
            }}
          >
            Oldest
          </Dropdown.Item>
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setSort("atoz");
              setSortTitle("A - Z");
              navigate({
                search: createSearchParams({
                  sort: "atoz",
                  filter: filter,
                }).toString(),
              });
            }}
          >
            A - Z
          </Dropdown.Item>
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setSort("ztoa");
              setSortTitle("Z - A");
              navigate({
                search: createSearchParams({
                  sort: "ztoa",
                  filter: filter,
                }).toString(),
              });
            }}
          >
            Z - A
          </Dropdown.Item>
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setSort("leastlikes");
              setSortTitle("Least Popular");
              navigate({
                search: createSearchParams({
                  sort: "leastlikes",
                  filter: filter,
                }).toString(),
              });
            }}
          >
            Least Popular
          </Dropdown.Item>
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setSort("mostlikes");
              setSortTitle("Popular");
              navigate({
                search: createSearchParams({
                  sort: "mostlikes",
                  filter: filter,
                }).toString(),
              });
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
              navigate({
                search: createSearchParams({
                  sort: sort,
                  filter: "all-types",
                }).toString(),
              });
            }}
          >
            All types
          </Dropdown.Item>
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setFilter("photo");
              setFilterTitle("Photo");
              navigate({
                search: createSearchParams({
                  sort: sort,
                  filter: "photo",
                }).toString(),
              });
            }}
          >
            Photo
          </Dropdown.Item>
          <Dropdown.Item
            className="image-gallery__dropdown-item"
            onClick={() => {
              setFilter("illustration");
              setFilterTitle("Illustration");
              navigate({
                search: createSearchParams({
                  sort: sort,
                  filter: "illustration",
                }).toString(),
              });
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
