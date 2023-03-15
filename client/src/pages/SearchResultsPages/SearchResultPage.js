import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import NavbarComponent from "../../components/NavbarComponent";
import ImageGallerySortFilterAndSubheadingComponent from "../../components/ImageGallerySortFilterAndSubheadingComponent";

import ImageGallery from "../../components/ImageGallery";

const SearchResultsPage = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
  isShowingImageSelectModal,
  setIsShowingImageSelectModal,
  imgGalleryScrollPosition,
  setImgGalleryScrollPosition,
  imgTitleArrState,
  setImgTitleArrState,
}) => {
  //search parameters eg: ?sort=most-recent  ... to get params use searchParams.get("x") eg: searchParams.get("sort")
  let [searchParams, setSearchParams] = useSearchParams();

  //to get number of images in array for "x pics liked by user" or "x search results" heading
  const [imgGalleryLength, setImgGalleryLength] = useState();

  //search query for heading
  const { searchQuery } = useParams();

  //sort and filter values to do get requests
  const [sort, setSort] = useState(searchParams.get("sort"));
  const [filter, setFilter] = useState(searchParams.get("filter"));
  //sort and filter values to change the titles of the dropdown menus
  const [sortTitle, setSortTitle] = useState("Most Recent");
  const [filterTitle, setFilterTitle] = useState("All Types");

  //when either sort or filter is changed, navigate to new search url
  let navigate = useNavigate();
  // useEffect(() => {
  //   navigate(`/search/${searchQuery}/?sort=most-recent&filter=all-types`);
  // }, [sort, filter]);

  // prev scroll position for clicking out of image modal. to return to previous scroll position of previous page
  //runs outside of useEffect to make sure it takes effect (runs after every render. useEffect using empty dependency array wasn't working)
  window.scrollTo(imgGalleryScrollPosition);
  if (imgGalleryScrollPosition) {
    //stops scrolling to the position after 200ms just to make sure it takes effect and then stops once it does
    //without this time out it will keep scrolling back to the imgGalleryScrollPosition if you try to scroll away, because it is always running
    //but clearing the imgGalleryScrollPosition makes it not scroll to any position since nothing is there. making it window.scrollTo() (nothing)
    setTimeout(() => {
      setImgGalleryScrollPosition();
    }, 200);
  }

  return (
    <div>
      <NavbarComponent
        domain={domain}
        curUser_real={curUser_real}
        curUser_hyphenated={curUser_hyphenated}
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
          curUser_real={curUser_real}
          curUser_hyphenated={curUser_hyphenated}
          isLoggedIn={isLoggedIn}
          sort={sort}
          filter={filter}
          imgGalleryLength={imgGalleryLength}
          setImgGalleryLength={setImgGalleryLength}
          isShowingImageSelectModal={isShowingImageSelectModal}
          setIsShowingImageSelectModal={setIsShowingImageSelectModal}
          imgGalleryScrollPosition={imgGalleryScrollPosition}
          setImgGalleryScrollPosition={setImgGalleryScrollPosition}
          imgTitleArrState={imgTitleArrState}
          setImgTitleArrState={setImgTitleArrState}
          page={"searchPage"}
        />
      </div>
    </div>
  );
};

export default SearchResultsPage;
