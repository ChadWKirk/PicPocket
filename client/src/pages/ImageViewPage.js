import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import NavBar from "../components/NavBar";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import DropDown from "../components/DropDown";
import WhiteNavBar from "../components/WhiteNavBar";

import { AiFillLike } from "react-icons/ai";

const ImageViewPage = ({ curUser, loggedIn }) => {
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
      windowHeight > 0 ? setNavPosition("fixed") : setNavPosition("gone");
    }
  }

  //on load, pull image using public id in url

  return (
    <div>
      <WhiteNavBar curUser={curUser} loggedIn={loggedIn} />
      <div className="fixed">
        <WhiteNavBar curUser={curUser} loggedIn={loggedIn} />
      </div>
      <div className="subBarCont1">
        <div className="subBarAuthor1">
          <img
            src={require("./nature-4k-pc-full-hd-wallpaper-preview.jpg")}
            className="profilePic"
          ></img>
          <h5>{curUser}</h5>
        </div>
        <div className="subBarLikeDownload1">
          <button className="imgViewLikeBtn">
            <div>♥</div>
            <div>Like</div>
          </button>
          <button className="imgViewDLBtn">Download</button>
        </div>
      </div>

      <div className="imageViewContainer">
        <div className="imageViewDetailsContainer">
          <img
            className="imageViewPageMainImg"
            alt="broken"
            src={require("./nature-4k-pc-full-hd-wallpaper-preview.jpg")} //change to pull public id from url
          ></img>
          <div className="imgViewPageTitleLikesCont">
            <div className="imgViewPageTitle">Image Title</div>
            <div className="imgViewPageLikes">
              <div className="likeCounter">RED HEART ICON number of likes</div>
            </div>
          </div>
          <div className="imgViewPageDescription">
            description of image inputted by uploader
          </div>
        </div>
      </div>
      <div className="relatedImagesContainer">
        <div className="relatedImagesTitle">Related Images</div>
        <div className="relatedImagesGalleryContainer">
          <img
            alt="broken"
            src={require("./nature-4k-pc-full-hd-wallpaper-preview.jpg")}
          ></img>
          <img
            alt="broken"
            src={require("./nature-4k-pc-full-hd-wallpaper-preview.jpg")}
          ></img>
          <img
            alt="broken"
            src={require("./nature-4k-pc-full-hd-wallpaper-preview.jpg")}
          ></img>
          <img
            alt="broken"
            src={require("./nature-4k-pc-full-hd-wallpaper-preview.jpg")}
          ></img>
          <img
            alt="broken"
            src={require("./nature-4k-pc-full-hd-wallpaper-preview.jpg")}
          ></img>
        </div>
      </div>
    </div>
  );
};

export default ImageViewPage;
