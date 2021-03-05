const getDB = require('../../db');

const listHoteles = async (req, res, next) => {
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

    if (search) {
      // leo las entradas de la base de datos por busqueda
      [results] = await connection.query(
        `
            SELECT * from hoteles
            WHERE hoteles.localidad LIKE ?
            `,
        // ORDER BY ${orderBy} ${orderDirection};
        [`%${search}%`]
      );
    } else {
      // leo las entradas de la base de datos
      [results] = await connection.query(`
            SELECT * from hoteles;
            `);
      // ORDER BY ${orderBy} ${orderDirection};
    }

    // devuelvo un json con las entradas
    res.send({
      message: 'ok',
      data: results,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listHoteles;
