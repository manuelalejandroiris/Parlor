const getDB = require('../../db');
const { deletePhoto } = require('../../helpers');

const deleteEspacioPhoto = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id, idFotos } = req.params;

    // Selecciono la foto de la base de datos
    const [current] = await connection.query(
      `
      SELECT fotos FROM fotosEspacios
      WHERE idFotosEspacios = ? AND idEspacios = ?
    `,
      [idFotos, id]
    );

    // Si la foto no existe devuelvo un error
    if (current.length === 0) {
      const error = new Error('La foto no existe');
      error.httpStatus = 404;
      throw error;
    }

    // Borrar la foto de disco
    await deletePhoto(current[0].fotos);

    // Borrar la foto de la base de datos
    await connection.query(
      `
      DELETE FROM fotosEspacios
      WHERE idFotosEspacios = ? AND idEspacios = ? 
    `,
      [idFotos, id]
    );

    res.send({
      status: 'ok',
      message: 'Foto borrada',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteEspacioPhoto;
