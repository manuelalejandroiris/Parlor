const getDB = require('../../db');

const deleteReserva = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    // borrar la entrada de la tabla reservas
    await connection.query(`DELETE FROM reservas WHERE idReserva = ?`, [id]);

    // mandar confirmacion
    res.send({
      status: 'ok',
      message: `La Reserva con id ${id} y todos sus elementos relacionas fueron borrados del sistema`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteReserva;
