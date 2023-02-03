import React, { useState, useEffect, useRef } from "react";
import NavbarComponent from "../../components/NavbarComponent";
import ImageGallerySortFilterAndSubheadingComponent from "../../components/ImageGallerySortFilterAndSubheadingComponent";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import ImageGallery from "../../components/ImageGallery";

const SearchResultsPage = ({ curUser, loggedIn }) => {
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

  //when either sort or filter is changed, navigate to new search url
  let navigate = useNavigate();
  useEffect(() => {
    navigate(`/search/${searchQuery}/${sort}/${filter}`);
  }, [sort, filter]);

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
        </div>
        <div>
          <h4>{imgGalleryLength} results</h4>
        </div>
        <ImageGallerySortFilterAndSubheadingComponent
          sort={sort}
          setSort={setSort}
          sortTitle={sortTitle}
          setSortTitle={setSortTitle}
          filter={filter}
          setFilter={setFilter}
          filterTitle={filterTitle}
          setFilterTitle={setFilterTitle}
          imgGalleryLength={imgGalleryLength}
          searchQuery={searchQuery}
          page={"search"}
        />
        <ImageGallery
          curUser={curUser}
          loggedIn={loggedIn}
          sort={sort}
          filter={filter}
          imgGalleryLength={imgGalleryLength}
          setImgGalleryLength={setImgGalleryLength}
          type={"search"}
        />
      </div>
    </div>
  );
};

export default SearchResultsPage;
