import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
//import { useState } from 'react';
import "../css/Form.css";

export default function AuthForm(props) {
  const { register, handleSubmit, errors } = useForm();
  //const [errorMessage, setErrorMessage] = useState('');
  console.log(errors);
  const onSubmit = async (data) => {
    await props.onSubmit(data.email, data.password);
  };

  return (
    <div className="form-container">
      <Link className="close-btn-hotels" to="/">
        <p>
          <i class="fas fa-arrow-left"></i>
        </p>
      </Link>
      <div className="form-content-left">
        <img src="images/team-form.svg" alt="spaceship" className="form-img" />
      </div>
      <div className="form-content-right">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <h1>Welcome back! We are glad to see you here again.</h1>
          <div className="form-inputs">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              ref={register({ required: true })}
            />
            {errors.email && <p className="error">Usuario incorrecto</p>}
          </div>
          <div className="form-inputs">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              ref={register({ required: true, minLength: 4 })}
            />
            {errors?.password?.type === "required" && (
              <p className="error"> La contraseña es obligatoria</p>
            )}
            {errors?.password?.type === "minLength" && (
              <p className="error">
                La contraseña tiene que tener por lo menos 10 caracteres
              </p>
            )}
          </div>
          <button className="form-input-btn login" type="submit">
            Login
          </button>
          <span className="form-input-login">
            Still don't have an account? Sign up <Link to="/sign-up">here</Link>
          </span>
        </form>
      </div>
    </div>
  );
}
