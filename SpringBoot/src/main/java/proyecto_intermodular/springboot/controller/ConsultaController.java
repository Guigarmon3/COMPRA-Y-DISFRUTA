package proyecto_intermodular.springboot.controller;

import org.springframework.web.bind.annotation.*;
import proyecto_intermodular.springboot.Modal.ROL;
import proyecto_intermodular.springboot.Modal.Usuario;
import proyecto_intermodular.springboot.service.ConsultaService;

import org.springframework.http.ResponseEntity;
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

    @GetMapping("/api/Salas")
    public List<Map<String, Object>> ObtenerSalas(){return cs.ObtenerSalas();}

    @GetMapping("/api/getcat/{id}")
    public Map<String, Object> obtenerCategoria(@PathVariable int id) {
        return cs.ObtenerCat(id);
    }

    @PostMapping("/api/crearUsuario")
    public ResponseEntity<?> crearUsuario(@RequestBody Usuario usuario) {
        try {
            cs.CrearUsuario(usuario);
            return ResponseEntity.ok(Map.of("ok", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("ok", false, "mensaje", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(500)
                    .body(Map.of("ok", false, "mensaje", e.getMessage()));
        } catch (Exception e) {
            String mensaje = e.getMessage() == null || e.getMessage().isBlank()
                    ? "Error inesperado al crear el usuario"
                    : "Error inesperado al crear el usuario: " + e.getMessage();
            return ResponseEntity.status(500)
                    .body(Map.of("ok", false, "mensaje", mensaje));
        }
    }

    @GetMapping("/api/login/{email}/{passwd}")
    public boolean login(@PathVariable String email, @PathVariable String passwd) {
        return cs.login(email, passwd);
    }

    @GetMapping("/api/getnombre/{email}")
    public String getNombre(@PathVariable String email) {return cs.getNombre(email);}

    @GetMapping("/api/getrol/{email}")
    public ROL getRol(@PathVariable String email){return cs.getRol(email);}

    @GetMapping("/api/getrol2/{nombre}")
    public ROL getRolAdmin(@PathVariable String nombre){return cs.getRolAdmin(nombre);}

    @GetMapping("/api/contuser/{nombre}/{email}")
    public int countUser(@PathVariable String nombre, @PathVariable String email){return cs.contUser(nombre, email);}

    @GetMapping("/api/getImage/{nombre}")
    public String getImage(@PathVariable String nombre) {return cs.getImagen(nombre);}

    @GetMapping("/api/getidpeli/{nombre}")
    public int getIdPeli(@PathVariable String nombre) {return cs.getIdPeli(nombre);}

    @GetMapping("/api/getsesiones/{id}")
    public List<Map<String, Object>> getSesiones(@PathVariable int id) {return cs.getSesiones(id);}

    @GetMapping("/api/getButacasFromSesion/{sesion_id}")
    public List<Map<String, Object>> getButacasFromSesion(@PathVariable int sesion_id) {return cs.getButacasFromSesion(sesion_id);}

    @GetMapping("/api/getIdSesion/{nombrePelicula}")
    public List<Map<String, Object>> getIdSesion(@PathVariable String nombrePelicula) {return cs.getIdSesion(nombrePelicula);}


    @PostMapping("/api/comprar")
    public ResponseEntity<?> comprar(@RequestBody Map<String, Object> body) {
        try {
            String usuario = String.valueOf(body.get("usuario"));
            int sesionId = Integer.parseInt(String.valueOf(body.get("sesion_id")));
            String seleccion = String.valueOf(body.get("seleccion"));
            int cantidad = Integer.parseInt(String.valueOf(body.get("cantidad")));
            List<Integer> butacaIds = new java.util.ArrayList<>();
            Object raw = body.get("butaca_ids");
            if (raw instanceof List<?> lista) {
                for (Object o : lista) butacaIds.add(Integer.parseInt(String.valueOf(o)));
            }
            cs.comprar(usuario, sesionId, seleccion, cantidad, butacaIds);
            return ResponseEntity.ok(Map.of("ok", true));
        } catch (Exception e) {
            return ResponseEntity.status(409).body(Map.of("ok", false, "mensaje", e.getMessage()));
        }
    }

    @DeleteMapping("/api/ticket/{id}")
    public void deleteTicket(@PathVariable int id) { cs.deleteTicket(id); }

    @DeleteMapping("/api/usuario/{id}")
    public void deleteUser(@PathVariable int id) { cs.deleteUser(id); }

    @GetMapping("/api/tickets/{nombre}")
    public List<Map<String, Object>> getTicketsByUsuario(@PathVariable String nombre) { return cs.getTicketsByUsuario(nombre); }

    @GetMapping("/api/categorias/all")
    public List<Map<String, Object>> getAllCategorias() {return cs.getAllCategorias();}

    @GetMapping("/api/eventos/crear")
    public ResponseEntity<String> crearEvento(
            @RequestParam String nombre,
            @RequestParam("genero_id") int generoId,
            @RequestParam String resumen,
            @RequestParam String imagen,
            @RequestParam("duracion_min") int duracionMin) {

        cs.crearEvento(nombre, generoId, resumen, imagen, duracionMin);
        return ResponseEntity.ok("Evento creado");
    }

    @GetMapping("/api/salas/crear")
    public ResponseEntity<String> crearSala(@RequestParam String nombre,@RequestParam double precio_aleatorio,@RequestParam double precio_elegido,@RequestParam String descripcion) {
        cs.crearSala(nombre, precio_aleatorio, precio_elegido, descripcion);
        return ResponseEntity.ok("Sala creada");
    }

    @GetMapping("/api/sesiones/")
    public List<Map<String, Object>> getSesiones() {return cs.getSesiones();}

    // Me cuenta cuantas sesiones existen que entren dentro de el rango de la nueva sesion
    @GetMapping("/api/sesiones/buscar/{fecha}/{hora}/{sala_id}/{duracion_minutos}")
    public int buscarSesiones(@PathVariable String fecha,@PathVariable String hora,@PathVariable int sala_id,@PathVariable int duracion_minutos) {return cs.buscarSesiones(fecha, hora, sala_id, duracion_minutos);}

    // Crear las sesiones
    @PostMapping("/api/sesiones/crear/{fecha}/{hora}/{pelicula_id}/{sala_id}")
    public void crearSesion(@PathVariable String fecha, @PathVariable String hora, @PathVariable int pelicula_id, @PathVariable int sala_id) {cs.crearSesion(fecha, hora, pelicula_id, sala_id);}

    // Get de la duracio nde una pelicula
    @GetMapping("/api/eventos/getDuracion/{pelicula_id}")
    public Integer getDuracion(@PathVariable int pelicula_id) {return cs.getDuracion(pelicula_id);}
}