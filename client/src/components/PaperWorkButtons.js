import React from "react";

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
      <div className="paperWorkButtons--container">
        {disclaimerBtn}
        {privacyBtn}
        {tosBtn}
      </div>
    </div>
  );
};

export default PaperWorkButtons;
