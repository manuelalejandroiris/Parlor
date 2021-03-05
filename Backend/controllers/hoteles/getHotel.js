const getDB = require("../../db");

let connection;

const getHotel = async (req, res, next) => {
  try {
    connection = await getDB();

    // saco el id de los paramentros de ruta
    const { id } = req.params;

    // hago la query
    const [result] = await connection.query(
      `
        SELECT * from hoteles WHERE hoteles.user_id = ?
        `,
      [id]
    );

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

module.exports = getHotel;
