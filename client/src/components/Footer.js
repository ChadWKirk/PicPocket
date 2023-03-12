import React from "react";

const Footer = ({ curUser_real, curUser_hyphenated, isLoggedIn }) => {
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
    <div className="footerContainer">
      <div className="footer__contents-container">
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
    </div>
  );
};

export default Footer;
