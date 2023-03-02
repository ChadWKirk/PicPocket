import { React, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { BsCartCheck } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const SignUpNavBar = ({
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

  const [isVisibleClass, setIsVisibleClass] = useState("gone");

  function setVisibleClassFunc() {
    if (isVisibleClass == "gone") {
      setIsVisibleClass("");
    } else {
      setIsVisibleClass("gone");
    }
  }

  const [hoverClass, setHoverClass] = useState(false);

  if (isLoggedIn) {
    accButton = (
      <div
        className="navbarDropCont"
        onMouseEnter={() =>
          setTimeout(() => {
            setHoverClass(!hoverClass);
          }, 200)
        }
        onMouseLeave={() =>
          setTimeout(() => {
            setHoverClass(!hoverClass);
          }, 200)
        }
      >
        <button
          className="navbarDropButton"
          onClick={() => setVisibleClassFunc()}
        >
          {curUser_real}
          <FontAwesomeIcon
            icon={faChevronDown}
            fontSize={10}
            style={{ marginLeft: "7px", marginBottom: "6px" }}
          />
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
      <button
        style={{
          backgroundColor: "grey",
          padding: "0.5rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <a href="/SignIn" style={{ color: "white", fontWeight: "bold" }}>
          Sign In
        </a>
      </button>
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
    <div className="navbar">
      <div>
        <a href="/" className="logo">
          <h1 className="logo__color-white">PicPocket</h1>
        </a>
      </div>
      <div className="navbar__buttons" style={{ color: "white" }}>
        Already have an account?
        {siButton}
      </div>
    </div>
  );
};

export default SignUpNavBar;
