import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { newHotel } from "../http/api";
import "../css/NewHotel.css";

const NewHotel = () => {
  const history = useHistory();

  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    await newHotel(data.nombre, data.localidad, data.direccion);
    history.push("/hotels/Gestion");
  };

  return (
    <section>
      <div className="form-container-hotels-edit">
        <Link className="close-btn-hotels" to="/hotels/gestion">
          <p>
            <i class="fas fa-arrow-left"></i>
          </p>
        </Link>
        <div className="form-content-left-hotels-new hotel">
          <h1>New Hotel</h1>
          <h2>Fill in the fields to create a new hotel</h2>
        </div>
        <div className="form-content-right-hotels hotel">
          <form
            className="form-hotels new hotel"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-inputs-hotels">
              <label htmlFor="nombre" className="form-label-hotels">
                Name
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                ref={register()}
                className="form-input-hotels"
                placeholder="Enter the hotel name"
              />
              {errors.nombre && <p>{errors.nombre}</p>}
            </div>
            <div className="form-inputs-hotels">
              <label htmlFor="direccion" className="form-label-hotels">
                Address
              </label>
              <input
                id="direccion"
                type="text"
                name="direccion"
                ref={register()}
                className="form-input-hotels"
                placeholder="Enter the hotel address"
              />
              {errors.direccion && <p>{errors.direccion}</p>}
            </div>
            <div className="form-inputs-hotels">
              <label htmlFor="localidad" className="form-label-hotels">
                Location
              </label>
              <input
                id="localidad"
                type="text"
                name="localidad"
                ref={register()}
                className="form-input-hotels"
                placeholder="Enter the location of the hotel"
              />
              {errors.localidad && <p>{errors.localidad}</p>}
            </div>
            <button className="form-input-btn-hotels hotel" type="submit">
              <strong>Create</strong>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewHotel;
