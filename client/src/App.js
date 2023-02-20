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
                curUser={curUser}
                isLoggedIn={isLoggedIn}
              />
            }
          ></Route>
          <Route
            path="/search/:searchQuery/:sort/:filter"
            element={
              <SearchResultPage
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
            element={<UploadPage curUser={curUser} isLoggedIn={isLoggedIn} />}
          ></Route>
          <Route
            path="/SignIn"
            element={<SignInPage curUser={curUser} isLoggedIn={isLoggedIn} />}
          ></Route>
          <Route
            path="/SignUp"
            element={<SignUpPage curUser={curUser} isLoggedIn={isLoggedIn} />}
          ></Route>
          <Route
            path="/SignUp/:username/Success"
            element={<SignUpSuccessPage />}
          ></Route>
          <Route
            path="/delSuccess"
            element={
              <DelSuccessPage curUser={curUser} isLoggedIn={isLoggedIn} />
            }
          ></Route>
          <Route
            path="/Privacy-Policy"
            element={
              <PrivacyPolicyPage curUser={curUser} isLoggedIn={isLoggedIn} />
            }
          ></Route>
          <Route
            path="/Terms-And-Conditions"
            element={<TOSPage curUser={curUser} isLoggedIn={isLoggedIn} />}
          ></Route>
          <Route
            path="/Disclaimer"
            element={
              <DisclaimerPage curUser={curUser} isLoggedIn={isLoggedIn} />
            }
          ></Route>
          <Route
            path="/Credits"
            element={<CreditsPage curUser={curUser} isLoggedIn={isLoggedIn} />}
          ></Route>
          <Route
            path="/Contact"
            element={
              <ContactUsPage curUser={curUser} isLoggedIn={isLoggedIn} />
            }
          ></Route>
        </Routes>
        <Footer curUser={curUser} isLoggedIn={isLoggedIn} />
      </div>
    );
  }
}
// }
export default App;
