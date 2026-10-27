package proyecto_intermodular.springboot.service;

import org.springframework.stereotype.Service;
import proyecto_intermodular.springboot.Modal.ROL;
import proyecto_intermodular.springboot.Modal.Usuario;
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

    public List<Map<String, Object>> ObtenerSalas(){return consulta.ObtenerSalas();}

    public Map<String, Object> ObtenerCat(int i ){return consulta.obtenerCategoriaDePelicula(i);}

    public void CrearUsuario(Usuario usuario){consulta.CrearUsuario(usuario);}
    public boolean login(String email, String passwd) {return consulta.login(email,passwd);}
    public String getNombre(String email){return consulta.getName(email);}
    public ROL getRol(String email){return consulta.getRol(email);}
    public ROL getRolAdmin(String nombre){return consulta.getRolAdmin(nombre);}
    public int contUser(String nombre, String email){return consulta.contUser(nombre, email);}
    public String getImagen(String nombre) {return consulta.getImage(nombre);}
    public int getIdPeli(String nombre) {return consulta.getIdPelia(nombre);}
    public List<Map<String, Object>> getSesiones(int id) {return consulta.getSesiones(id);}
    public List<Map<String, Object>> getButacasFromSala(int sala) {return consulta.getButacasFromSala(sala);}
    public List<Map<String, Object>> getIdSesion(String nombrePelicula) {return consulta.getIdSesion(nombrePelicula);}
    }
