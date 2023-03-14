import React from "react";
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
