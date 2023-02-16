import { React, useState, useEffect } from "react";

const ModalForYesOrNo = ({
  Message,
  setYesOrNoModal,
  setYesOrNoModalAnswer,
  acceptYesOrNoModalAnswer,
}) => {
  //when modal is open, set body overflow to hidden. for some reason classlist.add wasn't working it was glitching on and off
  document.body.style.overflow = "hidden";

  return (
    <div className="yes-or-no-modal__container">
      <div className="yes-or-no-modal__box">
        <div>{Message}</div>
        <div className="yes-or-no-modal__buttons-container">
          <button
            onClick={() => {
              setYesOrNoModalAnswer(true);
              acceptYesOrNoModalAnswer();
            }}
          >
            Yes
          </button>
          <button
            onClick={() => {
              setYesOrNoModalAnswer(false);
              acceptYesOrNoModalAnswer();
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalForYesOrNo;
