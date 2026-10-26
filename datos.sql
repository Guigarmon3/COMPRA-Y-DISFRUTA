USE Compra_Y_Disfruta;

INSERT INTO genero (id, nombre) VALUES
(1, 'drama'),
(2, 'animación'),
(3, 'ciencia ficción'),
(4, 'terror'),
(5, 'comedia');

INSERT INTO pelicula (id, nombre, genero_id, resumen, imagen) VALUES
(1, 'Cars',                    2, 'Un coche de carreras novato descubre que hay cosas más importantes que ganar.', 'https://en.wikipedia.org/wiki/Special:FilePath/Cars_2006.jpg?width=400'),
(2, 'Inception',               3, 'Un ladrón que roba secretos a través de los sueños recibe una misión imposible.', 'https://en.wikipedia.org/wiki/Special:FilePath/Inception_(2010)_theatrical_poster.jpg?width=400'),
(3, 'La bola negra',           1, 'Tres historias en distintas épocas unidas por un mismo secreto y por el peso de la fe y el deseo.', 'imagenes/Carteleras/LaBolaNegra.jpg'),
(4, 'Tiburón',                 4, 'Un tiburón blanco siembra el pánico en una playa y tres hombres salen a cazarlo en alta mar.', 'https://en.wikipedia.org/wiki/Special:FilePath/Jaws_movie_poster.jpg?width=400'),
(5, 'El gran hotel Budapest',  5, 'Un conserje legendario y su joven aprendiz se ven envueltos en el robo de un cuadro famoso.', 'https://en.wikipedia.org/wiki/Special:FilePath/The_Grand_Budapest_Hotel.png?width=400');

-- Una unica sala por cada tipo de sala (10 salas, 10 tipos)
INSERT INTO sala (id, nombre, tipo, precio_aleatorio, precio_elegido, descripcion) VALUES
(1,  'Sala 1',  'Cine infantil',     5.00,  6.00, 'Sesiones para peques con volumen suave y luz tenue.'),
(2,  'Sala 2',  'Cine 3D',           9.00, 10.50, 'Proyección en tres dimensiones con gafas incluidas.'),
(3,  'Sala 3',  'Cine IMAX',        10.00, 12.00, 'Pantalla gigante y sonido envolvente.'),
(4,  'Sala 4',  'Cine VIP',         11.00, 13.00, 'Butacas reclinables y más espacio entre filas.'),
(5,  'Sala 5',  'Cine Dolby Atmos', 10.00, 12.00, 'Sonido tridimensional con altavoces sobre y alrededor del público.'),
(6,  'Sala 6',  'Cine',              6.00,  7.50, 'La sala de siempre: pantalla grande y butacas cómodas.'),
(7,  'Sala 7',  'Cine 35mm',         7.00,  8.50, 'Proyección en película clásica, con su grano y su sonido de antes.'),
(8,  'Sala 8',  'Cine 4D',          12.00, 14.00, 'Butacas que se mueven y efectos de viento, agua y aroma.'),
(9,  'Sala 9',  'Teatro',           15.00, 18.00, 'Obras en directo con escenario y patio de butacas.'),
(10, 'Sala 10', 'Conciertos',       20.00, 25.00, 'Música en directo con un sonido pensado para el escenario.');

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

-- Butacas: 12 filas x 14 butacas = 168 por sala (10 salas = 1.680 butacas).
-- Ids correlativos, ordenados por sala, luego fila y luego número:
--   Sala 1: 1-168, Sala 2: 169-336, ... Sala 10: 1513-1680
INSERT INTO butaca (id, fila, numero_butaca, sala_id)
SELECT (s.id - 1) * 168 + (f.n - 1) * 14 + b.n, f.n, b.n, s.id
FROM sala s
CROSS JOIN (
  SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
  UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8
  UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
) f
CROSS JOIN (
  SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
  UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8
  UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
  UNION SELECT 13 UNION SELECT 14
) b
ORDER BY s.id, f.n, b.n;

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
-- Las butacas ocupadas siguen un patron de tablero (fila + numero par),
-- los usuarios 2-10 se reparten entre ellas, 1 de cada 3 es de seleccion
-- 'Aleatoria' y el precio sale de la propia sala segun el tipo de seleccion.
INSERT INTO ticket (usuario_id, sesion_id, butaca_id, seleccion, precio_total)
SELECT t.usuario_id,
       t.sesion_id,
       t.butaca_id,
       t.seleccion,
       CASE t.seleccion
         WHEN 'Aleatoria' THEN s.precio_aleatorio
         ELSE s.precio_elegido
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
ORDER BY t.sesion_id, t.butaca_id;