import React, { useEffect } from "react";

const DisclaimerPage = () => {
  let disclaimerID = process.env.REACT_APP_TERMLY_DISCLAIMER_ID;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.termly.io/embed-policy.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div name="termly-embed" data-id={disclaimerID} data-type="iframe"></div>
  );
};

export default DisclaimerPage;
