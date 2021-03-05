import React from "react";
import decodeTokenData from "../utils/decodeTokenData";
import { useState } from "react";
import { login, signUpApi, deleteHotelInfo } from "../../http/api";
import { useHistory } from "react-router-dom";

// 1 Creamos el contexto y exportamos para usar en el hook
export const AuthContext = React.createContext();
const AuthContextProvider = AuthContext.Provider;

// 2 Recuperamos el token del localStorage
const token = localStorage.getItem("token");
const tokenObject = decodeTokenData(token);

// 3 Creamos un custom provider
export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(tokenObject);
  const [isUserLogged, setIsUserLogged] = useState(!!tokenObject);
  const [isUserHotelLogged, setIsUserHotelLogged] = useState(!!tokenObject);
  const history = useHistory();

  // Método para hacer log in desde los componentes
  const signIn = async (email, password) => {
    const loginData = await login(email, password);
    localStorage.setItem("token", loginData);
    const tokenObject = decodeTokenData(loginData);
    setUserData(tokenObject);
    console.log(tokenObject.admin);
    if (tokenObject.admin === 0) {
      setIsUserLogged(true);
      setIsUserHotelLogged(false);
    } else if (tokenObject.admin === 1) {
      setIsUserLogged(false);
      setIsUserHotelLogged(true);
    }
    history.push("/");
  };

  // Método para registrarse
  const signUp = async (data) => {
    const signUpData = await signUpApi(data);
    console.log(signUpData);
    history.push("/");
  };

  // Método que borra las credenciales del localStorage y del state
  const signOut = () => {
    localStorage.removeItem("token");
    history.push("/");
    setUserData(null);
    setIsUserLogged(false);
    setIsUserHotelLogged(false);
    window.location.reload();
  };

  const [date, setDate] = useState();

  /*   const deleteHotel = (idHotel) => {
    const deleteHotelData = await deleteHotelInfo(idHotel);
    console.log(deleteHotelData)
  } */

  // 4 devolvemos el provider metiendole dentro los children
  return (
    <AuthContextProvider
      value={{
        userData,
        signIn,
        signOut,
        signUp,
        isUserLogged,
        isUserHotelLogged,
        setIsUserHotelLogged,
        setIsUserLogged,
        date,
        setDate,
        /* deleteHotel, */
      }}
    >
      {children}
    </AuthContextProvider>
  );
}
