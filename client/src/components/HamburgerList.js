import React, { useEffect } from "react";

const HamburgerList = ({ curUser, loggedIn, signOut }) => {
  return (
    <div className="navbar__hamburger-list-container">
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
    </div>
  );
};

export default HamburgerList;
