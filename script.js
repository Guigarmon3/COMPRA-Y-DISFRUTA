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

// Ventana de butacas
function cerrarButacas() {
    document.getElementById("modal-butacas").hidden = true;
}

// Ventana de tickets
async function abrirTickets() {
    const modal = document.getElementById("modal-tickets");
    const lista = document.getElementById("lista-tickets");
    lista.textContent = "";

    const login = await getLogin();
    if (!login) return;

    const nombre = document.getElementById("user-nombre").textContent;
    try {
        const resp = await fetch("http://localhost:8080/api/tickets/" + encodeURIComponent(nombre));
        if (!resp.ok) throw new Error("Error " + resp.status);
        const tickets = await resp.json();

        if (tickets.length === 0) {
            const p = document.createElement("p");
            p.textContent = "No tienes tickets comprados.";
            lista.appendChild(p);
            modal.hidden = false;
            return;
        }

        tickets.forEach(t => {
            const card = document.createElement("div");
            card.className = "ticket";

            const img = document.createElement("img");
            img.src = t.imagen;
            img.alt = "Imagen Pelicula";
            img.className = "img-ticket";

            const span = document.createElement("span");
            const h1 = document.createElement("h1");
            h1.textContent = t.pelicula;
            const h2 = document.createElement("h2");
            h2.textContent = t.sala + " (" + t.tipo_sala + ")";
            span.append(h1, h2);

            const pFecha = document.createElement("p");
            pFecha.textContent = "Fecha: " + formatearFechaHoraSesion(t.fecha_hora);
            const pButaca = document.createElement("p");
            pButaca.textContent = "Butaca - Fila: " + t.fila + ", Número: " + t.numero_butaca;
            const pSel = document.createElement("p");
            pSel.textContent = "Tipo: " + t.seleccion + " - " + Number(t.precio_total).toFixed(2).replace(".", ",") + " €";

            const btn = document.createElement("button");
            btn.textContent = "Devolver entrada";
            btn.addEventListener("click", async () => {
                const r = await fetch("http://localhost:8080/api/ticket/" + t.id, { method: "DELETE" });
                if (r.ok) {
                    PushNotify("Devolución", "Entrada devuelta correctamente");
                    abrirTickets();
                } else {
                    pushNotifyError("Error", "No se pudo devolver la entrada");
                }
            });

            card.append(img, span, pFecha, pButaca, pSel, btn);
            lista.appendChild(card);
        });
    } catch (e) {
        pushNotifyError("Error", "No se pudieron cargar los tickets");
    }

    modal.hidden = false;
}

function cerrarTickets() {
    document.getElementById("modal-tickets").hidden = true;
}
async function abrirAdmin() {
    if (await getLogin() === true) {
        if (await getRolLogin() === "ADMIN") {
            document.getElementById("modal-admin").hidden = false;
        }
    }
}
// Carrito
async function cerrarCarrito() {
    const resultado = await Swal.fire({
        title: "¿Cerrar la compra?",
        text: "Se borrarán todas las entradas de tu carrito.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "Cancelar",
        background: "#1e293b",
        color: "#cbd5e1",
        confirmButtonColor: "#f97316",
        cancelButtonColor: "#475569"
    });
    if (resultado.isConfirmed) {
        ocultarCarrito();
        borrarCarro()
    }   
}


// Minimizar / restaurar el carrito (solo queda visible la cabecera)
function minimizarCarrito() {
    const carrito = document.querySelector(".carrito");
    const boton = document.getElementById("btn-minimizar");
    carrito.classList.toggle("minimizado");
    if (carrito.classList.contains("minimizado")) {
        boton.innerHTML = "&#9660;";
        boton.setAttribute("aria-label", "Restaurar");
    } else {
        boton.innerHTML = "&minus;";
        boton.setAttribute("aria-label", "Minimizar");
    }
}

function abrirCarrito() {
    document.querySelector(".carrito").hidden = false;
    // Desplaza el contenido principal a la izquierda para dejar sitio al carrito
    document.body.classList.add("carrito-abierto");
}

// Deja el contenido exactamente como estaba al cargar la página
function restaurarPosicionPrincipal() {
    document.body.classList.remove("carrito-abierto");
    ["eventos", "salas", "informacion"].forEach(id => {
        const seccion = document.getElementById(id);
        if (seccion) seccion.style.paddingRight = "";
    });
}

function ocultarCarrito() {
    document.querySelector(".carrito").hidden = true;
    restaurarPosicionPrincipal();
}

// Si el carrito se oculta por cualquier motivo, se restaura la posición original
const carritoPrincipal = document.querySelector(".carrito");
if (carritoPrincipal) {
    new MutationObserver(() => {
        if (carritoPrincipal.hidden) {
            restaurarPosicionPrincipal();
        }
    }).observe(carritoPrincipal, { attributes: true, attributeFilter: ["hidden"] });
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

// Funcion para mostrar todas las salas (una por cada tipo)
async function MostrarSalas() {
    const resepuesta = await fetch("http://localhost:8080/api/Salas");
    if (!resepuesta.ok) {
        throw new Error("Error " + resepuesta.status);
    }
    const salas = await resepuesta.json();
    const listaSalas = document.querySelector(".lista-salas"); 

    for (const sala of salas) {
        const tipo = document.createElement("article");
        tipo.className = "sala";    
        const nombre = document.createElement("h3");
        nombre.textContent = sala.tipo;
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
// Devuelve un motivo claro cuando el registro falla
function motivoErrorCrearUsuario(respuesta, datos) {
    const mensajeBackend = datos && (datos.mensaje || datos.message || datos.error);
    if (mensajeBackend && mensajeBackend !== "Internal Server Error") {
        return mensajeBackend;
    }

    switch (respuesta.status) {
        case 400:
            return "Los datos del registro no son válidos. Revisa el nombre, el email y la contraseña.";
        case 404:
            return "El servidor no tiene disponible el servicio de registro de usuarios.";
        case 409:
            return "Ese email ya está registrado o los datos entran en conflicto con otro usuario.";
        case 500:
            return "El servidor no pudo guardar el usuario. Puede que el email ya esté registrado.";
        default:
            return "No se pudo crear el usuario (error " + respuesta.status + ").";
    }
}

// Funcion para crear los usuarios en la bdd
async function crearUsuario() {
    const boton = document.getElementById("btn-crear-cuenta");
    // Evita enviar dos registros si se hace doble clic o se pulsa Enter varias veces
    if (boton && boton.disabled) return;

    const nombre = document.getElementById("reg-nombre").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const passwd = document.getElementById("reg-passwd").value;

    if (!nombre || !email || !passwd) {
        pushNotifyError("Error", "Por favor, complete todos los campos");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        pushNotifyError("Error", "El email no tiene un formato válido");
        return;
    }
    if (passwd.length < 6) {
        pushNotifyError("Error", "La contraseña debe tener al menos 6 caracteres");
        return;
    }

    const usuario = { nombre, email, passwd };

    if (boton) {
        boton.disabled = true;
        boton.textContent = "Creando cuenta...";
    }

    try {
        const respuesta = await fetch("http://localhost:8080/api/crearUsuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        });

        let datos = null;
        try {
            datos = await respuesta.json();
        } catch (_) {
            // La respuesta no trae JSON; se usa el mensaje genérico
        }

        if (!respuesta.ok) {
            throw new Error(motivoErrorCrearUsuario(respuesta, datos));
        }

        PushNotify("Creación de Usuario", "Usuario creado correctamente");

        document.getElementById("form-registro").reset();
        document.getElementById("login-email").value = email;
        mostrarLogin();
    } catch (error) {
        const mensaje = error instanceof TypeError
            ? "No se pudo conectar con el servidor. Comprueba que el backend esté arrancado."
            : (error.message || "No se pudo crear el usuario.");
        pushNotifyError("Error al crear el usuario", mensaje);
    } finally {
        if (boton) {
            boton.disabled = false;
            boton.textContent = "Crear cuenta";
        }
    }
}

// Funcion para obtener el nombre del usuario en el que inicias sesión
async function getNombre(email) {
    const respuesta = await fetch("http://localhost:8080/api/getnombre/"+email);
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
    } else {
        const nombre = await respuesta.text();
        return nombre;
    }   
}

// Funcion para obtener el rol de un usuario
async function getRolEmail(email) {
    const respuesta = await fetch("http://localhost:8080/api/getrol/"+email);
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
    } else {
        try {
        const nombre = await respuesta.json();
        return nombre;
        } catch (error) {
            console.log(error);
        }
    }   
}

async function getLogin() {
    const nombre = document.getElementById("user-nombre").textContent
    if (nombre !== "") {
        const respuesta = await fetch("http://localhost:8080/api/getrol2/"+nombre);
        if (!respuesta.ok) {
            throw new Error("Error " + respuesta.status);
        } else {
            try {
            const nombre = await respuesta.json();
                return true;
            } catch (error) {
                console.log(error);
            }
        }   
    } else {
        pushNotifyError("Error", "No has iniciado sesion")
        return false;
    }
}
async function getRolLogin() {
    const nombre = document.getElementById("user-nombre").textContent
    if (nombre !== "") {
        const respuesta = await fetch("http://localhost:8080/api/getrol2/"+nombre);
        if (!respuesta.ok) {
            throw new Error("Error " + respuesta.status);
        } else {
            try {
                const rol = await respuesta.json();
                return rol;
            } catch (error) {
                console.log(error);
            }
        }   
    } else {
        pushNotifyError("Error", "No has iniciado sesion")
        return false;
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

    // Aceptamos tanto "1" como 1 por seguridad
    return existe === "1" || existe === 1;
}
// Funcion para iniciar sesión
let sesion = false;
async function iniciarSesion() {
    const email = document.getElementById("login-email").value;
    const passwd = document.getElementById("login-passwd").value;
    const respuesta = await fetch("http://localhost:8080/api/login/"+email+"/"+passwd)
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
    } else {
        if(await respuesta.json()) {
            const rol = await getRolEmail(email)
            if (rol == "ADMIN") {
                document.getElementById("admin-pannel").removeAttribute("hidden");
                sesion = true;
            } else {
                document.getElementById("modal-admin").remove();
                sesion = true;
            }
            nombre.style.display = "block";
            nombre.textContent = await getNombre(email)+"";
            button_loggin.style.display = "none";
            cerrarLogin();
        } else {
            pushNotifyError("Error", "No existe ningun usuario con esas credenciales")
        }
    }
}

async function getImagen(nombre) {
    const url = `http://localhost:8080/api/getImage/${nombre}`;
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
    }
    try {
        const imagen = await respuesta.text();
        return imagen;
    } catch (error) {
        console.log("error");
    }
}

// Muestra una fecha/hora de sesión en formato dd/mm/aaaa hh:mm
function fechaSesion(valor) {
    if (!valor) return "";
    return String(valor).replace("T", " ").trim().split(/\s+/)[0] || "";
}

function horaSesion(valor) {
    if (!valor) return "";
    const partes = String(valor).replace("T", " ").trim().split(/\s+/);
    return (partes[1] || "").slice(0, 5);
}

function formatearFechaSesion(valor) {
    const fecha = fechaSesion(valor);
    const partes = fecha.split("-");
    if (partes.length !== 3) return fecha;
    const [anio, mes, dia] = partes;
    return `${dia}/${mes}/${anio}`;
}

function formatearFechaHoraSesion(valor) {
    const fecha = formatearFechaSesion(valor);
    const hora = horaSesion(valor);
    return `${fecha}${hora ? " " + hora : ""}`;
}

function etiquetaSesion(sesion) {
    return `${formatearFechaHoraSesion(sesion.fecha_hora)} · ${sesion.tipo}`;
}

// Funcion para crear cada ticket de compra
async function creteTicket(nombre) {
    if (sesion) {
        // Solo se puede comprar para una pelicula a la vez
        const peliEnCarrito = document.querySelector(".PreTicketNombre");
        if (peliEnCarrito && peliEnCarrito.textContent !== nombre) {
            const resultado = await Swal.fire({
                title: "Ya tienes otra película",
                text: "Tu carrito tiene entradas de \"" + peliEnCarrito.textContent + "\". ¿Quieres borrarlas y comprar para \"" + nombre + "\"?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí, cambiar",
                cancelButtonText: "No, mantener",
                background: "#1e293b",
                color: "#cbd5e1",
                confirmButtonColor: "#f97316",
                cancelButtonColor: "#475569"
            });
            if (!resultado.isConfirmed) {
                return;
            }
            borrarCarro();
        }

        // La ventana de la pelicula se cierra al comprar
        cerrarEvento();

        if (document.querySelector(".carrito").hidden === true) {
            abrirCarrito();
        } 

        const PreTicket = document.createElement("div");
        PreTicket.className = "PreTicket";
            const Objeto = document.createElement("div");
            Objeto.className = "Object";
                const img = document.createElement("img");
                img.src = await getImagen(nombre);
                img.className="imgPreTicket";
                const info = document.createElement("div");
                info.className="info";
                    const PreTicketNombre = document.createElement("p");
                    PreTicketNombre.className = "PreTicketNombre";
                    PreTicketNombre.textContent=nombre;
                    const PreTicketSala = document.createElement("p");
                    PreTicketSala.className = "PreTicketSala";
                info.append(PreTicketNombre, PreTicketSala);
                const id = await getIdPeli(nombre);
                const arraySesiones = (await getSesionesPeli(id)) || [];

                if (arraySesiones.length === 0) {
                    pushNotifyError("Sin sesiones", "No hay sesiones disponibles para esta película");
                    PreTicket.remove();
                    if (document.querySelectorAll(".PreTicket").length === 0) {
                        ocultarCarrito();
                    }
                    return;
                }

                // Ordena las sesiones por fecha y hora
                arraySesiones.sort((a, b) => String(a.fecha_hora).localeCompare(String(b.fecha_hora)));

                const sesionSelectores = document.createElement("div");
                sesionSelectores.className = "sesionSelectores";

                const crearCampoSeleccion = (texto, clase) => {
                    const campo = document.createElement("div");
                    campo.className = "campoSeleccion";
                    const label = document.createElement("label");
                    label.textContent = texto;
                    const selector = document.createElement("select");
                    selector.className = "selectSesion " + clase;
                    selector.setAttribute("aria-label", texto);
                    campo.append(label, selector);
                    sesionSelectores.appendChild(campo);
                    return selector;
                };

                const selectSala = crearCampoSeleccion("Sala", "selectSala");
                const selectFecha = crearCampoSeleccion("Fecha", "selectFecha");
                const selectHora = crearCampoSeleccion("Hora", "selectHora");

                const cantidadTicket = document.createElement("p");
                cantidadTicket.className="cantidadTicket";
                let numero = 1;
                cantidadTicket.textContent=numero;

                let maxCantidad = 170;
                let peticionMaxCantidad = 0;

                const actualizarResumenSesion = () => {
                    const opcionHora = selectHora.selectedOptions[0];
                    if (!opcionHora) {
                        PreTicketSala.textContent = "Sin sesiones disponibles";
                        delete PreTicketSala.dataset.sesionId;
                        return;
                    }
                    const partes = [];
                    if (selectSala.selectedOptions[0]) partes.push(selectSala.selectedOptions[0].textContent);
                    if (selectFecha.selectedOptions[0]) partes.push(selectFecha.selectedOptions[0].textContent);
                    partes.push(opcionHora.textContent);
                    PreTicketSala.textContent = partes.join(" · ");
                    PreTicketSala.dataset.sesionId = opcionHora.dataset.sesionId;
                };

                // Cantidad maxima = butacas libres de la sesion seleccionada
                const actualizarMaxCantidad = async () => {
                    const opcionHora = selectHora.selectedOptions[0];
                    if (!opcionHora) {
                        maxCantidad = 1;
                        numero = 1;
                        cantidadTicket.textContent = numero;
                        return;
                    }
                    const peticion = ++peticionMaxCantidad;
                    const libres = await contarLibres(opcionHora.dataset.sesionId);
                    // Ignora respuestas antiguas si el usuario cambió rápido de sesión
                    if (peticion !== peticionMaxCantidad) return;
                    maxCantidad = libres > 0 ? libres : 1;
                    if (numero > maxCantidad) {
                        numero = maxCantidad;
                        cantidadTicket.textContent = numero;
                    }
                };

                const rellenarHoras = () => {
                    const sesiones = arraySesiones.filter(s =>
                        String(s.sala_id) === String(selectSala.value) &&
                        fechaSesion(s.fecha_hora) === selectFecha.value
                    );
                    selectHora.textContent = "";
                    sesiones.forEach(sesion => {
                        const opcion = document.createElement("option");
                        opcion.value = sesion.sesion_id;
                        opcion.textContent = horaSesion(sesion.fecha_hora);
                        opcion.dataset.sesionId = sesion.sesion_id;
                        opcion.dataset.aleatoria = sesion.precio_aleatorio;
                        opcion.dataset.elegida = sesion.precio_elegido;
                        selectHora.appendChild(opcion);
                    });
                    actualizarResumenSesion();
                };

                const rellenarFechas = () => {
                    const fechaAnterior = selectFecha.value;
                    const fechas = [...new Set(
                        arraySesiones
                            .filter(s => String(s.sala_id) === String(selectSala.value))
                            .map(s => fechaSesion(s.fecha_hora))
                    )].sort();

                    selectFecha.textContent = "";
                    fechas.forEach(fecha => {
                        const opcion = document.createElement("option");
                        opcion.value = fecha;
                        opcion.textContent = formatearFechaSesion(fecha);
                        selectFecha.appendChild(opcion);
                    });
                    if (fechas.includes(fechaAnterior)) selectFecha.value = fechaAnterior;
                    rellenarHoras();
                };

                const rellenarSalas = () => {
                    const salas = [];
                    const vistas = new Set();
                    arraySesiones.forEach(sesion => {
                        const salaId = String(sesion.sala_id);
                        if (!vistas.has(salaId)) {
                            vistas.add(salaId);
                            salas.push(sesion);
                        }
                    });
                    salas.sort((a, b) => Number(a.sala_id) - Number(b.sala_id));

                    const salaAnterior = selectSala.value;
                    selectSala.textContent = "";
                    salas.forEach(sesion => {
                        const opcion = document.createElement("option");
                        opcion.value = sesion.sala_id;
                        opcion.textContent = `${sesion.sala || "Sala " + sesion.sala_id} · ${sesion.tipo}`;
                        selectSala.appendChild(opcion);
                    });
                    if (salas.some(s => String(s.sala_id) === String(salaAnterior))) {
                        selectSala.value = salaAnterior;
                    }
                    rellenarFechas();
                };

                selectSala.addEventListener("change", async () => {
                    rellenarFechas();
                    await actualizarMaxCantidad();
                    actualizarTotal();
                });
                selectFecha.addEventListener("change", async () => {
                    rellenarHoras();
                    await actualizarMaxCantidad();
                    actualizarTotal();
                });
                selectHora.addEventListener("change", async () => {
                    actualizarResumenSesion();
                    await actualizarMaxCantidad();
                    actualizarTotal();
                });

                rellenarSalas();
                await actualizarMaxCantidad();
                const PreTicketInputs = document.createElement("div");
                PreTicketInputs.className = "PreTicketInputs";
                const Mas = document.createElement("button");
                Mas.className="Mas";
                Mas.textContent="+";
                Mas.addEventListener("click", () => {
                    if (numero < maxCantidad) {
                        numero++;
                        cantidadTicket.textContent = numero;
                        actualizarTotal();
                    } else {
                        numero = maxCantidad;
                        cantidadTicket.textContent = numero;
                        pushNotifyError("Limite alcanzado", "No puedes reservar mas butacas que las que quedan libres en la sala")
                    }
                });
                const Menos = document.createElement("button");
                Menos.className="Menos";
                Menos.textContent="-"


                Menos.addEventListener("click", () => {
                    if (numero-1 == 0) {
                        PreTicket.remove();
                        // Si era la ultima entrada, se cierra el carrito
                        if (document.querySelectorAll(".PreTicket").length === 0) {
                            ocultarCarrito();
                        }
                    }
                    if (numero > 0) {
                        numero--;
                        cantidadTicket.textContent = numero;
                    }
                    actualizarTotal();
                });

                // Selector de tipo de butaca (los valores coinciden con el enum de la tabla ticket)
                const tipoButaca = document.createElement("select");
                tipoButaca.className = "tipoButaca";
                ["Aleatoria", "Elegida"].forEach(valor => {
                    const opcion = document.createElement("option");
                    opcion.value = valor;
                    opcion.textContent = valor;
                    tipoButaca.appendChild(opcion);
                });
                tipoButaca.addEventListener("change", actualizarTotal);

                PreTicketInputs.append(Menos, cantidadTicket, Mas, tipoButaca);
            Objeto.append(img, info, sesionSelectores, PreTicketInputs)
        PreTicket.appendChild(Objeto)
        const lista = document.querySelector(".carrito-lista");
        lista.appendChild(PreTicket);
        actualizarTotal();
    } else {
        pushNotifyError("Error", "No has iniciado sesión");
    }

}

async function getIdPeli(nombre) {
    const respuesta = await fetch("http://localhost:8080/api/getidpeli/"+nombre);
    if (!respuesta.ok) {
        console.log(new Error("Error: " + respuesta.status));
    }
    try {
        return await respuesta.text();
    } catch (error) {
        console.log(error)
    }
}

async function getSesionesPeli(id) {
    const respuesta = await fetch("http://localhost:8080/api/getsesiones/"+id);
    if (!respuesta.ok) {
        return console.log("Error: " + respuesta.status)
    }
    try {
        return await respuesta.json()
    } catch (error) {
        console.log(error)
    }
}

function borrarCarro() {
    document.querySelectorAll(".PreTicket").forEach(e => e.remove());
    actualizarTotal();
}

// Suma de todas las entradas del carrito: cantidad x precio (segun sala y tipo de butaca)
function actualizarTotal() {
    let total = 0;
    document.querySelectorAll(".PreTicket").forEach(ticket => {
        const sesionElegida = ticket.querySelector(".selectHora").selectedOptions[0];
        if (!sesionElegida) return;
        const tipo = ticket.querySelector(".tipoButaca").value;
        const precio = tipo === "Aleatoria" ? sesionElegida.dataset.aleatoria : sesionElegida.dataset.elegida;
        const cantidad = Number(ticket.querySelector(".cantidadTicket").textContent);
        total += Number(precio) * cantidad;
    });
    document.querySelector(".precioTotalCarrito p").textContent = "Total: " + total.toFixed(2).replace(".", ",") + "€";
}

async function crearLineasButacas(sesionId) {
    const butacas_lista = document.querySelector(".lista_butacas");
    butacas_lista.textContent = "";

    const respuesta = await fetch("http://localhost:8080/api/getButacasFromSesion/" + sesionId);
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
    }
    const butacas = await respuesta.json();

    // Agrupar por fila
    const porFila = {};
    for (let i = 1; i <= 12; i++) porFila[i] = [];
    butacas.forEach(b => {
        if (!porFila[b.fila]) porFila[b.fila] = [];
        porFila[b.fila].push(b);
    });

    for (let i = 1; i <= 12; i++) {
        const linea = document.createElement("div");
        linea.className = "butaca_linea";

        porFila[i].sort((a,b) => a.numero_butaca - b.numero_butaca).forEach(butca => {
            const butaca = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            butaca.setAttribute("width", "22");
            butaca.setAttribute("height", "22");
            butaca.setAttribute("viewBox", "0 0 22 22");
            butaca.dataset.id = butca.id;

            for (let k = 1; k <= 5; k++) {
                const rectangulo = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                if (k === 1) {
                    rectangulo.setAttribute("x", "3"); rectangulo.setAttribute("y", "1");
                    rectangulo.setAttribute("width", "16"); rectangulo.setAttribute("height", "12");
                    rectangulo.setAttribute("rx", "4"); rectangulo.setAttribute("fill", "#cbd5e1");
                    rectangulo.setAttribute("stroke", "#475569"); rectangulo.setAttribute("stroke-width", "1");
                }
                if (k === 2) {
                    rectangulo.setAttribute("x", "6"); rectangulo.setAttribute("y", "3");
                    rectangulo.setAttribute("width", "10"); rectangulo.setAttribute("height", "6");
                    rectangulo.setAttribute("rx", "2"); rectangulo.setAttribute("fill", "#e2e8f0");
                }
                if (k === 3) {
                    rectangulo.setAttribute("x", "4"); rectangulo.setAttribute("y", "12");
                    rectangulo.setAttribute("width", "14"); rectangulo.setAttribute("height", "8");
                    rectangulo.setAttribute("rx", "3"); rectangulo.setAttribute("fill", "#94a3b8");
                    rectangulo.setAttribute("stroke", "#475569"); rectangulo.setAttribute("stroke-width", "1");
                }
                if (k === 4) {
                    rectangulo.setAttribute("x", "1"); rectangulo.setAttribute("y", "9");
                    rectangulo.setAttribute("width", "4"); rectangulo.setAttribute("height", "11");
                    rectangulo.setAttribute("rx", "2"); rectangulo.setAttribute("fill", "#64748b");
                    rectangulo.setAttribute("stroke", "#334155"); rectangulo.setAttribute("stroke-width", "1");
                }
                if (k === 5) {
                    rectangulo.setAttribute("x", "17"); rectangulo.setAttribute("y", "9");
                    rectangulo.setAttribute("width", "4"); rectangulo.setAttribute("height", "11");
                    rectangulo.setAttribute("rx", "2"); rectangulo.setAttribute("fill", "#64748b");
                    rectangulo.setAttribute("stroke", "#334155"); rectangulo.setAttribute("stroke-width", "1");
                }
                butaca.appendChild(rectangulo);
            }

            if (butca.estado === "OCUPADA") {
                butaca.setAttribute("data-nodisponible", "true");
                // marcar en rojo
                butaca.querySelectorAll("rect").forEach(r => r.setAttribute("fill", "#ef4444"));
            } else {
                butaca.style.cursor = "pointer";
                butaca.addEventListener("click", () => {
                    const id = Number(butca.id);
                    if (asientosSeleccionados.has(id)) {
                        asientosSeleccionados.delete(id);
                        butaca.querySelectorAll("rect").forEach((r, idx) => {
                            // restaurar colores originales aproximados
                        });
                        butaca.removeAttribute("data-seleccionada");
                        // revertir fills
                        const rects = butaca.querySelectorAll("rect");
                        rects[0].setAttribute("fill", "#cbd5e1");
                        rects[2].setAttribute("fill", "#94a3b8");
                        rects[3].setAttribute("fill", "#64748b");
                        rects[4].setAttribute("fill", "#64748b");
                    } else {
                        if (asientosSeleccionados.size >= maxAsientosSeleccion) {
                            pushNotifyError("Limite", "Ya has seleccionado " + maxAsientosSeleccion + " butacas");
                            return;
                        }
                        asientosSeleccionados.add(id);
                        butaca.setAttribute("data-seleccionada", "true");
                        butaca.querySelectorAll("rect").forEach(r => r.setAttribute("fill", "#f97316"));
                    }
                });
            }
            linea.appendChild(butaca);
        });

        butacas_lista.appendChild(linea);
    }
}

// Variables globales de seleccion de butacas
const asientosSeleccionados = new Set();
let maxAsientosSeleccion = 1;

async function abrirButacas() {
    const modalButaca = document.getElementById("modal-butacas");

    document.querySelectorAll(".butaca_linea").forEach(linea => {
        linea.remove();
    });

    asientosSeleccionados.clear();

    const login = await getLogin();
    if (login) {
        const sesionId = document.querySelector(".PreTicketSala").dataset.sesionId;
        const cantidad = Number(document.querySelector(".cantidadTicket").textContent);
        maxAsientosSeleccion = cantidad > 0 ? cantidad : 1;
        await crearLineasButacas(sesionId);
        modalButaca.hidden = false;
    }
}

// Obtiene la id y tipo de las salas en las que se reproduce la pelicula
async function getIdAndTipoSala() {
    const nombrePeli = document.querySelector(".PreTicketNombre").textContent;
    const respuesta = await fetch("http://localhost:8080/api/getIdSesion/" + encodeURIComponent(nombrePeli));
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
    }
    const datos = await respuesta.json();
    return datos;
}

async function getidSala() {
    const array = await getIdAndTipoSala();
    const sesionId = document.querySelector(".PreTicketSala").dataset.sesionId;

    const sala = array.find(s => String(s.sesion_id) === String(sesionId));
    if (!sala) {
        console.warn("No se encontró la sesión:", sesionId);
        return null;
    }
    console.log("Encontrado, la sala es: " + sala.sala_id + " | " + sala.tipo);
    return sala.sala_id;
}
async function contarLibres(sesionId) {
    const resp = await fetch("http://localhost:8080/api/getButacasFromSesion/" + sesionId);
    if (!resp.ok) return 0;
    const butacas = await resp.json();
    return butacas.filter(b => b.estado === "LIBRE").length;
}

async function procesarPago() {
    const tipoButaca = document.querySelector(".tipoButaca").value;
    const sesionId = document.querySelector(".PreTicketSala").dataset.sesionId;
    const cantidad = Number(document.querySelector(".cantidadTicket").textContent);

    // Validar cantidad <= libres
    const libres = await contarLibres(sesionId);
    if (cantidad > libres) {
        pushNotifyError("Sin butacas", "Solo quedan " + libres + " butacas libres");
        return;
    }

    if (tipoButaca === "Elegida") {
        abrirButacas();
    } else {
        // Aleatoria: compra directa
        await comprarEntradas(sesionId, "Aleatoria", cantidad, []);
    }
}

async function confirmarCompraButacas() {
    const sesionId = document.querySelector(".PreTicketSala").dataset.sesionId;
    const cantidad = Number(document.querySelector(".cantidadTicket").textContent);
    if (asientosSeleccionados.size !== cantidad) {
        pushNotifyError("Seleccion incompleta", "Debes seleccionar " + cantidad + " butacas");
        return;
    }
    const ok = await comprarEntradas(sesionId, "Elegida", cantidad, Array.from(asientosSeleccionados));
    if (ok) {
        asientosSeleccionados.clear();
    }
}

async function comprarEntradas(sesionId, seleccion, cantidad, butacaIds) {
    const nombre = document.getElementById("user-nombre").textContent;
    try {
        const resp = await fetch("http://localhost:8080/api/comprar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: nombre,
                sesion_id: Number(sesionId),
                seleccion: seleccion,
                cantidad: cantidad,
                butaca_ids: butacaIds
            })
        });
        const data = await resp.json().catch(() => ({}));
        if (resp.ok && data.ok) {
            PushNotify("Compra realizada", "Tus entradas se han comprado correctamente");
            borrarCarro();
            cerrarButacas();
            // Si ya no quedan entradas en el carrito, se cierra
            if (document.querySelectorAll(".PreTicket").length === 0) {
                ocultarCarrito();
            }
            return true;
        } else {
            pushNotifyError("Error", data.mensaje || "No se pudo completar la compra");
            return false;
        }
    } catch (e) {
        pushNotifyError("Error", "No se pudo completar la compra");
        return false;
    }
}
