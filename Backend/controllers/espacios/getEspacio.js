const getDB = require('../../db');

let connection;

const getEspacio = async (req, res, next) => {
  try {
    connection = await getDB();

    // saco el id de los paramentros de ruta
    const { id } = req.params;

    // hago la query
    const [result] = await connection.query(
      `SELECT DISTINCT a.idHotel, a.nombre AS nombreHotel, a.localidad, a.direccion, b.idHotel, b.idEspacios, b.nombre, b.tipoEspacio, b.descripcion, b.precio, c.fotos, AVG(IFNULL(d.puntuacion,0)) AS score
	    FROM hoteles a RIGHT JOIN espacios b ON (a.idHotel=b.idHotel) LEFT JOIN fotosEspacios c ON (c.idEspacios=b.idEspacios) LEFT JOIN valoracion d ON (d.idEspacios=b.idEspacios)
      WHERE (b.idEspacios=?)
      GROUP BY b.idEspacios;`,
      [id]
    );

    // desestructuro el elemento de los resultados
    const [single] = result;

    const [equipamiento] = await connection.query(`SELECT * FROM equipamiento WHERE idEspacios = ?`, [id]);

    // sacamos las fotos de la entreda
    const [photos] = await connection.query(`SELECT fotos, fechaSubida FROM fotosEspacios WHERE idEspacios = ?`, [id]);

    // sacamos las fotos de la entreda
    const [
      valoracion,
    ] = await connection.query(`SELECT fechaValoracion, comentarios, puntuacion FROM valoracion WHERE idEspacios = ?`, [
      id,
    ]);

    res.send({
      message: 'ok',
      data: { ...single, equipamiento, photos, valoracion },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = getEspacio;
