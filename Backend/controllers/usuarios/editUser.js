const getDB = require("../../db");
const { savePhoto, generateRandomString, sendMail } = require("../../helpers");

const editUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Cosas que podemos editar: correo, nombre, apellidos, avatar, telefono, metodoDePago, fechaNacimiento
    // Sacar id de req.params
    const { id } = req.params; // este es el id de usuario que queremos editar

    // Sacar nombre, correo e información relevante del usuario de req.body
    const {
      nombre,
      apellidos,
      correo,
      telefono,
      fechaNacimiento,
      metodoDePago,
    } = req.body;

    // Comprobar que el usuario que queremos editar es el mismo del token o somos administradores
    if (req.userAuth.id !== Number(id) && req.userAuth.role !== "admin") {
      const error = new Error("No tienes permisos para editar este usuario");
      error.httpStatus = 403;
      throw error;
    }

    // Sacar la información actual del usuario en la base de datos
    const [currentUser] = await connection.query(
      `
      SELECT correo, nombre, apellidos, telefono, fechaNacimiento, metodoDePago
      FROM usuarios
      WHERE idUsuario=?
      `,
      [id]
    );

    if (req.files && req.files.avatar) {
      // Se está subiendo un avatar
      const usuarioAvatar = await savePhoto(req.files.avatar);
      await connection.query(
        `
        UPDATE usuarios
        SET avatar=?
        WHERE idUsuario=?
      `,
        [usuarioAvatar, id]
      );
    }

    // Si el correo enviado es diferente al de la base de datos procesar el nuevo correo
    if (correo && correo !== currentUser[0].correo) {
      // Comprobar que no exista otro usuario con el nuevo correo
      const [existingEmail] = await connection.query(
        `
        SELECT idUsuario
        FROM usuarios
        WHERE correo=?
      `,
        [correo]
      );

      if (existingEmail.length > 0) {
        const error = new Error(
          "Ya existe un usuario con el correo proporcionado en la base de datos"
        );
        error.httpStatus = 409;
        throw error;
      }

      // Creo un código de registro (contraseña temporal de un solo uso)
      const registrationCode = generateRandomString(40);

      // Mando un correo al usuario con el link de confirmación de correo
      const emailBody = `
        Acabas de modificar tu correo en la app de Gestión de Espacios. 
        Pulsa en este link para validar tu nuevo correo: ${process.env.PUBLIC_HOST}/users/validate/${registrationCode}
      `;

      await sendMail({
        to: correo,
        subject: "Confirma tu nuevo correo",
        body: emailBody,
      });

      // Actualizar los datos finales
      await connection.query(
        `
        UPDATE usuarios
        SET nombre=?, apellidos=?, correo=?, telefono=?, fechaNacimiento=?, metodoDePago=?, lastAuthUpdate=?, active=0, registrationCode=?
        WHERE idUsuario=?
      `,
        [
          nombre,
          apellidos,
          correo,
          telefono,
          fechaNacimiento,
          metodoDePago,
          new Date(),
          registrationCode,
          id,
        ]
      );

      // Dar una respuesta
      res.send({
        status: "ok",
        message:
          "Datos de usuario actualizados. Mira tu correo para validar la nueva dirección",
      });
    } else {
      await connection.query(
        `
        UPDATE usuarios
        SET nombre=?, apellidos=?
        WHERE idUsuario=?
      `,
        [nombre, apellidos, id]
      );
    }
    res.send({
      status: "ok",
      message: "Datos de usuario actualizados",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editUser;
