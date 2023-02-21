import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // useEffect(() => {
  //   //get random number to get random index from slide array
  //   function getRandomInt(max) {
  //     return Math.floor(Math.random() * max);
  //   }

  //   async function getCarouselImages() {
  //     await fetch("http://localhost:5000/randomImages", {
  //       method: "GET",
  //       headers: { "Content-type": "application/json" },
  //     }).then((response) =>
  //       response
  //         .json()
  //         .then((resJSON) => JSON.stringify(resJSON))
  //         .then((stringJSON) => JSON.parse(stringJSON))
  //         .then((parsedJSON) => (slideArr = parsedJSON))
  //     );
  //     console.log(slideArr);
  //     //shuffling an array to get better randomization than just math.random
  //     var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  //     function shuffle(o) {
  //       for (
  //         var j, x, i = o.length;
  //         i;
  //         j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
  //       );
  //       return o;
  //     }

  //     var random = shuffle(numbers);

  //     console.log(random + " randommm");

  //     setHeroImage(slideArr[random[0]].secure_url);
  //   }
  //   getCarouselImages();
  // }, []);

  //go to /search/whateverYouSearchFor when hitting enter or clicking search button
  var navigate = useNavigate();
  let inputValue;

  function onChange(event) {
    inputValue = event.target.value;
    console.log(inputValue);
  }

  function onSubmit() {
    navigate(`/search/${inputValue}/most-recent/all-types`);
  }

  return (
    <div className="carousel__container">
      <div className="carousel__overlay">
        <p>
          The best free stock photos. Royalty free images shared by creators.
        </p>
        <form className="carousel__search-container" onSubmit={onSubmit}>
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
          <a href="https://picpoccket.com/search/Nature/most-recent/all-types">
            Nature,
          </a>
          <a href="https://picpoccket.com/search/Cats/most-recent/all-types">
            Cats,
          </a>
          <a href="https://picpoccket.com/search/Dogs/most-recent/all-types">
            Dogs,
          </a>
          <a href="https://picpoccket.com/search/Tech/most-recent/all-types">
            Tech,
          </a>
          <a href="https://picpoccket.com/search/Landscape/most-recent/all-types">
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
