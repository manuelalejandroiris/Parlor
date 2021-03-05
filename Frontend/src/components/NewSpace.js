import React from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { newSpace } from "../http/api";
import "../css/NewHotel.css";

const NewSpace = () => {
  const history = useHistory();
  let { idHotel } = useParams();

  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (editdata) => {
    await newSpace(
      idHotel,
      editdata.nombre,
      editdata.tipoEspacio,
      editdata.descripcion,
      editdata.aforo,
      editdata.precio
    );
    history.push("/hotels/gestion/spaces/" + idHotel);
  };

  return (
    <section>
      <div className="form-container-hotels-edit space">
        <Link className="close-btn-hotels" to={"/hotels/gestion/" + idHotel}>
          <p>
            <i class="fas fa-arrow-left"></i>
          </p>
        </Link>
        <div className="form-content-left-hotels-new space">
          <h1>New Space</h1>
          <h2>Fill in the fields to create a new space</h2>
        </div>
        <div className="form-content-right-hotels space">
          <form
            className="form-hotels new space"
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
                placeholder="Enter the name of the space"
              />
              {errors.nombre && <p>{errors.nombre}</p>}
            </div>
            <div className="form-inputs-hotels">
              <label htmlFor="tipoEspacio" className="form-label-hotels">
                Space type
              </label>
              <input
                id="tipoEspacio"
                type="text"
                name="tipoEspacio"
                ref={register()}
                className="form-input-hotels"
                placeholder="Enter the space type of the space"
              />
              {errors.tipoEspacio && <p>{errors.tipoEspacio}</p>}
            </div>
            <div className="form-inputs-hotels">
              <label htmlFor="descripcion" className="form-label">
                Description
              </label>
              <input
                id="descripcion"
                type="text"
                name="descripcion"
                ref={register()}
                className="form-input-hotels"
                placeholder="Enter the description of the space"
              />
              {errors.descripcion && <p>{errors.descripcion}</p>}
            </div>
            <div className="form-inputs-hotels">
              <label htmlFor="aforo" className="form-label">
                Capacity
              </label>
              <input
                id="aforo"
                type="text"
                name="aforo"
                ref={register()}
                className="form-input-hotels"
                placeholder="Enter the capacity of the space"
              />
              {errors.aforo && <p>{errors.aforo}</p>}
            </div>
            <div className="form-inputs-hotels">
              <label htmlFor="precio" className="form-label">
                Price
              </label>
              <input
                id="precio"
                type="number"
                name="precio"
                ref={register()}
                className="form-input-hotels"
                placeholder="Enter the price of the space"
              />
              {errors.precio && <p>{errors.precio}</p>}
              <button className="form-input-btn-hotels space" type="submit">
                <strong>Create</strong>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewSpace;
