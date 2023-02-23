import { React, useState, useEffect } from "react";

const ContactUsPage = ({ domain, curUser, isLoggedIn }) => {
  function submitForm() {
    console.log("submitted message");
  }
  return (
    <div className="">
      {/* <NavBar /> */}
      <div className="contactFormCont">
        <h1>Contact</h1>
        <form onSubmit={() => submitForm()}>
          <div className="contactForm--InputBlock">
            <label for="name">Name</label>
            <input name="name"></input>
          </div>
          <div className="contactForm--InputBlock">
            <label for="email">Email</label>
            <input name="email"></input>
          </div>
          <div className="contactForm--InputBlock">
            <label for="message">Message</label>
            <textarea name="message"></textarea>
          </div>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUsPage;
