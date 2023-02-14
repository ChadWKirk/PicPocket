import { React, useState, useEffect } from "react";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const UploadFormSideBar = ({ imagesToUpload }) => {
  //when scrolled past regular upload form, show side bar upload form
  const [isShowingSideBar, setIsShowingSideBar] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleScroll() {
    let windowHeight = window.scrollY;
    if (windowHeight > 600) {
      setIsShowingSideBar(true);
    } else {
      setIsShowingSideBar(false);
    }
  }
  return (
    <div
      className={
        isShowingSideBar
          ? "upload-page__upload-form-side-bar-contents"
          : "displayNone"
      }
    >
      <button>
        <FontAwesomeIcon
          icon={faPlus}
          className="upload-page__upload-form-side-bar-add-icon"
        />
      </button>
      {imagesToUpload?.map((image, index) => (
        <a href={`#${index}`}>
          <img src={image.secure_url}></img>
        </a>
      ))}
    </div>
  );
};

export default UploadFormSideBar;
