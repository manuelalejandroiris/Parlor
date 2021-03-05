import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory, useParams } from "react-router-dom";
import { getSpaceInfo, newBooking } from "../http/api";
import "../css/Form.css";
import useAuth from "../shared/hooks/useAuth";
import useQuery from "../shared/hooks/useQuery";

export default function AuthForm() {
  const [spacesData, setSpacesData] = useState([]);
  const { register, handleSubmit, errors } = useForm();
  const { userData, date } = useAuth();
  let { idEspacio } = useParams();
  let query = useQuery();
  const queryData = query.get("location");
  const history = useHistory();

  useEffect(() => {
    getSpaceInfo(idEspacio).then((data) => {
      setSpacesData(data);
    });
  }, [idEspacio]);

  let fecha1 = new Date(date.checkIn);
  let fecha2 = new Date(date.checkOut);

  let resta = fecha2.getTime() - fecha1.getTime();
  let diaTotal = Math.round(resta / (1000 * 60 * 60 * 24));
  let precioTotal = diaTotal * spacesData.precio;

  const onSubmit = async (
    idEspacios,
    idUsuario,
    fechaLlegada,
    fechaSalida,
    precioReserva
  ) => {
    await newBooking(
      spacesData.idEspacios,
      userData.id,
      date.checkIn,
      date.checkOut,
      precioReserva
    );

    history.push("/user/gestion");
  };

  return (
    <div className="form-container book">
      <span className="close-btn"></span>
      <div className="form-content-left"></div>
      <div className="form-content-right">
        <div className="form book">
          <h1>You are one click away from confirming your reservation for:</h1>
          <div className="form-inputs book">
            <h1> </h1>
            <hr></hr>
            <h1> </h1>
            <h2 className="form-label book" htmlFor="email">
              {spacesData?.nombre} at {spacesData?.nombreHotel}
            </h2>
          </div>
          <div className="form-inputs book">
            <h1> </h1>
            <hr></hr>
            <h1> </h1>
            <h2 className="form-label book" htmlFor="password">
              Date: From {date.checkIn} to {date.checkOut}
            </h2>
          </div>
          <div className="form-inputs book">
            <h2
              className="form-label book"
              name="precioReserva"
              htmlFor="password"
            >
              Total price: {precioTotal} €
            </h2>
            <h1> </h1>
            <hr></hr>
            <h1> </h1>
          </div>
          <button className="form-input-btn" type="button" onClick={onSubmit}>
            <strong>Booking</strong>
          </button>
          <span className="form-input-login">
            If you want to cancel, <Link to="/"> click here</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
