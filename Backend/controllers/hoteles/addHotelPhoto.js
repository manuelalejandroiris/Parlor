const getDB = require("../../db");

// CONSEGUIMOS SOLO UN HOTEL SEGUN EL ID DE HOTEL

let connection;

const addHotelPhoto = async (req, res, next) => {
  try {
    connection = await getDB();

    // saco el id de los paramentros de ruta
    const { id } = req.params;

    // hago la query
    const [result] = await connection.query(
      `
        SELECT * from hoteles WHERE hoteles.idHotel = ?
        `,
      [id]
    );

    // desestructuro el elemento de los resultados
    const [single] = result;

    res.send({
      message: "ok",
      data: single,
      // photos,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = addHotelPhoto;
