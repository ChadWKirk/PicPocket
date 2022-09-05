import React from "react";

const NavBar = () => {
  return (
    <div>
      <a href="/">
        <button>Home</button>
      </a>
      <a href="/ShoppingPage">
        <button>Shop</button>
      </a>
      <a href="/AccountPage">
        <button>Account</button>
      </a>
    </div>
  );
};

export default NavBar;
