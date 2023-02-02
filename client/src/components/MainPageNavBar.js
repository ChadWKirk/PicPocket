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
  //color class
  let navBackgroundColor;
  let navTextColor1;
  let navTextColor2;
  if (navColorClass == "transparent") {
    navBackgroundColor = "navBGColor--transparentBG";
    navTextColor1 = "navTextColor1--transparentBG";
    navTextColor2 = "navTextColor2--transparentBG";
  } else if (navColorClass == "white") {
    navBackgroundColor = "navBGColor--whiteBG";
    navTextColor1 = "navTextColor1--whiteBG";
    navTextColor2 = "navTextColor2--whiteBG";
  } else if (navColorClass == "black") {
    navBackgroundColor = "black";
    navTextColor1 = "navTextColor1--blackBG";
    navTextColor2 = "navTextColor2--blackBG";
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
  let soButton;
  let accButton;
  let hamburgerButton;
  let hamIconOrX;
  //media queries for hamburger. if hamOpen - remove pfp button if width < 730px
  let uploadButtonClass;
  let blackBG;
  let searchbarClass;
  let smallUploadButtonClass;
  let navbarContentsClass;
  let navbar__buttonsClass;
  const [hamIconOpen, setHamIconOpen] = useState(false);
  //if ham open or close
  if (hamIconOpen) {
    hamIconOrX = <FontAwesomeIcon icon={faXmark} className="hamburgerXIcon" />;
    blackBG = "blackBG";
    // uploadButtonClass = "navbarClickThisButton--hamopen";
    // searchbarClass = "transparentNavBar__search-container--hamopen";
    // smallUploadButtonClass = "smallUploadButton--hamopen";
    // navbarContentsClass = "navbarContents--hamopen";
    // navbar__buttonsClass = "navbar__buttons--hamopen";
    document.body.classList.add("overflowYHidden");
  } else if (!hamIconOpen) {
    hamIconOrX = <FontAwesomeIcon icon={faBars} className="hamburgerIcon" />;
    // uploadButtonClass = "navbarClickThisButton";
    // searchbarClass = "transparentNavBar__search-container--hamclose";
    // smallUploadButtonClass = "smallUploadButton";
    // navbarContentsClass = "navbarContents";
    // navbar__buttonsClass = "navbar__buttons";
    document.body.classList.remove("overflowYHidden");
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
        className="navbarDropCont"
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
        <button className="navbarClickThisButton">Upload</button>
      </a>
    );
    smallUploadButton = (
      <a href={`/${curUser}/upload`} className="smallUploadButton">
        <button>
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
    soButton = null;
    siButton = (
      <a href="/SignIn" className="navbar--logInButton">
        Log In
      </a>
    );
    suButton = (
      <a href="/SignUp">
        <button className="navbarClickThisButton">Join</button>
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
      className={`navbarContainer ${navPositionClass}`}
    >
      <div className="navbarContents">
        <div>
          <a href="/" className="logo">
            PicPocket
          </a>
        </div>
        <form
          className="transparentNavBar__search-container"
          onSubmit={onSubmit}
        >
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
        <div className="navbar__buttons">
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
