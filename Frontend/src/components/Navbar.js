import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserInfo } from "../http/api";
import "../css/Navbar.css";
import ShowToLoggedInUsers from "./ShowToLoggedInUser";
import ShowToGuestUsers from "./ShowToGuestUser";
import ShowToLoggedInUserHotel from "./ShowToLoggedInUserHotel";
import Dropdown from "./Dropdown";
import useAuth from "../shared/hooks/useAuth";
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

function Navbar() {
  const { signOut, userData } = useAuth();
  const styles = useStyles();

  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [dropdown, setDropdown] = useState(false);
  const [profileData, setprofileData] = useState([]);
  const [modal, setModal] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const abrirCerrarModal = () => {
    setModal(!modal);
  };

  const body = (
    <div className={styles.modal}>
      <div align="center">
        <h1>You are about to logout!</h1>
        <h1> Are you sure?</h1>
      </div>
      <br />
      <div align="center">
        <Button className={styles.botones} onClick={signOut}>
          Yes
        </Button>
        <Button className={styles.botones} onClick={() => abrirCerrarModal()}>
          No
        </Button>
      </div>
    </div>
  );

  const onMouseEnter = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(true);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(false);
    }
  };

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  useEffect(() => {
    if (userData) {
      getUserInfo(userData.id).then((data) => {
        setprofileData(data);
      });
    }
  }, [userData]);

  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <img className="logoParlor" src="images/logoParlor.png" alt="" />
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <ShowToGuestUsers>
                <Link
                  to="/sign-up/hotel"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  Register your spaces
                </Link>
              </ShowToGuestUsers>
            </li>
            <li
              className="nav-item"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <ShowToGuestUsers>
                <Link className="nav-links" onClick={closeMobileMenu}>
                  <i className="fas fa-user-circle" />
                  <i className="fas fa-caret-down" />
                </Link>
                {dropdown && <Dropdown />}
              </ShowToGuestUsers>

              <ShowToLoggedInUsers>
                <Link
                  to="/profile"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  {profileData.nombre} {profileData.apellidos}
                </Link>
              </ShowToLoggedInUsers>

              <ShowToLoggedInUserHotel>
                <Link
                  to="/hotels/profile"
                  className="nav-links"
                  onClick={closeMobileMenu}
                >
                  {profileData.nombre} {profileData.apellidos}
                </Link>
              </ShowToLoggedInUserHotel>
            </li>
            <ShowToLoggedInUsers>
              <li className="nav-item">
                <Link className="nav-links">
                  <i
                    onClick={() => abrirCerrarModal()}
                    class="fas fa-power-off"
                  ></i>
                </Link>
                <Modal open={modal} onClose={abrirCerrarModal}>
                  {body}
                </Modal>
              </li>
            </ShowToLoggedInUsers>

            <ShowToLoggedInUserHotel>
              <li className="nav-item">
                <Link className="nav-links">
                  <i
                    onClick={() => abrirCerrarModal()}
                    class="fas fa-power-off"
                  ></i>
                </Link>
                <Modal open={modal} onClose={abrirCerrarModal}>
                  {body}
                </Modal>
              </li>
            </ShowToLoggedInUserHotel>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
