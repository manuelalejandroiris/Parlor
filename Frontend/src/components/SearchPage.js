import React from "react";
import { useState, useEffect } from "react";
import { getSpaceInfo } from "../http/api";
import { Link, useParams } from "react-router-dom";
import "../css/SearchPage.css";
import useQuery from "../shared/hooks/useQuery";
import useAuth from "../shared/hooks/useAuth";

function SearchPage() {
  const [spacesData, setSpacesData] = useState([]);
  let { idEspacio } = useParams();
  const { userData, date } = useAuth();
  let query = useQuery();
  const queryData = query.get("location");

  useEffect(() => {
    getSpaceInfo(idEspacio).then((data) => {
      setSpacesData(data);
    });
  }, [idEspacio]);

  let fecha1 = new Date(date.checkIn);
  let fecha2 = new Date(date.checkOut);

  let resta = fecha2.getTime() - fecha1.getTime();
  let precioTotal = Math.round(
    (resta / (1000 * 60 * 60 * 24)) * spacesData.precio
  );

  return (
    <div className="searchResult">
      <Link to={"/results?location=" + queryData} className="hotel-back">
        <>
          <i class="fas fa-arrow-left"></i>
        </>
      </Link>
      <section className="section-space" key={spacesData.idEspacios}>
        <p>{spacesData?.nombreHotel}</p>
        <h2>{spacesData?.nombre}</h2>

        <div className="info-space">
          <i className="fas fa-star page" />
          <p>
            <strong>{spacesData?.score}</strong>
          </p>
          <p>{"(" + spacesData?.localidad + ")"}</p>
          <i className="fas fa-heart page" />
        </div>

        <div className="img-space">
          <img
            className="img-page"
            alt=""
            src="https://images.pexels.com/photos/159213/hall-congress-architecture-building-159213.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
          />
        </div>

        <div className="book-space">
          <h3>{spacesData?.precio + " €/ day"}</h3>
          <p>{precioTotal + " € total"}</p>
          <Link
            to={"/spaces/" + spacesData.idEspacios + "/booking"}
            className=""
          >
            <button>Reservar</button>
          </Link>
        </div>

        <div className="description-space">
          <h3>Descripción</h3>
          <p>{spacesData?.descripcion}</p>
          <h3>Esquipamiento</h3>
          <div className="equip-space">
            <p>{spacesData?.tipoEspacio}</p>
          </div>
        </div>

        <div className="comment-space">
          <h3>Comentarios</h3>
          <div className="score-space">
            <i className="fas fa-star page" />
            <p>
              <strong>{spacesData?.score}</strong>
            </p>
          </div>
          <p>todos los comentarios aqui listados</p>
        </div>
      </section>
    </div>
  );
}

export default SearchPage;
