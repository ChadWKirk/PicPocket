import { React } from "react";
//components
import NavbarComponent from "../components/NavbarComponent";

const AboutUsPage = ({
  domain,
  curUser_hyphenated,
  curUser_real,
  isLoggedIn,
}) => {
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
      <h1 className="about-us-page__heading">About PicPocket</h1>
      <main className="about-us-page__contents-container">
        <div className="about-us-page__text-container">
          <div>
            <h3>The Mission</h3>
            <p>
              <i>
                To provide high quality stock images to people around the world.
              </i>
            </p>
          </div>
          <div>
            <h3>Photos</h3>
            <p>
              <i>There are numerous high quality images to choose from!</i>
            </p>
          </div>
          <div>
            <h3>Team</h3>
            <p>
              <i>
                PicPocket was created by one man. He remains in the shadows, but
                rest assured he is a beast.
              </i>
            </p>
          </div>
          <div>
            <h3>Upload Your Own Images</h3>
            <p>
              <i>Are you ready to share your pics around the world?</i>
            </p>
          </div>
          <a
            href={`/${curUser_hyphenated}/upload`}
            className="navbar__CTA-button-1"
            style={{
              width: "195px",
              fontSize: "1.25rem",
              textAlign: "center",
              marginTop: "-40px",
            }}
          >
            Upload
          </a>
        </div>
        <div className="about-us-page__img-container">
          <img
            src="https://res.cloudinary.com/dtyg4ctfr/image/upload/q_60/dpr_auto/v1680027135/PicPocket/yellow-camera-about-us_wfnaef.jpg"
            loading="lazy"
          ></img>
        </div>
      </main>
    </div>
  );
};

export default AboutUsPage;
