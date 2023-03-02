import React from "react";
import NavbarComponent from "../components/NavbarComponent";

const CreditsPage = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
}) => {
  return (
    <div>
      <NavbarComponent
        domain={domain}
        curUser_real={curUser_real}
        curUser_hyphenated={curUser_hyphenated}
        isLoggedIn={isLoggedIn}
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
