const getDB = require('../db');

const hotelExists = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { id } = req.params;

        const [result] = await connection.query(
            `SELECT idHotel FROM hoteles WHERE idHotel = ?`,
            [id]
        );

        if (result.length === 0) {
            const error = new Error('Hotel no encontrado');
            error.httpStatus = 404;
            throw error;
        }

        next();

    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = hotelExists;