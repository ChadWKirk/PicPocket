import React, { useEffect } from "react";
import NavbarComponent from "../components/NavbarComponent";
import PaperWorkButtons from "../components/PaperWorkButtons";

const TOSPage = ({ domain, curUser_real, curUser_hyphenated, isLoggedIn }) => {
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
        domain={domain}
        curUser_real={curUser_real}
        curUser_hyphenated={curUser_hyphenated}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      <PaperWorkButtons whatPage={"tos"} />
      <main name="termly-embed" data-id={TOSID} data-type="iframe"></main>
    </div>
  );
};

export default TOSPage;
