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

const MainPageNavBar = ({
  curUser,
  loggedIn,
  navPositionClass,
  navColorClass,
}) => {
  const [navbarColorTheme, setNavbarColorTheme] = useState("transparent");
  const [hamIsOpen, setHamIsOpen] = useState(false);

  let hamOpenOrClosed;
  if (hamIsOpen) {
    hamOpenOrClosed = "open";
  } else {
    hamOpenOrClosed = "closed";
  }

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
  let accButton;
  let hamburgerButton;
  let hamIconOrX;
  //media queries for hamburger. if hamOpen - remove pfp button if width < 730px
  const [hamIconOpen, setHamIconOpen] = useState(false);
  //if ham open or close
  if (hamIconOpen) {
    hamIconOrX = <FontAwesomeIcon icon={faXmark} className="hamburgerXIcon" />;
    document.body.classList.add("overflowYHidden");
  } else if (!hamIconOpen) {
    hamIconOrX = <FontAwesomeIcon icon={faBars} className="hamburgerIcon" />;

    document.body.classList.remove("overflowYHidden");
  }

  let siButton;
  let suButton;
  let uploadButton;
  let smallUploadButton;
  let timer;
  let leaveTimer;

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
        className="navbar__up-arrow-icon"
        icon={faChevronUp}
        fontSize={10}
      />
    );
  } else {
    icon = (
      <FontAwesomeIcon
        className="navbar__down-arrow-icon"
        icon={faChevronDown}
        fontSize={10}
      />
    );
  }
  if (loggedIn) {
    accButton = (
      <div
        className="navbar__account-button-and-list-container"
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
        <a
          href={`/Account/${curUser}`}
          className="navbar__account-button-container"
        >
          <div className="navbar__account-button-hover-overlay-div">
            <img src={userPFP} className="profile-pic__small" />
          </div>
          {icon}
        </a>
        <div
          className={
            hoverClass
              ? `navbar__dropdown-menu-container`
              : `navbar__dropdown-menu-container displayNone`
          }
        >
          <ul className="navbar__dropdown-menu">
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
      <a href={`/${curUser}/upload`} className="navbar__CTA-button-1">
        Upload
      </a>
    );
    smallUploadButton = (
      <a href={`/${curUser}/upload`} className="navbar__smallUploadButton">
        <FontAwesomeIcon icon={faUpload} />
      </a>
    );

    siButton = null;
    suButton = null;
    hamburgerButton = (
      <div className="hamburgerIcon" onClick={() => setHamIsOpen(!hamIsOpen)}>
        <button
          className="navbarDropButton"
          onClick={() => setHamIconOpen(!hamIconOpen)}
        >
          <div>{hamIconOrX}</div>
        </button>
      </div>
    );
  } else {
    accButton = null;
    siButton = (
      <a href="/SignIn" className="navbar__login-button">
        Log In
      </a>
    );
    suButton = (
      <a href="/SignUp" className="navbar__CTA-button-1">
        Join
      </a>
    );
  }

  async function signOut() {
    await fetch("http://localhost:5000/SignOut", {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
  }
  console.log(hamOpenOrClosed);
  return (
    <div
      data-hamOpenOrClosed={hamOpenOrClosed}
      data-navTheme={navColorClass}
      className={`navbar__container ${navPositionClass}`}
    >
      <div className="navbar__contents">
        <a href="/" className="navbar__logo">
          PicPocket
        </a>
        <form className="navbar__search-container" onSubmit={onSubmit}>
          <input
            className="navbar__search-bar"
            placeholder="Search for free photos"
            onChange={onChange}
          ></input>
          <button className="navbar__search-button" type="submit">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="navbar__search-icon"
            />
          </button>
        </form>
        <div className="navbar__buttons-container">
          {siButton}
          {suButton}
          {accButton}
          {smallUploadButton}
          {uploadButton}
          {hamburgerButton}
        </div>
      </div>
      <HamburgerList curUser={curUser} loggedIn={loggedIn} signOut={signOut} />
    </div>
  );
};

export default MainPageNavBar;
