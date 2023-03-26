import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";
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

const NavbarComponent = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
  navPositionClass,
  navColorClass,
}) => {
  //fetch current user's info to get their profile picture to display in accButton
  const [userPFP, setPFP] = useState();
  useEffect(() => {
    async function fetchUserInfo() {
      await fetch(`${domain}/${curUser_real}/info`, {
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
    if (curUser_real) {
      fetchUserInfo();
    }
  }, [curUser_real]);

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
  function onSubmit(e) {
    e.preventDefault();
    window.location.href = `/search/${inputValue}/?sort=most-recent&filter=all-types`;
  }

  //navbuttons to conditionally render based on whether you're logged in or not
  let signInButton;
  let signUpButton;
  let accButton;
  let smallUploadButton;
  let uploadButton;

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

  //hamburger menu button that is rendered in the DOM
  let hamburgerButton = (
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
          href={`/Account/${curUser_hyphenated}`}
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
              <a
                href={`/Account/${curUser_hyphenated}/Likes/?sort=most-recent&filter=all-types`}
              >
                Likes
              </a>
            </li>
            <li>
              <a
                href={`/Account/${curUser_hyphenated}/My-Pics/most-recent/all-types`}
              >
                My Pics
              </a>
            </li>
            <li>
              <a href={`/Account/${curUser_hyphenated}`}>User Settings</a>
            </li>
            <li>
              <button onClick={signOut}>Sign Out</button>
            </li>
          </ul>
        </div>
      </div>
    );
    uploadButton = (
      <a
        href={`/${curUser_hyphenated}/upload`}
        className="navbar__CTA-button-1"
      >
        Upload
      </a>
    );
    smallUploadButton = (
      <a
        href={`/${curUser_hyphenated}/upload`}
        className="navbar__smallUploadButton"
      >
        <FontAwesomeIcon icon={faUpload} />
      </a>
    );

    signInButton = null;
    signUpButton = null;
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

  const { dispatch } = useAuthContext();
  async function signOut() {
    // await fetch("http://localhost:5000/SignOut", {
    //   method: "POST",
    //   headers: { "Content-type": "application/json" },
    // });

    //log out of facebook
    // Facebook OAuth
    //make prettier stop trippin sayin fb is undefined
    /*global FB*/
    //import facebook's javascript sdk
    window.fbAsyncInit = function () {
      FB.init({
        appId: "790444795516757",
        xfbml: true,
        version: "v2.6",
      });

      FB.getLoginStatus(function (response) {
        //this.statusChangeCallback(response);
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
    FB.logout(function (response) {
      // Person is now logged out
    });

    window.location.href = "/";
    navigate("/");
    //remove user from local storage
    localStorage.removeItem("user");

    //dispatch logout action
    dispatch({ type: "LOGOUT" });
  }
  return (
    <div data-hamOpenOrClosed={hamOpenOrClosed} data-navTheme={navColorClass}>
      <div className="navbar__height-margin"></div>
      <div className={`navbar__container ${navPositionClass}`}>
        <div className="navbar__contents">
          <a href="/" className="navbar__logo">
            PicPocket
          </a>
          <a href="/" className="navbar__logo__mobile">
            P
          </a>
          <form
            className="navbar__search-container"
            onSubmit={(e) => onSubmit(e)}
          >
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
            {/* {smallUploadButton} */}
            {uploadButton}
            {hamburgerButton}
          </div>
        </div>
        <HamburgerList
          curUser_real={curUser_real}
          curUser_hyphenated={curUser_hyphenated}
          isLoggedIn={isLoggedIn}
          signOut={signOut}
        />
      </div>
    </div>
  );
};

export default NavbarComponent;
