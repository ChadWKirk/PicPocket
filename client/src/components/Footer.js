import { React, useState, useEffect } from "react";

const Footer = ({ curUser_real, curUser_hyphenated, isLoggedIn, domain }) => {
  //if on main page, set footer__contents-container to have a padding-top helper class to put space between content and waves
  const [isOnMainPage, setIsOnMainPage] = useState(false);
  useEffect(() => {
    //if last character of current url is a / or last 7 chars is popular, then that means we are on the home page either most recent or most popular
    if (window.location.href.slice(-1) == "/") {
      setIsOnMainPage(true);
    } else if (window.location.href.slice(-7) == "popular") {
      setIsOnMainPage(true);
    } else {
      setIsOnMainPage(false);
    }
  });

  let footerPicPocketContent;
  if (isLoggedIn) {
    footerPicPocketContent = (
      <div>
        <h4>PicPocket</h4>
        <div className="footerUnderline2"> </div>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a
              href={`/Account/${curUser_hyphenated}/Likes/?sort=most-recent&filter=all-types`}
            >
              Likes
            </a>
          </li>
          <li>
            <a
              href={`/Account/${curUser_hyphenated}/My-Pics/Most-Recent/All-Types`}
            >
              My Pics
            </a>
          </li>
          <li>
            <a href={`/${curUser_hyphenated}/Upload`}>Upload</a>
          </li>
          <li>
            <a href={`/Account/${curUser_hyphenated}`}>User Settings</a>
          </li>
        </ul>
      </div>
    );
  } else if (!isLoggedIn) {
    footerPicPocketContent = (
      <div>
        <h4>PicPocket</h4>
        <div className="footerUnderline2"> </div>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/SignUp">Join</a>
          </li>
          <li>
            <a href={`/SignIn`}>Log In</a>
          </li>
        </ul>
      </div>
    );
  }
  return (
    <footer className="footerContainer">
      <div
        className={`footer__contents-container ${
          isOnMainPage ? "footer__contents-container-padding-top-main-page" : ""
        }`}
      >
        {footerPicPocketContent}
        <div>
          <h4>Company</h4>
          <div className="footerUnderline"> </div>
          <ul>
            <li>
              <a href="/About">About Us</a>
            </li>
            <li>
              <a href="/Privacy-Policy">Privacy Policy</a>
            </li>
            <li>
              <a href="/Terms-And-Conditions">Terms And Conditions</a>
            </li>
            <li>
              <a href="/Disclaimer">Disclaimer</a>
            </li>
            <li>
              <a href="/Credits">Credits</a>
            </li>
            <li>
              <a href="/Contact">Contact Us</a>
            </li>
          </ul>
        </div>
        <div className="footerText">
          <i>
            "This is a website I made to display my skills with the MERN stack.
            I used several different websites for design and implementation
            inspiration." - The Creator
          </i>
          <div>Copyright © 2023 PicPocket</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
