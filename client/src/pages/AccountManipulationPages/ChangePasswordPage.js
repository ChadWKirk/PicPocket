import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarComponent from "../../components/NavbarComponent";

const ChangePasswordPage = ({ domain, curUser }) => {
  const { username } = useParams();
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();

  async function onSubmit(e) {
    e.preventDefault();

    await fetch(`${domain}/change-password`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        username: username,
        currentPassword: currentPassword,
        newPassword: newPassword,
      }),
    }).then((response) =>
      response
        .json()
        .then((resJSON) => JSON.stringify(resJSON))
        .then((stringJSON) => JSON.parse(stringJSON))
        .then((parsedJSON) => {
          if (parsedJSON == "change password") {
            console.log("password changed");
          } else if (parsedJSON == "password too weak") {
            console.log("password too weak");
          } else if (
            parsedJSON == "new password cannot match current password"
          ) {
            console.log("new password cannot match current password");
          } else {
            console.log("incorrect current password");
          }
        })
    );
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
                onChange={(e) => setCurrentPassword(e.target.value)}
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
