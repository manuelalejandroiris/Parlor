const getDB = require("../../db");

// CONSEGUIMOS LOS ESPACIOS SEGUN EL ID DE HOTEL

const deleteEntryPhoto = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // saco el id de los paramentros de ruta
    const { id } = req.params;

    // hago la query
    const [result] = await connection.query(
      `
        SELECT * from espacios WHERE espacios.idHotel = ?
        `,
      [id]
    );

    const [single] = result;

    res.send({
      message: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteEntryPhoto;
