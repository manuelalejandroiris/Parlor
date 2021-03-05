const getDB = require('../../db');

const listEspacios = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // saco querystring
    const { search /*order*/ } = req.query;
    /*
        const validOrderFields = ['nombre', 'direccion', 'localidad'];
        const validOrderDirection = ["DESC", "ASC"];

        const orderBy = validOrderFields.includes(order) ? order : "localidad";
        const orderDirection = validOrderDirection.includes(direction)
        ? direction: "ASC";*/

    let results;
    // let photos;

    if (search) {
      // leo las entradas de la base de datos por busqueda
      [results] = await connection.query(
        `SELECT DISTINCT a.idHotel, a.nombre AS nombreHotel, a.localidad, b.idHotel, b.idEspacios, b.nombre, b.tipoEspacio, b.descripcion, b.precio, c.fotos, AVG(IFNULL(d.puntuacion,0)) AS score
	    FROM hoteles a RIGHT JOIN espacios b ON (a.idHotel=b.idHotel) LEFT JOIN fotosEspacios c ON (c.idEspacios=b.idEspacios) LEFT JOIN valoracion d ON (d.idEspacios=b.idEspacios)
      WHERE (a.localidad LIKE ?)
      GROUP BY b.idEspacios;
            `,
        // ORDER BY ${orderBy} ${orderDirection};
        [`%${search}%`]
      );
    } else {
      // leo las entradas de la base de datos
      [results] = await connection.query(`
        SELECT DISTINCT a.idHotel, a.nombre AS nombreHotel, a.localidad, b.idHotel, b.idEspacios, b.nombre, b.tipoEspacio, b.descripcion, b.precio, c.fotos, AVG(IFNULL(d.puntuacion,0)) AS score
        FROM hoteles a RIGHT JOIN espacios b ON (a.idHotel=b.idHotel) LEFT JOIN fotosEspacios c ON (c.idEspacios=b.idEspacios) LEFT JOIN valoracion d ON (d.idEspacios=b.idEspacios)
        GROUP BY b.idEspacios;
        `);
      /* [photos] = await connection.query(`
        SELECT DISTINCT a.idEspacios, b.fotos, b.fechaSubida
        FROM espacios a RIGHT JOIN fotosEspacios b ON (a.idEspacios=b.idEspacios)
        GROUP BY b.idEspacios;
        `); */
      // ORDER BY ${orderBy} ${orderDirection};
    }

    // devuelvo un json con las entradas
    res.send({
      status: 'ok',
      data: results,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listEspacios;
