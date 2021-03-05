const getDB = require("../../db");

const editUserPassword = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Recoger de req.params el id de usario al que tengo que cambiar la contraseña
    const { id } = req.params;

    // Recoger de req.body oldPassword y newPassword
    const { oldPassword, newPassword } = req.body;

    // Comprobamos que la nueva contraseña tenga al menos 8 caracteres
    if (newPassword.length < 8) {
      const error = new Error("La nueva contraseña es muy corta");
      error.httpStatus = 400;
      throw error;
    }

    // Comprobar que el usuario que viene del token es el mismo al que queremos cambiar la pass
    if (req.userAuth.id !== Number(id)) {
      const error = new Error(
        "No tienes permisos para cambiar la contraseña de este usuario"
      );
      error.httpStatus = 403;
      throw error;
    }

    // Comprobar que la contraseña antigua es correcta

    const [current] = await connection.query(
      `
      SELECT idUsuario
      FROM usuarios
      WHERE idUsuario=? AND contraseña=SHA2(?, 512)
    `,
      [id, oldPassword]
    );

    if (current.length === 0) {
      const error = new Error("La contraseña antigua no es correcta");
      error.httpStatus = 401;
      throw error;
    }

    // Guardar la nueva contraseña
    await connection.query(
      `
      UPDATE usuarios
      SET contraseña=SHA2(?, 512), lastAuthUpdate=?
      WHERE idUsuario=?
    `,
      [newPassword, new Date(), id]
    );

    res.send({
      status: "ok",
      message: "Contraseña cambiada",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editUserPassword;
