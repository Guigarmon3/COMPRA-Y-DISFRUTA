create table if not exists usuario (
  id int primary key AUTO_INCREMENT,
  nombre VARCHAR(100) not null,
  email varchar(100) not null UNIQUE,
  passwd VARCHAR(100) not null,
  rol ENUM("ADMIN", "CLIENTE") not null
);

create table if not exists tipo_sala (
  id int primary key AUTO_INCREMENT,
  nombre varchar(100) not null UNIQUE,
  descripcion TEXT not null,
  precio_aleatorio DECIMAL(5,2) not null,
  precio_elegido DECIMAL(5,2) not null
);

create table if not exists sala (
  id int primary key AUTO_INCREMENT,
  nombre VARCHAR(100) not null UNIQUE,
  tipo_sala_id int not null,
  foreign key (tipo_sala_id) references tipo_sala(id)
);

create table if not exists genero (
  id int primary key AUTO_INCREMENT,
  nombre varchar(100) not null UNIQUE
);

create table if not exists pelicula (
  id int primary key AUTO_INCREMENT,
  nombre VARCHAR(100) not null UNIQUE,
  resumen TEXT not null,
  genero_id int not null,
  foreign key (genero_id) references genero(id)
);

create table if not exists butaca (
  id int primary key AUTO_INCREMENT,
  fila int not null,
  numero_butaca int not null,
  sala_id int not null,
  foreign key (sala_id) references sala(id),
  UNIQUE (sala_id, fila, numero_butaca)
);

create table if not exists sesion (
  id int primary key AUTO_INCREMENT,
  fecha_hora DATETIME not null,
  pelicula_id int not null,
  sala_id int not null,
  foreign key (pelicula_id) references pelicula(id),
  foreign key (sala_id) references sala(id),
  UNIQUE (sala_id, fecha_hora)
);

create table if not exists ticket (
  id int primary key AUTO_INCREMENT,
  usuario_id int not null,
  sesion_id int not null,
  butaca_id int not null,
  seleccion ENUM("Elegida", "Aleatoria") not null,
  precio_total DECIMAL(5,2) not null,
  foreign key (usuario_id) references usuario(id),
  foreign key (sesion_id) references sesion(id),
  foreign key (butaca_id) references butaca(id),
  UNIQUE (sesion_id, butaca_id)
);