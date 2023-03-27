import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/useAuthContext";
//components
import Footer from "./components/Footer";

//pages
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";
import CreditsPage from "./pages/CreditsPage";
import ChangePasswordPage from "./pages/AccountManipulationPages/ChangePasswordPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import EmailVerifyPage from "./pages/AccountManipulationPages/EmailVerifyPage";
import ForgotPasswordResetPage from "./pages/AccountManipulationPages/ForgotPasswordPages/ForgotPasswordResetPage";
import ImageViewPage from "./pages/ImageViewPage";
import LikesPage from "./pages/MyLikes/LikesPage";
import MyPicsPage from "./pages/MyPics/MyPicsPages";
import MainPage from "./pages/MainPage/MainPage";
import NotFoundPage from "./pages/NotFoundPage";
import PasswordChangeSuccessPage from "./pages/AccountManipulationPages/PasswordChangeSuccessPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import SendForgotPasswordPage from "./pages/AccountManipulationPages/ForgotPasswordPages/ForgotPasswordSendLinkPage";
import SignInPage from "./pages/AccountManipulationPages/SignInPage";
import SignUpPage from "./pages/AccountManipulationPages/SignUpPage";
import SignUpSuccessPage from "./pages/AccountManipulationPages/SignUpSuccessPage";
import SearchResultPage from "./pages/SearchResultsPages/SearchResultPage";
import TOSPage from "./pages/TOSPage";
import UserSettingsPage from "./pages/AccountManipulationPages/UserSettingsPage";
import UserPage from "./pages/UserPage";
import UploadPage from "./pages/UploadPage";

//bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  //domain for fetch routes. either localhost or heroku depending on if you are developing or building to deploy to netlify
  let domain = "http://localhost:5000";
  // let domain = "https://localhost:5000";
  // let domain = "https://picpoccket.herokuapp.com";

  //When someone deletes their account, they will be navigated back to main page
  //and a red banner will show saying their account has successfully been deleted
  //until they refresh or go to a different page to reset the state to false.
  const [isJustDeleted, setIsJustDeleted] = useState(false);

  //banner for upload page for when you have just verified your email to be able to upload (green banner)
  const [isJustVerified, setIsJustVerified] = useState(false);

  //banner on sign in page that appears right after you send a forgot password link to your email
  const [resetPasswordLinkJustSent, setResetPasswordLinkJustSent] =
    useState(false);

  //used to show image select modal or not
  const [isShowingImageSelectModal, setIsShowingImageSelectModal] =
    useState(false);
  //store image being clicked on to show modal here so it loads instantly when modal first comes up
  const [imgToLoadInFirstModal, setImgToLoadInFirstModal] = useState();

  // scroll position user is currently at when clicking an image in an image gallery
  // when user clicks an image, it stores the current scroll position (code is in ImageGallery component)
  // When user clicks out of the image modal, it navigates back to previous page (not previous image if user used arrow buttons to go to a different image)
  // And that page does window.scrollTo(imgGalleryScrollPosition) to scroll to the stored scroll position
  // Making it seem like the modal is just popping up over the page and not going to a whole new page
  // and so user is right back where they left off when they were looking at the image gallery
  const [imgGalleryScrollPosition, setImgGalleryScrollPosition] = useState();

  // //page to go to when clicking out of image select modal
  // let URL = window.location.href;
  // //get position of third slash. The reason you want third slash is because you don't want the slashes in "http://", you want the first slash after that to indicate the actual path beginning
  // //indexOf accepts ("x", [fromIndex]), so you want to find secondSlash by searching from the firstSlash position onward. Etc.
  // let firstSlashPosition = URL.indexOf("/");
  // let secondSlashPosition = URL.indexOf("/", firstSlashPosition + 1);
  // let thirdSlashPosition = URL.indexOf("/", secondSlashPosition + 1);
  // let prevPageResult = URL.slice(thirdSlashPosition);
  // const [prevPageForModal, setPrevPageForModal] = useState(prevPageResult);

  //used to give array of img titles to imageview page to use for imageSelectModal
  //to fetch img src and to go to previous or next image
  const [imgTitleArrState, setImgTitleArrState] = useState();

  //set true or false for if user just signed up. use to decide whether to show sign up success page
  const [isJustSignedUp, setIsJustSignedUp] = useState(false);

  //set true or false for if user just changed password. use to decide whether to show password change success page
  const [isPasswordJustChanged, setIsPasswordJustChanged] = useState(false);

  console.log("render");

  //get user from AuthContext
  const { user } = useAuthContext();
  //set curUser to user.name
  const [curUser_hyphenated, setCurUser_hyphenated] = useState();
  const [curUser_real, setCurUser_real] = useState();
  //set logged in to true/false depending on if user from AuthContext is null or not
  const [isLoggedIn, setIsLoggedIn] = useState();
  useEffect(() => {
    if (user !== null) {
      setCurUser_real(user.name);
      setCurUser_hyphenated(user.name.split(" ").join("-"));
      setIsLoggedIn(true);
      console.log(isLoggedIn);
    } else {
      setCurUser_real();
      setCurUser_hyphenated();
      setIsLoggedIn(false);
    }
  }, [user]);

  //to avoid having no curUser for a split second when app loads
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, []);
  if (!isLoading) {
    return (
      <div className="app">
        <Routes>
          <Route
            path="*"
            element={
              <NotFoundPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/"
            element={
              <MainPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
                isJustDeleted={isJustDeleted}
                setIsJustDeleted={setIsJustDeleted}
                isShowingImageSelectModal={isShowingImageSelectModal}
                setIsShowingImageSelectModal={setIsShowingImageSelectModal}
                imgGalleryScrollPosition={imgGalleryScrollPosition}
                setImgGalleryScrollPosition={setImgGalleryScrollPosition}
                imgTitleArrState={imgTitleArrState}
                setImgTitleArrState={setImgTitleArrState}
                setImgToLoadInFirstModal={setImgToLoadInFirstModal}
                page={"mainPageMostRecent"}
              />
            }
          ></Route>
          <Route
            path="/most-popular"
            element={
              <MainPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
                isJustDeleted={isJustDeleted}
                setIsJustDeleted={setIsJustDeleted}
                isShowingImageSelectModal={isShowingImageSelectModal}
                setIsShowingImageSelectModal={setIsShowingImageSelectModal}
                imgGalleryScrollPosition={imgGalleryScrollPosition}
                setImgGalleryScrollPosition={setImgGalleryScrollPosition}
                imgTitleArrState={imgTitleArrState}
                setImgTitleArrState={setImgTitleArrState}
                page={"mainPageMostPopular"}
              />
            }
          ></Route>
          <Route
            path="/search/:searchQuery"
            element={
              <SearchResultPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
                isShowingImageSelectModal={isShowingImageSelectModal}
                setIsShowingImageSelectModal={setIsShowingImageSelectModal}
                imgGalleryScrollPosition={imgGalleryScrollPosition}
                setImgGalleryScrollPosition={setImgGalleryScrollPosition}
                imgTitleArrState={imgTitleArrState}
                setImgTitleArrState={setImgTitleArrState}
              />
            }
          ></Route>
          <Route
            path="/image/:imgPublic_Id"
            element={
              <ImageViewPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
                isShowingImageSelectModal={isShowingImageSelectModal}
                setIsShowingImageSelectModal={setIsShowingImageSelectModal}
                imgTitleArrState={imgTitleArrState}
                setImgTitleArrState={setImgTitleArrState}
                // prevPageForModal={prevPageForModal}
                // setPrevPageForModal={setPrevPageForModal}
                imgGalleryScrollPosition={imgGalleryScrollPosition}
                setImgGalleryScrollPosition={setImgGalleryScrollPosition}
                imgToLoadInFirstModal={imgToLoadInFirstModal}
              />
            }
          ></Route>
          <Route
            path={`/Account/:username`}
            element={
              isLoggedIn ? (
                <UserSettingsPage
                  domain={domain}
                  curUser_real={curUser_real}
                  curUser_hyphenated={curUser_hyphenated}
                  isLoggedIn={isLoggedIn}
                  // setLoggedIn={setLoggedIn}
                  isJustDeleted={isJustDeleted}
                  setIsJustDeleted={setIsJustDeleted}
                />
              ) : (
                <Navigate to="/SignUp" />
              )
            }
          ></Route>
          <Route
            path={`/User/:username`}
            element={
              <UserPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
                isShowingImageSelectModal={isShowingImageSelectModal}
                setIsShowingImageSelectModal={setIsShowingImageSelectModal}
                imgGalleryScrollPosition={imgGalleryScrollPosition}
                setImgGalleryScrollPosition={setImgGalleryScrollPosition}
                imgTitleArrState={imgTitleArrState}
                setImgTitleArrState={setImgTitleArrState}
              />
            }
          ></Route>
          <Route
            path={`/Account/:username/My-Pics/:sort/:filter`}
            element={
              isLoggedIn ? (
                <MyPicsPage
                  domain={domain}
                  curUser_real={curUser_real}
                  curUser_hyphenated={curUser_hyphenated}
                  isLoggedIn={isLoggedIn}
                  isShowingImageSelectModal={isShowingImageSelectModal}
                  setIsShowingImageSelectModal={setIsShowingImageSelectModal}
                  imgGalleryScrollPosition={imgGalleryScrollPosition}
                  setImgGalleryScrollPosition={setImgGalleryScrollPosition}
                  imgTitleArrState={imgTitleArrState}
                  setImgTitleArrState={setImgTitleArrState}
                />
              ) : (
                <Navigate to="/SignUp" />
              )
            }
          ></Route>
          <Route
            // path={`/Account/:username/Likes/:urlSort/:urlFilter`}
            path={`/Account/:username/Likes`}
            element={
              isLoggedIn ? (
                <LikesPage
                  domain={domain}
                  curUser_real={curUser_real}
                  curUser_hyphenated={curUser_hyphenated}
                  isLoggedIn={isLoggedIn}
                  isShowingImageSelectModal={isShowingImageSelectModal}
                  setIsShowingImageSelectModal={setIsShowingImageSelectModal}
                  imgGalleryScrollPosition={imgGalleryScrollPosition}
                  setImgGalleryScrollPosition={setImgGalleryScrollPosition}
                  imgTitleArrState={imgTitleArrState}
                  setImgTitleArrState={setImgTitleArrState}
                />
              ) : (
                <Navigate to="/SignUp" />
              )
            }
          ></Route>
          <Route
            path={`/:username/upload`}
            element={
              isLoggedIn ? (
                <UploadPage
                  domain={domain}
                  curUser_real={curUser_real}
                  curUser_hyphenated={curUser_hyphenated}
                  isLoggedIn={isLoggedIn}
                  isJustVerified={isJustVerified}
                  setIsJustVerified={setIsJustVerified}
                />
              ) : (
                <Navigate to="/SignUp" />
              )
            }
          ></Route>
          <Route
            path="/SignIn"
            element={
              <SignInPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
                resetPasswordLinkJustSent={resetPasswordLinkJustSent}
              />
            }
          ></Route>
          <Route
            path="/SignUp"
            element={
              <SignUpPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
                setIsJustSignedUp={setIsJustSignedUp}
              />
            }
          ></Route>
          <Route
            path="/SignUp/:username/Success"
            element={
              isJustSignedUp ? <SignUpSuccessPage /> : <Navigate to="/" />
            }
          ></Route>
          <Route
            path="/:username/verify/:token"
            element={
              <EmailVerifyPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
                isJustVerified={isJustVerified}
                setIsJustVerified={setIsJustVerified}
              />
            }
          />
          <Route
            path="/Account/:username/Change-Password"
            element={
              isLoggedIn ? (
                <ChangePasswordPage
                  domain={domain}
                  curUser_real={curUser_real}
                  curUser_hyphenated={curUser_hyphenated}
                  isLoggedIn={isLoggedIn}
                  setIsPasswordJustChanged={setIsPasswordJustChanged}
                />
              ) : (
                <Navigate to="/SignUp" />
              )
            }
          />
          <Route
            path="/Change-Password-Success"
            element={
              isPasswordJustChanged ? (
                <PasswordChangeSuccessPage
                  domain={domain}
                  curUser_real={curUser_real}
                  curUser_hyphenated={curUser_hyphenated}
                  isLoggedIn={isLoggedIn}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/:username/reset-password/:token"
            element={
              <ForgotPasswordResetPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/send-forgot"
            element={
              <SendForgotPasswordPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
                setResetPasswordLinkJustSent={setResetPasswordLinkJustSent}
              />
            }
          />
          <Route
            path="/Privacy-Policy"
            element={
              <PrivacyPolicyPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/Terms-And-Conditions"
            element={
              <TOSPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/Disclaimer"
            element={
              <DisclaimerPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/Credits"
            element={
              <CreditsPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/Contact"
            element={
              <ContactUsPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/About"
            element={
              <AboutUsPage
                domain={domain}
                curUser_real={curUser_real}
                curUser_hyphenated={curUser_hyphenated}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
        </Routes>
        <Footer
          domain={domain}
          curUser_real={curUser_real}
          curUser_hyphenated={curUser_hyphenated}
          isLoggedIn={isLoggedIn}
        />
      </div>
    );
  }
}
// }
export default App;
