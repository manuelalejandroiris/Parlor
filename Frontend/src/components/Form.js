import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormSignup from "./FormSignup";
import FormSuccess from "./FormSuccess";
import "../css/Form.css";

const Form = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function submitForm() {
    setIsSubmitted(true);
  }
  return (
    <>
      <div className="form-container">
        <Link className="close-btn-hotels" to="/">
          <p>
            <i class="fas fa-arrow-left"></i>
          </p>
        </Link>
        <div className="form-content-left">
          <img
            src="images/team-form.svg"
            alt="spaceship"
            className="form-img"
          />
        </div>
        {!isSubmitted ? <FormSignup /> : <FormSuccess />}
      </div>
    </>
  );
};

export default Form;
