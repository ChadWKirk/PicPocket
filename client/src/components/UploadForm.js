import { React, useEffect, useState } from "react";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
//images
import uploadFormGalleryIcon from "../images/upload-page__image-gallery-icon.png";

const UploadForm = ({
  curUser,
  imagesToUpload,
  setImagesToUpload,
  removeImageFromUpload,
  setImageError,
  imageError,
}) => {
  //cloudinary preset and file for formData
  var CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
  let CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  var targetFilesArray = [];

  async function uploadHandler(e) {
    e.preventDefault();

    for (var i = 0; i < e.target.files.length; i++) {
      const image = e.target.files[i];
      image.isUploading = true;
      targetFilesArray.push(image);
      setImagesToUpload((imagesToUpload) => [...imagesToUpload, image]);
      console.log(targetFilesArray + " target files");

      //to send in fetch
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", "picpocket");

      var uploadToMongoBody;

      //send post request to cloudinary api upload endpoint url (have to use admin API
      //from cloudinary for multi upload). Upload preset only allows jpg, jpeg or png files.
      await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      )
        .then((result) =>
          result.json().then((resJSON) => (uploadToMongoBody = resJSON))
        )
        .catch((err) => {
          console.log(err);
        });
      //if file type is jpg, png or jpeg and successfully gets uploaded to cloudinary,
      //send to mongoDB. Accepted file types are controlled through upload preset GUI on the cloudinary website
      if (uploadToMongoBody.public_id) {
        //add fields to fetch response to get ready to send to MongoDB
        uploadToMongoBody.likes = 0;
        uploadToMongoBody.likedBy = [];
        uploadToMongoBody.uploadedBy = curUser;
        uploadToMongoBody.title = image.name
          .replace(".jpg", "")
          .replace(".png", "")
          .replace(".jpeg", "");
        uploadToMongoBody.description = "";
        uploadToMongoBody.price = "$0.00";
        uploadToMongoBody.imageType = "Photo";

        //send to mongoDB
        fetch("http://localhost:5000/upload", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(uploadToMongoBody),
        })
          .then((res) => {
            image.isUploading = false;
            image.secure_url = uploadToMongoBody.secure_url;
            image.publicId = uploadToMongoBody.public_id;
            image.assetId = uploadToMongoBody.asset_id;
            setImagesToUpload((imagesToUpload) => [...imagesToUpload]);
            console.log(imagesToUpload);
          })
          .catch((err) => {
            console.error(err);
            removeImageFromUpload(image.name);
          });
      } else {
        image.isError = true;
        image.isUploading = false;
        setImageError(!imageError);
      }
    }
  }
  //add class to form when dragged over, same styling as when hovering over it
  const [uploadFormDragStyle, setUploadFormDragStyle] = useState();

  return (
    <div style={{ width: "100%" }}>
      <form
        className={`upload-page__upload-form ${uploadFormDragStyle}`}
        onDragEnter={() =>
          setUploadFormDragStyle("upload-page__upload-form-drag-enter")
        }
        onDragLeave={() => setUploadFormDragStyle()}
        onDrop={() => setUploadFormDragStyle()}
      >
        <div style={{ position: "absolute", top: -30, left: -7, fontSize: 16 }}>
          Upload
        </div>
        <div className="upload-page__upload-form-contents">
          <input type="file" multiple onChange={(e) => uploadHandler(e)} />
          <div className="upload-page__upload-form-input-buttons-and-captions">
            <img
              src={uploadFormGalleryIcon}
              className="upload-page__upload-form-gallery-icon"
            />
            <div className="upload-page__upload-form-heading">
              Drag and drop to upload, or
            </div>
            <button className="upload-page__add-upload-button">
              {/* <FontAwesomeIcon
                fontSize={24}
                style={{ color: "white" }}
                icon={faPlus}
              /> */}
              <div>Browse</div>
            </button>
            <div className="upload-page__upload-form-caption">
              Supported Files: JPEG, JPG, PNG
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
