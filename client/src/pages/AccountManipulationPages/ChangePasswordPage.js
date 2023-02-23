import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarComponent from "../../components/NavbarComponent";

const ChangePasswordPage = ({ domain, curUser }) => {
  const { username } = useParams();
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();

  async function onSubmit(e) {
    e.preventDefault();

    await fetch(`${domain}/change-password`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        username: username,
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    }).then((response) => {
      if (response.ok) {
        console.log("password changed");
      } else {
        console.log("error");
      }
    });
  }
  return (
    <div>
      <NavbarComponent />
      <div>
        <h1>Change Password</h1>
        <div>
          <form onSubmit={(e) => onSubmit(e)}>
            <div>
              <label for="oldPassInput">Current Password:</label>
              <input
                id="oldPassInput"
                onChange={(e) => setOldPassword(e.target.value)}
              ></input>
            </div>
            <div>
              <label for="newPassInput">New Password:</label>
              <input
                id="newPassInput"
                onChange={(e) => setNewPassword(e.target.value)}
              ></input>
            </div>
            <button type="submit">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
