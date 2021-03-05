const getDB = require('../../db');

const editEspacio = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // comprobar q existe un espacio con esa id
    const { id } = req.params;
    const { nombre, tipoEspacio, descripcion, aforo, precio, estado } = req.body;

    // hacer la query de SQL UPDATE
    const [
      results,
    ] = await connection.query(
      `UPDATE espacios SET fechaRegistro = curdate(), nombre = ?, tipoEspacio = ?, descripcion = ?, aforo = ?, precio = ?, estado = ? WHERE idEspacios = ?`,
      [nombre, tipoEspacio, descripcion, aforo, precio, estado, id]
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

module.exports = editEspacio;
