import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import useAuth from "../shared/hooks/useAuth";
import { useForm } from "react-hook-form";
import { getUserInfo, editUser, deleteUser, getHotelInfo } from "../http/api";
import UploadImg from "./UploadImg";
import "../css/UserHotel.css";
import ShowToLoggedInUserHotel from "./ShowToLoggedInUserHotel";
import { Modal, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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

const UserProfile = () => {
  const {
    userData,
    signOut,
    setIsUserLogged,
    setIsUserHotelLogged,
  } = useAuth();
  const styles = useStyles();
  const history = useHistory();

  const [profileData, setprofileData] = useState([]);
  const [hotelData, setHotelData] = useState([]);
  const { register, handleSubmit, errors } = useForm();
  const [modal, setModal] = useState(false);

  useEffect(() => {
    getUserInfo(userData.id).then((data) => {
      setprofileData(data);
    });
  }, [userData]);

  useEffect(() => {
    getHotelInfo(userData.id).then((data) => {
      setHotelData(data);
    });
  }, [userData]);
  console.log(profileData);

  const abrirCerrarModalDelete = () => {
    setModal(!modal);
  };

  const deleteUserClick = async (idUsuario) => {
    await deleteUser(profileData.idUsuario);
  };

  const bodyDelete = (
    <div className={styles.modal}>
      <div align="center">
        <h1>You are about to delete your account!</h1>
        <h2> Are you sure?</h2>
      </div>
      <br />
      <div align="center">
        <Button className={styles.botones} onClick={deleteUserClick}>
          Yes
        </Button>
        <Button
          className={styles.botones}
          onClick={() => abrirCerrarModalDelete()}
        >
          No
        </Button>
      </div>
    </div>
  );

  const onSubmit = async (editdata) => {
    await editUser(
      profileData.idUsuario,
      editdata.nombre,
      editdata.apellidos,
      editdata.telefono,
      editdata.correo,
      editdata.fechaNacimiento
    );
    setIsUserLogged(false);
    setIsUserHotelLogged(true);
    signOut();
    history.push("/login");
  };

  return (
    <section>
      <div className="form-container-hotels">
        <Link className="close-btn-hotels" to="/">
          <p>
            <i class="fas fa-arrow-left"></i>
          </p>
        </Link>
        <div className="form-content-left-hotels">
          <div className="form-avatar-hotels">
            <UploadImg />
          </div>
          <h1>
            {"Hello, " + profileData.nombre + " " + profileData.apellidos}
          </h1>
          <h2>
            <Link className="link-hotels" to="/user/gestion">
              Manage your bookings <i class="fas fa-edit"></i>
            </Link>
          </h2>
        </div>
        <div className="form-content-right-hotels">
          <form className="form-hotels" onSubmit={handleSubmit(onSubmit)}>
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
                placeholder={profileData.nombre}
              />
              {errors.nombre && <p>{errors.nombre}</p>}
            </div>
            <div className="form-inputs-hotels">
              <label htmlFor="apellidos" className="form-label-hotels">
                Last Name
              </label>
              <input
                id="apellidos"
                type="text"
                name="apellidos"
                ref={register()}
                className="form-input-hotels"
                placeholder={profileData.apellidos}
              />
              {errors.apellidos && <p>{errors.apellidos}</p>}
            </div>
            <div className="form-inputs-hotels">
              <label htmlFor="correo" className="form-label">
                Email
              </label>
              <input
                id="correo"
                type="email"
                name="correo"
                ref={register()}
                className="form-input-hotels"
                placeholder={profileData.correo}
              />
              {errors.correo && <p>{errors.correo}</p>}
            </div>
            <button className="form-input-btn-hotels userhotel" type="submit">
              <strong>Save</strong>
            </button>
            <span className="form-input-login-hotels">
              <p>
                If you want to delete your account click
                <Link onClick={() => abrirCerrarModalDelete()}> here</Link>
              </p>
              <Modal open={modal} onClose={abrirCerrarModalDelete}>
                {bodyDelete}
              </Modal>
            </span>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
