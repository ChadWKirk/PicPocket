import { React, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { BsCartCheck } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const MainPageNavBar = ({ curUser, loggedIn }) => {
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
        style={{ marginBottom: "1px" }}
      />
    );
  } else {
    icon = (
      <FontAwesomeIcon
        className="navbarArrowIconDownwards"
        icon={faChevronDown}
        fontSize={10}
        // style={{ marginLeft: "7px", marginBottom: "6px" }}
      />
    );
  }
  if (loggedIn) {
    accButton = (
      <div
        className="navbarDropCont"
        onMouseEnter={() =>
          (timer = setTimeout(() => {
            setHoverClass(true);
            icon = faChevronUp;
          }, 170))
        }
        onMouseLeave={() => {
          clearTimeout(timer);
          setTimeout(() => {
            setHoverClass(false);
            icon = faChevronDown;
          }, 170);
        }}
      >
        <button
          className="navbarDropButton"
          onClick={() => setVisibleClassFunc()}
        >
          <a href={`/Account/${curUser}`}>
            <div className="whiteNavBarPFPDiv">
              <img src={userPFP} className="profilePicSmall" />
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
          </ul>
        </div>
      </div>
    );
    uploadButton = (
      <a href={`/${curUser}/upload`}>
        <button className="navbarClickThisButton">Upload</button>
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
    <div className="navbar">
      <div>
        <a href="/" className="logo">
          <h1 className="logo__color-white">PicPocket</h1>
        </a>
      </div>
      <div className="navbar__buttons">
        {siButton}
        {suButton}
        {accButton}
        {soButton}
        {uploadButton}
        {/* {cartButton} */}
      </div>
    </div>
  );
};

export default MainPageNavBar;
