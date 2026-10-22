USE Compra_Y_Disfruta;

INSERT INTO genero (id, nombre) VALUES
(1, 'drama'),
(2, 'animación'),
(3, 'ciencia ficción'),
(4, 'terror'),
(5, 'comedia');

INSERT INTO tipo_sala (id, nombre, precio_aleatorio, precio_elegido, descripcion) VALUES
(1,  'Cine',              6.00,  7.50, 'La sala de siempre: pantalla grande y butacas cómodas.'),
(2,  'Cine 4D',          12.00, 14.00, 'Butacas que se mueven y efectos de viento, agua y aroma.'),
(3,  'Cine 35mm',         7.00,  8.50, 'Proyección en película clásica, con su grano y su sonido de antes.'),
(4,  'Teatro',           15.00, 18.00, 'Obras en directo con escenario y patio de butacas.'),
(5,  'Cine VIP',         11.00, 13.00, 'Butacas reclinables y más espacio entre filas.'),
(6,  'Cine IMAX',        10.00, 12.00, 'Pantalla gigante y sonido envolvente.'),
(7,  'Conciertos',       20.00, 25.00, 'Música en directo con un sonido pensado para el escenario.'),
(8,  'Cine infantil',     5.00,  6.00, 'Sesiones para peques con volumen suave y luz tenue.'),
(9,  'Cine 3D',           9.00, 10.50, 'Proyección en tres dimensiones con gafas incluidas.'),
(10, 'Cine Dolby Atmos', 10.00, 12.00, 'Sonido tridimensional con altavoces sobre y alrededor del público.');

INSERT INTO pelicula (id, nombre, genero_id, resumen, imagen) VALUES
(1, 'Cars',                    2, 'Un coche de carreras novato descubre que hay cosas más importantes que ganar.', 'https://en.wikipedia.org/wiki/Special:FilePath/Cars_2006.jpg?width=400'),
(2, 'Inception',               3, 'Un ladrón que roba secretos a través de los sueños recibe una misión imposible.', 'https://en.wikipedia.org/wiki/Special:FilePath/Inception_(2010)_theatrical_poster.jpg?width=400'),
(3, 'La bola negra',           1, 'Tres historias en distintas épocas unidas por un mismo secreto y por el peso de la fe y el deseo.', 'imagenes/Carteleras/LaBolaNegra.jpg'),
(4, 'Tiburón',                 4, 'Un tiburón blanco siembra el pánico en una playa y tres hombres salen a cazarlo en alta mar.', 'https://en.wikipedia.org/wiki/Special:FilePath/Jaws_movie_poster.jpg?width=400'),
(5, 'El gran hotel Budapest',  5, 'Un conserje legendario y su joven aprendiz se ven envueltos en el robo de un cuadro famoso.', 'https://en.wikipedia.org/wiki/Special:FilePath/The_Grand_Budapest_Hotel.png?width=400');

INSERT INTO sala (id, nombre, tipo_sala_id) VALUES
(1, 'Sala 1', 8),
(2, 'Sala 2', 9),
(3, 'Sala 3', 6),
(4, 'Sala 4', 5),
(5, 'Sala 5', 10),
(6, 'Sala 6', 1),
(7, 'Sala 7', 3);

INSERT INTO sesion (id, fecha_hora, pelicula_id, sala_id) VALUES
(1, '2026-10-24 17:00:00', 1, 1),
(2, '2026-10-24 18:30:00', 1, 2),
(3, '2026-10-24 20:00:00', 1, 3),
(4, '2026-10-24 19:00:00', 2, 4),
(5,  '2026-10-24 21:30:00', 2, 5),
(6,  '2026-10-23 18:00:00', 3, 6),
(7,  '2026-10-25 20:00:00', 3, 4),
(8,  '2026-10-24 22:00:00', 4, 7),
(9,  '2026-10-25 17:30:00', 4, 6),
(10, '2026-10-24 16:30:00', 5, 6),
(11, '2026-10-25 18:00:00', 5, 5);

INSERT INTO butaca (fila, numero_butaca, sala_id)
SELECT f.n, b.n, s.id
FROM sala s
CROSS JOIN (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) f
CROSS JOIN (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) b;

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