const getDB = require("../../db");
const { deletePhoto } = require("../../helpers");

const deleteHotel = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    // seleccionar las fotos relacionadas y borrar los ficheros de disco
    const [
      espacios,
    ] = await connection.query(
      `SELECT idEspacios FROM espacios WHERE idHotel = ?`,
      [id]
    );

    console.log(espacios);
    // .. y del disco
    for (const itemEspacios of espacios) {
      console.log(itemEspacios.idEspacios);

      const [
        photos,
      ] = await connection.query(
        `SELECT fotos FROM fotosEspacios WHERE idEspacios = ?`,
        [itemEspacios.idEspacios]
      );

      await connection.query(`DELETE FROM fotosEspacios WHERE idEspacios = ?`, [
        itemEspacios.idEspacios,
      ]);

      for (const item of photos) {
        console.log(item);
        await deletePhoto(item.photo);
      }

      console.log("borrado " + itemEspacios.idEspacios);
      console.log("siguiente en borrar " + itemEspacios.idEspacios);
    }

    await connection.query(`DELETE FROM espacios WHERE idHotel = ?`, [id]);

    // borrar la entrada de la tabla hoteles
    await connection.query(`DELETE FROM hoteles WHERE idHotel = ?`, [id]);

    // mandar confirmacion
    res.send({
      status: "ok",
      message: `El Hotel con id ${id} y todos sus elementos relacionas fueron borrados del sistema`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteHotel;
