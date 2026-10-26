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

    public List<Map<String, Object>> ObtenerSalas() {return comando.queryForList("select * from sala order by id");}

    public Map<String, Object> obtenerCategoriaDePelicula(int id) {
        return comando.queryForMap(
                "select * from genero where id = (select genero_id from pelicula where id = ?)", id);
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

    public List<Map<String, Object>> getSesiones(int id) {return comando.queryForList("select sa.tipo, sa.precio_aleatorio, sa.precio_elegido from pelicula p inner join sesion s  on s.pelicula_id = p.id inner join sala sa  on s.sala_id = sa.id where s.pelicula_id = ?;", id);}

    public List<Map<String, Object>> getButacasFromSala(int sala) {
        return comando.queryForList("""
        
                SELECT butaca.*,
               IF(ticket.butaca_id IS NULL, 'LIBRE', 'OCUPADA') AS estado
        FROM butaca
        LEFT JOIN ticket ON ticket.butaca_id = butaca.id
        WHERE butaca.sala_id = ?
        """, sala);
    }

    public boolean estaRegistrado(String nombre) {
        return comando.queryForObject("select count(*) from usuario where nombre = ?", int.class, nombre) > 0;
    }
}