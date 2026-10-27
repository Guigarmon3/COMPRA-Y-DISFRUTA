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
        document.querySelector(".carrito").hidden = true;
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
    document.getElementById("eventos").style.paddingRight = "20%";
    document.getElementById("salas").style.paddingRight = "20%";
    document.getElementById("informacion").style.paddingRight = "20%";

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
                const select = document.createElement("select");
                select.className="tipoTicket";

                const id = await getIdPeli(nombre);
                const arraySesiones = await getSesionesPeli(id);

                arraySesiones.forEach(sesion => {
                        const opcion = document.createElement("option");
                        opcion.value = sesion.tipo;
                        opcion.textContent = sesion.tipo;
                        opcion.dataset.aleatoria = sesion.precio_aleatorio;
                        opcion.dataset.elegida = sesion.precio_elegido;
                        select.appendChild(opcion);
                });
                
                select.addEventListener("change", function(){
                    PreTicketSala.textContent = select.value;
                    actualizarTotal();
                });
                PreTicketSala.textContent = select.value
                const cantidadTicket = document.createElement("p");
                cantidadTicket.className="cantidadTicket";
                let numero = 1;
                cantidadTicket.textContent=numero;
                const PreTicketInputs = document.createElement("div");
                PreTicketInputs.className = "PreTicketInputs";
                const Mas = document.createElement("button");
                Mas.className="Mas";
                Mas.textContent="+";
                Mas.addEventListener("click", () => {
                    if (numero < 170) {
                        numero++;
                        cantidadTicket.textContent = numero;
                        actualizarTotal();
                    } else {
                        numero = 170
                        cantidadTicket.textContent = numero;
                        pushNotifyError("Limite alcanzado", "No puedes reservar mas butacas que las que hay en la sala")
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
                            document.querySelector(".carrito").hidden = true;
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
            Objeto.append(img, info, select, PreTicketInputs)
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
        const sala = ticket.querySelector(".tipoTicket").selectedOptions[0];
        if (!sala) return;
        const tipo = ticket.querySelector(".tipoButaca").value;
        const precio = tipo === "Aleatoria" ? sala.dataset.aleatoria : sala.dataset.elegida;
        const cantidad = Number(ticket.querySelector(".cantidadTicket").textContent);
        total += Number(precio) * cantidad;
    });
    document.querySelector(".precioTotalCarrito p").textContent = "Total: " + total.toFixed(2).replace(".", ",") + "€";
}

async function crearLineasButacas(sala) {
    
    const butacas_lista = document.querySelector(".lista_butacas");

    for (let i = 1; i <= 12; i++) {
        const linea = document.createElement("div")
        linea.className = "butaca_linea";
        const butacasDeLaLinea = await generadorButacasPorLinea(sala, i);

        butacasDeLaLinea.forEach(butca => {
            const butaca = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            butaca.setAttribute("width", "22");
            butaca.setAttribute("height", "22");
            butaca.setAttribute("viewBox", "0 0 22 22");

            // Crear los 5 rectangulos con rect
            for (let k = 1; k <= 5; k++) {
                const rectangulo = document.createElementNS("http://www.w3.org/2000/svg", "rect");

                if (k === 1) { // respaldo
                    rectangulo.setAttribute("x", "3");
                    rectangulo.setAttribute("y", "1");
                    rectangulo.setAttribute("width", "16");
                    rectangulo.setAttribute("height", "12");
                    rectangulo.setAttribute("rx", "4");
                    rectangulo.setAttribute("fill", "#cbd5e1");
                    rectangulo.setAttribute("stroke", "#475569");
                    rectangulo.setAttribute("stroke-width", "1");
                }
                if (k === 2) { // brillo del respaldo
                    rectangulo.setAttribute("x", "6");
                    rectangulo.setAttribute("y", "3");
                    rectangulo.setAttribute("width", "10");
                    rectangulo.setAttribute("height", "6");
                    rectangulo.setAttribute("rx", "2");
                    rectangulo.setAttribute("fill", "#e2e8f0");
                }
                if (k === 3) { // asiento
                    rectangulo.setAttribute("x", "4");
                    rectangulo.setAttribute("y", "12");
                    rectangulo.setAttribute("width", "14");
                    rectangulo.setAttribute("height", "8");
                    rectangulo.setAttribute("rx", "3");
                    rectangulo.setAttribute("fill", "#94a3b8");
                    rectangulo.setAttribute("stroke", "#475569");
                    rectangulo.setAttribute("stroke-width", "1");
                }
                if (k === 4) { // brazo izquierdo
                    rectangulo.setAttribute("x", "1");
                    rectangulo.setAttribute("y", "9");
                    rectangulo.setAttribute("width", "4");
                    rectangulo.setAttribute("height", "11");
                    rectangulo.setAttribute("rx", "2");
                    rectangulo.setAttribute("fill", "#64748b");
                    rectangulo.setAttribute("stroke", "#334155");
                    rectangulo.setAttribute("stroke-width", "1");
                }
                if (k === 5) { // brazo derecho
                    rectangulo.setAttribute("x", "17");
                    rectangulo.setAttribute("y", "9");
                    rectangulo.setAttribute("width", "4");
                    rectangulo.setAttribute("height", "11");
                    rectangulo.setAttribute("rx", "2");
                    rectangulo.setAttribute("fill", "#64748b");
                    rectangulo.setAttribute("stroke", "#334155");
                    rectangulo.setAttribute("stroke-width", "1");
                }
                butaca.appendChild(rectangulo);   // el rectangulo dentro del svg
            }
            if (butca.estado === "OCUPADA") {
                butaca.setAttribute("data-nodisponible", "true");
            } else {
                butaca.addEventListener("click", (e) => {
                    console.log("hola");
                })
            }
            linea.appendChild(butaca);            // el svg dentro de la fila
        });

        butacas_lista.appendChild(linea);         // la fila dentro de .lista_butacas
    }
}

async function generadorButacasPorLinea(sala, linea) {
    const respuesta = await fetch("http://localhost:8080/api/getButacasFromSala/"+sala);
    if(!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
    }

    const mensaje = await respuesta.json();

    const butacasDeLaLinea = [];
    mensaje.forEach(butaca => {
        if (butaca.fila === linea) {
            butacasDeLaLinea.push(butaca);
        }
    });

    return butacasDeLaLinea;
}

async function abrirButacas() {
    const modalButaca = document.getElementById("modal-butacas");

    document.querySelectorAll(".butaca_linea").forEach(linea => {
        linea.remove();
    });

    const login = await getLogin();
    if (login) {
        crearLineasButacas(await getidSala());
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
    const tipoSeleccionado = document.querySelector(".PreTicketSala").textContent.trim();

    const sala = array.find(s => s.tipo === tipoSeleccionado);
    if (!sala) {
        console.warn("No se encontró sala de tipo:", tipoSeleccionado);
        return null;
    }
    console.log("Encontrado, la sala es: " + sala.sala_id + " | " + sala.tipo);
    return sala.sala_id;
}

