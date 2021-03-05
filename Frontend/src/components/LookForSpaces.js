import React from "react";
import { useState, useEffect } from "react";
import { getSpaceInfo, deleteSpaceInfo, editSpace } from "../http/api";
import { Link, useHistory, useParams } from "react-router-dom";
import { Modal, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "../css/LookForSpaces.css";
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    width: 400,
    height: 200,
    backgroundColor: "rgb(28, 27, 27)",
    WebkitTextFillColor: "rgb(200, 180, 100)",
    boxShadow: theme.shadows[5],
    borderRadius: "0.5rem",
    padding: "16px 32px 24px 16px",
    top: "18rem",
    left: "36rem",
    transform: "translate (-50%, -50%)",
    fontFamily: "Rajdhani, sans-serif",
  },
  textfield: {
    width: "100%",
  },
  container: {
    textAlign: "center",
  },
  botones: {
    WebkitTextFillColor: "white",
    "&:hover": {
      backgroundColor: "#7dcedb",
      WebkitTextFillColor: "black",
      cursor: "pointer",
    },
  },
}));

function LookForSpaces() {
  const [spacesData, setSpacesData] = useState([]);
  const [modal, setModal] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const styles = useStyles();
  const history = useHistory();
  let { idEspacio } = useParams();

  useEffect(() => {
    getSpaceInfo(idEspacio).then((data) => {
      setSpacesData(data);
    });
  }, [idEspacio]);

  const abrirCerrarModal = () => {
    setModal(!modal);
  };
  const deleteSpaceClick = async (idEspacios) => {
    console.log(idEspacio);
    await deleteSpaceInfo(idEspacio);
    history.push("/hotels/gestion/spaces/" + spacesData.idHotel);
  };

  const onSubmit = async (editdata) => {
    await editSpace(
      idEspacio,
      editdata.nombre,
      editdata.tipoEspacio,
      editdata.descripcion,
      editdata.aforo,
      editdata.precio
    );
    history.push("/hotels/gestion/spaces/" + spacesData.idHotel);
  };

  const body = (
    <div className={styles.modal}>
      <div align="center">
        <h1>You are about to delete your space!</h1>
        <h2> Are you sure?</h2>
      </div>
      <br />
      <div align="center">
        <Button className={styles.botones} onClick={deleteSpaceClick}>
          Yes
        </Button>
        <Button className={styles.botones} onClick={() => abrirCerrarModal()}>
          No
        </Button>
      </div>
    </div>
  );

  return (
    <section>
      <div className="form-container-hotels space">
        <Link
          className="close-btn-hotels"
          to={"/hotels/gestion/spaces/" + spacesData.idHotel}
        >
          <p>
            <i class="fas fa-arrow-left"></i>
          </p>
        </Link>
        <div className="form-content-left-hotels-edit">
          <h1>{spacesData.nombre}</h1>
        </div>
        <div className="form-content-right-hotels space">
          <form className="form-hotels" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-inputs-hotels space">
              <label htmlFor="nombre" className="form-label-hotels">
                Name
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                ref={register()}
                className="form-input-hotels"
                placeholder={spacesData.nombre}
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
                placeholder={spacesData.tipoEspacio}
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
                placeholder={spacesData.descripcion}
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
                placeholder={spacesData.aforo}
              />
              {errors.aforo && <p>{errors.aforo}</p>}
            </div>
            <div className="form-inputs-hotels">
              <label htmlFor="precio" className="form-label">
                Price
              </label>
              <input
                id="precio"
                type="decimal"
                name="precio"
                ref={register()}
                className="form-input-hotels"
                placeholder={spacesData.precio}
              />
              {errors.precio && <p>{errors.precio}</p>}
              <button className="form-input-btn-hotels space" type="submit">
                <strong>Save</strong>
              </button>
            </div>
            <span className="form-input-login-hotels">
              If you want to delete your space click
              <Link onClick={() => abrirCerrarModal()}> here</Link>
              <Modal open={modal} onClose={abrirCerrarModal}>
                {body}
              </Modal>
            </span>
          </form>
        </div>
      </div>
    </section>
  );
}

export default LookForSpaces;
