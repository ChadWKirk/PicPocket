import { React, useEffect, useState, useRef } from "react";
//components
import FileList from "./FileList";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
//images
import uploadFormGalleryIcon from "../images/upload-page__image-gallery-icon.png";

const UploadForm = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  imagesToUpload,
  setImagesToUpload,
  removeImageFromUploadFrontEnd,
  setImageError,
  imageError,
  verifiedValue,
}) => {
  //file for form data
  var targetFilesArray = [];
  //scroll to new upload
  const newItemRef = useRef(); //every imageitem has a ref of newItemRef
  const [isUploadingForRef, setIsUploadingForRef] = useState(false);
  useEffect(() => {
    //if there is actually an image in the array to scroll to
    if (imagesToUpload.length > 0) {
      newItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isUploadingForRef]);

  async function uploadHandlerClick(e) {
    e.preventDefault();
    if (verifiedValue === false) {
      return;
    } else {
      setUploadFormDragStyle();
      setIsDragActive(false);

      for (let i = 0; i < e.target.files.length; i++) {
        const image = e.target.files[i];

        //how many bytes are in a MB
        let mbMultiplier = 1048576;

        image.isUploading = true;
        setIsUploadingForRef(!isUploadingForRef); //switch this every time upload begins to call useEffect
        targetFilesArray.push(image);
        setImagesToUpload((imagesToUpload) => [...imagesToUpload, image]);
        console.log(e.target.files);
        //if file type is JPEG, JPG or PNG, or file is under 10 megabytes
        if (
          (image.type == "image/jpeg" && image.size / mbMultiplier <= 10) ||
          (image.type == "image/png" && image.size / mbMultiplier <= 10)
        ) {
          //to send in fetch
          const formData = new FormData();
          formData.append("files", image);
          formData.append("uploaderName", curUser_real);

          await fetch(`${domain}/upload`, {
            method: "POST",
            body: formData,
          })
            .then((response) =>
              response
                .json()
                .then((resJSON) => JSON.stringify(resJSON))
                .then((stringJSON) => JSON.parse(stringJSON))
                .then((parsedJSON) => {
                  if (parsedJSON.public_id) {
                    console.log(parsedJSON);
                    image.isUploading = false;
                    image.secure_url = parsedJSON.secure_url;
                    image.publicId = parsedJSON.public_id;
                    image.assetId = parsedJSON.asset_id;
                    setImagesToUpload((imagesToUpload) => [...imagesToUpload]);
                    console.log(imagesToUpload);
                  } else {
                    image.isError = true;
                    image.isUploading = false;
                    setImageError(!imageError);
                  }
                })
            )
            .catch((err) => {
              console.log(err);
              removeImageFromUploadFrontEnd(image.name);
            });
        }
        //if file type is not JPEG, PNG or JPG, or over 10MB
        else {
          setTimeout(() => {
            image.isUploading = false;
            image.isError = true;
            setImageError(!imageError);
            setImagesToUpload((imagesToUpload) => [...imagesToUpload]);
            return;
          }, 500);
        }
      }
    }
  }

  //upload handler for drag
  async function uploadHandlerDrag(e) {
    e.preventDefault();
    if (verifiedValue === false) {
      setUploadFormDragStyle();
      setIsDragActive(false);
      return;
    } else {
      setUploadFormDragStyle();
      setIsDragActive(false);
      let dt = e.dataTransfer;
      let files = dt.files;
      let count = files.length;
      for (let i = 0; i < count; i++) {
        const image = files[i];
        image.isUploading = true;
        setIsUploadingForRef(!isUploadingForRef); //switch this every time upload begins to call useEffect
        // targetFilesArray.push(image);
        setImagesToUpload((imagesToUpload) => [...imagesToUpload, image]);
        // console.log(targetFilesArray + " target files");
        //if file type is JPEG, JPG or PNG
        if (image.type == "image/jpeg" || image.type == "image/png") {
          //to send in fetch
          const formData = new FormData();
          formData.append("files", image);
          formData.append("uploaderName", curUser_real);

          await fetch(`${domain}/upload`, {
            method: "POST",
            body: formData,
          })
            .then((response) =>
              response
                .json()
                .then((resJSON) => JSON.stringify(resJSON))
                .then((stringJSON) => JSON.parse(stringJSON))
                .then((parsedJSON) => {
                  if (parsedJSON.public_id) {
                    console.log(parsedJSON);
                    image.isUploading = false;
                    image.secure_url = parsedJSON.secure_url;
                    image.publicId = parsedJSON.public_id;
                    image.assetId = parsedJSON.asset_id;
                    setImagesToUpload((imagesToUpload) => [...imagesToUpload]);
                    console.log(imagesToUpload);
                  } else {
                    image.isError = true;
                    image.isUploading = false;
                    setImageError(!imageError);
                  }
                })
            )
            .catch((err) => {
              console.log(err);
              removeImageFromUploadFrontEnd(image.name);
            });
        }
        //if file type is not JPEG, PNG or JPG
        else {
          setTimeout(() => {
            image.isUploading = false;
            image.isError = true;
            setImageError(!imageError);
            setImagesToUpload((imagesToUpload) => [...imagesToUpload]);
            return;
          }, 500);
        }
      }
    }
  }
  //add class to form when dragged over, same styling as when hovering over it
  const [uploadFormDragStyle, setUploadFormDragStyle] = useState();

  //when scrolled past regular upload form, show side bar upload form
  // const [isShowingSideBar, setIsShowingSideBar] = useState(false);

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  // function handleScroll() {
  //   let windowHeight = window.scrollY;
  //   if (windowHeight > 600) {
  //     setIsShowingSideBar(true);
  //   } else {
  //     setIsShowingSideBar(false);
  //   }
  // }
  const [browseButtonAllDoneClass, setBrowseButtonAllDoneClass] = useState(
    "upload-page__all-done-banner-container-button"
  );
  const [isDragActive, setIsDragActive] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <form
        className={`upload-page__upload-form ${uploadFormDragStyle}`}
        onDragEnter={() => setIsDragActive(true)}
      >
        <div className="upload-page__upload-form-contents">
          <input
            type="file"
            multiple
            onClick={(e) => e.preventDefault()} //this input is only for drag n drop. disable clicking
            onChange={(e) => uploadHandlerDrag(e)}
            onDragEnter={(e) => (e.target.value = null)}
            className="upload-page__upload-form-contents-input-for-drag"
            title={""}
          />
          {isDragActive && (
            <div
              className="upload-page__upload-form-hover-div"
              onDragEnter={() =>
                verifiedValue
                  ? setUploadFormDragStyle(
                      "upload-page__upload-form-drag-enter"
                    )
                  : setUploadFormDragStyle(
                      "upload-page__upload-form-drag-enter-not-verified"
                    )
              }
              onDragOver={(e) => {
                // e.stopPropagation();
                e.preventDefault();
                verifiedValue
                  ? setUploadFormDragStyle(
                      "upload-page__upload-form-drag-enter"
                    )
                  : setUploadFormDragStyle(
                      "upload-page__upload-form-drag-enter-not-verified"
                    );
              }}
              onDragLeave={() => {
                setUploadFormDragStyle();
                setIsDragActive(false);
              }}
              // onDragLeave={() => }
              onDrop={(e) => {
                e.stopPropagation();
                e.preventDefault();
                uploadHandlerDrag(e);
              }}
            >
              fffffff
            </div>
          )}
          <div className="upload-page__upload-form-input-buttons-and-captions">
            <img
              src={uploadFormGalleryIcon}
              className="upload-page__upload-form-gallery-icon"
            />
            <div className="upload-page__upload-form-heading">
              Drag and drop to upload, or
            </div>
            <div className="upload-page__add-upload-button-container">
              <input
                type="file"
                multiple
                onChange={(e) => uploadHandlerClick(e)}
                onClick={(e) => (e.target.value = null)}
                onDragEnter={(e) => (e.target.value = null)}
                className="upload-page__upload-form-contents-input-for-click"
                title={""}
              />
              <button className="upload-page__add-upload-button-button">
                <div>Browse</div>
              </button>
            </div>

            <div className="upload-page__upload-form-caption">
              Supported Files: JPEG, JPG, PNG{" "}
              <i style={{ fontSize: "0.85rem" }}>File Limit: 10MB</i>
            </div>
          </div>
        </div>
      </form>
      <FileList
        imagesToUpload={imagesToUpload}
        removeImageFromUploadFrontEnd={removeImageFromUploadFrontEnd}
        newItemRef={newItemRef}
        domain={domain}
      />
      {imagesToUpload[0] && (
        <div className="upload-page__all-done-banner-container">
          <div className="upload-page__all-done-banner-browse-button-container">
            <input
              type="file"
              multiple
              onChange={(e) => uploadHandlerClick(e)}
              onClick={(e) => (e.target.value = null)}
              onDragEnter={(e) => {
                e.target.value = null;
                setBrowseButtonAllDoneClass(
                  "upload-page__all-done-banner-container-button-dragover"
                );
              }}
              onDragLeave={() =>
                setBrowseButtonAllDoneClass(
                  "upload-page__all-done-banner-container-button"
                )
              }
              onDrop={() =>
                setBrowseButtonAllDoneClass(
                  "upload-page__all-done-banner-container-button"
                )
              }
              className="upload-page__all-done-banner-upload-input"
              title={""}
            />
            <button className={browseButtonAllDoneClass}>Browse</button>
          </div>
          All done?
          <a href={`/Account/${curUser_hyphenated}/My-Pics`}>Edit Images</a>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
