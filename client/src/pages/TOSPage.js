import React, { useEffect } from "react";

const TOSPage = () => {
  let TOSID = process.env.REACT_APP_TERMLY_TOS_ID;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.termly.io/embed-policy.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <div name="termly-embed" data-id={TOSID} data-type="iframe"></div>;
};

export default TOSPage;
