import React, { useEffect } from "react";
import NavbarComponent from "../components/NavbarComponent";
import PaperWorkButtons from "../components/PaperWorkButtons";

const DisclaimerPage = ({ curUser, isLoggedIn }) => {
  let disclaimerID = process.env.REACT_APP_TERMLY_DISCLAIMER_ID;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.termly.io/embed-policy.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <NavbarComponent
        curUser={curUser}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      <PaperWorkButtons whatPage={"disclaimer"} />
      <div name="termly-embed" data-id={disclaimerID} data-type="iframe"></div>
    </div>
  );
};

export default DisclaimerPage;
