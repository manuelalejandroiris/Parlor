const getDB = require("../../db");

const listReservas = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    // saco querystring
    const { search /*order*/ } = req.query;

    /*
        const validOrderFields = ['nombre', 'direccion', 'localidad'];
        const validOrderDirection = ["DESC", "ASC"];

        const orderBy = validOrderFields.includes(order) ? order : "localidad";
        const orderDirection = validOrderDirection.includes(direction)
        ? direction: "ASC";*/

    let results;

    if (search) {
      // leo las entradas de la base de datos por busqueda
      [results] = await connection.query(
        `
            SELECT * from reservas
            WHERE reservas.active LIKE ?
            `,
        // ORDER BY ${orderBy} ${orderDirection};
        [`%${search}%`]
      );
    } else {
      // leo las entradas de la base de datos
      [results] = await connection.query(
        `
      SELECT DISTINCT a.idReserva, DATE_FORMAT(a.fechaLlegada, "%d-%m-%Y") AS fechaLlegada, DATE_FORMAT(a.fechaSalida, "%d-%m-%Y") AS fechaSalida, b.nombre, b.tipoEspacio, b.descripcion, b.idEspacios, b.precio, c.nombre AS nombreHotel
	    FROM reservas a LEFT JOIN espacios b ON (a.idEspacios=b.idEspacios) LEFT JOIN hoteles c ON (b.idHotel=c.idHotel)
      WHERE (a.idUsuario LIKE ?)
      GROUP BY b.idEspacios;
            `,
        [id]
      );
      // ORDER BY ${orderBy} ${orderDirection};
    }

    // devuelvo un json con las entradas
    res.send({
      status: "ok",
      data: results,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listReservas;
