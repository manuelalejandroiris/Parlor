const getDB = require("../../db");
const { deletePhoto } = require("../../helpers");

const deleteEspacio = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    // seleccionar las fotos relacionadas y borrar los ficheros de disco
    const [
      photos,
    ] = await connection.query(
      `SELECT fotos FROM fotosEspacios WHERE idEspacios = ?`,
      [id]
    );

    // borrar las posibles fotos de la tabla fotosEspacios
    await connection.query(`DELETE FROM fotosEspacios WHERE idEspacios = ?`, [
      id,
    ]);

    // .. y del disco
    for (const item of photos) {
      console.log(item);
      await deletePhoto(item.photo);
    }

    // borrar la entrada de la tabla espacios
    await connection.query(`DELETE FROM espacios WHERE idEspacios = ?`, [id]);

    // mandar confirmacion
    res.send({
      status: "ok",
      message: `El Espacio con id ${id} y todos sus elementos relacionas fueron borrados del sistema`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteEspacio;
