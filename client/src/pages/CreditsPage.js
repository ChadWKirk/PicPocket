import React from "react";
import NavbarComponent from "../components/NavbarComponent";

const CreditsPage = ({ curUser, loggedIn }) => {
  return (
    <div>
      <NavbarComponent
        curUser={curUser}
        loggedIn={loggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      <h1>Credits:</h1>
      <h4>Images:</h4>
      <ul>
        <li>
          <a
            href="https://www.flaticon.com/free-icons/picture"
            title="picture icons"
          >
            Picture icons created by Pixel perfect - Flaticon
          </a>
        </li>
      </ul>
    </div>
  );
};

export default CreditsPage;