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