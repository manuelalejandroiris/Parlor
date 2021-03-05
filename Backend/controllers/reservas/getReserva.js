const getDB = require('../../db');

let connection;

const getReserva = async (req, res, next) => {
  try {
    connection = await getDB();

    // saco el id de los paramentros de ruta
    const { id } = req.params;

    // hago la query
    const [result] = await connection.query(
      `
        SELECT * from reservas WHERE reservas.idReserva = ?
        `,
      [id]
    );

    // desestructuro el elemento de los resultados
    const [single] = result;

    // =======================================================
    /* sacamos las fotos de la entreda
        const [photos] = await connection.query(
            `SELECT photos, uploadData FROM hoteles_photos WHERE entry_id = ?`,
        [id]
        );*/
    // =======================================================

    res.send({
      message: 'ok',
      data: single /*{
                ...single,
                photos,
            }*/,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = getReserva;
