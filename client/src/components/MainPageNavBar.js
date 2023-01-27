import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
// import { BsCartCheck } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faBars,
  faUpload,
  faXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import HamburgerList from "./HamburgerList";

const MainPageNavBar = ({ curUser, loggedIn, windowSize }) => {
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
  //navbuttons
  let soButton;
  let accButton;
  let hamburgerButton;
  let hamIconOrX;
  //media queries for hamburger. if hamOpen - remove pfp button if width < 730px
  let accButtonClass;
  let uploadButtonClass;
  let blackBG;
  let searchbarClass;
  let hamburgerIconClass;
  let smallUploadButtonClass;
  let navbarContentsClass;
  let navbar__buttonsClass;
  let hamburgerListClass;
  const [hamIconOpen, setHamIconOpen] = useState(false);
  //if ham open or close
  if (hamIconOpen) {
    hamIconOrX = <FontAwesomeIcon icon={faXmark} className="hamburgerXIcon" />;
    blackBG = "blackBG";
    accButtonClass = "navbarDropCont--hamopen";
    uploadButtonClass = "navbarClickThisButton--hamopen";
    searchbarClass = "carousel__search-container--hamopen";
    hamburgerIconClass = "hamburgerIcon--hamopen";
    smallUploadButtonClass = "smallUploadButton--hamopen";
    navbarContentsClass = "navbarContents--hamopen";
    navbar__buttonsClass = "navbar__buttons--hamopen";
    hamburgerListClass = "hamburgerListClass";
  } else if (!hamIconOpen) {
    hamIconOrX = <FontAwesomeIcon icon={faBars} className="hamburgerIcon" />;
    accButtonClass = "navbarDropCont";
    uploadButtonClass = "navbarClickThisButton";
    searchbarClass = "carousel__search-container--hamclose";
    hamburgerIconClass = "hamburgerIcon";
    smallUploadButtonClass = "smallUploadButton";
    navbarContentsClass = "navbarContents";
    navbar__buttonsClass = "navbar__buttons";
    hamburgerListClass = "gone";
  }

  let siButton;
  let suButton;
  let uploadButton;
  let smallUploadButton;
  let timer;
  let leaveTimer;

  const [isVisibleClass, setIsVisibleClass] = useState("gone");

  function setVisibleClassFunc() {
    if (isVisibleClass == "gone") {
      setIsVisibleClass("");
    } else {
      setIsVisibleClass("gone");
    }
  }

  const [hoverClass, setHoverClass] = useState(false);

  const [userInfo, setUserInfo] = useState();
  const [userPFP, setPFP] = useState();

  useEffect(() => {
    async function userInfoFetch() {
      await fetch(`http://localhost:5000/${curUser}/info`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => {
            setUserInfo(parsedJSON[0]);
            setPFP(
              parsedJSON[0].pfp.slice(0, 50) +
                "q_60/c_scale,w_200/dpr_auto/" +
                parsedJSON[0].pfp.slice(
                  50,
                  parsedJSON[0].pfp.lastIndexOf(".")
                ) +
                ".jpg"
            );
          })
      );
    }

    userInfoFetch();
  }, []);
  let icon;
  if (hoverClass) {
    icon = (
      <FontAwesomeIcon
        className="navbarArrowIconDownwards"
        icon={faChevronUp}
        fontSize={10}
        style={{ marginTop: "5px" }}
      />
    );
  } else {
    icon = (
      <FontAwesomeIcon
        className="navbarArrowIconDownwards"
        icon={faChevronDown}
        fontSize={10}
      />
    );
  }
  if (loggedIn) {
    accButton = (
      <div
        className={`${accButtonClass}`}
        onMouseEnter={() => {
          clearTimeout(leaveTimer);
          timer = setTimeout(() => {
            setHoverClass(true);
            icon = faChevronUp;
          }, 175);
        }}
        onMouseLeave={() => {
          clearTimeout(timer);
          leaveTimer = setTimeout(() => {
            setHoverClass(false);
            icon = faChevronDown;
          }, 175);
        }}
      >
        <button
          className="navbarDropButton"
          onClick={() => setVisibleClassFunc()}
        >
          <a href={`/Account/${curUser}`}>
            <div className="hoverDIV">
              <div className="whiteNavBarPFPDiv">
                <img src={userPFP} className="profilePicSmall" />
              </div>
            </div>

            {icon}
          </a>
        </button>
        <div className={hoverClass ? `navbarULCont` : `navbarULCont gone`}>
          <ul className="navbarUL">
            <li>
              <a href={`/Account/${curUser}/Likes/most-recent/all-types`}>
                Likes
              </a>
            </li>
            <li>
              <a href={`/Account/${curUser}/My-Pics/most-recent/all-types`}>
                My Pics
              </a>
            </li>
            <li>
              <a href={`/Account/${curUser}`}>User Settings</a>
            </li>
            <li>
              <a href="/" onClick={signOut}>
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
    uploadButton = (
      <a href={`/${curUser}/upload`}>
        <button className={`${uploadButtonClass}`}>Upload</button>
      </a>
    );
    smallUploadButton = (
      <a href={`/${curUser}/upload`} className={`${smallUploadButtonClass}`}>
        <button className="smallUploadButton">
          <FontAwesomeIcon icon={faUpload} />
        </button>
      </a>
    );
    soButton = (
      <a href="/">
        <button className="navbarButton" onClick={signOut}>
          Sign Out
        </button>
      </a>
    );

    siButton = null;
    suButton = null;
    hamburgerButton = (
      <div className={`${hamburgerIconClass}`}>
        <button
          className="navbarDropButton"
          onClick={() => setHamIconOpen(!hamIconOpen)}
        >
          <div className="transparentNavBar__hamburger-div">{hamIconOrX}</div>
        </button>
      </div>
    );
  } else {
    accButton = null;
    soButton = null;
    siButton = (
      <a href="/SignIn" style={{ color: "black" }}>
        Sign In
      </a>
    );
    suButton = (
      <a href="/SignUp">
        <button className="navbarButton">Sign Up</button>
      </a>
    );
  }

  async function signOut() {
    await fetch("http://localhost:5000/SignOut", {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
  }

  return (
    <div className={`navbarContainer ${blackBG}`}>
      <div className={`${navbarContentsClass}`}>
        <div>
          <a href="/" className="logo">
            <h1 className="logo__color-white">PicPocket</h1>
          </a>
        </div>
        <form className={`${searchbarClass}`} onSubmit={onSubmit}>
          <input
            className="carousel__search-bar--hamopen"
            placeholder="Search for free photos"
            onChange={onChange}
          ></input>
          <button className="carousel__search-button--hamopen" type="submit">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="carousel__search-icon--hamopen"
            />
          </button>
        </form>
        <div className={`${navbar__buttonsClass}`}>
          {siButton}
          {suButton}
          {accButton}
          {smallUploadButton}
          {uploadButton}

          {hamburgerButton}
        </div>
      </div>
      <HamburgerList
        hamburgerListClass={hamburgerListClass}
        curUser={curUser}
        loggedIn={loggedIn}
        signOut={signOut}
      />
    </div>
  );
};

export default MainPageNavBar;
