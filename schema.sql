CREATE DATABASE IF NOT EXISTS Compra_Y_Disfruta;
USE Compra_Y_Disfruta;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS sesion;
DROP TABLE IF EXISTS butaca;
DROP TABLE IF EXISTS sala;
DROP TABLE IF EXISTS tipo_sala;
DROP TABLE IF EXISTS pelicula;
DROP TABLE IF EXISTS genero;
DROP TABLE IF EXISTS usuario;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- TABLAS
-- ============================================================

CREATE TABLE genero (
  id int NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY nombre (nombre)
);

CREATE TABLE usuario (
  id int NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
  passwd varchar(100) NOT NULL,
  rol enum('ADMIN','CLIENTE') NOT NULL DEFAULT 'CLIENTE',
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
);

CREATE TABLE pelicula (
  id int NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  genero_id int NOT NULL,
  resumen text NOT NULL,
  imagen varchar(255) NOT NULL,
  duracion_min int NOT NULL DEFAULT 120,
  PRIMARY KEY (id),
  UNIQUE KEY nombre (nombre),
  KEY genero_id (genero_id),
  CONSTRAINT pelicula_ibfk_1 FOREIGN KEY (genero_id) REFERENCES genero (id)
);

CREATE TABLE tipo_sala (
  id int NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  precio_aleatorio decimal(5,2) NOT NULL,
  precio_elegido decimal(5,2) NOT NULL,
  descripcion text,
  PRIMARY KEY (id),
  UNIQUE KEY nombre (nombre)
);

CREATE TABLE sala (
  id int NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  tipo_sala_id int NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY nombre (nombre),
  KEY tipo_sala_id (tipo_sala_id),
  CONSTRAINT sala_ibfk_1 FOREIGN KEY (tipo_sala_id) REFERENCES tipo_sala (id)
);

CREATE TABLE sesion (
  id int NOT NULL AUTO_INCREMENT,
  fecha_hora datetime NOT NULL,
  pelicula_id int NOT NULL,
  sala_id int NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY sala_id (sala_id, fecha_hora),
  KEY pelicula_id (pelicula_id),
  CONSTRAINT sesion_ibfk_1 FOREIGN KEY (pelicula_id) REFERENCES pelicula (id),
  CONSTRAINT sesion_ibfk_2 FOREIGN KEY (sala_id) REFERENCES sala (id)
);

CREATE TABLE butaca (
  id int NOT NULL AUTO_INCREMENT,
  fila int NOT NULL,
  numero_butaca int NOT NULL,
  sala_id int NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY sala_id (sala_id, fila, numero_butaca),
  CONSTRAINT butaca_ibfk_1 FOREIGN KEY (sala_id) REFERENCES sala (id)
);

CREATE TABLE ticket (
  id int NOT NULL AUTO_INCREMENT,
  usuario_id int NOT NULL,
  sesion_id int NOT NULL,
  butaca_id int NOT NULL,
  seleccion enum('Elegida','Aleatoria') NOT NULL,
  precio_total decimal(5,2) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY sesion_id (sesion_id, butaca_id),
  KEY usuario_id (usuario_id),
  KEY butaca_id (butaca_id),
  CONSTRAINT ticket_ibfk_1 FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
  CONSTRAINT ticket_ibfk_2 FOREIGN KEY (sesion_id) REFERENCES sesion (id),
  CONSTRAINT ticket_ibfk_3 FOREIGN KEY (butaca_id) REFERENCES butaca (id)
);

-- ============================================================
-- TRIGGERS
-- ============================================================

DELIMITER $$

-- Al crear una sala se generan sus 12 filas x 14 butacas = 168 butacas.
-- Como se insertan en orden (fila, número), los ids salen correlativos:
--   Sala 1: 1-168, Sala 2: 169-336, ... Sala 10: 1513-1680
CREATE TRIGGER sala_crear_butacas
AFTER INSERT ON sala
FOR EACH ROW
BEGIN
  DECLARE f INT DEFAULT 1;
  DECLARE n INT;
  WHILE f <= 12 DO
    SET n = 1;
    WHILE n <= 14 DO
      INSERT INTO butaca (fila, numero_butaca, sala_id) VALUES (f, n, NEW.id);
      SET n = n + 1;
    END WHILE;
    SET f = f + 1;
  END WHILE;
END$$

-- No permite crear una sesión que se solape con otra de la misma sala.
-- Cada sesión ocupa [inicio, inicio + duración de la película + 15 min de limpieza).
CREATE TRIGGER sesion_no_solape_ins
BEFORE INSERT ON sesion
FOR EACH ROW
BEGIN
  DECLARE v_dur INT;
  DECLARE v_solapes INT;

  SELECT duracion_min INTO v_dur FROM pelicula WHERE id = NEW.pelicula_id;

  SELECT COUNT(*) INTO v_solapes
  FROM sesion s
  JOIN pelicula p ON p.id = s.pelicula_id
  WHERE s.sala_id = NEW.sala_id
    AND NEW.fecha_hora < DATE_ADD(s.fecha_hora, INTERVAL p.duracion_min + 15 MINUTE)
    AND DATE_ADD(NEW.fecha_hora, INTERVAL v_dur + 15 MINUTE) > s.fecha_hora;

  IF v_solapes > 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'La sala ya tiene una sesión que se solapa con ese horario';
  END IF;
END$$

-- Lo mismo al modificar una sesión existente (se excluye a sí misma).
CREATE TRIGGER sesion_no_solape_upd
BEFORE UPDATE ON sesion
FOR EACH ROW
BEGIN
  DECLARE v_dur INT;
  DECLARE v_solapes INT;

  SELECT duracion_min INTO v_dur FROM pelicula WHERE id = NEW.pelicula_id;

  SELECT COUNT(*) INTO v_solapes
  FROM sesion s
  JOIN pelicula p ON p.id = s.pelicula_id
  WHERE s.sala_id = NEW.sala_id
    AND s.id <> NEW.id
    AND NEW.fecha_hora < DATE_ADD(s.fecha_hora, INTERVAL p.duracion_min + 15 MINUTE)
    AND DATE_ADD(NEW.fecha_hora, INTERVAL v_dur + 15 MINUTE) > s.fecha_hora;

  IF v_solapes > 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'La sala ya tiene una sesión que se solapa con ese horario';
  END IF;
END$$

DELIMITER ;

-- ============================================================
-- DATOS
-- ============================================================

INSERT INTO genero (id, nombre) VALUES
(1, 'drama'),
(2, 'animación'),
(3, 'ciencia ficción'),
(4, 'terror'),
(5, 'comedia');

INSERT INTO pelicula (id, nombre, genero_id, resumen, imagen, duracion_min) VALUES
(1, 'Cars',                    2, 'Un coche de carreras novato descubre que hay cosas más importantes que ganar.', 'https://en.wikipedia.org/wiki/Special:FilePath/Cars_2006.jpg?width=400', 117),
(2, 'Inception',               3, 'Un ladrón que roba secretos a través de los sueños recibe una misión imposible.', 'https://en.wikipedia.org/wiki/Special:FilePath/Inception_(2010)_theatrical_poster.jpg?width=400', 148),
(3, 'La bola negra',           1, 'Tres historias en distintas épocas unidas por un mismo secreto y por el peso de la fe y el deseo.', 'imagenes/Carteleras/LaBolaNegra.jpg', 115),
(4, 'Tiburón',                 4, 'Un tiburón blanco siembra el pánico en una playa y tres hombres salen a cazarlo en alta mar.', 'https://en.wikipedia.org/wiki/Special:FilePath/Jaws_movie_poster.jpg?width=400', 124),
(5, 'El gran hotel Budapest',  5, 'Un conserje legendario y su joven aprendiz se ven envueltos en el robo de un cuadro famoso.', 'https://en.wikipedia.org/wiki/Special:FilePath/The_Grand_Budapest_Hotel.png?width=400', 99);

-- Tipos de sala: nombre del tipo, precios y descripción
INSERT INTO tipo_sala (id, nombre, precio_aleatorio, precio_elegido, descripcion) VALUES
(1,  'Cine infantil',     5.00,  6.00, 'Sesiones para peques con volumen suave y luz tenue.'),
(2,  'Cine 3D',           9.00, 10.50, 'Proyección en tres dimensiones con gafas incluidas.'),
(3,  'Cine IMAX',        10.00, 12.00, 'Pantalla gigante y sonido envolvente.'),
(4,  'Cine VIP',         11.00, 13.00, 'Butacas reclinables y más espacio entre filas.'),
(5,  'Cine Dolby Atmos', 10.00, 12.00, 'Sonido tridimensional con altavoces sobre y alrededor del público.'),
(6,  'Cine',              6.00,  7.50, 'La sala de siempre: pantalla grande y butacas cómodas.'),
(7,  'Cine 35mm',         7.00,  8.50, 'Proyección en película clásica, con su grano y su sonido de antes.'),
(8,  'Cine 4D',          12.00, 14.00, 'Butacas que se mueven y efectos de viento, agua y aroma.'),
(9,  'Teatro',           15.00, 18.00, 'Obras en directo con escenario y patio de butacas.'),
(10, 'Conciertos',       20.00, 25.00, 'Música en directo con un sonido pensado para el escenario.');

-- Una única sala por cada tipo de sala (10 salas, 10 tipos).
-- Las butacas (168 por sala = 1.680) las genera automáticamente el trigger sala_crear_butacas.
INSERT INTO sala (id, nombre, tipo_sala_id) VALUES
(1,  'Sala 1',  1),
(2,  'Sala 2',  2),
(3,  'Sala 3',  3),
(4,  'Sala 4',  4),
(5,  'Sala 5',  5),
(6,  'Sala 6',  6),
(7,  'Sala 7',  7),
(8,  'Sala 8',  8),
(9,  'Sala 9',  9),
(10, 'Sala 10', 10);

-- Sesiones: los triggers validan que no haya solapes en cada sala
INSERT INTO sesion (id, fecha_hora, pelicula_id, sala_id) VALUES
(1,  '2026-10-24 17:00:00', 1, 1),
(2,  '2026-10-24 18:30:00', 1, 2),
(3,  '2026-10-24 20:00:00', 1, 3),
(4,  '2026-10-24 19:00:00', 2, 4),
(5,  '2026-10-24 21:30:00', 2, 5),
(6,  '2026-10-23 18:00:00', 3, 6),
(7,  '2026-10-25 20:00:00', 3, 4),
(8,  '2026-10-24 22:00:00', 4, 7),
(9,  '2026-10-25 17:30:00', 4, 6),
(10, '2026-10-24 16:30:00', 5, 6),
(11, '2026-10-25 18:00:00', 5, 5);

INSERT INTO usuario (id, nombre, email, passwd, rol) VALUES
(1,  'Admin',  'admin@cine.com',  'admin123', 'ADMIN'),
(2,  'Lucía',  'lucia@mail.com',  '1234',     'CLIENTE'),
(3,  'Carlos', 'carlos@mail.com', '1234',     'CLIENTE'),
(4,  'Marta',  'marta@mail.com',  '1234',     'CLIENTE'),
(5,  'Pablo',  'pablo@mail.com',  '1234',     'CLIENTE'),
(6,  'Elena',  'elena@mail.com',  '1234',     'CLIENTE'),
(7,  'Javier', 'javier@mail.com', '1234',     'CLIENTE'),
(8,  'Sofía',  'sofia@mail.com',  '1234',     'CLIENTE'),
(9,  'Diego',  'diego@mail.com',  '1234',     'CLIENTE'),
(10, 'Laura',  'laura@mail.com',  '1234',     'CLIENTE');

-- Tickets: sesiones 3 (Sala 3, IMAX), 4 (Sala 4, VIP) y 8 (Sala 7, 35mm)
-- ocupadas justo a la mitad: 84 de 168 butacas cada una (252 tickets en total).
-- Las butacas ocupadas siguen un patrón de tablero (fila + número par),
-- los usuarios 2-10 se reparten entre ellas, 1 de cada 3 es de selección
-- 'Aleatoria' y el precio sale del tipo de sala (tipo_sala) según el tipo de selección.
INSERT INTO ticket (usuario_id, sesion_id, butaca_id, seleccion, precio_total)
SELECT t.usuario_id,
       t.sesion_id,
       t.butaca_id,
       t.seleccion,
       CASE t.seleccion
         WHEN 'Aleatoria' THEN ts.precio_aleatorio
         ELSE ts.precio_elegido
       END
FROM (
  SELECT 2 + MOD(b.id, 9) AS usuario_id,
         se.id AS sesion_id,
         b.id AS butaca_id,
         se.sala_id,
         IF(MOD(b.id, 3) = 0, 'Aleatoria', 'Elegida') AS seleccion
  FROM sesion se
  JOIN butaca b ON b.sala_id = se.sala_id
  WHERE se.id IN (3, 4, 8)
    AND MOD(b.fila + b.numero_butaca, 2) = 0
) t
JOIN sala s ON s.id = t.sala_id
JOIN tipo_sala ts ON ts.id = s.tipo_sala_id
ORDER BY t.sesion_id, t.butaca_id;

-- ============================================================
-- PRUEBAS (opcionales, descomenta para probar)
-- ============================================================
-- Debe FALLAR: la Sala 4 ya tiene Inception el 24/10 a las 19:00
-- INSERT INTO sesion (fecha_hora, pelicula_id, sala_id) VALUES ('2026-10-24 20:00:00', 1, 4);
--
-- Debe FUNCIONAR: horario libre
-- INSERT INTO sesion (fecha_hora, pelicula_id, sala_id) VALUES ('2026-10-24 23:30:00', 1, 4);