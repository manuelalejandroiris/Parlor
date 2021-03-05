const { format } = require("date-fns");
const sharp = require("sharp");
const uuid = require("uuid");
const path = require("path");
const { ensureDir, unlink } = require("fs-extra");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");

const { UPLOAD_DIRECTORY } = process.env;
const uploadsDir = path.join(__dirname, UPLOAD_DIRECTORY);

// Configuro sendgrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Formatea un objeto de fecha a DATETIME de SQL
function formatDateToDB(dateObject) {
  return format(dateObject, "yyyy-MM-dd HH:mm:ss");
}

// funcion que permite el borrado
async function deletePhoto(photo) {
  const photoPath = path.join(uploadsDir, photo);

  await unlink(photoPath);
}

// guarda foto en el directorio de uploads
async function savePhoto(imageData) {
  // imageData es el objeto con la informacion de la imagen

  // asegurarse que el directorio de subida de imagenes exista
  await ensureDir(uploadsDir);

  // leer la imagen con sharp
  const image = sharp(imageData.data);

  // comprobar que la imgaen no tenga un tamaño mayor a x pix de ancho
  const imageInfo = await image.metadata();

  // si es mayor que ese tamaño redimensionarla a ese tamaño
  const IMAGE_MAX_WIDTH = 1000;
  if (imageInfo > IMAGE_MAX_WIDTH) {
    image.resize(IMAGE_MAX_WIDTH);
  }

  // generar un nombre unico para la imagen
  const savedImageName = `${uuid.v4()}.jpg`;

  // guardar la imagen en el directorio de subida de imagenes
  await image.toFile(path.join(uploadsDir, savedImageName));

  // devolver el nombre del fichero
  return savedImageName;
}

// genera una cadena de caracteres aleatoria
function generateRandomString(length) {
  return crypto.randomBytes(length).toString("hex");
}

async function sendMail({ to, subject, body }) {
  // Instrucciones: https://www.npmjs.com/package/@sendgrid/mail
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM, // Use the email address or domain you verified above
      subject,
      text: body,
      html: `
        <div>
          <h1>${subject}</h1>
          <p>${body}</p>
        </div>
      `,
    };

    await sgMail.send(msg);
  } catch (error) {
    throw new Error("Error enviando mail");
  }
}

module.exports = {
  formatDateToDB,
  savePhoto,
  deletePhoto,
  generateRandomString,
  sendMail,
};
