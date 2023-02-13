import React, { useEffect } from "react";
import NavbarComponent from "../components/NavbarComponent";
import PaperWorkButtons from "../components/PaperWorkButtons";

const TOSPage = ({ curUser, loggedIn }) => {
  let TOSID = process.env.REACT_APP_TERMLY_TOS_ID;

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
        loggedIn={loggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      <PaperWorkButtons whatPage={"tos"} />
      <div name="termly-embed" data-id={TOSID} data-type="iframe"></div>
    </div>
  );
};

export default TOSPage;
