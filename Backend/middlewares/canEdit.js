const getDB = require("../db");

const canEdit = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    // Seleccionar la entrada de la base de datos para saber quien la creó
    const [current] = await connection.query(
      `
      SELECT user_id
      FROM hoteles
      WHERE idHotel=?
    `,
      [id]
    );

    // comprobar q la id de usuario que la creó es la misma que la que viene en el token (o el token es de administrador)
    if (
      current[0].user_id !== req.userAuth.id &&
      req.userAuth.role !== "admin"
    ) {
      const error = new Error("No tienes permisos para editar esta entrada");
      error.httpStatus = 401;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = canEdit;
