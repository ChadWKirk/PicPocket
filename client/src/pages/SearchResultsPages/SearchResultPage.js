import React, { useState, useEffect, useRef } from "react";
import NavbarComponent from "../../components/NavbarComponent";
import ImageGallerySortFilterAndSubheadingComponent from "../../components/ImageGallerySortFilterAndSubheadingComponent";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import ImageGallery from "../../components/ImageGallery";

const SearchResultsPage = ({
  domain,
  curUser,
  isLoggedIn,
  isShowingImageSelectModal,
  setIsShowingImageSelectModal,
  imgTitleArrState,
  setImgTitleArrState,
}) => {
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
        domain={domain}
        curUser={curUser}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      <div className="image-gallery__container">
        <h1 className="image-gallery__searchquery-heading">
          {searchQuery} Images
        </h1>
        {/* <div
          className="image-gallery__dropdown-and-subheading-container"
          style={{ height: "20px", marginBottom: "27px" }}
        > */}

        <ImageGallerySortFilterAndSubheadingComponent
          domain={domain}
          sort={sort}
          setSort={setSort}
          sortTitle={sortTitle}
          setSortTitle={setSortTitle}
          filter={filter}
          setFilter={setFilter}
          filterTitle={filterTitle}
          setFilterTitle={setFilterTitle}
          imgGalleryLength={imgGalleryLength}
          page={"searchPage"}
        />
        {/* </div> */}
        <ImageGallery
          domain={domain}
          curUser={curUser}
          isLoggedIn={isLoggedIn}
          sort={sort}
          filter={filter}
          imgGalleryLength={imgGalleryLength}
          setImgGalleryLength={setImgGalleryLength}
          isShowingImageSelectModal={isShowingImageSelectModal}
          setIsShowingImageSelectModal={setIsShowingImageSelectModal}
          imgTitleArrState={imgTitleArrState}
          setImgTitleArrState={setImgTitleArrState}
          page={"searchPage"}
        />
      </div>
    </div>
  );
};

export default SearchResultsPage;
