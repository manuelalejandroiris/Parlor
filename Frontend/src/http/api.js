const apiUrl = "http://localhost:4000";

const requestMethods = {
  post: "POST",
  get: "GET",
  put: "PUT",
  delete: "DELETE",
};
const endpoints = {
  login: "/usuarios/login",
  getUserInfo: "/usuarios/",
  entries: "/entries",
  signUp: "/usuarios",
  getHotelInfo: "/hoteles/",
  getSpaceInfo: "/espacios",
  getResults: "/results",
  newBooking: "/reservas",
  getBooking: "/reservas/",
};

async function fetchFormData(path, { body, method }) {
  const token = localStorage.getItem("token");
  const headers = new Headers();
  headers.append("Authorization", token);

  return await fetch(`${apiUrl}${path}`, { method, headers, body });
}

async function fetchApi(path, { body, method }) {
  const token = localStorage.getItem("token");
  const headers = new Headers({ "Content-Type": "application/json" });
  if (token) {
    headers.append("Authorization", token);
  }
  const request = await fetch(`${apiUrl}${path}`, {
    headers: headers,
    method: method,
    body: JSON.stringify(body),
  });
  const requestData = await request.json();
  if (requestData.status === "error") {
    throw requestData.message;
  }
  return requestData;
}

export async function login(email, password) {
  const tokenData = await fetchApi(endpoints.login, {
    method: requestMethods.post,
    body: { email, password },
  });
  const token = tokenData.data.token;
  localStorage.setItem("token", token);
  return token;
}

export async function signUpApi(data) {
  return await fetchApi(endpoints.signUp, {
    method: requestMethods.post,
    body: data,
  });
}

export async function getUserInfo(userId) {
  const userData = await fetchApi(`${endpoints.getUserInfo}${userId}`, {
    method: requestMethods.get,
  });
  return userData.data;
}

export async function newBooking(
  idEspacios,
  idUsuario,
  fechaLlegada,
  fechaSalida,
  precioReserva
) {
  console.log(idEspacios, idUsuario, fechaLlegada, fechaSalida, precioReserva);
  return await fetchApi(`/${idEspacios}${endpoints.newBooking}`, {
    method: requestMethods.post,
    body: { idEspacios, idUsuario, fechaLlegada, fechaSalida, precioReserva },
  });
}

export async function getSpaceInfo(idEspacios) {
  const userData = await fetchApi(`${endpoints.getSpaceInfo}/${idEspacios}`, {
    method: requestMethods.get,
  });
  return userData.data;
}

export async function getSpaceIdHotel(idHotel) {
  console.log(idHotel);
  const userData = await fetchApi(
    `${endpoints.getHotelInfo}espacios/${idHotel}`,
    {
      method: requestMethods.get,
    }
  );
  return userData.data;
}

export async function getHotelInfo(idUsuario) {
  const userData = await fetchApi(`${endpoints.getHotelInfo}${idUsuario}`, {
    method: requestMethods.get,
  });
  return userData.data;
}

export async function newHotel(nombre, localidad, direccion) {
  const body = new FormData();
  body.append("nombre", nombre);
  body.append("localidad", localidad);
  body.append("direccion", direccion);

  return await fetchFormData(endpoints.getHotelInfo, {
    method: requestMethods.post,
    body,
  });
}

export async function getSpaceLocation(location) {
  const userData = await fetchApi(
    `${endpoints.getSpaceInfo}?search=${location}`,
    {
      method: requestMethods.get,
    }
  );
  return userData.data;
}

export async function getSpaces() {
  const userData = await fetchApi(`${endpoints.getSpaceInfo}`, {
    method: requestMethods.get,
  });
  return userData.data;
}

export async function editUser(
  idUsuario,
  nombre,
  apellidos,
  telefono,
  correo,
  fechaNacimiento,
  avatar
) {
  return await fetchApi(`${endpoints.getUserInfo}${idUsuario}`, {
    method: requestMethods.put,
    body: {
      nombre,
      apellidos,
      telefono,
      correo,
      fechaNacimiento,
      avatar,
    },
  });
}

export async function editHotel(idHotel, nombre, localidad, direccion) {
  const body = new FormData();
  body.append("nombre", nombre);
  body.append("localidad", localidad);
  body.append("direccion", direccion);

  return await fetchFormData(`${endpoints.getHotelInfo}${idHotel}`, {
    method: requestMethods.put,
    body,
  });
}

export async function deleteUser(idUsuario) {
  return await fetchApi(`${endpoints.getUserInfo}${idUsuario}`, {
    method: requestMethods.delete,
  });
}

export async function deleteHotelInfo(idHotel) {
  console.log(idHotel);
  return await fetchApi(`${endpoints.getHotelInfo}${idHotel}`, {
    method: requestMethods.delete,
  });
}

export async function deleteSpaceInfo(idEspacio) {
  console.log(idEspacio);
  return await fetchApi(`${endpoints.getSpaceInfo}/${idEspacio}`, {
    method: requestMethods.delete,
  });
}

export async function editSpace(
  idEspacio,
  nombre,
  tipoEspacio,
  descripcion,
  aforo,
  precio
) {
  const body = new FormData();
  body.append("nombre", nombre);
  body.append("tipoEspacio", tipoEspacio);
  body.append("descripcion", descripcion);
  body.append("aforo", aforo);
  body.append("precio", precio);

  return await fetchFormData(`${endpoints.getSpaceInfo}/${idEspacio}`, {
    method: requestMethods.put,
    body,
  });
}

export async function newSpace(
  idHotel,
  nombre,
  tipoEspacio,
  descripcion,
  aforo,
  precio
) {
  const body = new FormData();
  body.append("nombre", nombre);
  body.append("tipoEspacio", tipoEspacio);
  body.append("descripcion", descripcion);
  body.append("aforo", aforo);
  body.append("precio", precio);

  return await fetchFormData(
    `${endpoints.getHotelInfo}${idHotel}${endpoints.getSpaceInfo}`,
    {
      method: requestMethods.post,
      body,
    }
  );
}

export async function getHotelView(idHotel) {
  const userData = await fetchApi(`${endpoints.getHotelInfo}view/${idHotel}`, {
    method: requestMethods.get,
  });
  return userData.data;
}

export async function getBookingInfo(idUsuario) {
  console.log(idUsuario);
  const userData = await fetchApi(`${endpoints.getBooking}${idUsuario}`, {
    method: requestMethods.get,
  });
  return userData.data;
}

export async function deleteBookingInfo(idReserva) {
  console.log(idReserva);
  const userData = await fetchApi(`${endpoints.getBooking}${idReserva}`, {
    method: requestMethods.delete,
  });
  return userData.data;
}
