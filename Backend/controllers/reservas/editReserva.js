const getDB = require('../../db');

const editReserva = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // comprobar q existe un hotel con esa id
    const { fechaLlegada, fechaSalida } = req.body;
    const { id } = req.params;

    // hacer la query de SQL UPDATE
    const [
      results,
    ] = await connection.query(
      `UPDATE reservas SET fechaRegistro = curdate(), fechaLlegada = ?, fechaSalida = ? WHERE idReserva = ?`,
      [fechaLlegada, fechaSalida, id]
    );

    // devolver una respuesta

    res.send({
      status: 'ok',
      data: { ...results },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editReserva;
