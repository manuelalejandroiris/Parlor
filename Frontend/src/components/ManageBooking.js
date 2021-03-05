import React from "react";
import { useState, useEffect } from "react";
import { getBookingInfo, deleteBookingInfo } from "../http/api";
import { Link, useParams } from "react-router-dom";
import useAuth from "../shared/hooks/useAuth";
import "../css/ManageHotel.css";

function ManageBooking() {
  const [bookingData, setBookingData] = useState([]);
  const [spacesData, setSpacesData] = useState([]);
  const { userData, date } = useAuth();

  useEffect(() => {
    getBookingInfo(userData.id).then((data) => {
      setBookingData(data);
    });
  }, [userData]);

  return (
    <div className="searchResult booking">
      <Link to="/profile" className="hotel-back">
        <p>
          <i class="fas fa-arrow-left"></i>
        </p>
      </Link>

      {bookingData.map((booking) => {
        return (
          <section>
            <div className="section-link booking">
              <section className="section-results" key={booking.idReserva}>
                <div className="searchResult__info">
                  <div className="searchResult__infoTop">
                    <p>{booking?.nombreHotel}</p>
                    <hr />
                    <h3>{booking?.nombre}</h3>
                    <p>{booking?.tipoEspacio}</p>
                    <p>
                      {booking?.fechaLlegada} to {booking?.fechaSalida}
                    </p>
                    <hr />
                    <p>Total price: {booking?.precioReserva} €</p>
                  </div>
                </div>
              </section>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default ManageBooking;
