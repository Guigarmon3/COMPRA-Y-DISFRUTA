package proyecto_intermodular.springboot.service;

import org.springframework.stereotype.Service;
import proyecto_intermodular.springboot.repository.ConsultaRepository;

import java.util.List;
import java.util.Map;


@Service
public class ConsultaService {

    private final ConsultaRepository consulta;

    public ConsultaService(ConsultaRepository consulta) {
        this.consulta = consulta;
    }

    public List<Map<String, Object>> ObtenerPeliculas() {
        return consulta.ObtenerPeliculas();
    }

    public List<Map<String, Object>> ObtenerTodosLosTickets() {return consulta.ObtenerTodosLosTickets();}

    public List<Map<String, Object>> ObtenerUsuarios(){return consulta.ObtenerUsuarios();}

    public List<Map<String, Object>> ObtenerSalas(){return consulta.ObtenerSalas();}

    public List<Map<String, Object>> Obtenerbutacas(){return consulta.Obtenerbutacas();}

    public Map<String, Object> ObtenerCat(int i ){return consulta.obtenerCategoriaDePelicula(i);}

    public List<Map<String, Object>> TiposDeSala(){return consulta.ObtenerTipoSala();}

    public Map<String,Object> CrearUsuario(String nombre, String email, String passwd){return consulta.CrearUsuario(nombre,email,passwd);}
}
