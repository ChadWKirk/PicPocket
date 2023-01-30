import React, { useEffect } from "react";
import WhiteNavBar from "../components/WhiteNavBar";
import PaperWorkButtons from "../components/PaperWorkButtons";

const DisclaimerPage = () => {
  let disclaimerID = process.env.REACT_APP_TERMLY_DISCLAIMER_ID;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.termly.io/embed-policy.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <WhiteNavBar />
      <PaperWorkButtons whatPage={"disclaimer"} />
      <div name="termly-embed" data-id={disclaimerID} data-type="iframe"></div>
    </div>
  );
};

export default DisclaimerPage;
