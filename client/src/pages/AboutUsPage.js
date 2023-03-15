import { React } from "react";
//components
import NavbarComponent from "../components/NavbarComponent";
//images
import yellowCamImg from "../images/yellow-camera-about-us.jpg";

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
      <div className="about-us-page__contents-container">
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
              width: "165px",
              fontSize: "1.5rem",
              textAlign: "center",
              marginTop: "-12px",
            }}
          >
            Upload
          </a>
        </div>
        <div className="about-us-page__img-container">
          <img src={yellowCamImg}></img>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
