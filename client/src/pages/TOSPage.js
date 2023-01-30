import React, { useEffect } from "react";
import WhiteNavBar from "../components/WhiteNavBar";
import PaperWorkButtons from "../components/PaperWorkButtons";

const TOSPage = () => {
  let TOSID = process.env.REACT_APP_TERMLY_TOS_ID;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.termly.io/embed-policy.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <WhiteNavBar />
      <PaperWorkButtons whatPage={"tos"} />
      <div name="termly-embed" data-id={TOSID} data-type="iframe"></div>
    </div>
  );
};

export default TOSPage;
