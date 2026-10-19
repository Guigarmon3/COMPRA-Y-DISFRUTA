package proyecto_intermodular.springboot.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
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

    public List<Map<String, Object>> ObtenerTodosLosTickets() {return comando.queryForList("select * from ticket order by id");}

    public List<Map<String, Object>> ObtenerUsuarios() {return comando.queryForList("select * from usuario order by id");}

    public List<Map<String, Object>> ObtenerSalas() {return comando.queryForList("select * from sala order by id");}

    public List<Map<String, Object>> Obtenerbutacas() {return comando.queryForList("select * from butaca order by id");}

    public Map<String, Object> obtenerCategoriaDePelicula(int id) {
        return comando.queryForMap(
                "select * from genero where id = (select genero_id from pelicula where id = ?)", id);
    }

    public List<Map<String, Object>> ObtenerTipoSala() {return comando.queryForList("select * from tipo_sala");}

    public void CrearUsuario(Usuario usuario) {
        comando.update(
                "insert into usuario(nombre,email,passwd,rol) values (?,?,?,'CLIENTE')",
                usuario.nombre, usuario.email, usuario.passwd
        );
    }
}