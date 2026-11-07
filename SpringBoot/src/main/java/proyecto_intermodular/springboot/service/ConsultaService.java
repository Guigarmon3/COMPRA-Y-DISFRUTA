package proyecto_intermodular.springboot.service;

<<<<<<< HEAD
import org.springframework.stereotype.Service;
=======
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import proyecto_intermodular.springboot.Modal.ROL;
import proyecto_intermodular.springboot.Modal.Usuario;
>>>>>>> testing
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

<<<<<<< HEAD
    public List<Map<String, Object>> ObtenerTodosLosTickets() {return consulta.ObtenerTodosLosTickets();}

    public List<Map<String, Object>> ObtenerUsuarios(){return consulta.ObtenerUsuarios();}

    public List<Map<String, Object>> ObtenerSalas(){return consulta.ObtenerSalas();}

    public List<Map<String, Object>> Obtenerbutacas(){return consulta.Obtenerbutacas();}

    public List<Map<String, Object>> ObtenerCat(int i ){return consulta.ObtenerCategoriaDePelicula(i);}

=======
    public List<Map<String, Object>> ObtenerSalas(){return consulta.ObtenerSalas();}

    public Map<String, Object> ObtenerCat(int i ){return consulta.obtenerCategoriaDePelicula(i);}

    public void CrearUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("Datos de usuario no válidos");
        }
        String nombre = usuario.nombre == null ? "" : usuario.nombre.trim();
        String email = usuario.email == null ? "" : usuario.email.trim();
        String passwd = usuario.passwd == null ? "" : usuario.passwd;

        if (nombre.isEmpty() || email.isEmpty() || passwd.isEmpty()) {
            throw new IllegalArgumentException("Por favor, complete todos los campos");
        }
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException("El email no tiene un formato válido");
        }
        if (nombre.length() > 100 || email.length() > 100 || passwd.length() > 100) {
            throw new IllegalArgumentException("El nombre, el email y la contraseña no pueden superar los 100 caracteres");
        }
        if (passwd.length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }
        if (consulta.emailExists(email)) {
            throw new IllegalArgumentException("Ya existe una cuenta con ese email");
        }

        usuario.nombre = nombre;
        usuario.email = email;
        usuario.passwd = passwd;
        try {
            consulta.CrearUsuario(usuario);
        } catch (DuplicateKeyException e) {
            throw new IllegalArgumentException("Ya existe una cuenta con ese email");
        } catch (DataAccessException e) {
            String causa = e.getMostSpecificCause().getMessage();
            throw new IllegalStateException("No se pudo guardar el usuario en la base de datos"
                    + (causa == null || causa.isBlank() ? "" : ": " + causa));
        }
    }
    public boolean login(String email, String passwd) {return consulta.login(email,passwd);}
    public String getNombre(String email){return consulta.getName(email);}
    public ROL getRol(String email){return consulta.getRol(email);}
    public ROL getRolAdmin(String nombre){return consulta.getRolAdmin(nombre);}
    public int contUser(String nombre, String email){return consulta.contUser(nombre, email);}
    public String getImagen(String nombre) {return consulta.getImage(nombre);}
    public int getIdPeli(String nombre) {return consulta.getIdPelia(nombre);}
    public List<Map<String, Object>> getSesiones(int id) {return consulta.getSesiones(id);}
    public List<Map<String, Object>> getButacasFromSesion(int sesionId) {return consulta.getButacasFromSesion(sesionId);}
    public List<Map<String, Object>> getIdSesion(String nombrePelicula) {return consulta.getIdSesion(nombrePelicula);}
    
    @Transactional
    public boolean comprar(String nombreUsuario, int sesionId, String seleccion, int cantidad, List<Integer> butacaIds) {
        if (cantidad <= 0) throw new RuntimeException("Cantidad invalida");
        int usuarioId = consulta.getUserIdByNombre(nombreUsuario);
        int salaId = consulta.getSalaIdBySesion(sesionId);
        // Bloquea todas las butacas de la sala para evitar compras simultaneas
        consulta.lockButacasBySala(salaId);
        java.util.Set<Integer> ocupadas = consulta.getOccupiedButacaIds(sesionId);

        Map<String, Object> precios = consulta.getPreciosBySesion(sesionId);
        double precio = seleccion.equalsIgnoreCase("Aleatoria")
                ? ((Number) precios.get("precio_aleatorio")).doubleValue()
                : ((Number) precios.get("precio_elegido")).doubleValue();

        List<Integer> aComprar;
        if (seleccion.equalsIgnoreCase("Elegida")) {
            if (butacaIds == null || butacaIds.size() != cantidad) {
                throw new RuntimeException("Debes seleccionar exactamente " + cantidad + " butacas");
            }
            for (Integer b : butacaIds) {
                if (ocupadas.contains(b)) {
                    throw new RuntimeException("La butaca " + b + " ya esta ocupada");
                }
            }
            aComprar = butacaIds;
        } else {
            aComprar = new java.util.ArrayList<>();
            for (Integer b : consulta.getButacaIdsSortedBySala(salaId)) {
                if (!ocupadas.contains(b)) {
                    aComprar.add(b);
                    if (aComprar.size() >= cantidad) break;
                }
            }
            if (aComprar.size() < cantidad) {
                throw new RuntimeException("No hay suficientes butacas libres");
            }
        }

        for (Integer butacaId : aComprar) {
            consulta.insertTicket(usuarioId, sesionId, butacaId, seleccion, precio);
        }
        return true;
    }

    public void deleteTicket(int id) { consulta.deleteTicket(id); }
    public void deleteUser(int id) { consulta.deleteUser(id); }

    public List<Map<String, Object>> getTicketsByUsuario(String nombre) { return consulta.getTicketsByUsuario(nombre); }

    public List<Map<String, Object>> getAllCategorias() {return consulta.getAllCategorias();}
    public void  crearEvento(String nombre, int genero_id, String resumen, String imagen, int dureacion_min) {consulta.crearEvento(nombre, genero_id, resumen, imagen, dureacion_min);}
    public void crearSala(String nombre, double precio_aleatorio, double precio_elegido, String descripcion) {consulta.crearSala(nombre, precio_aleatorio, precio_elegido, descripcion);}
    public List<Map<String, Object>> getSesiones() {return consulta.getSesiones();}
    public int buscarSesiones(String fecha, String hora, int sala_id, int duracion_minutos) {return consulta.buscarSesiones(fecha, hora, sala_id, duracion_minutos);}
    public void crearSesion(String fecha, String hora, int pelicula_id, int sala_id) {consulta.crearSesion(fecha, hora, pelicula_id, sala_id);}
    public Integer getDuracion(int pelicula_id) {return consulta.getDuracion(pelicula_id);}
>>>>>>> testing
}
