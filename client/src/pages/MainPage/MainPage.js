import { React, useEffect } from "react";
import MainPageContent from "../../components/MainPageContent";

const MainPage = ({
  domain,
  curUser_real,
  curUser_hyphenated,
  isLoggedIn,
  isJustDeleted,
  setIsJustDeleted,
  isShowingImageSelectModal,
  setIsShowingImageSelectModal,
  setImgTitleArrState,
  imgTitleArrState,
  page,
}) => {
  //if user deletes their account, they get navigated back to main page. make main page start at top of page to show JustDeleted banner
  useEffect(() => {
    if (isJustDeleted) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [isJustDeleted]);
  return (
    <div>
      <MainPageContent
        domain={domain}
        curUser_real={curUser_real}
        curUser_hyphenated={curUser_hyphenated}
        isLoggedIn={isLoggedIn}
        page={page}
        isShowingImageSelectModal={isShowingImageSelectModal}
        setIsShowingImageSelectModal={setIsShowingImageSelectModal}
        imgTitleArrState={imgTitleArrState}
        setImgTitleArrState={setImgTitleArrState}
        isJustDeleted={isJustDeleted}
        setIsJustDeleted={setIsJustDeleted}
      />
    </div>
  );
};

export default MainPage;
