import React, { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuthContext } from "./context/useAuthContext";
//components
import Footer from "./components/Footer";

//pages
import MainPage from "./pages/MainPage/MainPage";
import MainPageMostPopularImages from "./pages/MainPage/MainPageMostPopularImages";
import UserSettingsPage from "./pages/AccountManipulationPages/UserSettingsPage";
import UserPage from "./pages/UserPage";
import SignInPage from "./pages/AccountManipulationPages/SignInPage";
import SignUpPage from "./pages/AccountManipulationPages/SignUpPage";
import SignUpSuccessPage from "./pages/AccountManipulationPages/SignUpSuccessPage";
import DelSuccessPage from "./pages/AccountManipulationPages/DelSuccessPage";
import SearchResultPage from "./pages/SearchResultsPages/SearchResultPage";
import MyPicsPage from "./pages/MyPics/MyPicsPages";
import UploadPage from "./pages/UploadPage";
import ImageViewPage from "./pages/ImageViewPage";
import LikesPage from "./pages/MyLikes/LikesPage";
import LikeTestPage from "./pages/MyLikes/LikeTestPage";
import ChangePasswordPage from "./pages/AccountManipulationPages/ChangePasswordPage";
import PasswordChangeSuccessPage from "./pages/AccountManipulationPages/PasswordChangeSuccessPage";
import SendForgotPasswordPage from "./pages/AccountManipulationPages/ForgotPasswordPages/ForgotPasswordSendLinkPage";
import ForgotPasswordResetPage from "./pages/AccountManipulationPages/ForgotPasswordPages/ForgotPasswordResetPage";
import EmailVerifyPage from "./pages/AccountManipulationPages/EmailVerifyPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TOSPage from "./pages/TOSPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import ContactUsPage from "./pages/ContactUsPage";
import CreditsPage from "./pages/CreditsPage";
//bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  //domain for fetch routes. either localhost or heroku depending on if you are developing or building to deploy to netlify
  let domain = "http://localhost:5000";
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

  //used to give array of img titles to imageview page to use for imageSelectModal
  //to fetch img src and to go to previous or next image
  const [imgTitleArrState, setImgTitleArrState] = useState();

  // const [curUser, setCurUser] = useState();
  // const [loggedIn, setLoggedIn] = useState();

  console.log("render");

  // useEffect(() => {
  //   async function getCurUser() {
  //     //every time app renders, get currently signed in user.
  //     await fetch("http://localhost:5000/curUser", {
  //       method: "GET",
  //       headers: { "Content-type": "application/json" },
  //     })
  //       .then((response) => response.json()) //gets res from express and parses it into JSON for React
  //       .then((responseJSON) => {
  //         console.log(responseJSON + " responseJSON");
  //         if (responseJSON == "none") {
  //           console.log("none");
  //           setLoggedIn(false);
  //           setLoading(false); //now that curUser and loggedIn are set, load app's HTML
  //           console.log(loggedIn + " false");
  //         } else {
  //           setCurUser(responseJSON);
  //           setLoggedIn(true);
  //           setLoading(false);
  //         }
  //       });
  //   }

  //   getCurUser();
  // }, []);

  // if (isLoading) {
  //   return null;
  // } else {

  //get user from AuthContext
  const { user } = useAuthContext();
  console.log(user);
  //set curUser to user.name
  const [curUser, setCurUser] = useState();
  //set logged in to true/false depending on if user from AuthContext is null or not
  const [isLoggedIn, setIsLoggedIn] = useState();
  useEffect(() => {
    if (user !== null) {
      setCurUser(user.name);
      setIsLoggedIn(true);
      console.log(isLoggedIn);
    } else {
      setCurUser();
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
            path="/"
            element={
              <MainPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
                isJustDeleted={isJustDeleted}
                setIsJustDeleted={setIsJustDeleted}
                isShowingImageSelectModal={isShowingImageSelectModal}
                setIsShowingImageSelectModal={setIsShowingImageSelectModal}
                imgTitleArrState={imgTitleArrState}
                setImgTitleArrState={setImgTitleArrState}
              />
            }
          ></Route>
          <Route
            path="/most-popular"
            element={
              <MainPageMostPopularImages
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/search/:searchQuery/:sort/:filter"
            element={
              <SearchResultPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
                isShowingImageSelectModal={isShowingImageSelectModal}
                setIsShowingImageSelectModal={setIsShowingImageSelectModal}
                imgTitleArrState={imgTitleArrState}
                setImgTitleArrState={setImgTitleArrState}
              />
            }
          ></Route>
          <Route
            path="/image/:imageTitle"
            element={
              <ImageViewPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
                isShowingImageSelectModal={isShowingImageSelectModal}
                setIsShowingImageSelectModal={setIsShowingImageSelectModal}
                imgTitleArrState={imgTitleArrState}
                setImgTitleArrState={setImgTitleArrState}
              />
            }
          ></Route>
          <Route path="/like-test" element={<LikeTestPage />}></Route>
          <Route
            path={`/Account/${curUser}`}
            element={
              <UserSettingsPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
                // setLoggedIn={setLoggedIn}
                isJustDeleted={isJustDeleted}
                setIsJustDeleted={setIsJustDeleted}
              />
            }
          ></Route>
          <Route
            path={`/User/:username`}
            element={
              <UserPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
                isShowingImageSelectModal={isShowingImageSelectModal}
                setIsShowingImageSelectModal={setIsShowingImageSelectModal}
                imgTitleArrState={imgTitleArrState}
                setImgTitleArrState={setImgTitleArrState}
              />
            }
          ></Route>
          <Route
            path={`/Account/${curUser}/My-Pics/:sort/:filter`}
            element={
              <MyPicsPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
                isShowingImageSelectModal={isShowingImageSelectModal}
                setIsShowingImageSelectModal={setIsShowingImageSelectModal}
                imgTitleArrState={imgTitleArrState}
                setImgTitleArrState={setImgTitleArrState}
              />
            }
          ></Route>
          <Route
            path={`/Account/:username/Likes/:sort/:filter`}
            element={
              <LikesPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
                isShowingImageSelectModal={isShowingImageSelectModal}
                setIsShowingImageSelectModal={setIsShowingImageSelectModal}
                imgTitleArrState={imgTitleArrState}
                setImgTitleArrState={setImgTitleArrState}
              />
            }
          ></Route>
          <Route
            path={`/${curUser}/upload`}
            element={
              <UploadPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
                isJustVerified={isJustVerified}
                setIsJustVerified={setIsJustVerified}
              />
            }
          ></Route>
          <Route
            path="/SignIn"
            element={
              <SignInPage
                domain={domain}
                curUser={curUser}
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
                curUser={curUser}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/SignUp/:username/Success"
            element={<SignUpSuccessPage />}
          ></Route>
          <Route
            path="/delSuccess"
            element={
              <DelSuccessPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/:username/verify/:token"
            element={
              <EmailVerifyPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
                isJustVerified={isJustVerified}
                setIsJustVerified={setIsJustVerified}
              />
            }
          />
          <Route
            path="/Account/:username/Change-Password"
            element={
              <ChangePasswordPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/Change-Password-Success"
            element={
              <PasswordChangeSuccessPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/:username/reset-password/:token"
            element={
              <ForgotPasswordResetPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/send-forgot"
            element={
              <SendForgotPasswordPage
                domain={domain}
                curUser={curUser}
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
                curUser={curUser}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/Terms-And-Conditions"
            element={
              <TOSPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/Disclaimer"
            element={
              <DisclaimerPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/Credits"
            element={
              <CreditsPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/Contact"
            element={
              <ContactUsPage
                domain={domain}
                curUser={curUser}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
        </Routes>
        <Footer domain={domain} curUser={curUser} isLoggedIn={isLoggedIn} />
      </div>
    );
  }
}
// }
export default App;
