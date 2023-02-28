import React from "react";
import ImageItem from "./ImageItem";

const FileList = ({
  domain,
  imagesToUpload,
  removeImageFromUploadFrontEnd,
  newItemRef,
}) => {
  async function deleteImageFromBackEnd(imageName, publicId) {
    await fetch(`${domain}/deleteImage`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ public_id: publicId }),
    })
      .then((res) => removeImageFromUploadFrontEnd(imageName))
      .catch((err) => console.error(err));
  }

  return (
    <ul className="upload-page__file-list">
      {imagesToUpload?.map((image, index) => (
        <ImageItem
          identifierForScroll={index}
          key={Math.random(100)}
          image={image}
          deleteImageFromBackEnd={deleteImageFromBackEnd}
          newItemRef={newItemRef}
        />
      ))}
    </ul>
  );
};

export default FileList;
