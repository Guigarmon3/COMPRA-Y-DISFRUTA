package proyecto_intermodular.springboot.Modal;

import java.time.LocalDate;
import java.time.LocalTime;

public class Sesion {

    public int id;
    public LocalDate dia;
    public LocalTime hora;
    public int pelicula_id;
    public int sala_id;

    public Sesion(int id, LocalDate dia, LocalTime hora, int pelicula_id, int sala_id) {
        this.id = id;
        this.dia = dia;
        this.hora = hora;
        this.pelicula_id = pelicula_id;
        this.sala_id = sala_id;
    }
}
