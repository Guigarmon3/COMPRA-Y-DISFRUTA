package proyecto_intermodular.springboot.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import proyecto_intermodular.springboot.service.ConsultaService;

import java.util.List;
import java.util.Map;

@RestController@CrossOrigin
public class ConsultaController {
    private final ConsultaService cs;

    public ConsultaController(ConsultaService cs) {
        this.cs = cs;
    }

    @GetMapping("/api/peliculas")
    public List<Map<String, Object>> ObtenerPeliculas() {
        return cs.ObtenerPeliculas();
    }
}