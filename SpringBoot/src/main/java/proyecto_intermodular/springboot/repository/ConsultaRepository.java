package proyecto_intermodular.springboot.repository;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import proyecto_intermodular.springboot.Modal.ROL;
import proyecto_intermodular.springboot.Modal.Usuario;

import java.util.List;
import java.util.Map;

@Repository
public class ConsultaRepository {

    private final JdbcTemplate comando;

    public ConsultaRepository(JdbcTemplate comando) {
        this.comando = comando;
    }

    public List<Map<String, Object>> ObtenerPeliculas() {
        return comando.queryForList("select * from pelicula order by id");
    }

    public List<Map<String, Object>> ObtenerSalas() {
        return comando.queryForList("""
                SELECT s.id, s.nombre, ts.nombre AS tipo, ts.precio_aleatorio, ts.precio_elegido, ts.descripcion
                FROM sala s JOIN tipo_sala ts ON s.tipo_sala_id = ts.id
                ORDER BY s.id
                """);
    }

    public Map<String, Object> obtenerCategoriaDePelicula(int id) {
        return comando.queryForMap(
                "select * from genero where id = (select genero_id from pelicula where id = ?)", id);
    }

    public boolean emailExists(String email) {
        Integer total = comando.queryForObject(
                "select count(*) from usuario where email = ?", Integer.class, email);
        return total != null && total > 0;
    }

    public void CrearUsuario(Usuario usuario) {
        comando.update(
                "insert into usuario(nombre,email,passwd,rol) values (?,?,?,'CLIENTE')",
                usuario.nombre, usuario.email, usuario.passwd
        );
    }

    public boolean login(String email, String passwd) {
        try {
            comando.queryForMap("select email, passwd from usuario where email = ? and passwd = ?", email, passwd);
            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }

    public String getName(String email) {
        try {
            return String.valueOf(comando.queryForObject("select nombre from usuario where email = ?",String.class, email));
        } catch(Error e){
            return "Error";
        }
    }

    public ROL getRol(String email) {return comando.queryForObject("select rol from usuario where email = ?", ROL.class, email);}

    public ROL getRolAdmin(String nombre) {return comando.queryForObject("select rol from usuario where nombre = ?", ROL.class, nombre);}

    public int contUser(String nombre, String email) {
        try {
            return comando.queryForObject("select count(*) from usuario where nombre = ? and email = ?", int.class, nombre, email);
        } catch (Exception e) {
            return 0;
        }
    }

    public String getImage(String nombre) {return  comando.queryForObject("select imagen from pelicula where nombre = ?", String.class, nombre);}

    public int getIdPelia(String nombre) {return comando.queryForObject("select id from pelicula where nombre = ?", int.class, nombre);}

    public List<Map<String, Object>> getSesiones(int id) {
        return comando.queryForList("""
                SELECT s.id AS sesion_id, s.fecha_hora, sa.id AS sala_id, sa.nombre AS sala,
                       ts.nombre AS tipo, ts.precio_aleatorio, ts.precio_elegido
                FROM pelicula p
                INNER JOIN sesion s ON s.pelicula_id = p.id
                INNER JOIN sala sa ON s.sala_id = sa.id
                INNER JOIN tipo_sala ts ON sa.tipo_sala_id = ts.id
                WHERE s.pelicula_id = ?
                ORDER BY s.fecha_hora
                """, id);
    }

    public List<Map<String, Object>> getButacasFromSesion(int sesionId) {
        return comando.queryForList("""
                SELECT b.id, b.fila, b.numero_butaca, b.sala_id,
                       IF(t.butaca_id IS NULL, 'LIBRE', 'OCUPADA') AS estado
                FROM butaca b
                LEFT JOIN ticket t ON t.butaca_id = b.id AND t.sesion_id = ?
                WHERE b.sala_id = (SELECT sala_id FROM sesion WHERE id = ?)
                ORDER BY b.fila, b.numero_butaca
                """, sesionId, sesionId);
    }

    public boolean estaRegistrado(String nombre) {return comando.queryForObject("select count(*) from usuario where nombre = ?", int.class, nombre) > 0;}

    public List<Map<String, Object>> getIdSesion(String nombrePelicula) {
        return comando.queryForList("""
                SELECT s.id AS sesion_id, s.sala_id, sa.nombre AS sala, ts.nombre AS tipo
                FROM sesion s
                INNER JOIN sala sa ON s.sala_id = sa.id
                INNER JOIN tipo_sala ts ON sa.tipo_sala_id = ts.id
                WHERE s.pelicula_id = (SELECT id FROM pelicula WHERE nombre = ?)
                ORDER BY s.fecha_hora
                """, nombrePelicula);
    }

    public int getUserIdByNombre(String nombre) {
        try {
            return comando.queryForObject("SELECT id FROM usuario WHERE nombre = ?", int.class, nombre);
        } catch (Exception e) {
            throw new RuntimeException("Usuario no encontrado");
        }
    }

    public int getSalaIdBySesion(int sesionId) {
        return comando.queryForObject("SELECT sala_id FROM sesion WHERE id = ?", int.class, sesionId);
    }

    public List<Integer> lockButacasBySala(int salaId) {
        return comando.queryForList("SELECT id FROM butaca WHERE sala_id = ? FOR UPDATE", int.class, salaId);
    }

    public java.util.Set<Integer> getOccupiedButacaIds(int sesionId) {
        List<Integer> ids = comando.queryForList("SELECT butaca_id FROM ticket WHERE sesion_id = ?", int.class, sesionId);
        return new java.util.HashSet<>(ids);
    }

    public List<Integer> getButacaIdsSortedBySala(int salaId) {
        return comando.queryForList("SELECT id FROM butaca WHERE sala_id = ? ORDER BY fila, numero_butaca", int.class, salaId);
    }

    public Map<String, Object> getPreciosBySesion(int sesionId) {
        return comando.queryForMap("""
                SELECT ts.precio_aleatorio, ts.precio_elegido
                FROM sesion s JOIN sala sa ON s.sala_id = sa.id JOIN tipo_sala ts ON sa.tipo_sala_id = ts.id
                WHERE s.id = ?
                """, sesionId);
    }

    public void insertTicket(int usuarioId, int sesionId, int butacaId, String seleccion, double precio) {
        comando.update(
                "INSERT INTO ticket(usuario_id, sesion_id, butaca_id, seleccion, precio_total) VALUES (?,?,?,?,?)",
                usuarioId, sesionId, butacaId, seleccion, precio
        );
    }


    public void deleteTicket(int id) {
        comando.update("DELETE FROM ticket WHERE id = ?", id);
    }

    public void deleteUser(int id) {
        comando.update("DELETE FROM usuario WHERE id = ?", id);
    }

    public List<Map<String, Object>> getTicketsByUsuario(String nombre) {
        return comando.queryForList("""
                SELECT t.id, p.nombre AS pelicula, p.imagen, sa.nombre AS sala, ts.nombre AS tipo_sala,
                       s.fecha_hora, b.fila, b.numero_butaca, t.seleccion, t.precio_total
                FROM ticket t
                JOIN usuario u ON t.usuario_id = u.id
                JOIN sesion s ON t.sesion_id = s.id
                JOIN pelicula p ON s.pelicula_id = p.id
                JOIN sala sa ON s.sala_id = sa.id
                JOIN tipo_sala ts ON sa.tipo_sala_id = ts.id
                JOIN butaca b ON t.butaca_id = b.id
                WHERE u.nombre = ?
                ORDER BY s.fecha_hora, b.fila, b.numero_butaca
                """, nombre);
    }
}