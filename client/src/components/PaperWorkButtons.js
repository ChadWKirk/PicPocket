import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const PaperWorkButtons = ({ whatPage }) => {
  let disclaimerBtn = (
    <a href="/Disclaimer">
      <button className="inactivePWorkBtn">Disclaimer</button>
    </a>
  );
  let privacyBtn = (
    <a href="/Privacy-Policy">
      <button className="inactivePWorkBtn">Privacy Policy</button>
    </a>
  );
  let tosBtn = (
    <a href="/Terms-And-Conditions">
      <button className="inactivePWorkBtn">Terms and Conditions</button>
    </a>
  );

  if (whatPage == "disclaimer") {
    disclaimerBtn = (
      <a href="/Disclaimer">
        <button className="activePWorkBtn">Disclaimer</button>
      </a>
    );
  } else if (whatPage == "privacy") {
    privacyBtn = (
      <a href="/Privacy-Policy">
        <button className="activePWorkBtn">Privacy Policy</button>
      </a>
    );
  } else if (whatPage == "tos") {
    tosBtn = (
      <a href="/Terms-And-Conditions">
        <button className="activePWorkBtn">Terms and Conditions</button>
      </a>
    );
  }
  return (
    <div>
      <div className="paperWorkButtons--container">{disclaimerBtn}
        <div className="paperWorkButtons-overflowArrowLeft">
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="paperWorkButtons-arrowIcon"
          />
        </div>
        
        {privacyBtn}
        {tosBtn}
        <div className="paperWorkButtons-overflowArrowRight">
          <FontAwesomeIcon
            icon={faChevronRight}
            className="paperWorkButtons-arrowIcon"
          />
        </div>
      </div>
    </div>
  );
};

export default PaperWorkButtons;
