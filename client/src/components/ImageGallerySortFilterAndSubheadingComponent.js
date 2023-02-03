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
}) => {
  return (
    <div className="gallerySortBar d-flex">
      <DropdownButton className="galleryDropDownButton" title={`${sortTitle}`}>
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
  );
};

export default ImageGallerySortFilterAndSubheadingComponent;
