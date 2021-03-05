const getDB = require('../../db');
const {
  formatDateToDB,
  savePhoto
} = require('../../helpers');

let connection;

const addEspacioPhoto = async (req, res, next) => {
  try {
    connection = await getDB();

    const {
      idEspacio
    } = req.params;

    // miro cuantas fotos tiene el espacio
    const [currentPhotos] = await connection.query(`SELECT idFotosEspacios FROM fotosEspacios WHERE idEspacios = ?`, [
      idEspacio,
    ]);

    // si tiene 3 o mas fotos devuelvo un error
    if (currentPhotos.length >= 3) {
      const error = new Error('No puedes subir más fotos a este espacio, ya tienes 3');
      error.httpStatus = 403;
      throw error;
    }

    let savedPhoto;

    if (req.files && req.files.fotos) {
      // guardo la foto en disco y saco el nombre con el q la guarde
      savedPhoto = await savePhoto(req.files.fotos);

      const now = new Date();
      // meto en la tabla de fotos una nueva foto
      await connection.query(
        `INSERT INTO fotosEspacios (fechaSubida, fotos, idEspacios)
                VALUES (?, ?, ?)`,
        [formatDateToDB(now), savedPhoto, idEspacio]
      );
    }

    res.send({
      status: 'ok',
      photo: savedPhoto,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = addEspacioPhoto;