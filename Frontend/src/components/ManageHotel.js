import React from "react";
import { useState, useEffect } from "react";
import { getHotelInfo } from "../http/api";
import { Link } from "react-router-dom";
import useAuth from "../shared/hooks/useAuth";
import "../css/ManageHotel.css";

function ManageHotel() {
  const [spacesData, setSpacesData] = useState([]);
  const { userData } = useAuth();

  useEffect(() => {
    getHotelInfo(userData.id).then((data) => {
      setSpacesData(data);
    });
  }, []);

  return (
    <div className="searchResult">
      <Link to="/hotels/profile" className="hotel-back">
        <>
          <i class="fas fa-arrow-left"></i>
        </>
      </Link>
      <Link to="/hotels/newhotel" class="new-hotel">
        <button className="form-input-btn-hotels nhotel">
          <strong>New Hotel</strong>
        </button>
      </Link>
      {spacesData.map((space) => {
        return (
          <section>
            <Link
              to={"/hotels/gestion/" + space.idHotel}
              className="section-link"
            >
              <section className="section-results" key={space.idHotel}>
                <div className="searchResult__info">
                  <div className="searchResult__infoTop">
                    <h3>{space?.nombre}</h3>
                    <p>{space?.localidad}</p>
                    <p>————</p>
                    <p>{space?.direccion}</p>
                  </div>
                </div>
              </section>
            </Link>
          </section>
        );
      })}
    </div>
  );
}

export default ManageHotel;
