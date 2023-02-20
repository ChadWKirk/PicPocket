import React, { useEffect } from "react";

const HamburgerList = ({ curUser, isLoggedIn, signOut }) => {
  let hamburgerPicPocketList;
  if (isLoggedIn) {
    hamburgerPicPocketList = (
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href={`/${curUser}/upload`}>Upload</a>
        </li>
        <li>
          <a href={`/Account/${curUser}/Likes/most-recent/all-types`}>Likes</a>
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
