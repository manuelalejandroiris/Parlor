const getDB = require("../../db");
const { generateRandomString, sendMail } = require("../../helpers");

const recoverUserPassword = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Sacar de req.body el correo a donde enviar la información de cambio de contraseña
    const { email } = req.body;

    // Si no hay email dar un error
    if (!email) {
      const error = new Error("Faltan campos");
      error.httpStatus = 400;
      throw error;
    }

    // Comprobar que el correo existe en la base de datos y si no dar un error
    const [currentEmail] = await connection.query(
      `
      SELECT idUsuario
      FROM usuarios
      WHERE correo=?
    `,
      [email]
    );

    if (currentEmail.length === 0) {
      const error = new Error("No hay ningún usuario registrado con ese email");
      error.httpStatus = 404;
      throw error;
    }

    // Generar una código de recuperación

    const recoverCode = generateRandomString(20);

    // Enviar por correo el código de recuperación
    // Mando un correo al usuario con el link de confirmación de correo

    const emailBody = `
        Se ha solicitado un cambio de contraseña para el usuario registrado con este correo en la app Gestion de Espacios.
        
        El código de recuperación es: ${recoverCode} 

        Si no has sido quien solicitó el cambio, por favor ignora este correo. Puedes hacer login con tu contraseña habitual.

        Gracias!
      `;

    await connection.query(
      `
      UPDATE usuarios
      SET recoverCode=?
      WHERE correo=?
    `,
      [recoverCode, email]
    );

    await sendMail({
      to: email,
      subject: "Cambio de contraseña en Gestión de Espacios",
      body: emailBody,
    });

    // Dar una respuesta
    res.send({
      status: "Ok",
      message: "Correo enviado",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = recoverUserPassword;
