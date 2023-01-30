import React, { useEffect } from "react";
import WhiteNavBar from "../components/WhiteNavBar";
import PaperWorkButtons from "../components/PaperWorkButtons";

const PrivacyPolicyPage = () => {
  let privacyID = process.env.REACT_APP_TERMLY_PRIVACY_POLICY_ID;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.termly.io/embed-policy.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <WhiteNavBar />
      <PaperWorkButtons whatPage={"privacy"} />
      <div name="termly-embed" data-id={privacyID} data-type="iframe"></div>
    </div>
  );
};

export default PrivacyPolicyPage;
