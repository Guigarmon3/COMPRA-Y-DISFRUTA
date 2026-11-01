# COMPRA-Y-DISFRUTA (Taquik)

Web de cine para comprar entradas y elegir butacas. Frontend en HTML/CSS/JS, backend en Spring Boot y base de datos MySQL.

## Puesta en marcha
1. Importar la base de datos (crea la base, las tablas, los triggers y los datos de ejemplo):
   ```bash
   mysql -u root -p < schema.sql
   ```
2. Arrancar el backend desde la carpeta `SpringBoot/` (puerto `8080`, conexión a `localhost:3306/Compra_Y_Disfruta`).
3. Abrir `index.html` en el navegador.

## Compra de entradas y butacas
- El usuario inicia sesión y crea un carrito con entradas para una película.
- En el carrito puede elegir la sala, la fecha y la hora entre las sesiones existentes de esa película; los desplegables se actualizan según la selección.
- Puede elegir tipo de butaca: Aleatoria (más barata, asignación automática) o Elegida (selecciona butacas en el mapa).
- Solo se pueden seleccionar butacas libres en esa sesión.
- La cantidad máxima de entradas se limita a las butacas libres restantes de la sala/sesión.
- Se evita la compra doble de la misma butaca con transacción + bloqueo pesimista (`FOR UPDATE`) y la restricción única `(sesion_id, butaca_id)`.

## Películas
- La cartelera muestra el cartel, el nombre y la **duración** de cada película (formato `2 h 28 min`).
- Al pulsar un cartel se abre la ficha con género, duración y resumen.
- La duración se guarda en minutos en `pelicula.duracion_min`.

## Devoluciones / borrado
- **Borrar un ticket** (`DELETE /api/ticket/{id}`): libera automáticamente su butaca (la ocupación se calcula a partir de la tabla `ticket`).
- **Borrar un usuario** (`DELETE /api/usuario/{id}`): se eliminan en cascada sus tickets, por lo que todas sus butacas quedan libres de nuevo.
- La base de datos aplica `ON DELETE CASCADE` en `ticket.usuario_id` para garantizar la limpieza.

## Base de datos (`schema.sql`)
Un único archivo con todo: tablas, triggers y datos de ejemplo.
- **Tablas:** `genero`, `usuario`, `pelicula`, `tipo_sala`, `sala`, `sesion`, `butaca`, `ticket`.
- **Trigger `sala_crear_butacas`:** al crear una sala genera sus 12 filas x 14 butacas (168).
- **Triggers `sesion_no_solape_ins` / `sesion_no_solape_upd`:** impiden que dos sesiones se solapen en la misma sala (duración de la película + 15 min de limpieza).
- **Datos de ejemplo:** 5 películas, 10 tipos de sala, 10 salas, 11 sesiones, 10 usuarios y 252 tickets.
- Al ejecutarlo se borran y recrean las tablas, así que se pierde lo que hubiera en la base.

## Endpoints principales
- `GET /api/Peliculas`, `GET /api/Salas`
- `GET /api/getsesiones/{idPelicula}`
- `GET /api/getIdSesion/{nombrePelicula}`
- `GET /api/getButacasFromSesion/{sesionId}`
- `GET /api/tickets/{nombreUsuario}` (incluye fila y número de butaca)
- `POST /api/comprar` body: `{ usuario, sesion_id, seleccion, cantidad, butaca_ids }`
- `DELETE /api/ticket/{id}`
- `DELETE /api/usuario/{id}`

---

## Pendiente / Por hacer

### Panel de administración
El panel actual (`ADMIN PANNEL`) solo tiene botones de prueba de la API. Falta convertirlo en un panel real.
- [ ] Que el admin pueda **crear, editar y borrar películas** (nombre, género, resumen, imagen y duración) desde otro panel
- [ ] Que el admin pueda **crear, editar y borrar sesiones** (película, sala, fecha y hora), mostrando el error del trigger si hay solape
- [ ] Que el admin pueda **gestionar salas y tipos de sala** (nombre, precios aleatorio/elegido, descripción)
- [ ] Que el admin pueda **gestionar géneros**
- [ ] Que el admin pueda **ver y gestionar usuarios** (cambiar rol, borrar)
- [ ] Que el admin pueda **ver y anular tickets** de cualquier usuario
- [ ] Endpoints del backend (`POST`/`PUT`/`DELETE`) para todo lo anterior, protegidos para que solo los use un `ADMIN`
- [ ] Panel con estadísticas básicas (entradas vendidas, ocupación por sesión, recaudación)

### Funciones para el usuario
- [ ] Más funciones para el usuario (perfil, cambiar contraseña, historial de compras, etc.)
- [ ] Una **sección donde el usuario pueda añadir más ideas** o sugerencias para la web (formulario + tabla en la base de datos, y que el admin pueda verlas)
- [ ] Buscador y filtros de películas (por género, duración, fecha)
- [ ] Valoraciones y comentarios de las películas
- [ ] Lista de favoritos o "quiero verla"
- [ ] Recuperar contraseña
- [ ] Descargar o imprimir la entrada (PDF o código QR)

### Seguridad y calidad
- [ ] Guardar las contraseñas cifradas (ahora están en texto plano)
- [ ] Login seguro con token o sesión en lugar de comprobar el rol desde el navegador
- [ ] Cambiar el login a `POST` (ahora usa `GET /api/login/{email}/{passwd}` y la contraseña va en la URL)
- [ ] Sacar la contraseña de la base de datos de `application.properties`
- [ ] Validar los datos en el backend (campos vacíos, formatos, longitudes)
- [ ] Pruebas automáticas del backend (`ApplicationTests` está vacío)
- [ ] Revisar la zona horaria de las sesiones

### Hecho
- [x] Compra de entradas con butaca aleatoria o elegida
- [x] Evitar la compra doble de una butaca
- [x] Devolución de entradas y borrado de usuarios en cascada
- [x] Butacas generadas automáticamente al crear una sala (trigger)
- [x] Evitar sesiones solapadas en la misma sala (triggers)
- [x] Duración de cada película (base de datos y web)
- [x] Todo el esquema y los datos en un único `schema.sql`