import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
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
  isLoggedIn,
  navPositionClass,
  navColorClass,
}) => {
  //fetch current user's info to get their profile picture to display in accButton
  const [userPFP, setPFP] = useState();
  useEffect(() => {
    async function fetchUserInfo() {
      await fetch(`http://localhost:5000/${curUser}/info`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => {
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
    fetchUserInfo();
  }, []);

  //check if ham menu is open or closed. sets data-hamOpenOrClosed attribute to use appropriate CSS variable values for navbar
  const [hamDataIsOpen, setHamDataIsOpen] = useState(false);
  let hamOpenOrClosed;
  if (hamDataIsOpen) {
    hamOpenOrClosed = "open";
  } else {
    hamOpenOrClosed = "closed";
  }

  //go to /search/whateverYouSearchFor when hitting enter or clicking search button
  let navigate = useNavigate();
  let inputValue;
  function onChange(event) {
    inputValue = event.target.value;
  }
  function onSubmit() {
    navigate(`/search/${inputValue}/most-recent/all-types`);
  }

  //navbuttons to conditionally render based on whether you're logged in or not
  let signInButton;
  let signUpButton;
  let accButton;
  let smallUploadButton;
  let uploadButton;

  //hamburger menu button that is rendered in the DOM
  let hamburgerButton;

  //hamburger icon. either bars or x depending on whether it is open or closed
  let hamIcon;
  const [hamIconOpen, setHamIconOpen] = useState(false);
  if (hamIconOpen) {
    hamIcon = (
      <FontAwesomeIcon icon={faXmark} className="navbar__hamburger-icon-x" />
    );
    document.body.classList.add("overflowYHidden");
  } else if (!hamIconOpen) {
    hamIcon = (
      <FontAwesomeIcon icon={faBars} className="navbar__hamburger-icon-bars" />
    );
    document.body.classList.remove("overflowYHidden");
  }

  //When accButton is hovered, changes isHovered to true and vice versa. When isHovered is false, it's a down arrow. When isHovered is true, it's an up arrow.
  const [isHovered, setIsHovered] = useState(false);
  let accButtonArrowIcon;
  if (isHovered) {
    accButtonArrowIcon = (
      <FontAwesomeIcon
        className="navbar__up-arrow-icon"
        icon={faChevronUp}
        fontSize={10}
      />
    );
  } else {
    accButtonArrowIcon = (
      <FontAwesomeIcon
        className="navbar__down-arrow-icon"
        icon={faChevronDown}
        fontSize={10}
      />
    );
  }

  //Changes isHovered to true or false which changes the arrow icon to either an up or down arrow. Has a timer so it doesn't change as soon as you hover over the account button.
  //Clears timer so the menu doesn't appear if you just quickly pass the cursor over it.
  let onHoverTimer; //when accbutton is hovered, start timer to change isHovered to true
  let offHoverTimer; //when accbutton is not hovered, start timer to change isHovered to false
  if (isLoggedIn) {
    accButton = (
      <div
        className="navbar__account-button-and-list-container"
        onMouseEnter={() => {
          clearTimeout(offHoverTimer);
          onHoverTimer = setTimeout(() => {
            setIsHovered(true);
            accButtonArrowIcon = faChevronUp;
          }, 175);
        }}
        onMouseLeave={() => {
          clearTimeout(onHoverTimer);
          offHoverTimer = setTimeout(() => {
            setIsHovered(false);
            accButtonArrowIcon = faChevronDown;
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
          {accButtonArrowIcon}
        </a>
        <div
          className={
            isHovered
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

    signInButton = null;
    signUpButton = null;
    hamburgerButton = (
      <div
        className="navbar__hamburger-icon-bars"
        onClick={() => setHamDataIsOpen(!hamDataIsOpen)}
      >
        <button
          className="navbarDropButton"
          onClick={() => setHamIconOpen(!hamIconOpen)}
        >
          <div>{hamIcon}</div>
        </button>
      </div>
    );
  } else {
    accButton = null;
    signInButton = (
      <a href="/SignIn" className="navbar__login-button">
        Log In
      </a>
    );
    signUpButton = (
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
          {signInButton}
          {signUpButton}
          {accButton}
          {smallUploadButton}
          {uploadButton}
          {hamburgerButton}
        </div>
      </div>
      <HamburgerList
        curUser={curUser}
        isLoggedIn={isLoggedIn}
        signOut={signOut}
      />
    </div>
  );
};

export default MainPageNavBar;
