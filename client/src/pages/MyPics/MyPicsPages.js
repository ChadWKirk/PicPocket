import React, { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Toast from "../../components/Toast";
import NavbarComponent from "../../components/NavbarComponent";
//font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const MyPicsPage = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
}) => {
  //get screen width. at Xpx setIsScreenMobile(true)
  const [isScreenMobile, setIsScreenMobile] = useState();
  const [windowSize, setWindowSize] = useState(getWindowSize());
  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
  useEffect(() => {
    if (windowSize.innerWidth < 900) {
      setIsScreenMobile(true);
    } else {
      setIsScreenMobile(false);
    }
  }, [windowSize]);

  let navigate = useNavigate();
  const { username } = useParams();

  //create an array of image items with all as false
  //when one is clicked, in the displayEditor function it checks if bulk arr length is greater than 0
  //if so, change that index of imgItemArr to true
  //when imgItemArr[index] is true, show form
  const [isImageItemOpen, setIsImageItemOpen] = useState(false);
  //array of image items to decide which one to show mobile open form in
  let imgItemArr = [];
  //imgItemArr state
  const [imgItemArrState, setImgItemArrState] = useState(imgItemArr);

  //if user tries to go to a user's my pics page that they aren't logged in as
  //change url to url with their curUser name
  //if user tries to get to my pics page and they aren't logged in at all, app.js takes cares of it by using Navigate element
  useEffect(() => {
    if (username !== curUser_hyphenated) {
      navigate(`/Account/${curUser_hyphenated}/My-Pics/most-recent/all-types`);
    }
  }, []);

  const [massDlLink, setMassDlLink] = useState();

  //toast stuff
  //set toast to invisible until it is called by either error or success function
  const [toastMessage, setToastMessage] = useState();
  const [toastStatus, setToastStatus] = useState("Invisible");
  function toastDissappear() {
    setTimeout(() => {
      setToastStatus("Invisible");
      setToastMessage();
    }, 3000);
  }
  function closeToast() {
    setToastMessage();
    setToastStatus();
  }

  //img array to display
  const [imgGallery, setImgGallery] = useState([]);
  //fetch img array to map over
  const [imgData, setImgData] = useState([]);
  //put mapped over imgData in here
  let imgDataMapOutcome;

  //put true or false values in here for individual checkboxes
  let isCheckedArr = [];
  //checkbox state
  const [isCheckedArrState, setIsCheckedArrState] = useState(isCheckedArr);
  //if a checkbox is checked, set checkedIsVisible to true to show all checkboxes rather than only on hover (css)
  const [isACheckboxChecked, setIsACheckboxChecked] = useState(false);

  //Editor array for mass delete / mass download
  let bulkArr = useRef([]);

  //to do select/deselect all
  let isSelectAll = useRef(false);
  const [isSelectAllState, setIsSelectAllState] = useState(false);

  //values to set editor form fields to
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [imageType, setImageType] = useState("");

  //get colors from image for when you submit an edit to it to carry them over
  const [colors, setColors] = useState();

  //sort and filter values to do get requests
  const [sort, setSort] = useState("most-recent");
  const [filter, setFilter] = useState("all-types");
  //sort and filter values to change the titles of the dropdown menus
  const [sortTitle, setSortTitle] = useState("Most Recent");
  const [filterTitle, setFilterTitle] = useState("All Types");

  //change this state when deleting or downloading
  const [isDeletingOrDownloading, setIsDeletingOrDownloading] = useState(false);

  //don't accept special characters
  const [titleClass, setTitleClass] = useState(
    "my-pics-editor__editor-form-details-sub-containerInput"
  );
  const [specialMessage, setSpecialMessage] = useState("");
  if (/[~`!#$%\^&*+=\\[\]\\;,/{}|\\":<>\?]/g.test(title)) {
    console.log("special");
    setTimeout(() => {
      setTitleClass(
        "my-pics-editor__editor-form-details-sub-containerInputRed"
      );
      setSpecialMessage(" No Special Characters");
    }, 10);
  } else {
    // console.log("no special");
    setTimeout(() => {
      setTitleClass("my-pics-editor__editor-form-details-sub-containerInput");
      setSpecialMessage("");
    }, 10);
  }

  //get images
  useEffect(() => {
    //reset bulkArr when changing sort/filter
    bulkArr.current = [];

    // displayEditorInfo();

    //reset select all when changing sort/filter
    isSelectAll.current = false;
    setIsSelectAllState(false);

    // navigate(`/Account/${curUser}/My-Pics/${sort}/${filter}`);

    async function myPicsFetch() {
      await fetch(`${domain}/${curUser_real}/${sort}/${filter}`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((response) =>
        response.json().then((resJSON) => setImgData(resJSON))
      );
    }
    myPicsFetch();

    //set all checkboxes to false by default
    for (let i = 0; i < imgData.length; i++) {
      isCheckedArr[i] = false;
    }
    setIsCheckedArrState(isCheckedArr);
  }, [sort, filter, isDeletingOrDownloading]);

  useEffect(() => {
    //set all imgItemsClicked to false by default
    for (let i = 0; i < imgData.length; i++) {
      imgItemArr[i] = { isOpen: false, isChecked: false };
    }
    setImgItemArrState(imgItemArr);
  }, [imgData]);

  //Create Image Gallery
  //use this to pass index from map to useEffect
  const [indexx, setIndexx] = useState();
  //create gallery
  useEffect(() => {
    //wait for imgItemArrState to populate before running useEffect
    //to get conditional rendering to work. otherwise it will say can not read property isOpen of undefined
    if (imgItemArrState.length > 0) {
      console.log(imgItemArr);
      function uncheck(index, element) {
        console.log("uncheck function");
        setIndexx(index);
        let boxes = [...isCheckedArrState];
        let box = isCheckedArrState[index];
        box = false;
        boxes[index] = box;
        handleBulkArrCheck(element, index);
        setIsCheckedArrState(boxes);
        // displayEditorInfo();
        // if (isScreenMobile) {
        //set so title info shows when unchecked
        let imgItems = [];
        for (let i = 0; i < imgItemArrState.length; i++) {
          imgItems[i] = {
            isOpen: imgItemArrState[i].isOpen,
            isChecked: imgItemArrState[i].isChecked,
          };
        }
        //get current index of array
        let imgItem = imgItemArrState[index];
        imgItem = { isOpen: false, isChecked: false };
        //change index to false
        imgItems[index] = imgItem;
        //check if only one is remaining to checked to set to open true or not
        if (
          imgItems.filter((element) => element.isChecked == true).length == 1
        ) {
          imgItems.forEach((element, index) => {
            if (element.isChecked) {
              element.isOpen = true;
              if (isScreenMobile) {
                setTimeout(() => {
                  document
                    .getElementById(`imageItemContainer${index}`)
                    .classList.add("heightmore");
                  document.querySelector("#titleInputID").value =
                    bulkArr.current[0].title;
                  setTitle(bulkArr.current[0].title);
                  document.querySelector("#tagsInputID").value =
                    bulkArr.current[0].tags.join(", "); //makes the tags array display with ", " separating items instead of just a comma. To play nice with split to create array on submit
                  setTags(bulkArr.current[0].tags.join(", "));
                  document.querySelector("#descriptionInputID").value =
                    bulkArr.current[0].description;
                  setDescription(bulkArr.current[0].description);
                  document.querySelector("#imageTypeInputID").value =
                    bulkArr.current[0].imageType;
                  setImageType(bulkArr.current[0].imageType);
                  document.querySelector(
                    "#my-pics-editor__preview-image-for-editor"
                  ).src =
                    bulkArr.current[0].secure_url.slice(0, 50) +
                    "q_60/c_scale,w_600/dpr_auto/" +
                    bulkArr.current[0].secure_url.slice(
                      50,
                      bulkArr.current[0].secure_url.lastIndexOf(".")
                    ) +
                    ".jpg";
                }, 1);
              } else {
                displayEditorInfo(index);
              }
            }
          });
        }
        setImgItemArrState(imgItems);
        //if not all are checked, set isSelectAllState to false to uncheck Select All checkbox
        if (bulkArr.current.length < imgItemArrState.length) {
          isSelectAll.current = false;
          setIsSelectAllState(false);
        }
      }
      function check(index, element) {
        console.log("check");
        setIndexx(index);
        let boxes = [...isCheckedArrState];
        let box = isCheckedArrState[index];
        box = true;
        boxes[index] = box;
        handleBulkArrCheck(element, index);
        setIsCheckedArrState(boxes);

        //if using mobile, run showMobileForm
        // if (isScreenMobile) {
        setTimeout(() => {
          showMobileForm(index);
        }, 1);
        //if all are checked, set isSelectAllState to true to check Select All checkbox
        if (bulkArr.current.length == imgItemArrState.length) {
          isSelectAll.current = true;
          setIsSelectAllState(true);
        }
        //if not all are checked, set isSelectAllState to false to uncheck Select All checkbox
        if (bulkArr.current.length < imgItemArrState.length) {
          isSelectAll.current = false;
          setIsSelectAllState(false);
        }
      }
      function showMobileForm(index, element) {
        console.log("showmobileform");

        //set indexx to index of selected image item. pass indexx to useEffect that runs displayEditorInfo(index) after imgItemArrState changes at the end of this function
        setIndexx(index);
        //set all to false again
        let imgItems = [];
        for (let i = 0; i < imgItemArrState.length; i++) {
          imgItems[i] = {
            isOpen: imgItemArrState[i].isOpen,
            isChecked: imgItemArrState[i].isChecked,
          };
        }

        //get current index of array
        let imgItem = imgItemArrState[index];
        //if only one checked, set to true to show form, and increase height to fit form
        if (bulkArr.current.length == 1) {
          imgItem.isOpen = true;
          imgItem.isChecked = true;
        } else {
          //set all isOpen to false + set is checked to true
          imgItems.forEach((element) => {
            element.isOpen = false;
          });
          imgItem.isChecked = true;
        }
        //change index depending on if only one checked or not
        imgItems[index] = imgItem;
        //set state. runs useEffect that runs displayEditorInfo(index)
        setImgItemArrState(imgItems);
      }
      imgDataMapOutcome = imgData.map((element, index) => {
        // let parts = element.public_id.split("/");  --SPLIT NOT WORKING DUE TO MESSED UP UPLOADS EARLIER. JUST NEED TO DELETE THEM
        // let result = parts[parts.length - 1];
        let assetId = element.asset_id;
        let checkbox;
        let checkboxMobile;
        let elBytes = element.bytes;
        let elKilobytes = (elBytes / 1024).toFixed(2);
        let elMegabytes = (elBytes / 1048576).toFixed(2);

        //set if checkbox is checked or not based on isCheckedArrState
        if (isCheckedArrState[index]) {
          checkbox = (
            <input
              type="checkbox"
              checked={isCheckedArrState[index]}
              onChange={() => {
                uncheck(index, element);
              }}
              id={`checkbox${index}`}
              className="checkbox"
            />
          );
          checkboxMobile = (
            <input
              type="checkbox"
              checked={isCheckedArrState[index]}
              onChange={() => {
                uncheck(index, element);
                // showMobileForm(index, element);
                // displayEditorInfo(index);
              }}
              id={`checkbox${index}`}
              className="checkbox-mobile"
            />
          );
        } else {
          checkbox = (
            <input
              type="checkbox"
              checked={isCheckedArrState[index]}
              onChange={() => {
                check(index, element);
                displayEditorInfo(index);
              }}
              id={`checkbox${index}`}
              className="checkbox"
            />
          );
          checkboxMobile = (
            <input
              type="checkbox"
              checked={isCheckedArrState[index]}
              onChange={() => {
                check(index, element);
                displayEditorInfo(index);
              }}
              id={`checkbox${index}`}
              className="checkbox-mobile"
            />
          );
        }
        //if screen width is over 460px, then display desktop version of image gallery item
        let imageItem;
        if (isScreenMobile == false) {
          imageItem = (
            <div
              onClick={(e) => {
                displayEditorInfo(index);
              }}
              className={`${
                isCheckedArrState[index]
                  ? "mypics-image-gallery__img-and-info-container border"
                  : "mypics-image-gallery__img-and-info-container"
              }`}
              data-isACheckboxChecked={isACheckboxChecked}
            >
              {checkbox}
              {checkboxMobile}
              <label
                onClick={() => {
                  handleCheck(index);
                  handleBulkArrLabel(element, index);
                }}
                className="mypics-image-gallery__img-label"
              >
                <div
                  className="mypics-image-gallery__img-container"
                  // href={`/image/${result.replaceAll(" ", "-")}`}
                >
                  <img
                    src={
                      element.secure_url.slice(0, 50) +
                      "q_60/c_scale,w_600/dpr_auto/" +
                      element.secure_url.slice(
                        50,
                        element.secure_url.lastIndexOf(".")
                      ) +
                      ".jpg"
                    } //how the images come in. uses slice to input quality into url and change everything to jpg
                    alt="img"
                    className="mypics-image-gallery__img"
                  ></img>
                </div>
                <div className="mypics-image-gallery__img-info-container">
                  <div>
                    <p className="mypics-image-gallery__img-info-title">
                      {imgData[index].title}
                    </p>
                  </div>
                  <div className="mypics-img-gallery__img-info-size-container">
                    <p>
                      {element.width} x {element.height}
                    </p>
                    <p>{elMegabytes}Mb</p>
                  </div>
                </div>
              </label>
            </div>
          );
        }
        //if screen width is under Xpx, then display mobile version of image gallery item
        if (isScreenMobile == true) {
          imageItem = (
            <div
              onClick={(e) => {
                displayEditorInfo(index);
              }}
              className={`${
                isCheckedArrState[index]
                  ? "mypics-image-gallery__img-and-info-container border"
                  : "mypics-image-gallery__img-and-info-container"
              }`}
              data-isACheckboxChecked={isACheckboxChecked}
              id={`imageItemContainer${index}`}
            >
              {checkbox}
              {checkboxMobile}
              <label
                onClick={() => {
                  handleCheck(index);
                  handleBulkArrLabel(element, index);
                }}
                className="mypics-image-gallery__img-label"
              >
                <div
                  className="mypics-image-gallery__img-container"
                  // href={`/image/${result.replaceAll(" ", "-")}`}
                >
                  <img
                    src={
                      element.secure_url.slice(0, 50) +
                      "q_60/c_scale,w_600/dpr_auto/" +
                      element.secure_url.slice(
                        50,
                        element.secure_url.lastIndexOf(".")
                      ) +
                      ".jpg"
                    } //how the images come in. uses slice to input quality into url and change everything to jpg
                    alt="img"
                    className="mypics-image-gallery__img"
                  ></img>
                </div>
                <div className="mypics-image-gallery__img-info-container">
                  {imgItemArrState[index].isOpen && (
                    <form
                      className={`${
                        bulkArr.current.length == 1
                          ? "my-pics-editor__editor-form-container-mobile-open"
                          : "gone"
                      }`}
                      onSubmit={(e) => submitForm(e)}
                    >
                      <div className="my-pics-editor__editor-form-contents-container-mobile-open">
                        <div>
                          <div style={{ fontSize: "0.75rem" }}>
                            Title{" "}
                            <p
                              style={{
                                fontSize: "0.75rem",
                                color: "red",
                                display: "inline",
                              }}
                            >
                              *
                            </p>
                            <p
                              style={{
                                fontSize: "0.75rem",
                                color: "red",
                                display: "inline",
                              }}
                            >
                              {specialMessage}
                            </p>
                          </div>
                          <div>
                            <input
                              id="titleInputID"
                              className={titleClass}
                              onChange={(e) => setTitle(e.target.value)}
                            ></input>
                          </div>
                        </div>

                        <div className="my-pics-editor__editor-form-details-container-mobile-open">
                          <div className="my-pics-editor__editor-form-details-sub-container-mobile-open">
                            {/* don't allow anything but letters and numbers. no special characters */}
                          </div>
                          <div className="my-pics-editor__editor-form-details-sub-container-mobile-open">
                            {/* copy how cloudinary lets you add tags. maybe bootstrap */}
                            <div style={{ fontSize: "0.75rem" }}>
                              Tags (Use commas. Ex: tag, tags)
                            </div>
                            <div>
                              <input
                                id="tagsInputID"
                                onChange={(e) => setTags(e.target.value)}
                              ></input>
                            </div>
                          </div>
                          <div
                            className="my-pics-editor__editor-form-details-sub-container-mobile-open"
                            style={{ flex: "1" }}
                          >
                            {/* have max length of 500 characters */}
                            <div style={{ fontSize: "0.75rem" }}>
                              Description
                            </div>
                            <div style={{ height: "100%" }}>
                              <textarea
                                style={{ height: "100%" }}
                                id="descriptionInputID"
                                onChange={(e) => setDescription(e.target.value)}
                              ></textarea>
                            </div>
                          </div>
                          <div className="my-pics-editor__editor-form-details-sub-container-mobile-open">
                            <div
                              style={{
                                fontSize: "0.75rem",
                                marginTop: "-1.5rem",
                              }}
                            >
                              Image type
                            </div>
                            <div className="my-pics-editor__image-type-and-btns-container-mobile-open">
                              <select
                                id="imageTypeInputID"
                                onChange={(e) => setImageType(e.target.value)}
                              >
                                <option value="Photo">Photo</option>
                                <option value="Illustration">
                                  Illustration
                                </option>
                              </select>
                              <div className="my-pics-editor__btns-container-mobile-open">
                                <button
                                  style={{
                                    backgroundColor: "rgb(250, 250, 250)",
                                    border: "2px solid darkgreen",
                                    color: "green",
                                  }}
                                >
                                  <FontAwesomeIcon icon={faCheck} />
                                </button>
                                {bulkArr.current[0] && (
                                  <a
                                    style={{
                                      backgroundColor: "rgb(250, 250, 250)",
                                      border: "2px solid silver",
                                      color: "darkblue",
                                    }}
                                    href={
                                      bulkArr.current[0].secure_url.slice(
                                        0,
                                        50
                                      ) +
                                      "q_100/fl_attachment/" +
                                      bulkArr.current[0].secure_url.slice(
                                        50,
                                        bulkArr.current[0].secure_url.lastIndexOf(
                                          "."
                                        )
                                      )
                                    }
                                  >
                                    <FontAwesomeIcon icon={faDownload} />
                                  </a>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => deleteImageFromBackEnd(e)}
                                  style={{
                                    backgroundColor: "rgb(250, 250, 250)",
                                    border: "2px solid darkred",
                                    color: "red",
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                  {!imgItemArrState[index].isOpen && (
                    <>
                      <div>
                        <p className="mypics-image-gallery__img-info-title">
                          {imgData[index].title}
                        </p>
                      </div>
                      <div className="mypics-img-gallery__img-info-size-container">
                        <p>
                          {element.width} x {element.height}
                        </p>
                        <p>{elMegabytes}Mb</p>
                      </div>
                    </>
                  )}
                </div>
              </label>
            </div>
          );
        }

        return <div key={element.asset_id}>{imageItem}</div>;
      });
      setImgGallery(imgDataMapOutcome);
      console.log(imgItemArrState, " img item arr");
    }
  }, [
    imgData,
    sort,
    filter,
    isCheckedArrState,
    imgItemArrState,
    titleClass,
    windowSize,
  ]);

  //handle push / filter bulkArr when clicking checkbox (for mass download/delete)
  //if it is already in bulkArr, remove it from bulkArr. If it is not, push it to bulkArr.
  //(mimics check / uncheck behavior on screen)
  function handleBulkArrCheck(element, index) {
    if (bulkArr.current.indexOf(element) >= 0) {
      bulkArr.current = bulkArr.current.filter((item) => {
        return item !== element;
      });
      console.log("pull");
    } else if (bulkArr.current.indexOf(element.asset_id) == -1) {
      bulkArr.current.push(element);
      console.log("push");
    }
    //if an image is checked, show all checkboxes without hovering
    if (bulkArr.current.length > 0) {
      setIsACheckboxChecked(true);
    } else if (bulkArr.current.length <= 0) {
      setIsACheckboxChecked(false);
    }
    console.log(bulkArr.current);
  }

  //handle push / filter bulkArr when clicking label (for mass download/delete)
  //clears bulkArr and puts only the selected img in the bulkArr (mimics check/uncheck behavior on screen)
  function handleBulkArrLabel(element, index) {
    bulkArr.current = [];
    bulkArr.current.push(element);
    //if an image is checked, show all checkboxes without hovering
    if (bulkArr.current.length > 0) {
      setIsACheckboxChecked(true);
    } else if (bulkArr.current.length <= 0) {
      setIsACheckboxChecked(false);
    }
    // console.log(bulkArr.current);
  }

  //set editor info
  function displayEditorInfo(index) {
    console.log("display function");
    //if not all are checked, set isSelectAllState to false to uncheck Select All checkbox
    if (bulkArr.current.length < imgItemArrState.length) {
      isSelectAll.current = false;
      setIsSelectAllState(false);
    }
    //if bulkArr has one selected and it is not already currently open
    if (bulkArr.current.length == 1 && imgItemArrState[index].isOpen == false) {
      console.log("false");
      console.log(bulkArr.current.length, " length");
      console.log(imgItemArrState[index], " real");
      //set editor fields
      setTimeout(() => {
        document.querySelector("#titleInputID").value =
          bulkArr.current[0].title;
        setTitle(bulkArr.current[0].title);
        document.querySelector("#tagsInputID").value =
          bulkArr.current[0].tags.join(", "); //makes the tags array display with ", " separating items instead of just a comma. To play nice with split to create array on submit
        setTags(bulkArr.current[0].tags.join(", "));
        document.querySelector("#descriptionInputID").value =
          bulkArr.current[0].description;
        setDescription(bulkArr.current[0].description);
        document.querySelector("#imageTypeInputID").value =
          bulkArr.current[0].imageType;
        setImageType(bulkArr.current[0].imageType);
        document.querySelector(
          "#my-pics-editor__preview-image-for-editor"
        ).src =
          bulkArr.current[0].secure_url.slice(0, 50) +
          "q_60/c_scale,w_600/dpr_auto/" +
          bulkArr.current[0].secure_url.slice(
            50,
            bulkArr.current[0].secure_url.lastIndexOf(".")
          ) +
          ".jpg";
      }, 1);

      //now set imgItemArrState[index].isOpen and isChecked to true
      let imgItems = [];
      for (let i = 0; i < imgItemArrState.length; i++) {
        imgItems[i] = { isOpen: false, isChecked: false };
      }
      //set to true to show form, and increase height to fit form
      imgItems[index] = { isOpen: true, isChecked: true };
      setTimeout(() => {
        document
          .getElementById(`imageItemContainer${index}`)
          .classList.add("heightmore");
      }, 1);
      setImgItemArrState(imgItems);
    }
    //if bulkArr has one selected and it is already currently open
    else if (
      bulkArr.current.length == 1 &&
      imgItemArrState[index].isOpen == true
    ) {
      console.log("true");
      console.log(bulkArr.current.length, " length");
      console.log(imgItemArrState[index], " real");
      return;
    }
    // if multiple images are selected
    else {
      console.log("null");
      console.log(bulkArr.current.length, " length");
      console.log(imgItemArrState[index], " real");

      document.querySelector("#titleInputID").value = null;
      document.querySelector("#tagsInputID").value = null;
      document.querySelector("#descriptionInputID").value = null;
      document.querySelector("#imageTypeInputID").value = null;
      document.querySelector("#my-pics-editor__preview-image-for-editor").src =
        null;
      //remove added height when multiple images are checked
      setTimeout(() => {
        const allElements = document.querySelectorAll("*");
        allElements.forEach((element) => {
          element.classList.remove("heightmore");
        });
      }, 1);
    }
  }

  //when a box is checked or unchecked, change isCheckedArrState accordingly
  function handleCheck(position) {
    let boxes = [...isCheckedArrState];
    for (let i = 0; i < imgData.length; i++) {
      if (i === position) {
        boxes[i] = true;
      } else {
        boxes[i] = false;
      }
    }
    setIsCheckedArrState(boxes);
  }

  async function submitForm(e) {
    e.preventDefault();
    if (
      titleClass == "my-pics-editor__editor-form-details-sub-containerInputRed"
    ) {
      return;
    }
    bulkArr.current[0].title = title;
    bulkArr.current[0].description = description;
    bulkArr.current[0].tags = tags.split(", "); //turn string into array
    bulkArr.current[0].imageType = imageType.toLowerCase();
    console.log("submit attempt");
    await fetch(`${domain}/update/${curUser_real}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(bulkArr.current[0]),
    }).then((res) => {
      setIsDeletingOrDownloading(!isDeletingOrDownloading);
      setToastStatus("Success");
      setToastMessage("Your pic was updated successfully.");
      toastDissappear();
    });
    // .catch((err) => notify_edit_failure);
  }

  //single delete button in editor form function
  async function deleteImageFromBackEnd() {
    let publicIdArr = [];
    for (let p = 0; p < bulkArr.current.length + 1; p++) {
      // publicIdArr.push(bulkArr.current[p].public_id);

      // console.log(publicIdArr);

      //cloudinary admin api for bulk delete.

      await fetch(`${domain}/deleteImage/`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ public_id: bulkArr.current[p].public_id }),
      })
        .then((res) => {
          setIsDeletingOrDownloading(!isDeletingOrDownloading);
          setToastStatus("Success");
          setToastMessage("Pic(s) successfully deleted.");
          toastDissappear();
        })
        .catch((err) => {
          console.error(err);
          setToastStatus("Error");
          setToastMessage("Error. Deletion unsuccessful");
          toastDissappear();
        });
    }
  }

  //mass delete images
  async function massDeleteImages() {
    let publicIDArr = bulkArr.current.map((a) => a.public_id);
    console.log(publicIDArr);
    await fetch(`${domain}/massDeleteImages`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(publicIDArr),
    })
      .then((res) => {
        setTimeout(() => {
          setIsDeletingOrDownloading(!isDeletingOrDownloading);
          setToastStatus("Success");
          setToastMessage("Pic(s) successfully deleted.");
          toastDissappear();
        }, 10);
      })
      .catch((err) => {
        console.error(err);
        setToastStatus("Error");
        setToastMessage("Error. Deletion unsuccessful");
        toastDissappear();
      });
  }

  //mass download images
  async function massDownloadImages() {
    let publicIDArr = bulkArr.current.map((a) =>
      a.public_id.replace("/", "%2F")
    );
    console.log(publicIDArr);
    await fetch(`${domain}/massDownloadImages/${publicIDArr}`, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    }).then((res) => {
      res
        .json()
        .then((resJSON) => JSON.stringify(resJSON))
        .then((stringJSON) => JSON.parse(stringJSON))
        .then((parsedJSON) => (window.location.href = parsedJSON));
      setIsDeletingOrDownloading(!isDeletingOrDownloading);
    });
  }

  let bulkButtons;

  const [isHoveredMassDeleteButton, setIsHoveredMassDeleteButton] =
    useState(false);
  const [isHoveredMassDownloadButton, setIsHoveredMassDownloadButton] =
    useState(false);

  if (bulkArr.current.length > 0) {
    bulkButtons = (
      <div className="mypics-image-gallery__sort-bar__download-delete-all-btn-container">
        <div style={{ position: "relative" }}>
          <FontAwesomeIcon
            icon={faTrash}
            className="massIcon"
            onClick={() => massDeleteImages()}
            onMouseEnter={() => {
              setTimeout(() => {
                setIsHoveredMassDeleteButton(true);
              }, 0);
            }}
            onMouseLeave={() => {
              setTimeout(() => {
                setIsHoveredMassDeleteButton(false);
              }, 100);
            }}
          />
          <div
            className={`${isHoveredMassDeleteButton ? "massIconText" : "gone"}`}
          >
            Delete Selected
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <FontAwesomeIcon
            icon={faDownload}
            className="massIcon"
            onClick={() => massDownloadImages()}
            onMouseEnter={() => {
              setTimeout(() => {
                setIsHoveredMassDownloadButton(true);
              }, 0);
            }}
            onMouseLeave={() => {
              setTimeout(() => {
                setIsHoveredMassDownloadButton(false);
              }, 100);
            }}
          />
          <div
            className={`${
              isHoveredMassDownloadButton ? "massIconText" : "gone"
            }`}
          >
            Download Selected
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mypics-page__container">
      <NavbarComponent
        domain={domain}
        curUser_real={curUser_real}
        curUser_hyphenated={curUser_hyphenated}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      <div className="mypics-page__above-gallery-section-container">
        <Toast
          status={toastStatus}
          message={toastMessage}
          closeToast={closeToast}
        />
        <div className="mypics-page__heading-container">
          <div className="mypics-page__heading">
            <h2>Your Pics</h2>
            <p>
              {imgData.length} images uploaded by {curUser_real}
              {/* <a href={`"/Account/${curUser}"`}>{curUser}</a> */}
            </p>
          </div>
        </div>
      </div>
      <div className="mypics-image-gallery__gallery-and-editor-container">
        <div>
          <div className="mypics-image-gallery__sort-bar-container">
            <div className="mypics-image-gallery__sort-bar__sort-filter-dropdown-checkbox-container">
              <input
                type="checkbox"
                checked={isSelectAllState}
                onClick={() => setIsSelectAllState(!isSelectAllState)}
                onChange={() => {
                  let boxes = [...isCheckedArrState];
                  let massCopy = [...bulkArr.current];
                  console.log(isSelectAll.current);
                  if (isSelectAll.current == false) {
                    for (let r = 0; r < imgData.length; r++) {
                      boxes[r] = true;
                      massCopy.push(imgData[r]);
                      setIsACheckboxChecked(true);
                    }
                    isSelectAll.current = true;
                  } else if (isSelectAll.current == true) {
                    for (let r = 0; r < imgData.length; r++) {
                      boxes[r] = false;
                      massCopy = [];
                    }
                    isSelectAll.current = false;
                    setIsACheckboxChecked(false);
                    console.log("deselect");
                  }

                  setIsCheckedArrState(boxes);
                  bulkArr.current = massCopy;
                  // let box = isCheckedArrState[index];
                  // box = false;
                  // boxes[index] = box;
                  // handleBulkArrCheck(element, index);

                  // displayEditorInfo();
                }}
                className="mypics-image-gallery__checkbox-select-all"
              />
              <DropdownButton
                className="mypics-image-gallery__dropdown-button"
                title={`${sortTitle}`}
                style={{ width: "150px" }}
              >
                <Dropdown.Item
                  className="mypics-image-gallery__dropdown-item"
                  onClick={() => {
                    setSort("most-recent");
                    setSortTitle("Most Recent");
                  }}
                >
                  Most Recent
                </Dropdown.Item>
                <Dropdown.Item
                  className="mypics-image-gallery__dropdown-item"
                  onClick={() => {
                    setSort("oldest");
                    setSortTitle("Oldest");
                  }}
                >
                  Oldest
                </Dropdown.Item>
                <Dropdown.Item
                  className="mypics-image-gallery__dropdown-item"
                  onClick={() => {
                    setSort("aToz");
                    setSortTitle("A - Z");
                  }}
                >
                  A - Z
                </Dropdown.Item>
                <Dropdown.Item
                  className="mypics-image-gallery__dropdown-item"
                  onClick={() => {
                    setSort("zToa");
                    setSortTitle("Z - A");
                  }}
                >
                  Z - A
                </Dropdown.Item>
                <Dropdown.Item
                  className="mypics-image-gallery__dropdown-item"
                  onClick={() => {
                    setSort("leastLikes");
                    setSortTitle("Least Popular");
                  }}
                >
                  Least Popular
                </Dropdown.Item>
                <Dropdown.Item
                  className="mypics-image-gallery__dropdown-item"
                  onClick={() => {
                    setSort("mostLikes");
                    setSortTitle("Popular");
                  }}
                >
                  Popular
                </Dropdown.Item>
              </DropdownButton>
              <DropdownButton
                className="mypics-image-gallery__dropdown-button"
                title={`${filterTitle}`}
                style={{ width: "150px" }}
              >
                <Dropdown.Item
                  className="mypics-image-gallery__dropdown-item"
                  onClick={() => {
                    setFilter("all-types");
                    setFilterTitle("All Types");
                  }}
                >
                  All types
                </Dropdown.Item>
                <Dropdown.Item
                  className="mypics-image-gallery__dropdown-item"
                  onClick={() => {
                    setFilter("Photo");
                    setFilterTitle("Photo");
                  }}
                >
                  Photo
                </Dropdown.Item>
                <Dropdown.Item
                  className="mypics-image-gallery__dropdown-item"
                  onClick={() => {
                    setFilter("Illustration");
                    setFilterTitle("Illustration");
                  }}
                >
                  Illustration
                </Dropdown.Item>
              </DropdownButton>
            </div>

            {bulkButtons}
          </div>
          <div className="mypics-image-gallery__container">{imgGallery}</div>
        </div>

        <div className="my-pics-editor__container">
          <div
            className={`${
              bulkArr.current.length != 1
                ? "my-pics-editor__choose-image-div"
                : "gone"
            }`}
          >
            <FontAwesomeIcon
              icon={faEye}
              className="my-pics-editor__eye-icon"
            />
            <p>Select a single image to edit it here.</p>
          </div>
          <form
            className={`${
              bulkArr.current.length == 1
                ? "my-pics-editor__editor-form-container"
                : "gone"
            }`}
            onSubmit={(e) => submitForm(e)}
          >
            <div className="my-pics-editor__editor-form-contents-container">
              <div>
                <div style={{ fontSize: "0.75rem" }}>
                  Title{" "}
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "red",
                      display: "inline",
                    }}
                  >
                    *
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "red",
                      display: "inline",
                    }}
                  >
                    {specialMessage}
                  </p>
                </div>
                <div>
                  <input
                    id="titleInputID"
                    className={titleClass}
                    onChange={(e) => setTitle(e.target.value)}
                  ></input>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    id="my-pics-editor__preview-image-for-editor"
                    src={""}
                  ></img>
                </div>
              </div>

              <div className="my-pics-editor__editor-form-details-container">
                <div className="my-pics-editor__editor-form-details-sub-container">
                  {/* don't allow anything but letters and numbers. no special characters */}
                </div>
                <div className="my-pics-editor__editor-form-details-sub-container">
                  {/* copy how cloudinary lets you add tags. maybe bootstrap */}
                  <div style={{ fontSize: "0.75rem" }}>
                    Tags (Separate with commas. Ex: tag, tags)
                  </div>
                  <div>
                    <input
                      style={{ marginBottom: "1rem" }}
                      id="tagsInputID"
                      onChange={(e) => setTags(e.target.value)}
                    ></input>
                  </div>
                </div>
                <div
                  className="my-pics-editor__editor-form-details-sub-container"
                  style={{ flex: "1" }}
                >
                  {/* have max length of 500 characters */}
                  <div style={{ fontSize: "0.75rem" }}>Description</div>
                  <div style={{ height: "100%" }}>
                    <textarea
                      style={{ height: "100%" }}
                      id="descriptionInputID"
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="my-pics-editor__editor-form-details-sub-container">
                  <div style={{ fontSize: "0.75rem", marginTop: "1rem" }}>
                    Image type
                  </div>
                  <div className="my-pics-editor__image-type-and-btns-container">
                    <select
                      id="imageTypeInputID"
                      onChange={(e) => setImageType(e.target.value)}
                    >
                      <option value="Photo">Photo</option>
                      <option value="Illustration">Illustration</option>
                    </select>
                    <div className="my-pics-editor__btns-container">
                      <button
                        style={{
                          fontSize: "0.85em",
                          backgroundColor: "rgb(250, 250, 250)",
                          padding: "0.25rem",
                          paddingLeft: "0.75rem",
                          paddingRight: "0.75rem",
                          border: "1px solid lightgrey",
                          borderRadius: "2px",
                        }}
                      >
                        Submit
                      </button>
                      {bulkArr.current[0] && (
                        <a
                          style={{
                            fontSize: "0.85rem",
                            backgroundColor: "rgb(250, 250, 250)",
                            padding: "0.25rem",
                            paddingLeft: "0.75rem",
                            paddingRight: "0.75rem",
                            border: "1px solid lightgrey",
                            borderRadius: "2px",
                          }}
                          href={
                            bulkArr.current[0].secure_url.slice(0, 50) +
                            "q_100/fl_attachment/" +
                            bulkArr.current[0].secure_url.slice(
                              50,
                              bulkArr.current[0].secure_url.lastIndexOf(".")
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={(e) => deleteImageFromBackEnd(e)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{
                            fontSize: "0.8rem",
                            backgroundColor: "rgb(250, 250, 250)",
                            padding: "0.5rem",
                            paddingLeft: "0.87rem",
                            paddingRight: "0.87rem",
                            border: "1px solid lightgrey",
                            borderRadius: "2px",
                            marginTop: "4px",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyPicsPage;
