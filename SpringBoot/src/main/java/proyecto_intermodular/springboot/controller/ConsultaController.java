package proyecto_intermodular.springboot.controller;

import org.springframework.web.bind.annotation.*;
import proyecto_intermodular.springboot.Modal.Usuario;
import proyecto_intermodular.springboot.service.ConsultaService;

import javax.print.DocFlavor;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class ConsultaController {
    private final ConsultaService cs;

    public ConsultaController(ConsultaService cs) {
        this.cs = cs;
    }

    @GetMapping("/api/Peliculas")
    public List<Map<String, Object>> ObtenerPeliculas() {
        return cs.ObtenerPeliculas();
    }

    @GetMapping("/api/Tickets")
    public List<Map<String, Object>> ObtenerTodosLosTickets() {return cs.ObtenerTodosLosTickets();}

    @GetMapping("/api/Usuarios")
    public List<Map<String, Object>> ObtenerUsuarios(){return cs.ObtenerUsuarios();}

    @GetMapping("/api/Salas")
    public List<Map<String, Object>> ObtenerSalas(){return cs.ObtenerSalas();}

    @GetMapping("/api/Butacas")
    public List<Map<String, Object>> Obtenerbutacas(){return cs.Obtenerbutacas();}

    @GetMapping("/api/getcat/{id}")
    public Map<String, Object> obtenerCategoria(@PathVariable int id) {
        return cs.ObtenerCat(id);
    }

    @GetMapping("/api/tipos_salas/")
    public List<Map<String, Object>> TiposSalas(){
        return cs.TiposDeSala();
    }

    @PostMapping("/api/crearUsuario")
    public void crerUsuario(@RequestBody Usuario usuario) {
        cs.CrearUsuario(usuario);
    }

    @GetMapping("/api/login/{email}/{passwd}")
    public boolean login(@PathVariable String email, @PathVariable String passwd) {return cs.login(email,passwd);}

    @GetMapping("/api/getnombre/{email}")
    public String getNombre(@PathVariable String email) {return cs.getNombre(email);}
}