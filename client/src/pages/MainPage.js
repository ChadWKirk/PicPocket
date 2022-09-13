import React, { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";

const MainPage = ({ curUser, loggedIn }) => {
  return (
    <div>
      <h1>Main Page</h1>
      <NavBar curUser={curUser} loggedIn={loggedIn} />
    </div>
  );
};

export default MainPage;
