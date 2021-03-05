import React from "react";
import "../App.css";
import AuthForm from "../components/AuthForm";
import useAuth from "../shared/hooks/useAuth";

function Login() {
  const { signIn } = useAuth();

  return <AuthForm onSubmit={signIn}></AuthForm>;
}

export default Login;
