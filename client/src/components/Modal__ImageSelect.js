import { React, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faXmark,
  faHeart,
  faPenToSquare,
  faCheck,
  faTrash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import Toast from "./Toast";
import ProgressBar from "./ProgressBar";

const Modal__ImageSelect = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
  imgTitleArrState,
  setImgTitleArrState,
  isShowingImageSelectModal,
  setIsShowingImageSelectModal,
  imgInfo,
  userInfo,
  setIsPrevOrNextClicked,
  isPrevOrNextClicked,
  prevPageForModal,
  setPrevPageForModal,
  imgGalleryScrollPosition,
  setImgGalleryScrollPosition,
  imgToLoadInFirstModal,
}) => {
  // BUGS
  // when editing and not filling in a field, it submits it as undefined instead of the current info
  // image modal info doesn't update after submit
  //img title url or imgtitlearrstate doesn't update with the random number given from fetch
  useEffect(() => {
    console.log(imgTitleArrState, " img title arr state");
  });
  //when modal is open, set body overflow to hidden. for some reason classlist.add wasn't working it was glitching on and off
  document.body.style.overflow = "hidden";

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
    <button style={{ color: "blue" }}>Submit</button>
  );

  //submit when editing image info
  async function submitForm(e) {
    e.preventDefault();
    console.log(title, " title ", description, " desc ", tags, " tags ");
    // if (
    //   titleClass == "my-pics-editor__editor-form-details-sub-containerInputRed"
    // ) {
    //   return;
    // }
    // setProgressBar();

    // setSubmitButton(
    //   <button style={{ pointerEvents: "none", backgroundColor: "#e7e7e7" }}>
    //     Submit{" "}
    //     <FontAwesomeIcon
    //       icon={faSpinner}
    //       className="fa-spin"
    //       style={{ marginLeft: "0.4rem" }}
    //     />
    //   </button>
    // );
    // // if (isScreenMobile) {
    // // setMobileSubmitButton(
    // //   <button
    // //     style={{
    // //       backgroundColor: "#e7e7e7",
    // //       border: "none",
    // //       color: "green",
    // //       pointerEvents: "none",
    // //       fontSize: "1.55rem",
    // //       display: "flex",
    // //       justifyContent: "center",
    // //       alignContent: "center",
    // //       paddingTop: "0.25rem",
    // //     }}
    // //   >
    // //     <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
    // //   </button>
    // // );
    // // }
    // //make everything unclickable until submit is finished
    // const allElements = document.querySelectorAll("*");
    // allElements.forEach((element) => {
    //   element.classList.add("pointer-events__none");
    // });
    // //start progress bar
    // setProgressBar(<ProgressBar playStatus="play" />);
    // //set up tags to send in fetch POST
    // let sendTags;
    // //if tags actually have something in them upon submit
    // if (tags != "") {
    //   sendTags = tags.split(", "); //turn string into array
    // } else if (tags == "") {
    //   sendTags = [];
    // }

    // // bulkArr.current[0].imageType = imageType.toLowerCase();
    // console.log("submit attempt");
    // await fetch(`${domain}/update/${curUser_real}`, {
    //   method: "PUT",
    //   headers: { "Content-type": "application/json" },
    //   body: JSON.stringify({
    //     title: title,
    //     description: description,
    //     tags: sendTags,
    //     imageType: imgInfo.imageType,
    //     colors: imgInfo.colors,
    //     likes: imgInfo.likes,
    //     likedBy: imgInfo.likedBy,
    //     public_id: `picpocket/${imgPublic_Id}`,
    //   }),
    // }).then((res) => {
    //   //make progress bar finish
    //   setProgressBar(<ProgressBar playStatus="finish" />);
    //   // //set progress bar to default after it finishes
    //   setTimeout(() => {
    //     setProgressBar();
    //   }, 500);
    //   allElements.forEach((element) => {
    //     element.classList.remove("pointer-events__none");
    //   });
    //   if (!isScreenMobile) {
    //     setToastStatus("Success-modal");
    //     setToastMessage("Your pic was updated successfully.");
    //     toastDissappear();
    //     //make deleteYesOrNo modal go away if it is open
    //     setDeleteYesOrNo();
    //     //set img info stuff to new info
    //     imgTitle = title;
    //     imgDescription = description;
    //     imgTags = tags;
    //     //set is editable to false to turn inputs back into divs
    //     setIsEditable(false);
    //     //change current title of current item in imgTitleArrState to new updated title
    //     imgTitleArrState[currentImgIndex] = title;
    //     //go to new image title url
    //     navigate(`/image/${title}`);
    //   } else if (isScreenMobile) {
    //     setToastStatus("Success-mobile-modal");
    //     setToastMessage("Your pic was updated successfully.");
    //     toastDissappear();
    //     //make deleteYesOrNo modal go away if it is open
    //     setDeleteYesOrNo();
    //     //set is editable to false to turn inputs back into divs
    //     setIsEditable(false);
    //     //change current title of current item in imgTitleArrState to new updated title
    //     imgTitleArrState[currentImgIndex] = title;
    //     //go to new image title url
    //     navigate(`/image/${title}`);
    //   }
    //   setSubmitButton(<button style={{ color: "blue" }}>Submit</button>);
    //   // setMobileSubmitButton(
    //   //   <button
    //   //     style={{
    //   //       backgroundColor: "rgb(250, 250, 250)",
    //   //       border: "2px solid darkgreen",
    //   //       color: "green",
    //   //     }}
    //   //   >
    //   //     <FontAwesomeIcon icon={faCheck} />
    //   //   </button>
    //   // );
    // });
    // // .catch((err) => notify_edit_failure);
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

  //amount of pages to jump back when clicking out of modal to get back to previous page before going into modal
  const [amountOfPagesToJumpBack, setAmountOfPagesToJumpBack] = useState(-1);

  //to navigate
  let navigate = useNavigate();

  //img info
  const { imgPublic_Id } = useParams();

  //refetch img info to update like button to either liked or not liked
  const [isLiked, setIsLiked] = useState();

  //delete Are You Sure? box. On mobile (width < 650px) use window.alert. On desktop (width > 650px) use own modal.
  const [deleteYesOrNo, setDeleteYesOrNo] = useState();

  //assigning user info to variables (user info comes from ImageViewPage)
  let imgAuthorPFP = imgToLoadInFirstModal.imgAuthorPFP;
  let imgAuthorName = imgToLoadInFirstModal.imgAuthorName;
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

  //assigning img info to variables (img info comes from ImageViewPage)
  let imgSrc = imgToLoadInFirstModal.imgSrc;
  let imgTitle = imgToLoadInFirstModal.title;
  let imgDescription = imgToLoadInFirstModal.description;
  let imgLikes = imgToLoadInFirstModal.likes;
  let imgDownloadURL = imgToLoadInFirstModal.imgDownloadURL;
  let imgTags = imgToLoadInFirstModal.imgTags;
  let editorTags;
  let imageSelectModalLikeBtn;
  //to load like button before fetch
  if (imgToLoadInFirstModal.isImgLiked) {
    imageSelectModalLikeBtn = (
      <button
        className="image-select-modal__main-like-button"
        onClick={(e) => handleMainLike(e)}
      >
        <FontAwesomeIcon
          icon={faHeart}
          className="image-select-modal__main-like-button-icon-unliked image-select-modal__main-like-button-icon-liked"
        ></FontAwesomeIcon>
        <div className="image-select-modal__main-like-button-text">Unlike</div>
        <div className="image-select-modal__main-like-button-text">
          {/* {imgInfo.likedBy.length} */}
        </div>
      </button>
    );
  } else {
    imageSelectModalLikeBtn = (
      <button
        className="image-select-modal__main-like-button"
        onClick={(e) => handleMainLike(e)}
      >
        <FontAwesomeIcon
          icon={farHeart}
          className="image-select-modal__main-like-button-icon-unliked"
        ></FontAwesomeIcon>
        <div className="image-select-modal__main-like-button-text">Like</div>
        <div className="image-select-modal__main-like-button-text">
          {/* {imgInfo.likedBy.length} */}
        </div>
      </button>
    );
  }

  //for tag list scroll animation
  let tagListIDWidth;
  let scrollByPxAmount;
  const [tagListScrollPosition, setTagListScrollPosition] = useState(0);

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

  //for if curUser is the selected image's uploader - they can edit or delete it from image modal
  let editBtn;
  let deleteBtn;

  if (imgInfo) {
    imgSrc =
      imgInfo.secure_url.slice(0, 50) +
      "q_60/c_scale,w_700/dpr_auto/" +
      imgInfo.secure_url.slice(50, imgInfo.secure_url.lastIndexOf(".")) +
      ".jpg";
    imgTitle = imgInfo.title;
    if (imgInfo.description == "") {
      imgDescription = "No Description Given";
    } else {
      imgDescription = imgInfo.description;
    }

    imgLikes = imgInfo.likes;

    imgDownloadURL =
      imgInfo.secure_url.slice(0, 50) +
      "q_100/fl_attachment/" +
      imgInfo.secure_url.slice(50, imgInfo.secure_url.lastIndexOf("."));

    imgTags = [];
    for (let i = 0; i < imgInfo.tags.length; i++) {
      imgTags.push(
        <li>
          <a
            href={`/search/${imgInfo.tags[i]}?sort=most-recent&filter=all-types`}
          >
            {imgInfo.tags[i]}
          </a>
        </li>
      );
    }
    //tags with commas to display while editing
    editorTags = imgInfo.tags.join(", ");

    if (imgInfo.likedBy.includes(curUser_real)) {
      imageSelectModalLikeBtn = (
        <button
          className="image-select-modal__main-like-button"
          onClick={(e) => handleMainLike(e)}
        >
          <FontAwesomeIcon
            icon={faHeart}
            className="image-select-modal__main-like-button-icon-unliked image-select-modal__main-like-button-icon-liked"
          ></FontAwesomeIcon>
          <div className="image-select-modal__main-like-button-text">
            Unlike
          </div>
          <div className="image-select-modal__main-like-button-text">
            {imgInfo.likedBy.length}
          </div>
        </button>
      );
    } else {
      imageSelectModalLikeBtn = (
        <button
          className="image-select-modal__main-like-button"
          onClick={(e) => handleMainLike(e)}
        >
          <FontAwesomeIcon
            icon={farHeart}
            className="image-select-modal__main-like-button-icon-unliked"
          ></FontAwesomeIcon>
          <div className="image-select-modal__main-like-button-text">Like</div>
          <div className="image-select-modal__main-like-button-text">
            {imgInfo.likedBy.length}
          </div>
        </button>
      );
    }
    //for tag list scroll animation
    tagListIDWidth = document.querySelector("#tagListID").clientWidth;
    scrollByPxAmount = tagListIDWidth + tagListScrollPosition;

    // if image.uploadedBy == imageauthorname, show edit and delete buttons
    if (imgInfo.uploadedBy == curUser_real) {
      editBtn = (
        <button
          className="image-select-modal__edit-btn"
          onClick={() => setIsEditable(!isEditable)}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      );
      deleteBtn = (
        <button
          className="image-select-modal__delete-btn"
          onClick={() => showDeleteYesOrNo()}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      );
    }
  }

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
  } else if (title == "") {
    setTimeout(() => {
      setTitleClass(
        "my-pics-editor__editor-form-details-sub-containerInputRed"
      );
      setSpecialMessage(" Must Have Name");
    }, 10);
  } else {
    // console.log("no special");
    setTimeout(() => {
      setTitleClass("my-pics-editor__editor-form-details-sub-containerInput");
      setSpecialMessage("");
    }, 10);
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
      setTagRightArrowClass("image-select-modal__img-tags-overflowArrowRight");
    } else {
      setTagRightArrowClass("opacity0");
    }
  }, [imgInfo]);

  function showTagListArrowsBasedOnScrollPosition(
    tagListScrollPosition,
    tagListMaxScroll
  ) {
    //set to < 1 rather than == 0 because when using the left arrow button it would sit at 0.6666777 for some reason
    if (tagListScrollPosition < 1) {
      setTagLeftArrowClass(
        "image-select-modal__img-tags-overflowArrowLeft opacity0"
      );
    } else {
      setTagLeftArrowClass("image-select-modal__img-tags-overflowArrowLeft");
    }
    if (tagListScrollPosition > tagListMaxScroll) {
      setTagRightArrowClass(
        "image-select-modal__img-tags-overflowArrowRight opacity0"
      );
    } else {
      setTagRightArrowClass("image-select-modal__img-tags-overflowArrowRight");
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

  //handle like
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

  //img zoom stuff
  //change this on click of the main img to change it's class to either zoomed in or zoomed out class and style ternary for transform
  //zoomed out by default
  const [isImgZoomedIn, setIsImgZoomedIn] = useState(false);

  //get boundingclientrect of img when zoomed out and storing it so it doesn't change once it is zoomed in (scale 3)
  //waits for imgInfo to fetch so img is actually there to get the rect from
  //uses useRef to maintain original (zoomed out) rect
  let imgRect = useRef();
  let imgRectVal;
  //get modal contents container height to use for black background's height
  let modal = useRef();
  let modalVal;
  useEffect(() => {
    if (imgInfo) {
      imgRectVal = document.querySelector("#mainImg").getBoundingClientRect();
      imgRect.current = imgRectVal;
    }
    modalVal = document.querySelector("#modal").getBoundingClientRect();
    modal.current = modalVal.height;
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
    } else if (isImgZoomedIn) {
      setTransformOriginState(
        `${clickPos.X - imgRect.current.left}px ${
          clickPos.y - imgRect.current.top
        }px`
      );
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

  //reset zoom stuff when prev or next arrow is clicked to go to a different image
  useEffect(() => {
    setIsImgZoomedIn(false);
    setTransformOriginState();
  }, [isPrevOrNextClicked]);

  //index of current img in title array to get prev and next links for next and previous arrow links (see html conditional rendering)
  let currentImgIndex = imgTitleArrState.indexOf(`${imgPublic_Id}`);

  //when user deletes an image, filter the imgTitleArr to remove the deleted item from the array
  //so user can no longer go back or forward to land on the deleted image
  function filterImgTitleArr() {
    setImgTitleArrState(
      imgTitleArrState.filter(
        (imageTitle) => imageTitle !== imgInfo.public_id.slice(10)
      )
    );
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
          //take deleted image title out of imgTitleArrState
          filterImgTitleArr();
          //go to next image in list
          navigate(`/image/${imgTitleArrState[currentImgIndex + 1]}`);
        } else if (isScreenMobile) {
          setToastStatus("Success-mobile-modal");
          setToastMessage("Pic successfully deleted.");
          toastDissappear();
          //make deleteYesOrNo modal go away
          setDeleteYesOrNo();
          //take deleted image title out of imgTitleArrState
          filterImgTitleArr();
          //go to next image in list
          navigate(`/image/${imgTitleArrState[currentImgIndex + 1]}`);
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
  function showDeleteYesOrNo() {
    if (deleteYesOrNo === undefined && !isScreenMobile) {
      setDeleteYesOrNo(
        <div className="image-select-modal__delete-yes-or-no">
          <p>
            This will <b>permanently</b> delete this pic from your account. Are
            you sure you want to delete this pic from your account?
          </p>

          <div className="image-select-modal__delete-yes-or-no-btns">
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

  return (
    <div
      className="image-select-modal__container"
      onMouseMove={(event) => handleMouseMove(event)}
    >
      {progressBar}
      <Toast
        status={toastStatus}
        message={toastMessage}
        closeToast={closeToast}
      />
      <div
        className="image-select-modal__background"
        onClick={() => {
          //navigate to previous page
          // navigate(amountOfPagesToJumpBack);
          navigate(prevPageForModal);
          //set body overflow back to auto when closing modal
          //delayed to make sure it changes the next page's document.body instead of the modal's document.body
          setTimeout(() => {
            document.body.style.overflow = "auto";
          }, 50);
          //make delete yes or no modal go away if it is open
          setDeleteYesOrNo();
        }}
        style={{ height: `100vh` }} //get height of modal contents container and use that for height of black bg
      ></div>
      <div className="image-select-modal__contents-container" id="modal">
        <FontAwesomeIcon
          icon={faXmark}
          className="image-select-modal__x-icon"
          onClick={() => {
            //navigate to previous page
            // navigate(amountOfPagesToJumpBack);
            navigate(prevPageForModal);
            //set body overflow back to auto when closing modal
            //delayed to make sure it changes the next page's document.body instead of the modal's document.body
            setTimeout(() => {
              document.body.style.overflow = "auto";
            }, 50);
            //make delete yes or no modal go away if it is open
            setDeleteYesOrNo();
          }}
          style={{ cursor: "pointer" }}
        />
        {currentImgIndex > 0 && (
          <a
            onClick={() => {
              navigate(`/image/${imgTitleArrState[currentImgIndex - 1]}`);
              setIsPrevOrNextClicked(!isPrevOrNextClicked);
              setIsShowingImageSelectModal(true);
              setAmountOfPagesToJumpBack(amountOfPagesToJumpBack - 1);
              //make delete yes or no modal go away if it is open
              setDeleteYesOrNo();
            }}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="image-select-modal__left-arrow-icon"
            />
          </a>
        )}
        {currentImgIndex < imgTitleArrState.length - 1 && (
          <a
            onClick={() => {
              navigate(`/image/${imgTitleArrState[currentImgIndex + 1]}`);
              setIsPrevOrNextClicked(!isPrevOrNextClicked);
              setIsShowingImageSelectModal(true);
              //subtract from amount of pages to jump back because that's how navigate works
              //to jump back one page it is navigate(-1). to jump back 5 pages it is -5.
              setAmountOfPagesToJumpBack(amountOfPagesToJumpBack - 1);
              //make delete yes or no modal go away if it is open
              setDeleteYesOrNo();
            }}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className="image-select-modal__right-arrow-icon"
            />
          </a>
        )}

        <div className="image-select-modal__top-bar-container">
          <div className="image-select-modal__image-author-link-container">
            <div className="image-select-modal__image-author-pfp-div">
              <a
                className="image-select-modal__image-author-pfp"
                href={`/User/${imgAuthorName_hyphenated}`}
              >
                <img
                  src={imgAuthorPFP}
                  className="image-select-modal__image-author-pfp"
                  loading="lazy"
                />
              </a>
            </div>

            <a
              href={`/User/${imgAuthorName_hyphenated}`}
              className="image-select-modal__image-author-name"
            >
              {imgAuthorName}
            </a>
          </div>
          <div className="image-select-modal__top-bar-buttons-container">
            {imageSelectModalLikeBtn}
            <a
              className="image-select-modal__download-button"
              href={imgDownloadURL}
            >
              Free Download
            </a>
            {editBtn}
            {deleteBtn}
            {deleteYesOrNo}
          </div>
        </div>

        <div className="image-select-modal__img-container">
          <div className="image-select-modal__img-height-spacing"></div>
          <img
            id="mainImg"
            src={imgSrc}
            className={`${
              isImgZoomedIn
                ? "image-select-modal__img-zoomed-in"
                : "image-select-modal__img-zoomed-out"
            }`}
            onClick={(event) => {
              handleImgClick(event);
              handleMouseMoveInitialOriginState(event);
            }}
            // onMouseMove={(event) => {
            //   handleMouseMoveInitialOriginState(event);
            // }}
            style={{
              // transform: isImgZoomedIn ? `scale(3)` : "scale(1)",
              transformOrigin: transformOriginState,
            }}
            loading="lazy"
          ></img>
        </div>
        <div className="image-select-modal__img-info-container">
          {isEditable && (
            <form onSubmit={(e) => submitForm(e)}>
              <input
                placeholder={imgTitle}
                className="image-select-modal__img-title-input"
                onChange={(e) => setTitle(e.target.value)}
              ></input>
              <input
                placeholder={imgDescription}
                className="image-select-modal__img-description-input"
                onChange={(e) => setDescription(e.target.value)}
              ></input>
              <div className="image-select-modal__img-tags-input-container">
                <p>Tags (Use commas. Ex: tag, tags)</p>
                <div className="image-select-modal__img-tags-input-and-btns-container">
                  <input
                    placeholder={editorTags}
                    className="image-select-modal__img-tags-input"
                    onChange={(e) => setTags(e.target.value)}
                  ></input>
                  <div className="image-select-modal__img-tags-input-container-btns-container">
                    <button
                      style={{ color: "#b20000" }}
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
            <div className="image-select-modal__img-title">{imgTitle}</div>
          )}
          {!isEditable && (
            <div className="image-select-modal__img-description">
              <em>{imgDescription}</em>
            </div>
          )}
        </div>
        {!isEditable && (
          <div style={{ width: "100%", position: "relative" }}>
            <div
              className={tagLeftArrowClass}
              onClick={() => window.requestAnimationFrame(step_left)}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="image-select-modal__img-tags-arrowIcon"
              />
            </div>
            <div
              className={tagRightArrowClass}
              onClick={() => window.requestAnimationFrame(step)}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="image-select-modal__img-tags-arrowIcon"
              />
            </div>
            <div
              id="tagListID"
              className="image-select-modal__img-tags-container"
              onScroll={(e) => {
                setTagListScrollPosition(e.target.scrollLeft);
                setTagListMaxScroll(
                  e.target.scrollWidth - e.target.clientWidth - 1
                );
              }}
            >
              <div className="image-select-modal__img-tags-list">
                <ul>{imgTags}</ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal__ImageSelect;
