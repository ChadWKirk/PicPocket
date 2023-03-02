import { React, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { BsCartCheck } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const WhiteNavBar = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
}) => {
  let soButton;
  let accButton;
  let siButton;
  let suButton;
  let cartButton;
  let uploadButton;
  let timer;
  const [isVisibleClass, setIsVisibleClass] = useState("gone");

  function setVisibleClassFunc() {
    if (isVisibleClass == "gone") {
      setIsVisibleClass("");
    } else {
      setIsVisibleClass("gone");
    }
  }

  //go to /search/whateverYouSearchFor when hitting enter or clicking search button
  var navigate = useNavigate();
  let inputValue;

  function onChange(event) {
    inputValue = event.target.value;
    console.log(inputValue);
  }

  function onSubmit() {
    if (inputValue.length > 0) {
      navigate(`/search/${inputValue}/most-recent/all-types`);
    }
  }

  const [hoverClass, setHoverClass] = useState(false);

  const [userInfo, setUserInfo] = useState();
  const [userPFP, setPFP] = useState();

  useEffect(() => {
    async function userInfoFetch() {
      await fetch(`${domain}/${curUser_real}/info`, {
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

  if (isLoggedIn) {
    accButton = (
      <div
        className="navbarDropCont"
        onMouseEnter={() =>
          (timer = setTimeout(() => {
            setHoverClass(true);
          }, 200))
        }
        onMouseLeave={() => {
          clearTimeout(timer);
          setTimeout(() => {
            setHoverClass(false);
          }, 200);
        }}
      >
        <button
          className="navbarDropButton"
          onClick={() => setVisibleClassFunc()}
          style={{ color: "black" }}
        >
          <a href={`/Account/${curUser_hyphenated}`}>
            <div className="whiteNavBarPFPDiv">
              <img src={userPFP} className="profilePicSmall" />
            </div>
            <FontAwesomeIcon
              className="navbarArrowIconDownwardsWHITENAVBAR"
              icon={faChevronDown}
              fontSize={10}
              // style={{ marginLeft: "7px", marginBottom: "6px", color: "black" }}
            />
          </a>
        </button>
        <div className={hoverClass ? `navbarULCont` : `navbarULCont gone`}>
          <ul className="navbarUL">
            <li>
              <a
                href={`/Account/${curUser_hyphenated}/Likes/most-recent/all-types`}
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
          </ul>
        </div>
      </div>
    );
    uploadButton = (
      <a href={`/${curUser_hyphenated}/upload`}>
        <button
          className="navbarClickThisButton__whitenav"
          style={{ color: "black" }}
        >
          Upload
        </button>
      </a>
    );
    soButton = (
      <a href="/">
        <button
          className="navbarButton"
          onClick={signOut}
          style={{ color: "black" }}
        >
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
    await fetch(`${domain}/SignOut`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
  }

  return (
    <div className="navbarContainer navbar__white">
      <div className="navbarContents">
        <div>
          <a href="/" className="logo" style={{ color: "black" }}>
            <h1>PicPocket</h1>
          </a>
        </div>
        <form className="search__container" onSubmit={onSubmit}>
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
          {soButton}
          {uploadButton}
          {/* {cartButton} */}
        </div>
      </div>
    </div>
  );
};

export default WhiteNavBar;
