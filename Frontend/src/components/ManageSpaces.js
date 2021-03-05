import React from "react";
import { useState, useEffect } from "react";
import { getSpaceIdHotel } from "../http/api";
import { Link, useParams } from "react-router-dom";
import useAuth from "../shared/hooks/useAuth";
import "../css/ManageHotel.css";

function ManageSpaces() {
  const [spacesData, setSpacesData] = useState([]);
  const { userData } = useAuth();
  let { idHotel } = useParams();

  useEffect(() => {
    getSpaceIdHotel(idHotel).then((data) => {
      setSpacesData(data);
    });
  }, []);

  return (
    <div className="searchResult">
      <Link to={"/hotels/gestion/" + idHotel} className="hotel-back">
        <p>
          <i class="fas fa-arrow-left"></i>
        </p>
      </Link>
      <Link to={"/gestion/spaces/newspace/" + idHotel} class="new-hotel">
        <button className="form-input-btn-hotels nhotel">
          <strong>New Space</strong>
        </button>
      </Link>

      {spacesData.map((space) => {
        return (
          <section>
            <Link
              to={"/gestion/spaces/" + space.idEspacios}
              className="section-link"
            >
              <section className="section-results" key={space.idEspacios}>
                <div className="searchResult__info">
                  <div className="searchResult__infoTop">
                    <h3>{space?.nombre}</h3>
                    <p>{space?.tipoEspacio}</p>
                    <p>————</p>
                    <p>{space?.descripcion}</p>
                    <p>{space?.aforo}</p>
                    <p>{space?.precio}</p>
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

export default ManageSpaces;
