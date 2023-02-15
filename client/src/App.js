import React, { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
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
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TOSPage from "./pages/TOSPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import ContactUsPage from "./pages/ContactUsPage";
import CreditsPage from "./pages/CreditsPage";
//bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  //When someone deletes their account, they will be navigated back to main page
  //and a red banner will show saying their account has successfully been deleted
  //until they refresh or go to a different page to reset the state to false.
  const [isJustDeleted, setIsJustDeleted] = useState(false);

  //used to show image select modal or not
  const [isShowingImageSelectModal, setIsShowingImageSelectModal] =
    useState(false);

  //used to give array of img titles to imageview page to use for imageSelectModal
  //to fetch img src and to go to previous or next image
  const [imgTitleArrState, setImgTitleArrState] = useState();

  const [curUser, setCurUser] = useState();
  const [loggedIn, setLoggedIn] = useState();
  console.log("render");
  //loading app useState to only return html after getCurUser finishes
  //to avoid having no curUser for signed in as: for a split second when app loads
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function getCurUser() {
      //every time app renders, get currently signed in user.
      await fetch("http://localhost:5000/curUser", {
        method: "GET",
        headers: { "Content-type": "application/json" },
      })
        .then((response) => response.json()) //gets res from express and parses it into JSON for React
        .then((responseJSON) => {
          console.log(responseJSON + " responseJSON");
          if (responseJSON == "none") {
            console.log("none");
            setLoggedIn(false);
            setLoading(false); //now that curUser and loggedIn are set, load app's HTML
            console.log(loggedIn + " false");
          } else {
            setCurUser(responseJSON);
            setLoggedIn(true);
            setLoading(false);
          }
        });
    }

    getCurUser();
  }, []);

  if (isLoading) {
    return null;
  } else {
    return (
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <MainPage
                curUser={curUser}
                loggedIn={loggedIn}
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
                curUser={curUser}
                loggedIn={loggedIn}
              />
            }
          ></Route>
          <Route
            path="/search/:searchQuery/:sort/:filter"
            element={
              <SearchResultPage
                curUser={curUser}
                loggedIn={loggedIn}
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
                curUser={curUser}
                loggedIn={loggedIn}
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
                curUser={curUser}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                isJustDeleted={isJustDeleted}
                setIsJustDeleted={setIsJustDeleted}
              />
            }
          ></Route>
          <Route
            path={`/User/:username`}
            element={
              <UserPage
                curUser={curUser}
                loggedIn={loggedIn}
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
                curUser={curUser}
                loggedIn={loggedIn}
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
                curUser={curUser}
                loggedIn={loggedIn}
                isShowingImageSelectModal={isShowingImageSelectModal}
                setIsShowingImageSelectModal={setIsShowingImageSelectModal}
                imgTitleArrState={imgTitleArrState}
                setImgTitleArrState={setImgTitleArrState}
              />
            }
          ></Route>
          <Route
            path={`/${curUser}/upload`}
            element={<UploadPage curUser={curUser} loggedIn={loggedIn} />}
          ></Route>
          <Route
            path="/SignIn"
            element={<SignInPage curUser={curUser} loggedIn={loggedIn} />}
          ></Route>
          <Route
            path="/SignUp"
            element={<SignUpPage curUser={curUser} loggedIn={loggedIn} />}
          ></Route>
          <Route
            path="/SignUp/:username/Success"
            element={<SignUpSuccessPage />}
          ></Route>
          <Route
            path="/delSuccess"
            element={<DelSuccessPage curUser={curUser} loggedIn={loggedIn} />}
          ></Route>
          <Route
            path="/Privacy-Policy"
            element={
              <PrivacyPolicyPage curUser={curUser} loggedIn={loggedIn} />
            }
          ></Route>
          <Route
            path="/Terms-And-Conditions"
            element={<TOSPage curUser={curUser} loggedIn={loggedIn} />}
          ></Route>
          <Route
            path="/Disclaimer"
            element={<DisclaimerPage curUser={curUser} loggedIn={loggedIn} />}
          ></Route>
          <Route
            path="/Credits"
            element={<CreditsPage curUser={curUser} loggedIn={loggedIn} />}
          ></Route>
          <Route
            path="/Contact"
            element={<ContactUsPage curUser={curUser} loggedIn={loggedIn} />}
          ></Route>
        </Routes>
        <Footer curUser={curUser} loggedIn={loggedIn} />
        
      </div>
    );
  }
}
export default App;
