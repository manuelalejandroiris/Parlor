const getDB = require('../../db');
const { generateRandomString, sendMail } = require('../../helpers');

const newUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Recojo de req.body el email y la password
    const { nombre, apellidos, email, password, admin } = req.body;

    // Compruebo que no estén vacíos
    if (!nombre || !apellidos || !email || !password) {
      const error = new Error('Faltan campos');
      error.httpStatus = 400;
      throw error;
    }

    // Compruebo que no exista un usuario en la base de datos con ese email
    const [existingUser] = await connection.query(
      `
            SELECT idUsuario
            FROM usuarios
            WHERE correo=?
        `,
      [email]
    );

    if (existingUser.length > 0) {
      const error = new Error('Ya hay un usuario en la base de datos con ese email');
      error.httpStatus = 409;
      throw error;
    }

    // Creo un codigo de registro (contraseña temporal de un solo uso)
    const registrationCode = generateRandomString(40);

    // Mando un mail al usuario con el link de confirmación de email
    const emailBody = `
        Te acabas de registrar en Gestión de Espacios. 
        Pulsa en este link para validar tu email: ${process.env.PUBLIC_HOST}/users/validate/${registrationCode}
        `;

    await sendMail({
      to: email,
      subject: 'Activa tu usuario de Gestión de Espacios',
      body: emailBody,
    });

    // Meto el usuario en la base de datos desactivado y con ese código de registro
    await connection.query(
      `
        INSERT INTO usuarios(fechaRegistro, nombre, apellidos, correo, contraseña, registrationCode, admin)
        VALUES(?,?,?,?,SHA2(?, 512),?, ?) 
        `,
      [new Date(), nombre, apellidos, email, password, registrationCode, admin]
    );

    // Mando una respuesta
    res.send({
      status: 'ok',
      message: 'Usuario registrado comprueba tu email para activarlo',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newUser;
