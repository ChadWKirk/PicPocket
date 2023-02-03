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
  page,
}) => {
  let subHeading;
  if (page == "searchPage") {
    subHeading = (
      <div>
        <h4>{imgGalleryLength} results</h4>
      </div>
    );
  }
  return (
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
  );
};

export default ImageGallerySortFilterAndSubheadingComponent;
