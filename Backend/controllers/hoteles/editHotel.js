const getDB = require('../../db');
const { differenceInHours } = require("date-fns");

const editHotel = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // comprobar q existe un hotel con esa id
    const { id } = req.params;
    const { nombre, direccion, localidad } = req.body;

    // Seleccionar la entrada de la base de datos para saber quien la creó
    const [current] = await connection.query(
      `
      SELECT fechaRegistro
      FROM hoteles
      WHERE idHotel=?
    `,
      [id]
    );

    // Comprobar que pasaron menos de X días desde la creación de la entrada
    const difference = differenceInHours(
      new Date(),
      new Date(current[0].fechaRegistro)
    );

    if (
      difference > Number(process.env.MAX_HOURS_EDIT_MARGIN) &&
      req.userAuth.role !== "admin"
    ) {
      const error = new Error(
        `Pasaron ya ${difference} horas desde la creación de esta entrada y sólo se puede editar si pasaron menos de ${process.env.MAX_HOURS_EDIT_MARGIN} horas. No se puede editar.`
      );
      error.httpStatus = 403;
      throw error;
    }
    
    // hacer la query de SQL UPDATE
    const [
      results,
    ] = await connection.query(
      `UPDATE hoteles SET fechaRegistro = curdate(), nombre = ?, direccion = ?, localidad = ? WHERE idHotel = ?`,
      [nombre, direccion, localidad, id]
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

module.exports = editHotel;
