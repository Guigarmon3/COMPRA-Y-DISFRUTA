
// ----------Inicio-----------
const button_loggin = document.querySelector(".btn-login");
const nombre = document.getElementById("user-nombre");
nombre.style.display = "none"

// ---------- Login ----------
function abrirLogin() {
    mostrarLogin();
    document.getElementById("modal-login").hidden = false;
}

function cerrarLogin() {
    document.getElementById("modal-login").hidden = true;
}

// Pestaña "Entrar"
function mostrarLogin() {
    document.getElementById("form-login").hidden = false;
    document.getElementById("form-registro").hidden = true;
    document.getElementById("tab-login").classList.add("activa");
    document.getElementById("tab-registro").classList.remove("activa");
}

// Pestaña "Crear cuenta"
function mostrarRegistro() {
    document.getElementById("form-login").hidden = true;
    document.getElementById("form-registro").hidden = false;
    document.getElementById("tab-login").classList.remove("activa");
    document.getElementById("tab-registro").classList.add("activa");
}

// Mostrar u ocultar la contraseña
function verPassword(idInput, boton) {
    let input = document.getElementById(idInput);

    if (input.type == "password") {
        input.type = "text";
        boton.textContent = "Ocultar";
    } else {
        input.type = "password";
        boton.textContent = "Ver";
    }
}

// ---------- Evento ----------


// funcion para obtener la imagen de un evento
async function getImagen(nombre) {
    const url = "http://localhost:8080/api/getImage/"+nombre;
    const respuesta = await fetch(url);
}



// funcion para añadir la entrada
function comprarEntrada(cartel) {
    console.log(cartel);
    const PreTicket = document.createElement("div");
    const Object = document.createElement("div");
    // const imagen = 
}

function abrirEvento(cartel) {
    // Los datos están en los atributos data-* del cartel
    document.getElementById("evento-img").src = cartel.getAttribute("data-imagen");
    document.getElementById("evento-nombre").textContent = cartel.getAttribute("data-nombre");
    document.getElementById("evento-categoria").textContent = cartel.getAttribute("data-categoria");
    document.getElementById("evento-resumen").textContent = cartel.getAttribute("data-resumen");
    document.getElementById("modal-evento").hidden = false;
}

function cerrarEvento() {
    document.getElementById("modal-evento").hidden = true;
}

// Funcion para cambiar el header de completo a desplazado
function comprobarScroll() {
    let header = document.querySelector("header");

    if (window.scrollY >= 150) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}
window.addEventListener("scroll", comprobarScroll);
comprobarScroll();

// Mostrar todos los eventos
MostrarEventos();

// Panel de adminstrador
function cerrarAdmin() {
    document.getElementById("modal-admin").hidden = true;
}
function abrirAdmin() {
    document.getElementById("modal-admin").hidden = false;
}
// Carrito
function cerrarCarrito() {
    const cerrar = confirm("Quieres borrar todo tu carrito?");
    if (cerrar) {
        document.querySelector(".carrito").hidden = true;

    }   
}


function abrirCarrito() {
    document.querySelector(".carrito").hidden = false;
}
/*

███████╗██████╗ ██████╗ ██╗███╗   ██╗ ██████╗       ██████╗  ██████╗  ██████╗ ████████╗   
██╔════╝██╔══██╗██╔══██╗██║████╗  ██║██╔════╝       ██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝
███████╗██████╔╝██████╔╝██║██╔██╗ ██║██║  ███╗█████╗██████╔╝██║   ██║██║   ██║   ██║  
╚════██║██╔═══╝ ██╔══██╗██║██║╚██╗██║██║   ██║╚════╝██╔══██╗██║   ██║██║   ██║   ██║
███████║██║     ██║  ██║██║██║ ╚████║╚██████╔╝      ██████╔╝╚██████╔╝╚██████╔╝   ██║  
╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝       ╚═════╝  ╚═════╝  ╚═════╝    ╚═╝  

██╗███╗   ██╗████████╗███████╗ ██████╗ ██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
██║████╗  ██║╚══██╔══╝██╔════╝██╔════╝ ██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║ 
██║██╔██╗ ██║   ██║   █████╗  ██║  ███╗██████╔╝███████║   ██║   ██║██║   ██║██╔██╗ ██║
██║██║╚██╗██║   ██║   ██╔══╝  ██║   ██║██╔══██╗██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
██║██║ ╚████║   ██║   ███████╗╚██████╔╝██║  ██║██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
*/


// Esta funcion obtiene el objeto de categoria de la pelicula con el id enviado
async function GetCategoria(id) {
    const respuesta = await fetch("http://localhost:8080/api/getcat/" + id);
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
        pushNotifyError("Error", "No se pudo obtener la categoría");
    }
    const categoria = await respuesta.json();
    return categoria.nombre;
}

// Esta funcion obtiene todas las peliculas y las muestra en la cartelera
async function MostrarEventos() {
    const div = document.getElementById("cartelera");

    div.textContent = "";

    const respuesta = await fetch("http://localhost:8080/api/Peliculas");
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
    }
    const eventos = await respuesta.json();
    console.log(eventos);

    for (const element of eventos) {
        const pelicula = document.createElement("div");
        pelicula.className = "cartel";

        const portada = document.createElement("img");
        portada.src = element.imagen;
        pelicula.append(portada);

        const nombre = document.createElement("p");
        nombre.textContent = element.nombre;
        pelicula.append(nombre);

        const cat = await GetCategoria(element.id);

        pelicula.setAttribute("data-imagen", element.imagen);
        pelicula.setAttribute("data-nombre", element.nombre);
        pelicula.setAttribute("data-categoria", cat);
        pelicula.setAttribute("data-resumen", element.resumen);

        div.appendChild(pelicula);

        pelicula.addEventListener("click", () => abrirEvento(pelicula));
    }
}

// Funcion para mostrar todos los tipos de salas
async function MostrarSalas() {
    const resepuesta = await fetch("http://localhost:8080/api/tipos_salas");
    if (!resepuesta.ok) {
        throw new Error("Error " + resepuesta.status);
    }
    const salas = await resepuesta.json();
    const listaSalas = document.querySelector(".lista-salas"); 

    for (const sala of salas) {
        const tipo = document.createElement("article");
        tipo.className = "sala";    
        const nombre = document.createElement("h3");
        nombre.textContent = sala.nombre;
        const descripcion = document.createElement("p");
        descripcion.textContent = sala.descripcion;
        const listado = document.createElement("ul");
        const butacaAleatoria = document.createElement("li");
        butacaAleatoria.textContent = "Butaca aleatoria: " + sala.precio_aleatorio + " €";
        const butacaElegida = document.createElement("li");
        butacaElegida.textContent = "Butaca elegida: " + sala.precio_elegido + " €";

        listado.appendChild(butacaAleatoria);
        listado.appendChild(butacaElegida);
        tipo.appendChild(nombre);
        tipo.appendChild(descripcion);
        tipo.appendChild(listado);
        listaSalas.append(tipo);
    }
}
MostrarSalas();
// Funcion para crear los usuarios en la bdd
async function crearUsuario() {
    const nombre = document.getElementById("reg-nombre").value;
    const email = document.getElementById("reg-email").value;
    const passwd = document.getElementById("reg-passwd").value;
    if (!nombre || !email || !passwd) {
        pushNotifyError("Error", "Por favor, complete todos los campos");
        return;
    }
    const usuario = {
        nombre: nombre,
        email: email,
        passwd: passwd
    };  

    try {
            const resepuesta = await fetch("http://localhost:8080/api/crearUsuario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            });
            if (!resepuesta.ok) throw new Error("Error " + resepuesta.status);
            const resultado = await resepuesta.json();

            if (await verificarUsuario(nombre.textContent, email) === 1) {
                PushNotify("Creación de Usuario", "Usuario creado correctamente");
            } else {
                pushNotifyError("Error", "Usuario no encontrado");
            }
            console.log(resultado);
            
        } catch (error) {
            pushNotifyError("Error", "No se pudo crear el usuario");
        }
}
// Funcion para iniciar sesión
async function iniciarSesion() {
    const email = document.getElementById("login-email").value;
    const passwd = document.getElementById("login-passwd").value;
    const respuesta = await fetch("http://localhost:8080/api/login/"+email+"/"+passwd)
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
        pushNotifyError("Error", "No se pudo iniciar sesión");
    } else {
        alert("Correcto " + email+": " + passwd);
        nombre.style.display = "block";
        nombre.textContent = await getNombre(email)+"";
        button_loggin.style.display = "none";
        cerrarLogin();
    }
}
name
// Funcion para obtener el nombre del usuario en el que inicias sesión
async function getNombre(email) {
    const respuesta = await fetch("http://localhost:8080/api/getnombre/"+email);
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
        pushNotifyError("Error", "No se pudo obtener el nombre del usuario");
    } else {
        const nombre = await respuesta.text();
        console.log(nombre);
        return nombre;
    }   
}

// Funcion para obtener el rol de un usuario
async function getRol(email) {
        const respuesta = await fetch("http://localhost:8080/api/getrol/"+email);
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
    } else {
        try {
        const nombre = await respuesta.text();
        console.log(nombre);
        return nombre;
        } catch (error) {
            console.log(error);
        }
    }   
}

// Funcion para verificar si el usuario ha sido creado
async function verificarUsuario(nombre, email) {
    const url = `http://localhost:8080/api/contuser/${nombre}/${email}`;
    const respuesta = await fetch(url);
    
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
    }
    
    const textoBruto = await respuesta.text();
    // Limpiamos espacios o saltos de línea por si acaso
    const existe = textoBruto.trim(); 
    
    console.log("Lo que devuelve la API de verificación:", JSON.stringify(existe));

    // Aceptamos tanto "1" como 1 por seguridad
    return existe === "1" || existe === 1;
}


// Funcion para crear cada ticket de compra
async function creteTicket(nombre) {
    
}

// Funcion para mostrar todas las salsas en el ticket de compra
async function optionTipoSala() {
    const respuesta = await fetch("http://localhost:8080/api/tipos_salas")
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
    }

    const desplegables = document.querySelectorAll(".tipoTicket");
    try {
        const salas = await respuesta.json();
        desplegables.forEach(desplegable => {
            salas.forEach(sala => {
                console.log(sala.nombre)
                const opcion = document.createElement("option");
                opcion.value = sala.nombre;
                opcion.textContent = sala.nombre;
                desplegable.appendChild(opcion)
            });
        });
    } catch (error) {
        console.log(error)
    }
}