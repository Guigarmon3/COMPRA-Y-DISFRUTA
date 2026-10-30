# COMPRA-Y-DISFRUTA (Taquik)

## Compra de entradas y butacas
- El usuario inicia sesión y crea un carrito con entradas para una película.
- En el carrito puede elegir la sala, la fecha y la hora entre las sesiones existentes de esa película; los desplegables se actualizan según la selección.
- Puede elegir tipo de butaca: Aleatoria (más barata, asignación automática) o Elegida (selecciona butacas en el mapa).
- Solo se pueden seleccionar butacas libres en esa sesión.
- La cantidad máxima de entradas se limita a las butacas libres restantes de la sala/sesión.
- Se evita la compra doble de la misma butaca con transacción + bloqueo pesimista (`FOR UPDATE`) y la restricción única `(sesion_id, butaca_id)`.

## Devoluciones / borrado
- **Borrar un ticket** (`DELETE /api/ticket/{id}`): libera automáticamente su butaca (la ocupación se calcula a partir de la tabla `ticket`).
- **Borrar un usuario** (`DELETE /api/usuario/{id}`): se eliminan en cascada sus tickets, por lo que todas sus butacas quedan libres de nuevo.
- La base de datos aplica `ON DELETE CASCADE` en `ticket.usuario_id` para garantizar la limpieza.

## Endpoints principales
- `GET /api/Peliculas`, `GET /api/Salas`
- `GET /api/getsesiones/{idPelicula}`
- `GET /api/getIdSesion/{nombrePelicula}`
- `GET /api/getButacasFromSesion/{sesionId}`
- `GET /api/tickets/{nombreUsuario}` (incluye fila y número de butaca)
- `POST /api/comprar` body: `{ usuario, sesion_id, seleccion, cantidad, butaca_ids }`
- `DELETE /api/ticket/{id}`
- `DELETE /api/usuario/{id}`