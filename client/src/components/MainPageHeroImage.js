import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//images
import mainImage from "../images/4k/pexels-water-rocks-4k-blur.jpg";
// import mainImage from "../images/4k/pexels-coffee-4k.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
const MainPageHeroImage = () => {
  //on load, fetch 5 random images and use them as variables in the img src
  //resJSON will be an array of secure_url's
  const [heroImage, setHeroImage] = useState();

  var slideArr = [];

  //for bootstrap carousel controls
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  //go to /search/whateverYouSearchFor when hitting enter or clicking search button
  var navigate = useNavigate();
  let inputValue;

  function onChange(event) {
    inputValue = event.target.value;
    console.log(inputValue);
  }

  function onSubmit(e) {
    e.preventDefault();
    window.location.href = `/search/${inputValue}/?sort=most-recent&filter=all-types`;
  }

  return (
    <div className="carousel__container">
      <div className="carousel__black-bg-for-image">
        <img
          src="https://res.cloudinary.com/dtyg4ctfr/image/upload/q_40/dpr_auto/v1679876969/pexels-water-rocks-4k-full_mssmdr.jpg"
          loading="lazy"
          className="carousel__hero-image"
        ></img>
      </div>

      <div className="carousel__overlay">
        <p>
          The best free stock photos. Royalty free images shared by creators.
        </p>
        <form
          className="carousel__search-container"
          onSubmit={(e) => onSubmit(e)}
        >
          <input
            className="carousel__search-bar"
            placeholder="Search for free photos"
            onChange={onChange}
          ></input>
          <button className="carousel__search-button" type="submit">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="carousel__search-icon"
            />
          </button>
        </form>
        <div className="carousel__overlay-categories">
          <p>Try these: </p>
          <a href="/search/Nature/?sort=most-recent&filter=all-types">
            Nature,
          </a>
          <a href="/search/Cats/?sort=most-recent&filter=all-types">Cats,</a>
          <a href="/search/Dogs/?sort=most-recent&filter=all-types">Dogs,</a>
          <a href="/search/Tech/?sort=most-recent&filter=all-types">Tech,</a>
          <a href="/search/Landscape/?sort=most-recent&filter=all-types">
            Landscape
          </a>
        </div>
      </div>
      <div
        activeIndex={index}
        onSelect={handleSelect}
        className="carousel__contents"
      >
        {/* <img className="heroImage" src={heroImage} alt="Hero Image" /> */}
      </div>
    </div>
  );
};

export default MainPageHeroImage;
