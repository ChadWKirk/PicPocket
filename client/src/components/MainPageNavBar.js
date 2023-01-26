import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { BsCartCheck } from "react-icons/bs";
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

const MainPageNavBar = ({ curUser, loggedIn, windowSize }) => {
  //for searchbar
  var navigate = useNavigate();
  let inputValue;
  console.log(windowSize);
  function onChange(event) {
    inputValue = event.target.value;
    console.log(inputValue);
  }

  function onSubmit() {
    if (inputValue.length > 0) {
      navigate(`/search/${inputValue}/most-recent/all-types`);
    }
  }
  //navbuttons
  let soButton;
  let accButton;
  let hamburgerButton;
  let hamIconOrX;
  //media queries for hamburger. if hamOpen - remove pfp button if width < 730px
  let blackBG;
  let goAwayClass;
  let goAwayClass__forUploadBtn;
  const [hamIconOpen, setHamIconOpen] = useState(false);
  //if ham open
  if (!hamIconOpen) {
    hamIconOrX = <FontAwesomeIcon icon={faBars} className="hamburgerIcon" />;
    goAwayClass = "gone";
  } else if (hamIconOpen) {
    hamIconOrX = <FontAwesomeIcon icon={faXmark} className="hamburgerXIcon" />;
    blackBG = "blackBG";
  } else if (hamIconOpen && windowSize.innerWidth < 650) {
    goAwayClass__forUploadBtn = "gone";
  } else if (hamIconOpen && windowSize.innerWidth > 650) {
  }

  let siButton;
  let suButton;
  let cartButton;
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
        <button
          className={`navbarClickThisButton ${goAwayClass__forUploadBtn}`}
        >
          Upload
        </button>
      </a>
    );
    smallUploadButton = (
      <a
        href={`/${curUser}/upload`}
        className={`smallUploadButton ${goAwayClass__forUploadBtn}`}
      >
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
    cartButton = (
      <a href="/Cart">
        <Button className="navbar__cartBtn">
          <BsCartCheck size={36} className="navbar__cartIcon" />
          <div>Cart</div>
        </Button>
      </a>
    );
    siButton = null;
    suButton = null;
    hamburgerButton = (
      <div>
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
    cartButton = null;
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
      <div className="navbarContents">
        <div>
          <a href="/" className="logo">
            <h1 className="logo__color-white">PicPocket</h1>
          </a>
        </div>
        <form
          className={`search__container ${goAwayClass}`}
          onSubmit={onSubmit}
        >
          <input
            className="search__bar"
            placeholder="Search for free photos"
            onChange={onChange}
          ></input>
          <button className="search__button" type="submit">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="search__icon"
            />
          </button>
        </form>
        <div className="navbar__buttons">
          {siButton}
          {suButton}
          {accButton}
          {smallUploadButton}
          {uploadButton}

          {/* {cartButton} */}
          {hamburgerButton}
        </div>
      </div>
    </div>
  );
};

export default MainPageNavBar;
