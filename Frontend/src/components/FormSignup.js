import React from "react";
import { Link } from "react-router-dom";
import validate from "./validateInfo";
import useAuth from "../shared/hooks/useAuth";
import "../css/Form.css";
import { useForm } from "react-hook-form";

const FormSignup = () => {
  const { signUp } = useAuth();
  const { register, handleSubmit, errors } = useForm();

  const test = (data) => {
    signUp(data);
  };

  return (
    <div className="form-content-right">
      <form className="form" onSubmit={handleSubmit(test)}>
        <h1>
          Get started with us today! Create your account by filling out the
          information below.
        </h1>
        <div className="form-inputs">
          <label htmlFor="username" className="form-label">
            Nombre
          </label>
          <input
            id="username"
            type="text"
            name="nombre"
            ref={register()}
            className="form-input"
            placeholder="Enter your username"
          />
          {errors.nombre && <p>{errors.nombre}</p>}
        </div>
        <div className="form-inputs">
          <label htmlFor="apellidos" className="form-label">
            Apellidos
          </label>
          <input
            id="apellidos"
            type="text"
            name="apellidos"
            ref={register()}
            className="form-input"
            placeholder="Enter your username"
          />
          {errors.apellidos && <p>{errors.apellidos}</p>}
        </div>
        <div className="form-inputs">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            ref={register()}
            className="form-input"
            placeholder="Enter your email"
          />
          {errors.correo && <p>{errors.correo}</p>}
        </div>
        <div className="form-inputs">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            ref={register()}
            className="form-input"
            placeholder="Enter your password"
          />
          {errors.contraseña && <p>{errors.contraseña}</p>}
        </div>
        <button className="form-input-btn" type="submit">
          Sign up
        </button>
        <span className="form-input-login">
          Already have an account? Login <Link to="/login">here</Link>
        </span>
      </form>
    </div>
  );
};

export default FormSignup;
