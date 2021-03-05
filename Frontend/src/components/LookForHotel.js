import React from "react";
import { useState, useEffect } from "react";
import { deleteHotelInfo, getHotelView, editHotel } from "../http/api";
import { Link, useHistory, useParams } from "react-router-dom";
import { Modal, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UploadImg from "./UploadImg";
import "../css/LookForHotel.css";
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

function LookForHotel() {
  const [spacesData, setSpacesData] = useState([]);
  const [modal, setModal] = useState(false);
  let { idHotel } = useParams();
  const { register, handleSubmit, errors } = useForm();
  const styles = useStyles();
  const history = useHistory();

  useEffect(() => {
    getHotelView(idHotel).then((data) => {
      setSpacesData(data);
    });
  }, [idHotel]);

  console.log(spacesData);

  const abrirCerrarModal = () => {
    setModal(!modal);
  };

  const deleteHotelClick = async (idHotel) => {
    await deleteHotelInfo(spacesData.idHotel);
    history.push("/hotels/Gestion");
  };

  const onSubmit = async (editdata) => {
    await editHotel(
      spacesData.idHotel,
      editdata.nombre,
      editdata.localidad,
      editdata.direccion
    );
    history.push("/hotels/Gestion");
  };

  const body = (
    <div className={styles.modal}>
      <div align="center">
        <h1>You are about to delete your hotel!</h1>
        <h2> Are you sure?</h2>
      </div>
      <br />
      <div align="center">
        <Button className={styles.botones} onClick={deleteHotelClick}>
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
      <div className="form-container-hotels-edit">
        <Link className="close-btn-hotels" to="/hotels/Gestion">
          <p>
            <i class="fas fa-arrow-left"></i>
          </p>
        </Link>
        <div className="form-content-left-hotels-edit">
          <h1>{spacesData.nombre}</h1>
        </div>
        <div className="form-content-right-hotels">
          <form className="form-hotels look" onSubmit={handleSubmit(onSubmit)}>
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
                placeholder={spacesData.nombre}
              />
              {errors.nombre && <p>{errors.nombre}</p>}
            </div>
            <div className="form-inputs-hotels">
              <label htmlFor="location" className="form-label-hotels">
                Location
              </label>
              <input
                id="location"
                type="text"
                name="localidad"
                ref={register()}
                className="form-input-hotels"
                placeholder={spacesData.localidad}
              />
              {errors.localidad && <p>{errors.localidad}</p>}
            </div>
            <div className="form-inputs-hotels">
              <label htmlFor="adress" className="form-label">
                Adress
              </label>
              <input
                id="adress"
                type="text"
                name="direccion"
                ref={register()}
                className="form-input-hotels"
                placeholder={spacesData.direccion}
              />
              {errors.direccion && <p>{errors.direccion}</p>}
            </div>
            <button className="form-input-btn-hotels" type="submit">
              <strong>Save</strong>
            </button>{" "}
            <h2 className="manageSpaces">
              <Link
                to={"/hotels/gestion/spaces/" + spacesData.idHotel}
                className="link-hotels-edit"
              >
                Manage your spaces <i class="fas fa-edit"></i>
              </Link>
            </h2>
            <span className="form-input-login-hotels">
              If you want to delete your hotel click
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

export default LookForHotel;
