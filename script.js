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
// "cartel" es el div del evento que se ha pulsado
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

// TODO: botón "Comprar entradas" -> pantalla de sesiones y butacas

function comprobarScroll() {
    let header = document.querySelector("header");

    if (window.scrollY > 0) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", comprobarScroll);
comprobarScroll();
//