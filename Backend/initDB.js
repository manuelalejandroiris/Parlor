const getDB = require('./db');
const faker = require('faker');
const {
        random
} = require('lodash');
const {
        formatDateToDB
} = require('./helpers');

let connection;

async function main() {
        try {
                connection = await getDB();

                // Borrar tablas existentes
                await connection.query('DROP TABLE IF EXISTS usuarios');
                await connection.query('DROP TABLE IF EXISTS hoteles');
                await connection.query('DROP TABLE IF EXISTS espacios');
                await connection.query('DROP TABLE IF EXISTS equipamiento');
                await connection.query('DROP TABLE IF EXISTS valoracion');
                await connection.query('DROP TABLE IF EXISTS reservas');

                console.log('Tablas borradas');

                // Crear tabla de Usuarios
                await connection.query(`
                        CREATE TABLE usuarios  
                        (
                        idUsuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                        admin BOOLEAN DEFAULT FALSE,
                        CONSTRAINT usuarios_admin_ck1
                                CHECK (admin = 0 OR admin = 1),
                        fechaRegistro DATETIME NOT NULL,
                        nombre VARCHAR(100) NOT NULL,
                        apellidos VARCHAR(100) NOT NULL,
                        avatar VARCHAR(50),
                        correo VARCHAR(100) NOT NULL,
                        -- solo un registro por correo
                        CONSTRAINT usuarios_correo_uq2 UNIQUE(correo),
                        telefono VARCHAR(50),
                        -- solo un registro por telefono
                        CONSTRAINT usuarios_telefono_uq2 UNIQUE(telefono),
                        contraseña VARCHAR(512) NOT NULL,
                        metodoDePago ENUM ('Tarjeta de Crédito', 'ApplePay', 'GooglePay', 'PayPal'),
                        -- formato YYYY-mm-dd
                        fechaNacimiento DATE,
                        active BOOLEAN DEFAULT false,
                        role ENUM("admin", "normal") DEFAULT "normal" NOT NULL,
                        deleted BOOLEAN DEFAULT false,
                        registrationCode VARCHAR(100),
                        lastAuthUpdate DATETIME,
                        recoverCode VARCHAR(100)
                        )
                `);
                // Crear tabla de hoteles
                await connection.query(`
            CREATE TABLE hoteles
            (
            idHotel INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            fechaRegistro DATETIME NOT NULL,
            -- DEFAULT CURDATE()
            nombre VARCHAR(300) NOT NULL,
            localidad VARCHAR(300) NOT NULL,
            direccion VARCHAR(300) NOT NULL,
            user_id INT
            );
        `);

                // Crear tabla de espacios
                await connection.query(`
            CREATE TABLE espacios
            (
            idEspacios INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            idHotel INT UNSIGNED NOT NULL,
            CONSTRAINT espacios_idHotel_fk1 
                    FOREIGN KEY (idHotel) REFERENCES hoteles(idHotel),
            fechaRegistro DATETIME NOT NULL,
            nombre VARCHAR(300) NOT NULL,
            tipoEspacio ENUM ('Sala de reuniones', 'Sala de conferencia', 'Sala de formación', 'Sala de entrevistas', 'Eventos') NOT NULL,
            descripcion VARCHAR(500) NOT NULL,
            aforo INT NOT NULL,
            precio DECIMAL(5, 2) DEFAULT 0.0,
            estado BOOLEAN DEFAULT FALSE,
            CONSTRAINT espacios_estado_ck1
                    CHECK (estado = 0 OR estado = 1)
            );
        `);

                // Crear tabla de equipamiento
                await connection.query(`
            CREATE TABLE equipamiento
            (
            idEquipamiento INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            idEspacios INT UNSIGNED NOT NULL,
            CONSTRAINT equipamiento_idEspacios_fk1
                    FOREIGN KEY (idEspacios) REFERENCES espacios(idEspacios),
            wifi BOOLEAN DEFAULT FALSE,
            proyector BOOLEAN DEFAULT FALSE,
            pantallaProyector BOOLEAN DEFAULT FALSE,
            television BOOLEAN DEFAULT FALSE,
            climatizacion BOOLEAN DEFAULT FALSE,
            equipoSonido BOOLEAN DEFAULT FALSE,
            catering BOOLEAN DEFAULT FALSE,
            parking BOOLEAN DEFAULT FALSE
            );
        `);

                // Crear tabla de valoracion
                await connection.query(`
            CREATE TABLE valoracion
            (
            idValoracion INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            idUsuario INT UNSIGNED NOT NULL,
            CONSTRAINT valoracion_idUsuario_fk2 
                    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
            idEspacios INT UNSIGNED NOT NULL,
            CONSTRAINT valoracion_idEspacios_fk2 
                    FOREIGN KEY (idEspacios) REFERENCES espacios(idEspacios),
            CONSTRAINT reservas_idUsuario_idEspacios_uq1 UNIQUE (idUsuario, idEspacios),
            fechaValoracion DATETIME NOT NULL,
            comentarios VARCHAR(140) NOT NULL,
            puntuacion TINYINT DEFAULT 0,
            CONSTRAINT valoracion_puntuacion_ck1
                    CHECK (puntuacion >= 1 OR puntuacion <= 5)
            );
        `);

                // Crear tabla fotosEspacios
                await connection.query(`
        CREATE TABLE fotosEspacios ( 
        idFotosEspacios INT PRIMARY KEY AUTO_INCREMENT,
        idEspacios INT UNSIGNED NOT NULL,
        CONSTRAINT fotosEspacios_idEspacios_fk1
                FOREIGN KEY (idEspacios) REFERENCES espacios(idEspacios),
        fechaSubida DATETIME NOT NULL,
        fotos VARCHAR(50) NOT NULL
        );
     `);

                // Crear tabla de reservas
                await connection.query(`
            CREATE TABLE reservas
            (
            idReserva INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            idUsuario INT UNSIGNED NOT NULL,
            CONSTRAINT reservas_idUsuario_fk2 
                    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
            idEspacios INT UNSIGNED NOT NULL,
            CONSTRAINT reservas_idEspacios_fk2 
                    FOREIGN KEY (idEspacios) REFERENCES espacios(idEspacios),
            fechaRegistro DATETIME NOT NULL,
            fechaLlegada DATE NOT NULL,
            CONSTRAINT reservas_idEspacios_fechaLlegada_uq1 UNIQUE (idEspacios, fechaLlegada),
            CONSTRAINT reservas_fechaLlegada_ck2
                    CHECK (fechaLlegada <= fechaSalida),
            fechaSalida DATE NOT NULL,
            CONSTRAINT reservas_fechaSalida_ck2
                    CHECK (fechaSalida >= fechaLlegada),
            precioReserva DECIMAL(5, 2) DEFAULT 0.0,
            active BOOLEAN DEFAULT true
        );
        `);

                console.log('Nuevas tablas creadas');

                // Introducimos varios usuarios aleatorios
                const users = 10;

                for (let index = 0; index < users; index++) {
                        const now = new Date();
                        const name = faker.name.firstName();
                        const surname = faker.name.lastName();
                        const email = faker.internet.email();
                        const password = faker.internet.password();
                        const phone = faker.phone.phoneNumber();
                        const fecha = faker.date.past();

                        await connection.query(`
                        INSERT INTO usuarios(fechaRegistro, nombre, apellidos, correo, contraseña, telefono, metodoDePago, fechaNacimiento, active)
                        VALUES("${formatDateToDB(
                          now
                        )}", "${name}", "${surname}", "${email}", SHA2("${password}", 512), "${phone}", "${random(
        1,
        4
      )}", "${formatDateToDB(fecha)}", true) 
                `);
                }

                console.log('Usuarios creados');

                // Introducimos varios usuarios admin aleatorios
                const usersAdmin = 1;

                for (let index = 0; index < usersAdmin; index++) {
                        const now = new Date();
                        //const name = faker.name.firstName();
                        //const surname = faker.name.lastName();
                        //const email = faker.internet.email();
                        //const password = faker.internet.password();
                        const phone = faker.phone.phoneNumber();
                        const fecha = faker.date.past();

                        //Introducimos un usuario administrador
                        await connection.query(`
        INSERT INTO usuarios(fechaRegistro, nombre, apellidos, correo, contraseña, telefono, fechaNacimiento, active, role)
        VALUES("${formatDateToDB(now)}", "Manuel", "Cordero", "corderovivero.manuelalejandro@gmail.com", SHA2("${
        process.env.ADMIN_PASSWORD
      }", 512), "${phone}", "${formatDateToDB(fecha)}", true, "admin");
        `);
                }

                console.log('Usuarios admin creados');

                // Introducimos varios hoteles
                const hotel = 5;

                for (let index = 0; index < hotel; index++) {
                        const now = new Date();
                        const name = faker.company.companyName();
                        const cityHotel = faker.address.city();
                        const addressHotel = faker.address.streetAddress();

                        await connection.query(`
                INSERT INTO hoteles(fechaRegistro, nombre, localidad, direccion)
                VALUES("${formatDateToDB(now)}", "${name}", "${cityHotel}", "${addressHotel}")
            `);
                }

                console.log('Hoteles creados');

                // Introducimos varios espacios
                const espacios = 5;

                for (let index = 0; index < espacios; index++) {
                        const now = new Date();
                        const name = faker.name.jobTitle();
                        const descripcion = faker.lorem.sentence();
                        const aforo = faker.random.number();

                        await connection.query(`
                INSERT INTO espacios(fechaRegistro, nombre, tipoEspacio, descripcion, aforo, idHotel)
                VALUES("${formatDateToDB(now)}", "${name}", "${random(1, 5)}", "${descripcion}", "${aforo}", "${random(
        1,
        hotel
      )}")
            `);
                }

                console.log('Espacios creados');

                // Introducimos equipamiento para espacios
                // solucionar foreign key idEspacios
                const equipamiento = 5;

                for (let index = 0; index < equipamiento; index++) {
                        await connection.query(`
                INSERT INTO equipamiento(wifi, proyector, pantallaProyector, television, climatizacion, equipoSonido, catering, parking, idEspacios)
                VALUES("${random(0, 1)}", "${random(0, 1)}", "${random(0, 1)}", "${random(0, 1)}", "${random(
        0,
        1
      )}", "${random(0, 1)}", "${random(0, 1)}", "${random(0, 1)}", "1")
            `);
                }

                console.log('Equipamiento creado');

                // Introducimos reservas para espacios
                const reservas = 5;

                for (let index = 0; index < reservas; index++) {
                        const now = new Date();
                        const fechaLlegada = faker.date.past();
                        const fechaSalida = faker.date.future();

                        await connection.query(`
                INSERT INTO reservas(idUsuario, idEspacios, fechaRegistro, fechaLlegada, fechaSalida)
                VALUES("${random(1, users)}", "${random(1, espacios)}", "${formatDateToDB(now)}", "${formatDateToDB(
        fechaLlegada
      )}", "${formatDateToDB(fechaSalida)}")
            `);
                }

                console.log('Reservas creadas');
        } catch (error) {
                console.error(error);
        } finally {
                // libera la conexión
                if (connection) connection.release();
                process.exit();
        }
}

main();