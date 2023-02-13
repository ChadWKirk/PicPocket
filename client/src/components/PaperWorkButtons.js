import { React, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const PaperWorkButtons = ({ whatPage }) => {
  const [leftArrowClass, setLeftArrowClass] = useState(
    "paperWorkButtons-overflowArrowLeft"
  );
  const [rightArrowClass, setRightArrowClass] = useState(
    "paperWorkButtons-overflowArrowRight"
  );

  function scrollPos(e) {
    let maxScroll = e.target.scrollWidth - e.target.clientWidth - 1;
    console.log(e);
    if (e.target.scrollLeft == 0) {
      setLeftArrowClass("paperWorkButtons-overflowArrowLeft opacity0");
    } else {
      setLeftArrowClass("paperWorkButtons-overflowArrowLeft");
    }
    if (e.target.scrollLeft > maxScroll) {
      setRightArrowClass("paperWorkButtons-overflowArrowRight opacity0");
    } else {
      setRightArrowClass("paperWorkButtons-overflowArrowRight");
    }
  }
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
      {/* <div className={leftArrowClass}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="paperWorkButtons-arrowIcon"
        />
      </div>
      <div className={rightArrowClass}>
        <FontAwesomeIcon
          icon={faChevronRight}
          className="paperWorkButtons-arrowIcon"
        />
      </div> */}
      <div
        className="paperWorkButtons--container"
        onScroll={(e) => scrollPos(e)}
      >
        {disclaimerBtn}

        {privacyBtn}
        {tosBtn}
      </div>
    </div>
  );
};

export default PaperWorkButtons;
