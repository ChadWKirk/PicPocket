import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ShoppingPage from "./pages/ShoppingPage";
import AccountPage from "./pages/AccountPage";

function App() {
  return (
    <div>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />}></Route>
          <Route path="/ShoppingPage" element={<ShoppingPage />}></Route>
          <Route path="/AccountPage" element={<AccountPage />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
