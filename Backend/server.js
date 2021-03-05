require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

// controladores de hoteles
const {
  listHoteles,
  getHotel,
  newHotel,
  editHotel,
  deleteHotel,
  addHotelPhoto,
  deleteHotelPhoto,
} = require("./controllers/hoteles");

// controladores de espacios
const {
  listEspacios,
  getEspacio,
  newEspacio,
  editEspacio,
  deleteEspacio,
  addEspacioPhoto,
  deleteEspacioPhoto,
  voteEspacios,
} = require("./controllers/espacios");

// controladores de usuarios
const {
  newUser,
  validateUser,
  loginUser,
  getUser,
  deleteUser,
  editUser,
  editUserPassword,
  recoverUserPassword,
  resetUserPassword,
} = require("./controllers/usuarios");

// controladores de reservas
const {
  listReservas,
  getReserva,
  newReserva,
  editReserva,
  deleteReserva,
} = require("./controllers/reservas");

// middlewares
const hotelExists = require("./middlewares/hotelExists");
const userExists = require("./middlewares/userExists");
const isUser = require("./middlewares/isUser");
const canEdit = require("./middlewares/canEdit");

const { PORT } = process.env;

// creo la app de express
const app = express();

// aplico middlewares

// logger
app.use(morgan("dev"));

//body parsers (body en JSON)
app.use(bodyParser.json());

// body parser (multipart from data <- subida de imagenes)
app.use(fileUpload());

// static
app.use(express.static(path.join(__dirname, "static")));

// peticiones extenas
app.use(cors());

/* 
    Rutas Hoteles API
*/

// GET - /hoteles
//devuelve todos los elementos de la tabla de hoteles
app.get("/hoteles", listHoteles);

// GET - /hoteles/:id
// devuelve un solo hotel
app.get("/hoteles/:id", getHotel);

// GET - /hoteles/:id
// devuelve un solo hotel
app.get("/hoteles/view/:id", addHotelPhoto);

//POST - /hoteles
// crea un nuevo hotel
app.post("/hoteles/", isUser, newHotel);

// PUT - /hoteles/:id
// edita un hotel en la BBDD
app.put("/hoteles/:id", isUser, hotelExists, canEdit, editHotel);

// DELETE - /hoteles/:id
// borra un hotel en la BBDD
app.delete("/hoteles/:id", isUser, hotelExists, canEdit, deleteHotel);

//POST - /hoteles/:id/photos
// añade una foto a un hotel
app.post("/hoteles/:id/photos", isUser, hotelExists, canEdit, addHotelPhoto);

// DELETE -/hoteles/:id/photos/:photosId
// borra una foto a un hotel
app.get(
  "/hoteles/espacios/:id",
  isUser,
  hotelExists,
  canEdit,
  deleteHotelPhoto
);

/* // POST -/hoteles/:id/votes
// vota una entrada
app.post("/hoteles/:id/votes", hotelExists, voteSpaces);*/

/* 
    Rutas Espacios API
*/

// GET - /espacios
//devuelve todos los elementos de la tabla de espacios
app.get("/espacios", listEspacios);

// GET - /espacios/:id
// devuelve un solo espacios
app.get("/espacios/:id", getEspacio);

//POST - /espacios
// crea un nuevo espacios
app.post("/hoteles/:idHotel/espacios", isUser, newEspacio);

// PUT - /espacios/:id
// edita un espacio en la BBDD
app.put("/espacios/:id", editEspacio);

// DELETE - /espacios/:id
// borra un espacios en la BBDD
app.delete("/espacios/:id", deleteEspacio);

// POST - /espacios/:id/photo (token)
// Añade una foto a un espacio
app.post(
  "/hoteles/:id/espacios/:idEspacio/fotos",
  isUser,
  canEdit,
  addEspacioPhoto
);

// DELETE -/hoteles/:id/photos/:photosId
// borra una foto a un hotel
app.delete("/espacios/:id/fotos/:idFotos", isUser, canEdit, deleteEspacioPhoto);

// POST - /espacios/:id/votes
// vota un espacio
app.post("/espacios/:id/votes", voteEspacios);

/* 
    Rutas usuarios API
*/

// POST -/users
// Registra un nuevo usuario (sin validar) ✅
app.post("/usuarios", newUser);

// GET - /users//users/validate/:validationCode
// Valida un usuario que se acaba de registrar ✅
app.get("/users/validate/:registrationCode", validateUser);

// POST - /users/login
// Hace login de un usuario ✅
app.post("/usuarios/login", loginUser);

// GET - /users/:id
// Muestra información de usuario ✅
app.get("/usuarios/:id", isUser, userExists, getUser);

// DELETE - /users/:id
// Anonimiza un usuario ✅
app.delete("/usuarios/:id", isUser, userExists, deleteUser);

// PUT - /users/:id
// Edita los datos de un usuario ✅
app.put("/usuarios/:id", isUser, userExists, editUser);

// PUT - /users/:id/password
// Edita la contraseña de un usuario ✅
app.put("/usuarios/:id/password", isUser, userExists, editUserPassword);

// POST - /users/recover-password
// Enviar un correo con el código de reseteo de contraseña a un correo ✅
app.post("/usuarios/recover-password", recoverUserPassword);

// POST - /users/reset-password
// Cambiar la contraseña de un usuario
app.post("/usuarios/reset-password", resetUserPassword);

/* 
    Rutas reservas API
*/

// GET - /reservas
//devuelve todos los elementos de la tabla de reservas
app.get("/reservas/:id", listReservas);

// GET - /reservas/:id
// devuelve un solo reserva
app.get("/reservas/:id", getReserva);

//POST - /reservas
// crea un nuevo reserva
app.post("/:idEspacios/reservas", newReserva);

// PUT - /reservas/:id
// edita un reserva en la BBDD
app.put("/reservas/:id", editReserva);

// DELETE - /reservas/:id
// borra un reserva en la BBDD
app.delete("/reservas/:id", deleteReserva);

// middleware de error || devuelve .json tiene entrada status error y mensaje error
app.use((error, req, res, next) => {
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

// middleware 404
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT} 🔥`);
});
