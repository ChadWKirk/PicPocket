import { React, useEffect, useState, useRef } from "react";

const ProgressBar = ({ playStatus }) => {
  const progressBar = useRef();

  useEffect(() => {
    let interval;
    setTimeout(() => {
      //check every Xms
      interval = setInterval(() => {
        console.log("run");
        //if progress bar makes it to x% screen width and fetch isn't finished, pause animation
        if (
          progressBar.current.offsetWidth >= window.innerWidth * 0.7 &&
          playStatus === "play"
        ) {
          progressBar.current.classList.add("progress-bar__pause");
        }
        //if progress bar made it to x% screen width and fetch just finished
        else if (
          playStatus === "finish" &&
          progressBar.current.classList[2] === "progress-bar__pause"
        ) {
          progressBar.current.classList.remove("progress-bar__pause");
          //add this just so bar doesn't repeat due to the conditional that comes after this that checks if fetch is done but bar has no gotten to x% yet
          progressBar.current.classList.add("progress-bar__placeholder");
        }
        //if fetch finishes before reaching x%, change animation speed to finish it quickly
        else if (
          playStatus === "finish" &&
          progressBar.current.classList[2] != "progress-bar__placeholder" &&
          progressBar.current.offsetWidth < window.innerWidth * 0.7
        ) {
          progressBar.current.classList.remove("progress-bar__start");
          progressBar.current.classList.add("progress-bar__finish");
        }
      }, 1);
    }, 10);
    //clean up on unmount when setting ProgressBar to () on page
    return () => clearInterval(interval);
  }, [playStatus]);

  return (
    <div
      className="progress-bar__main progress-bar__start"
      ref={progressBar}
    ></div>
  );
};

export default ProgressBar;
