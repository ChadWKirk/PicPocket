import React, { useState, useEffect, useRef } from "react";
import NavbarComponent from "../components/NavbarComponent";
import MainPageHeroImage from "../components/MainPageHeroImage";
import ImageGallery from "../components/ImageGallery";
import RedBanner from "../components/RedBanner";

const MainPageContent = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
  isJustDeleted,
  setIsJustDeleted,
  isShowingImageSelectModal,
  setIsShowingImageSelectModal,
  setImgTitleArrState,
  imgTitleArrState,
  page,
}) => {
  //if account has just been deleted, render RedBanner. See comment in App.js for more.
  let redBanner;
  if (isJustDeleted) {
    redBanner = (
      <RedBanner Message={"Your account has been successfully deleted."} />
    );
  } else if (!isJustDeleted) {
    redBanner = null;
  }

  //to get number of images in array for "x pics liked by user" or "x search results" heading
  //really just a placeholder so I can use the ImageGallery component. It doesn't get used on this page
  const [imgGalleryLength, setImgGalleryLength] = useState();

  //sticky nav bar
  const [navPositionClass, setNavPositionClass] = useState();
  const [navColorClass, setNavColorClass] = useState("transparent");

  useEffect(() => {
    window.addEventListener("scroll", setNavDisplayFunction);

    return () => {
      window.removeEventListener("scroll", setNavDisplayFunction);
    };
  }, []);

  function setNavDisplayFunction() {
    if (window !== undefined) {
      let windowHeight = window.scrollY;
      windowHeight > 425 ? setNavPositionClass("fixed") : setNavPositionClass();
      windowHeight > 425
        ? setNavColorClass("white")
        : setNavColorClass("transparent");
    }
  }

  return (
    <div>
      <div className="mainPage__heroPicture">
        <NavbarComponent
          domain={domain}
          curUser_real={curUser_real}
          curUser_hyphenated={curUser_hyphenated}
          isLoggedIn={isLoggedIn}
          navPositionClass={navPositionClass}
          navColorClass={navColorClass}
        />
        {redBanner}
        <MainPageHeroImage />
      </div>
      <div className="sortingBarCont1">
        <a
          href="/"
          className={`${
            page == "mainPageMostRecent" ? "buttonClicked" : "buttonNotClicked"
          }`}
        >
          Most Recent
        </a>
        <a
          href="/most-popular"
          className={`${
            page == "mainPageMostPopular" ? "buttonClicked" : "buttonNotClicked"
          }`}
        >
          Most Popular
        </a>
      </div>
      <div className="image-gallery__container">
        <ImageGallery
          domain={domain}
          curUser_real={curUser_real}
          curUser_hyphenated={curUser_hyphenated}
          isLoggedIn={isLoggedIn}
          setImgGalleryLength={setImgGalleryLength}
          page={page}
          isShowingImageSelectModal={isShowingImageSelectModal}
          setIsShowingImageSelectModal={setIsShowingImageSelectModal}
          imgTitleArrState={imgTitleArrState}
          setImgTitleArrState={setImgTitleArrState}
        />
      </div>

      <div className="joinNowContainer box">
        <h1>Want to contribute?</h1>
        <h3>Upload your own stock photos in minutes.</h3>
        <a href="/signup">Join Now</a>
      </div>
    </div>
  );
};

export default MainPageContent;
