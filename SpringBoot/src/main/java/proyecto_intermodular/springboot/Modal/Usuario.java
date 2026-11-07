package proyecto_intermodular.springboot.Modal;

public class Usuario {
    public String nombre;
    public String email;
    public String passwd;

    public Usuario() {
    }

    public Usuario(String nombre, String email, String passwd) {
        this.nombre = nombre;
        this.email = email;
        this.passwd = passwd;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswd() {
        return passwd;
    }

    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }
}
