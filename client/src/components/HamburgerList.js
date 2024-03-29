import React, { useEffect } from "react";

const HamburgerList = ({
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
  signOut,
}) => {
  let hamburgerPicPocketList;
  if (isLoggedIn) {
    hamburgerPicPocketList = (
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href={`/${curUser_hyphenated}/upload`}>Upload</a>
        </li>
        <li>
          <a
            href={`/Account/${curUser_hyphenated}/Likes/?sort=most-recent&filter=all-types`}
          >
            Likes
          </a>
        </li>
        <li>
          <a href={`/Account/${curUser_hyphenated}/My-Pics`}>My Pics</a>
        </li>
        <li>
          <a href={`/Account/${curUser_hyphenated}`}>User Settings</a>
        </li>
        <li>
          <button onClick={signOut}>Sign Out</button>
        </li>
      </ul>
    );
  } else if (!isLoggedIn) {
    hamburgerPicPocketList = (
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href={`/SignIn`}>Log In</a>
        </li>
        <li>
          <a href="/SignUp">Join</a>
        </li>
        <li>
          <a href="/About">About Us</a>
        </li>
        <li>
          <a href="/Contact">Contact Us</a>
        </li>
      </ul>
    );
  }
  return (
    <div className="navbar__hamburger-list-container">
      {hamburgerPicPocketList}
      <ul>
        <li className="navbar__hamburger-list-grey-divider"></li>
        <li>
          <a href="Terms-And-Conditions">Terms And Conditions</a>
        </li>
        <li>
          <a href="/Disclaimer">Disclaimer</a>
        </li>
        <li>
          <a href="/Privacy-Policy">Privacy Policy</a>
        </li>
      </ul>
    </div>
  );
};

export default HamburgerList;
