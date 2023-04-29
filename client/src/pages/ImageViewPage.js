import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import ProgressBar from "../components/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPenToSquare,
  faQuestionCircle,
  faTrash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import Modal__ImageSelect from "../components/Modal__ImageSelect";
import NavbarComponent from "../components/NavbarComponent";
import { AiFillLike } from "react-icons/ai";

const ImageViewPage = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
  isShowingImageSelectModal,
  setIsShowingImageSelectModal,
  imgTitleArrState,
  setImgTitleArrState,
  prevPageForModal,
  setPrevPageForModal,
  imgGalleryScrollPosition,
  setImgGalleryScrollPosition,
  imgToLoadInFirstModal,
}) => {
  let navigate = useNavigate();
  //variables for related images
  let searchQuery;
  let imageURL;
  const [imageFetchID, setImageFetchID] = useState();

  //set this after a successful edit to refetch imgInfo (useEffect)
  const [successfulEdit, setSuccessfulEdit] = useState(false);

  //get first url and when url changes (from back button or arrows) change url state which runs imgInfo useEffect
  const [url, setUrl] = useState(window.location.href);
  useEffect(() => {
    setUrl(window.location.href);
    console.log(url, " url");
  });

  //title input max length. if too long cloudinary won't accept it
  const titleInputMaxLength = 230;

  //get screen width. at Xpx setIsScreenMobile(true)
  const [isScreenMobile, setIsScreenMobile] = useState();
  // get window size to either show delete yes or no modal / submit modal or just use window.confirm for those
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
    if (windowSize.innerWidth < 650) {
      setIsScreenMobile(true);
    } else {
      setIsScreenMobile(false);
    }
  }, [windowSize]);

  // progress bar state. gets set to progressbar component when submitform starts
  const [progressBar, setProgressBar] = useState();

  //submit buttons to change when submitting to add a loading spinner
  const [submitButton, setSubmitButton] = useState(
    <button
      type="submit"
      className="image-view-page__img-tags-input-container-btns-container-submit-btn"
    >
      Submit
    </button>
  );

  //submit when editing image info
  async function submitForm(e) {
    e.preventDefault();
    console.log(title, " title ", description, " desc ", tags, " tags ");
    if (
      titleClass == "image-view-page__img-title-input-red" ||
      tagClass == "image-view-page__img-tags-input-red"
    ) {
      return;
    }
    setProgressBar();

    setSubmitButton(
      <button
        style={{ pointerEvents: "none" }}
        className="image-view-page__img-tags-input-container-btns-container-submit-btn"
      >
        Submit{" "}
        <FontAwesomeIcon
          icon={faSpinner}
          className="fa-spin"
          style={{ marginLeft: "0.4rem" }}
        />
      </button>
    );
    // if (isScreenMobile) {
    // setMobileSubmitButton(
    //   <button
    //     style={{
    //       backgroundColor: "#e7e7e7",
    //       border: "none",
    //       color: "green",
    //       pointerEvents: "none",
    //       fontSize: "1.55rem",
    //       display: "flex",
    //       justifyContent: "center",
    //       alignContent: "center",
    //       paddingTop: "0.25rem",
    //     }}
    //   >
    //     <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
    //   </button>
    // );
    // }
    //make everything unclickable until submit is finished
    const allElements = document.querySelectorAll("*");
    allElements.forEach((element) => {
      element.classList.add("pointer-events__none");
    });
    //start progress bar
    setProgressBar(<ProgressBar playStatus="play" />);
    //set up tags to send in fetch POST
    let sendTags;
    //if user edits tag field to be empty, change value from "" to an empty array
    //so a blank box doesn't show in tags section on modal
    if (tags != "") {
      sendTags = tags; //turn string into array
    } else if (tags == "") {
      sendTags = [];
    }

    // bulkArr.current[0].imageType = imageType.toLowerCase();
    console.log("submit attempt");
    await fetch(`${domain}/update/${curUser_real}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        title: title,
        description: description,
        tags: sendTags,
        imageType: imgInfo.imageType,
        colors: imgInfo.colors,
        likes: imgInfo.likes,
        likedBy: imgInfo.likedBy,
        public_id: `picpocket/${imgPublic_Id}`,
      }),
    }).then((response) =>
      response
        .json()
        .then((resJSON) => JSON.stringify(resJSON))
        .then((stringJSON) => JSON.parse(stringJSON))
        .then((parsedJSON) => {
          console.log(parsedJSON, " parsedJSON");
          //make progress bar finish
          setProgressBar(<ProgressBar playStatus="finish" />);
          // //set progress bar to default after it finishes
          setTimeout(() => {
            setProgressBar();
          }, 500);
          allElements.forEach((element) => {
            element.classList.remove("pointer-events__none");
          });
          if (!isScreenMobile) {
            setToastStatus("Success");
            setToastMessage("Your pic was updated successfully.");
            toastDissappear();
            //make deleteYesOrNo modal go away if it is open
            setDeleteYesOrNo();
            //set img info stuff to new info
            imgTitle = title;
            imgDescription = description;
            imgTags = tags;
            //set is editable to false to turn inputs back into divs
            setIsEditable(false);
            //go to new image title url
            navigate(`/image/${parsedJSON.slice(10)}`);
            //triggers refetch of imgInfo (useEffect)
            setSuccessfulEdit(!successfulEdit);
            console.log(imgTitleArrState);
          } else if (isScreenMobile) {
            setToastStatus("Success-mobile");
            setToastMessage("Your pic was updated successfully.");
            toastDissappear();
            //make deleteYesOrNo modal go away if it is open
            setDeleteYesOrNo();
            //set img info stuff to new info
            imgTitle = title;
            imgDescription = description;
            imgTags = tags;
            //set is editable to false to turn inputs back into divs
            setIsEditable(false);
            //go to new image title url
            navigate(`/image/${parsedJSON.slice(10)}`);
            //triggers refetch of imgInfo (useEffect)
            setSuccessfulEdit(!successfulEdit);
          }
          setSubmitButton(
            <button
              type="submit"
              className="image-view-page__img-tags-input-container-btns-container-submit-btn"
            >
              Submit
            </button>
          );
          // setMobileSubmitButton(
          //   <button
          //     style={{
          //       backgroundColor: "rgb(250, 250, 250)",
          //       border: "2px solid darkgreen",
          //       color: "green",
          //     }}
          //   >
          //     <FontAwesomeIcon icon={faCheck} />
          //   </button>
          // );
        })
    );
    // .catch((err) => notify_edit_failure);
  }

  //toast stuff
  //set toast to invisible until it is called by either error or success function
  const [toastMessage, setToastMessage] = useState();
  const [toastStatus, setToastStatus] = useState("Invisible");
  function toastDissappear() {
    setTimeout(() => {
      setToastStatus("Invisible");
      setToastMessage();
    }, 1500);
  }
  function closeToast() {
    setToastMessage();
    setToastStatus();
  }

  //img info
  const { imgPublic_Id } = useParams();
  const [imgInfo, setImgInfo] = useState();

  //user info to get author name and pfp
  const [userInfo, setUserInfo] = useState();

  //refetch img info to update like button to either liked or not liked
  const [isLiked, setIsLiked] = useState();

  //delete Are You Sure? box. On mobile (width < 650px) use window.alert. On desktop (width > 650px) use own modal.
  const [deleteYesOrNo, setDeleteYesOrNo] = useState();

  //img array to display
  const [imgGallery, setImgGallery] = useState([]);
  //fetch img array
  const [fetchArr, setFetchArr] = useState([]);

  //array of results from mongoDB that you can grab stuff from like title or likedBy etc.
  const [searchArr, setSearchArr] = useState([]);
  //array of stuff you decide to keep from mongoDB search (push from searchArr into resultsArr)
  var resultsArr = [];

  const [resultsMap, setResultsMap] = useState();

  var mapArr;

  let mainLikeBtn;

  //to rerender modal on prev or next img arrow click
  const [isPrevOrNextClicked, setIsPrevOrNextClicked] = useState(false);

  // whether an image is found by fetchImgInfo() or not. Determines whether "page not found" content is display or normal imageViewPage content is displayed
  const [isImgFound, setIsImgFound] = useState(true);

  //whether page content is being loaded or not. changes to false once fetchImgInfo() is done fetching so blank page content doesn't show for a split second before Page Not Found content is displayed
  const [isLoading, setIsLoading] = useState(true);

  //on load, pull img from url parameter :imgPublic_Id (see app.js), and get user info for img author pfp and name
  useEffect(() => {
    async function fetchImgInfo() {
      await fetch(`${domain}/image/${imgPublic_Id}`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => {
            if (parsedJSON === "no image found") {
              setIsImgFound(false);
              setIsLoading(false);
            } else {
              setImgInfo(parsedJSON[0]);
              setIsLoading(false);
            }
          })
      );
    }
    fetchImgInfo();
  }, [isLiked, isPrevOrNextClicked, url, successfulEdit]);

  //fetch user info for pfp and author name
  useEffect(() => {
    console.log(imgInfo);
    if (imgInfo) {
      async function fetchUserInfo() {
        await fetch(`${domain}/${imgInfo.uploadedBy}/info`, {
          method: "GET",
          headers: { "Content-type": "application/json" },
        }).then((response) =>
          response
            .json()
            .then((resJSON) => JSON.stringify(resJSON))
            .then((stringJSON) => JSON.parse(stringJSON))
            .then((parsedJSON) => setUserInfo(parsedJSON[0]))
        );
      }

      fetchUserInfo();
    }
  }, [imgInfo]);

  //assigning user info to variables
  let imgAuthorPFP;
  let imgAuthorName;
  let imgAuthorName_hyphenated;
  if (userInfo) {
    imgAuthorPFP =
      userInfo.pfp.slice(0, 50) +
      "q_60/c_scale,w_200/dpr_auto/" +
      userInfo.pfp.slice(50, userInfo.pfp.lastIndexOf(".")) +
      ".jpg";
    imgAuthorName = userInfo.username;
    imgAuthorName_hyphenated = userInfo.username.split(" ").join("-");
  }

  //when edit btn is clicked, set isEditable to !isEditable
  const [isEditable, setIsEditable] = useState(false);

  //set title,description and tags to default if is editable is false
  useEffect(() => {
    if (!isEditable && imgInfo) {
      setTitle(imgInfo.title);
      setDescription(imgInfo.description);
      setTags(imgInfo.tags);
    }
  }, [isEditable]);

  //set title, description and tag input fields values to current img info
  //so user doesn't have to rewrite the entire title/desc/tags list and they can just edit it
  function displayEditorInfo() {
    setTimeout(() => {
      document.querySelector("#titleInputID").value = imgTitle;
      // setTitle(bulkArr.current[0].title);
      document.querySelector("#tagsInputID").value = editorTags; //makes the tags array display with ", " separating items instead of just a comma. To play nice with split to create array on submit
      // setTags(bulkArr.current[0].tags.join(", "));
      if (!imgInfo.description == "") {
        document.querySelector("#descriptionInputID").value = imgDescription;
      }
      // document.querySelector("#descriptionInputID").value = imgDescription;
      // setDescription(bulkArr.current[0].description);
    }, 100);
  }

  //for if curUser is the selected image's uploader - they can edit or delete it from image modal
  let editBtn;
  let deleteBtn;

  //edit button class to toggle when isEditable is true or not
  const [editBtnClass, setEditBtnClass] = useState("image-view-page__edit-btn");

  useEffect(() => {
    if (isEditable) {
      setEditBtnClass("image-view-page__edit-btn-active");
    } else {
      setEditBtnClass("image-view-page__edit-btn");
    }
  }, [isEditable]);

  //assigning img info to variables
  let imgSrc;
  // use this for paddingTop of skeleton loading div to get aspect ratio
  let aspectRatio;
  let paddingTop; //turn aspect ratio into percentage for paddingTop
  let elementBGColor; //use image (element) primary color as background color
  let imgTitle;
  let imgDescription;
  let imgLikes;
  let imgDownloadURL;
  let imgTags = [];
  let editorTags;
  let mainImgLikeBtn;
  //for tag list scroll animation
  let tagListIDWidth;
  let scrollByPxAmount;

  const [tagListScrollPosition, setTagListScrollPosition] = useState(0);
  if (imgInfo) {
    imgSrc =
      imgInfo.secure_url.slice(0, 50) +
      "q_60/c_scale,w_700/dpr_auto/" +
      imgInfo.secure_url.slice(50, imgInfo.secure_url.lastIndexOf(".")) +
      ".jpg";
    imgTitle = imgInfo.title;
    // use this for paddingTop of skeleton loading div to get aspect ratio
    aspectRatio = imgInfo.height / imgInfo.width;
    paddingTop = aspectRatio * 100; //turn aspect ratio into percentage for paddingTop
    elementBGColor = imgInfo.colors[0][0]; //use image (element) primary color as background color
    if (imgInfo.description == "") {
      imgDescription = <em>No Description Given</em>;
    } else {
      imgDescription = imgInfo.description;
    }

    imgLikes = imgInfo.likes;

    imgDownloadURL =
      imgInfo.secure_url.slice(0, 50) +
      "q_100/fl_attachment/" +
      imgInfo.secure_url.slice(50, imgInfo.secure_url.lastIndexOf("."));

    for (let i = 0; i < imgInfo.tags.length; i++) {
      imgTags.push(
        <li>
          <a
            href={`/search/${imgInfo.tags[i]}/?sort=most-recent&filter=all-types`}
          >
            {imgInfo.tags[i]}
          </a>
        </li>
      );
    }
    //tags with commas to display while editing
    editorTags = imgInfo.tags.join(", ");

    // searchQuery = imageTags.join(" ") + " " + imgPublic_Ide;

    if (imgInfo.likedBy.includes(curUser_real)) {
      mainImgLikeBtn = (
        <button
          className="image-view-page__main-like-button"
          onClick={(e) => handleMainLike(e)}
        >
          <FontAwesomeIcon
            icon={faHeart}
            className="image-view-page__main-like-button-icon-unliked image-view-page__main-like-button-icon-liked"
          ></FontAwesomeIcon>
          <div className="image-view-page__main-like-button-text">Unlike</div>
          <div className="image-view-page__main-like-button-text">
            {imgInfo.likedBy.length}
          </div>
        </button>
      );
    } else {
      mainImgLikeBtn = (
        <button
          className="image-view-page__main-like-button"
          onClick={(e) => handleMainLike(e)}
        >
          <FontAwesomeIcon
            icon={farHeart}
            className="image-view-page__main-like-button-icon-unliked"
          ></FontAwesomeIcon>
          <div className="image-view-page__main-like-button-text">Like</div>
          <div className="image-view-page__main-like-button-text">
            {imgInfo.likedBy.length}
          </div>
        </button>
      );
    }

    // if image.uploadedBy == imageauthorname, show edit and delete buttons
    if (imgInfo.uploadedBy == curUser_real) {
      editBtn = (
        <button
          className={editBtnClass}
          onClick={() => {
            setIsEditable(!isEditable);
            displayEditorInfo();
          }}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      );
      deleteBtn = (
        <button
          className="image-view-page__delete-btn"
          onClick={() => showDeleteYesOrNo()}
        >
          <FontAwesomeIcon icon={faTrash} />
          {deleteYesOrNo}
        </button>
      );
    }
  }

  //for tag list scroll animation
  useEffect(() => {
    if (!isEditable) {
      tagListIDWidth = document.querySelector("#tagListID").clientWidth;
      scrollByPxAmount = tagListIDWidth + tagListScrollPosition;
    }
  });

  //values to set editor form fields to
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [tags, setTags] = useState();

  useEffect(() => {
    //values to set editor form fields to
    if (imgInfo) {
      setTitle(imgInfo.title);
      setDescription(imgInfo.description);
      setTags(imgInfo.tags);
    }
  }, [imgInfo]);

  //don't accept special characters in title or tags
  const [titleClass, setTitleClass] = useState(
    "image-view-page__img-title-input"
  );
  const [tagClass, setTagClass] = useState("image-view-page__img-tags-input");
  const [tagSpecialMessage, setTagSpecialMessage] = useState("");
  const [titleSpecialMessage, setTitleSpecialMessage] = useState("");
  if (/[~`!#$%\^&*+=\\[\]\\;,/{}|\\":<>\?]/g.test(title)) {
    setTimeout(() => {
      setTitleClass("image-view-page__img-title-input-red");
      setTitleSpecialMessage(" No Special Characters");
    }, 10);
  } else if (!/[~`!#$%\^&*+=\\[\]\\;,/{}|\\":<>\?]/g.test(title)) {
    // console.log("no special");
    setTimeout(() => {
      setTitleClass("image-view-page__img-title-input");
      setTitleSpecialMessage("");
    }, 10);
  }
  if (/[~`!#$%\^&*+=\\[\]\\;/{}|\\":<>\?]/g.test(tags)) {
    setTimeout(() => {
      setTagClass("image-view-page__img-tags-input-red");
      setTagSpecialMessage(
        <p
          style={{
            lineHeight: "2.75",
            color: "red",
            display: "block",
            marginBottom: "0",
            marginTop: "-1rem",
          }}
        >
          No Special Characters
        </p>
      );
    }, 10);
  } else {
    // console.log("no special");
    setTimeout(() => {
      setTagClass("image-view-page__img-tags-input");
      setTagSpecialMessage("");
    }, 10);
  }

  //delete function. happens when user clicks Yes on deleteYesOrNo if they click the delete button in modal
  async function deleteImageFromBackEnd() {
    await fetch(`${domain}/deleteImage/`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ public_id: `picpocket/${imgPublic_Id}` }),
    })
      .then((res) => {
        if (!isScreenMobile) {
          setToastStatus("Success-modal");
          setToastMessage("Pic successfully deleted.");
          toastDissappear();
          //make deleteYesOrNo modal go away
          setDeleteYesOrNo();
          //go to home
          navigate(`/`);
        } else if (isScreenMobile) {
          setToastStatus("Success-mobile-modal");
          setToastMessage("Pic successfully deleted.");
          toastDissappear();
          //make deleteYesOrNo modal go away
          setDeleteYesOrNo();
          //go to home
          navigate(`/`);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!isScreenMobile) {
          setToastStatus("Error-modal");
          setToastMessage("Error. Deletion unsuccessful");
          toastDissappear();
          setDeleteYesOrNo();
        } else if (isScreenMobile) {
          setToastStatus("Error-mobile-modal");
          setToastMessage("Error. Deletion unsuccessful");
          toastDissappear();
          setDeleteYesOrNo();
        }
      });
  }

  //shows delete Are You Sure? box. On mobile (width < 650px) use window.alert. On desktop (width > 650px) use own modal.
  //asking if undefined to see if modal is up already or not. if it is not up, it is undefined.
  function showDeleteYesOrNo() {
    if (deleteYesOrNo === undefined && !isScreenMobile) {
      setDeleteYesOrNo(
        <div className="image-view-page__delete-yes-or-no">
          <p>
            This will <b>permanently</b> delete this pic from your account. Are
            you sure you want to delete this pic from your account?
          </p>

          <div className="image-view-page__delete-yes-or-no-btns">
            <button onClick={() => deleteImageFromBackEnd()}>Yes</button>
            <button onClick={() => setDeleteYesOrNo()}>No</button>
          </div>
        </div>
      );
    } else if (deleteYesOrNo === undefined && isScreenMobile) {
      if (
        window.confirm(
          "This will permanently delete this pic from your account. Are you sure you want to delete this pic from your account?"
        )
      ) {
        deleteImageFromBackEnd();
      }
    } else {
      setDeleteYesOrNo();
    }
  }

  //handle like for main image
  async function handleMainLike(e) {
    if (!isLoggedIn) {
      window.location.href = "/SignUp";
    } else {
      if (imgInfo.likedBy.includes(curUser_real)) {
        await fetch(
          `${domain}/removeLikedBy/${imgInfo.asset_id}/${curUser_real}`,
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
          }
        ).then((res) => {
          imgInfo.likedBy = imgInfo.likedBy.filter((user) => {
            return user !== curUser_real;
          });
        });
      } else if (!imgInfo.likedBy.includes(curUser_real)) {
        await fetch(
          `${domain}/addLikedBy/${imgInfo.asset_id}/${curUser_real}`,
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
          }
        ).then((res) => {
          imgInfo.likedBy.push(curUser_real);
        });
      }
      setIsLiked(!isLiked);
    }
  }

  //tag list scrolling
  //every time tag list is scrolled, fire useEffect to decide whether to show arrows or not
  //left arrow only shows when not at scroll position 0 (all the way to the left)
  //right arrow only shows when scroll position is under max scroll
  const [tagListMaxScroll, setTagListMaxScroll] = useState();

  useEffect(() => {
    showTagListArrowsBasedOnScrollPosition(
      tagListScrollPosition,
      tagListMaxScroll
    );
  }, [tagListScrollPosition]);

  const [tagLeftArrowClass, setTagLeftArrowClass] = useState("opacity0");
  const [tagRightArrowClass, setTagRightArrowClass] = useState("opacity0");

  //if tag list is scrollable, show right arrow. by default right arrow is opacity0.
  //fires once imgInfo is done fetching, therefore tag list actually exists
  useEffect(() => {
    const tagListID = document.querySelector("#tagListID");

    if (tagListID.clientWidth < tagListID.scrollWidth) {
      setTagRightArrowClass("image-view-page__img-tags-overflowArrowRight");
    } else {
      setTagRightArrowClass("opacity0");
    }
  }, [imgInfo]);

  const [tagsPaddingLeft, setTagsPaddingLeft] = useState();

  function showTagListArrowsBasedOnScrollPosition(
    tagListScrollPosition,
    tagListMaxScroll
  ) {
    //set to < 1 rather than == 0 because when using the left arrow button it would sit at 0.6666777 for some reason
    if (tagListScrollPosition < 1) {
      setTagLeftArrowClass(
        "image-view-page__img-tags-overflowArrowLeft opacity0"
      );
      setTagsPaddingLeft("padding-left-0");
    } else {
      setTagLeftArrowClass("image-view-page__img-tags-overflowArrowLeft");
      setTagsPaddingLeft();
    }
    if (tagListScrollPosition > tagListMaxScroll) {
      setTagRightArrowClass(
        "image-view-page__img-tags-overflowArrowRight opacity0"
      );
    } else {
      setTagRightArrowClass("image-view-page__img-tags-overflowArrowRight");
    }
  }

  //tag list scroll animation

  //left animation
  const element_left = document.querySelector("#tagListID");
  let start_left, previousTimeStamp_left;
  let done_left = false;

  function step_left(timestamp_left) {
    if (start_left === undefined) {
      start_left = timestamp_left;
    }
    const elapsed_left = timestamp_left - start_left;

    if (previousTimeStamp_left !== timestamp_left) {
      const count_left = Math.min(0.1 * elapsed_left, scrollByPxAmount);
      element_left.scrollBy(-count_left, 0);
      if (count_left === 1000) {
        done_left = true;
      }
    }

    if (elapsed_left < 1000) {
      previousTimeStamp_left = timestamp_left;
      if (!done_left) {
        window.requestAnimationFrame(step_left);
      }
    }
  }

  //right animation
  const element = document.querySelector("#tagListID");
  let start, previousTimeStamp;
  let done = false;

  function step(timestamp) {
    if (start === undefined) {
      start = timestamp;
    }
    const elapsed = timestamp - start;

    if (previousTimeStamp !== timestamp) {
      const count = Math.min(0.1 * elapsed, scrollByPxAmount);
      element.scrollBy(count, 0);
      if (count === scrollByPxAmount) {
        done = true;
      }
    }

    if (elapsed < 1000) {
      previousTimeStamp = timestamp;
      if (!done) {
        window.requestAnimationFrame(step);
      }
    }
  }

  //get related images
  //perform a search for title and tags and return an array of results
  //map over results array
  useEffect(() => {
    console.log(searchQuery);

    async function searchFetch() {
      await fetch(`${domain}/search/${searchQuery}/most-recent/all-types`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((response) =>
        response
          .json()
          .then((resJSON) => JSON.stringify(resJSON))
          .then((stringJSON) => JSON.parse(stringJSON))
          .then((parsedJSON) => setSearchArr(parsedJSON))
      );
    }
    searchFetch();
  }, [searchQuery]);

  useEffect(() => {
    console.log(searchArr);
    //use split to get an array split by the /
    //only output the public_id after the last /. last index of array meaning length-1
    //replace all spaces with dashes

    mapArr = searchArr.map((element, index) => {
      let parts = element.public_id.split("/");
      let result = parts[parts.length - 1];
      var likeButton;
      var count = -1;

      if (element.likedBy.includes(curUser_real)) {
        likeButton = (
          <div>
            <FontAwesomeIcon
              icon={faHeart}
              className="likeButtonHeart1 likeButtonLikedFill1"
            ></FontAwesomeIcon>
          </div>
        );
      } else {
        likeButton = (
          <div>
            <FontAwesomeIcon
              icon={farHeart}
              className="likeButtonHeart1"
            ></FontAwesomeIcon>
          </div>
        );
      }
      return (
        <div key={index} className="imgGalleryImgCont1">
          <a
            // onClick={() => {
            //   navigate(`/image/${element.title}`);
            // }}
            href={`https://picpoccket.com/image/${element.title}`}
          >
            <img
              src={
                element.secure_url.slice(0, 50) +
                "q_60/c_scale,w_1600/dpr_auto/" +
                element.secure_url.slice(
                  50,
                  element.secure_url.lastIndexOf(".")
                ) +
                ".jpg"
              }
              className="imgGalleryImg1"
              loading="lazy"
            ></img>
          </a>

          <div className="imgGalleryImgOverlay1">
            <a
              className="likeButtonContainer1"
              onClick={(e) => handleLike(e, element, index)}
            >
              {likeButton}
            </a>
            <a
              className="downloadButtonCont1"
              href={
                element.secure_url.slice(0, 50) +
                "q_100/fl_attachment/" +
                element.secure_url.slice(
                  50,
                  element.secure_url.lastIndexOf(".")
                )
              }
            >
              <FontAwesomeIcon
                icon={faDownload}
                className="downloadButton1"
              ></FontAwesomeIcon>
            </a>
            <a className="imgAuthor1">{element.uploadedBy}</a>
          </div>
        </div>
      );
    });
    setResultsMap(mapArr);
  }, [searchArr, isLiked]);

  //handle likes for related images
  async function handleLike(e, element, index) {
    if (!isLoggedIn) {
      window.location.href = "/SignUp";
    } else {
      var searchArrCopy = searchArr;
      console.log(searchArrCopy);

      if (searchArrCopy[index].likedBy.includes(curUser_real)) {
        await fetch(
          `${domain}/removeLikedBy/${element.asset_id}/${curUser_real}`,
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
          }
        ).then((res) => {
          searchArrCopy[index].likedBy = searchArrCopy[index].likedBy.filter(
            (user) => {
              return user !== curUser_real;
            }
          );
          setFetchArr(searchArrCopy);
          console.log("run 3");
        });
      } else if (!searchArrCopy[index].likedBy.includes(curUser_real)) {
        await fetch(
          `${domain}/addLikedBy/${element.asset_id}/${curUser_real}`,
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
          }
        ).then((res) => {
          searchArrCopy[index].likedBy.push(curUser_real);
          setFetchArr(searchArrCopy);
          console.log("run 4");
        });
      }
      setIsLiked(!isLiked);
    }
  }

  //img zoom stuff
  //change this on click of the main img to change it's class to either zoomed in or zoomed out class and style ternary for transform
  //zoomed out by default
  const [isImgZoomedIn, setIsImgZoomedIn] = useState(false);

  //get boundingclientrect of img when zoomed out and storing it so it doesn't change once it is zoomed in (scale 3)
  //waits for imgInfo to fetch so img is actually there to get the rect from
  //uses useRef to maintain original (zoomed out) rect
  let imgRect = useRef();
  let imgRectVal;
  useEffect(() => {
    imgRectVal = document.querySelector("#mainImg").getBoundingClientRect();
    imgRect.current = imgRectVal;
  }, [imgInfo, isImgZoomedIn]);

  //set transformOrigin to click position relative to the image element by subtrcting width/height from click position when clicking. top left is 0,0
  const [transformOriginState, setTransformOriginState] = useState();
  useEffect(() => {}, [imgInfo]);
  function handleImgClick(event) {
    setIsImgZoomedIn(!isImgZoomedIn);
    setTransformOriginState(
      `${event.clientX - imgRect.current.left}px ${
        event.clientY - imgRect.current.top
      }px`
    );
    console.log(event);
  }

  //get click position for inital transformOriginState
  const [clickPos, setClickPos] = useState({});
  function handleMouseMoveInitialOriginState(event) {
    setClickPos({ X: event.clientX, y: event.clientY });
  }

  //reset rect when zooming out so the img doesn't fly off the screen
  //set transformOrigin for first click using clickPos
  useEffect(() => {
    if (!isImgZoomedIn) {
      imgRect.current = document
        .querySelector("#mainImg")
        .getBoundingClientRect();
      setTransformOriginState(
        `${clickPos.X - imgRect.current.left}px ${
          clickPos.y - imgRect.current.top
        }px`
      );
      console.log("zoomed out");
    } else if (isImgZoomedIn) {
      setTransformOriginState(
        `${clickPos.X - imgRect.current.left}px ${
          clickPos.y - imgRect.current.top
        }px`
      );
      console.log("zomed in");
      imgRect.current = document
        .querySelector("#mainImg")
        .getBoundingClientRect();
    }
  }, [isImgZoomedIn]);

  //set transformOrigin once image is clicked (zoomed in) when mouse moves. this makes you able to look over the image with moving the mouse
  function handleMouseMove(event) {
    setTransformOriginState(
      `${event.clientX - imgRect.current.left}px ${
        event.clientY - imgRect.current.top
      }px`
    );
    // console.log(event.target.clientWidth);
  }

  return (
    <div onMouseMove={(event) => handleMouseMove(event)}>
      {!isShowingImageSelectModal && progressBar}
      {!isShowingImageSelectModal && (
        <Toast
          status={toastStatus}
          message={toastMessage}
          closeToast={closeToast}
        />
      )}
      {/* conditionally render modal based on state of isShowingImageSelectModal in app.js */}
      {isShowingImageSelectModal && (
        <Modal__ImageSelect
          domain={domain}
          isLoggedIn={isLoggedIn}
          curUser_real={curUser_real}
          curUser_hyphenated={curUser_hyphenated}
          imgTitleArrState={imgTitleArrState}
          setImgTitleArrState={setImgTitleArrState}
          isShowingImageSelectModal={isShowingImageSelectModal}
          setIsShowingImageSelectModal={setIsShowingImageSelectModal}
          mainLikeBtn={mainLikeBtn}
          imageURL={imageURL}
          imgInfo={imgInfo}
          userInfo={userInfo}
          successfulEdit={successfulEdit}
          setSuccessfulEdit={setSuccessfulEdit}
          isPrevOrNextClicked={isPrevOrNextClicked}
          setIsPrevOrNextClicked={setIsPrevOrNextClicked}
          prevPageForModal={prevPageForModal}
          setPrevPageForModal={setPrevPageForModal}
          imgGalleryScrollPosition={imgGalleryScrollPosition}
          setImgGalleryScrollPosition={setImgGalleryScrollPosition}
          imgToLoadInFirstModal={imgToLoadInFirstModal}
        />
      )}
      <NavbarComponent
        domain={domain}
        curUser_real={curUser_real}
        curUser_hyphenated={curUser_hyphenated}
        isLoggedIn={isLoggedIn}
        navPositionClass={"fixed"}
        navColorClass={"white"}
      />
      {!isLoading && !isImgFound && (
        <div className="not-found-page__contents-container">
          <div className="not-found-page__icon">
            <FontAwesomeIcon icon={faQuestionCircle} />
          </div>
          <div className="not-found-page__message">
            Sorry, this page could not be found.
          </div>
          <div className="not-found-page__link">
            <a href="/">Go Back Home</a>
          </div>
        </div>
      )}
      {!isLoading && isImgFound && (
        <div className="image-view-page__top-bar-height-margin">margin</div>
      )}
      {!isLoading && isImgFound && (
        <div className="image-view-page__top-bar-container">
          <div className="image-view-page__top-bar-contents">
            <div className="image-view-page__image-author-link-container">
              <div className="image-view-page__image-author-pfp-div">
                <a
                  className="image-view-page__image-author-pfp"
                  href={`/User/${imgAuthorName_hyphenated}`}
                >
                  <img
                    src={imgAuthorPFP}
                    className="image-view-page__image-author-pfp"
                    loading="lazy"
                  />
                </a>
              </div>

              <a
                href={`/User/${imgAuthorName_hyphenated}`}
                className="image-view-page__image-author-name"
              >
                {imgAuthorName}
              </a>
            </div>
            <div className="image-view-page__top-bar-buttons-container">
              {mainImgLikeBtn}
              <a
                className="image-view-page__download-button"
                href={imgDownloadURL}
              >
                Free Download
              </a>
              {editBtn}
              {deleteBtn}
            </div>
          </div>
        </div>
      )}
      <div
        className={`${
          !isImgFound ? "displayNone" : "image-view-page__container"
        }`}
      >
        <div className="image-view-page__img-container">
          {/* <div
            style={{
              // width: `${imgInfo.width}px`,
              paddingTop: `${paddingTop}%`,
              height: "100px", //for some reason, adding an artbitrary height knocks off that extra couple hundred pixels off the bottom.
              background: `${elementBGColor}`,
              color: `${elementBGColor}`,
            }}
          > */}
          <img
            id="mainImg"
            src={imgSrc}
            className={`${
              isImgZoomedIn
                ? "image-view-page__img-zoomed-in"
                : "image-view-page__img-zoomed-out"
            }`}
            onClick={(event) => {
              handleImgClick(event);
              handleMouseMoveInitialOriginState(event);
            }}
            // onClick={(event) => {

            // }}
            style={{
              // transform: isImgZoomedIn ? `scale(3)` : "scale(1)",
              transformOrigin: transformOriginState,
            }}
            loading="lazy"
          ></img>
          {/* </div> */}
        </div>
        <div className="image-view-page__img-info-container">
          {isEditable && (
            <form onSubmit={(e) => submitForm(e)}>
              <p style={{ lineHeight: "0", color: "red" }}>
                {titleSpecialMessage}
              </p>
              <input
                id="titleInputID"
                placeholder={imgTitle}
                className={titleClass}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={titleInputMaxLength}
              ></input>
              <input
                id="descriptionInputID"
                placeholder={imgDescription}
                className="image-view-page__img-description-input"
                onChange={(e) => setDescription(e.target.value)}
                maxLength={70}
              ></input>
              <p className="image-view-page__description-char-count">
                {description.length}/{70}
              </p>
              <div className="image-view-page__img-tags-input-container">
                <p
                  style={{
                    marginTop: "4rem",
                    lineHeight: "1",
                    marginBottom: "0.95rem",
                    fontWeight: "300",
                  }}
                >
                  Tags (Use commas. Ex: tag, tags)
                </p>
                {tagSpecialMessage}
                <div className="image-view-page__img-tags-input-and-btns-container">
                  <input
                    id="tagsInputID"
                    placeholder={editorTags}
                    className={tagClass}
                    onChange={(e) => setTags(e.target.value.split(", "))}
                  ></input>
                  <div className="image-view-page__img-tags-input-container-btns-container">
                    <button
                      type="button"
                      className="image-view-page__img-tags-input-container-btns-container-cancel-btn"
                      onClick={() => setIsEditable(false)}
                    >
                      Cancel
                    </button>
                    {submitButton}
                  </div>
                </div>
              </div>
            </form>
          )}
          {!isEditable && (
            <div className="image-view-page__img-title">{imgTitle}</div>
          )}
          {!isEditable && (
            <div className="image-view-page__img-description">
              {imgDescription}
            </div>
          )}
        </div>
        {!isEditable && (
          <div className={`image-view-page__tag-arrow-bounds padding-left-0`}>
            <div
              className={tagLeftArrowClass}
              onClick={() => window.requestAnimationFrame(step_left)}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="image-view-page__img-tags-arrowIcon"
              />
            </div>
            <div
              className={tagRightArrowClass}
              onClick={() => window.requestAnimationFrame(step)}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="image-view-page__img-tags-arrowIcon"
              />
            </div>
            <div
              id="tagListID"
              className="image-view-page__img-tags-container"
              onScroll={(e) => {
                setTagListScrollPosition(e.target.scrollLeft);
                setTagListMaxScroll(
                  e.target.scrollWidth - e.target.clientWidth - 1
                );
              }}
            >
              <div className="image-view-page__img-tags-list">
                <ul>{imgTags}</ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewPage;
