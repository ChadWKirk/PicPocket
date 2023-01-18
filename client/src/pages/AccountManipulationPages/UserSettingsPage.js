import React from "react";
import NavBar from "../../components/NavBar";
import Logo from "../../components/Logo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import DropDown from "../../components/DropDown";

const UserSettingsPage = ({ curUser, loggedIn }) => {
  const navigate = useNavigate();
  console.log(curUser + " this is username in url");
  async function delAcc(e) {
    e.preventDefault();

    if (
      window.confirm(
        `Are you sure you would like to permanantely delete your account "${curUser}"?`
      )
    ) {
      await fetch(`http://localhost:5000/Account/${curUser}/delUser`, {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      }).then(() =>
        setTimeout(() => {
          window.location.href = "/delSuccess";
        }, 500)
      );
    } else {
      console.log("nothing happened");
    }
  }

  return (
    <div>
      <NavBar curUser={curUser} loggedIn={loggedIn} />
      <h2>Email:</h2>
      <input></input>
      <button>Change Email</button>
      <button>Change Password</button>
      <a href="" onClick={delAcc}>
        <h3>Delete account</h3>
      </a>
    </div>
  );
};

export default UserSettingsPage;
