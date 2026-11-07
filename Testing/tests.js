async function GetCategoriatests() {
    console.clear();
    const id = document.getElementById("getcatest").value;
    const respuesta = await fetch("http://localhost:8080/api/getcat/" + id);
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
    }
    const categoria = await respuesta.json();
    console.log(categoria.nombre)
    return categoria.nombre;
}

async function MostrarEventosTest() {
    console.clear();
    const respuesta = await fetch("http://localhost:8080/api/Peliculas");
    if (!respuesta.ok) {
    throw new Error("Error " + respuesta.status);
    }
    const eventos = await respuesta.json();

    for (const element of eventos) {
        console.log(element)
    }
}

async function MostrarSalasTest() {
    console.clear();
    const resepuesta = await fetch("http://localhost:8080/api/Salas");
    if (!resepuesta.ok) {
        throw new Error("Error " + resepuesta.status);
    }
    const salas = await resepuesta.json();

    for (const sala of salas) {
        console.log(sala);
    }
}

async function crearUsuarioTest() {
    console.clear();
    const nombre = document.getElementById("admin-register-nombre").value;
    const email = document.getElementById("admin-register-email").value;
    const passwd = document.getElementById("admin-register-passwd").value;
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
            const existe = await verificarUsuario(nombre, email);

            if (existe) {
                PushNotify("Creación de Usuario", "Usuario creado correctamente");
            } else {
                pushNotifyError("Error", "Usuario no encontrado");
            }
            
        } catch (error) {
            pushNotifyError("Error", "No se pudo crear el usuario");
        }
}

async function getNombreTest() {
    console.clear();
    const email = document.getElementById("admin-getNombre-email").value;
    const respuesta = await fetch("http://localhost:8080/api/getnombre/"+email);
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
        pushNotifyError("Error", "No se pudo obtener el nombre del usuario");
    } else {
        const nombre = await respuesta.text();
        console.log(nombre);
    }   
}

async function getRolTest() {
    console.clear();
    const email = document.getElementById("admin-getRol-email").value
        const respuesta = await fetch("http://localhost:8080/api/getrol/"+email);
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
    } else {
        try {
        console.log(await respuesta.text());
        return nombre;
        } catch (error) {
            console.log(error);
        }
    }   
}

async function verificarUsuarioTest() {
    console.clear();
    const email = document.getElementById("admin-verificar-email").value;
    const nombre = document.getElementById("admin-verificar-nombre").value;
    const url = `http://localhost:8080/api/contuser/${nombre}/${email}`;
    const respuesta = await fetch(url);
    
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status);
    }
    
    const textoBruto = await respuesta.text();
// trim() quita los espacios por si hay algun error
    const existe = textoBruto.trim(); 
    
    console.log("Lo que devuelve la API de verificación:", JSON.stringify(existe));

    // Aceptamos tanto "1" como 1 por seguridad
    if (existe === 1 || existe==="1"){
        PushNotify(
            "Existe",
            "El usuario "+ nombre +" existe"
        );
    } else {
        pushNotifyError(
            "Error",
            nombre+" no existe"
        );
    }
}

async function getCategorias() {
    const respuesta = await fetch('http://localhost:8080/api/categorias/all');
    if (!respuesta.ok) {
        return respuesta.status;
    }
    const categorias = await respuesta.json();
    return categorias;
}

async function crearOpcionesCategoria() {
    const categorias = await getCategorias();
    const select = document.getElementById("CreEventoCategoria");
    categorias.forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria.id
        option.textContent = categoria.nombre
        select.appendChild(option);
    });
}

async function CrearEvento() {
    const objeto = new URLSearchParams({
        nombre: document.getElementById("CreEventoNombre").value,
        genero_id: document.getElementById("CreEventoCategoria").value,
        resumen: document.getElementById("CreEventoResumen").value,
        imagen: document.getElementById("CreEventoImagen").value,
        duracion_min: document.getElementById("CreEventoDuracion").value
    });

    try {
        const respuesta = await fetch(`http://localhost:8080/api/eventos/crear?${objeto}`);
        if (!respuesta.ok) {
            return respuesta.status;
        }
        const texto = await respuesta.text();
        console.log(texto);
        return texto;
    } catch (error) {
        console.error("Error de red:", error);
    }
}

async function CrearSala() {
    const objeto = new URLSearchParams({
        nombre: document.getElementById("CreSalaNombre").value,
        precio_aleatorio: document.getElementById("CreSalaPreAleatorio").value,
        precio_elegido: document.getElementById("CreSalaPreElegida").value,
        descripcion: document.getElementById("CreSalaResumen").value
    });

    try {
        const respuesta = await fetch(`http://localhost:8080/api/salas/crear?${objeto}`);
        if (!respuesta.ok) {
            return respuesta.status;
        }
        const texto = await respuesta.text();
        console.log(texto);
        return texto;
    } catch (error) {
        console.error("Error de red:", error);
    }
}

// Mostrar todas las sesiones que hay con todas sus cositas
async function getSesiones() {
    const respuesta = await fetch("http://localhost:8080/api/sesiones/");
    if (!respuesta.ok) {
        return console.log(Error);
    }
    const sesiones = await respuesta.json();
    console.log(sesiones);
    return sesiones;
}

// Get de la duración del evento
async function getDuracion(pelicula_id) {
    const respuesta = await fetch(`http://localhost:8080/api/eventos/getDuracion/${pelicula_id}`);

    if (!respuesta.ok) {
        throw new Error("No se pudo obtener la duración");
    }

    return parseInt(await respuesta.text());
}

// true = sala libre, false = hay solapamiento
async function countSesiones(fecha, hora, sala_id, pelicula_id) {
    const duracion = await getDuracion(pelicula_id);

    const respuesta = await fetch(`http://localhost:8080/api/sesiones/buscar/${fecha}/${hora}/${sala_id}/${duracion}`);

    if (!respuesta.ok) {
        throw new Error("Error al comprobar sesiones");
    }

    const numero = parseInt(await respuesta.text());
    return numero === 0;
}

async function crearSesion(fecha, hora, pelicula_id, sala_id) {
    if (!(await getLogin())) return;

    try {
        const libre = await countSesiones(fecha, hora, sala_id, pelicula_id);

        if (!libre) {
            pushNotifyError("Error", "No se ha podido crear la sesión, ya existe otra en ese lapso");
            return;
        }

        const respuesta = await fetch(`http://localhost:8080/api/sesiones/crear/${fecha}/${hora}/${pelicula_id}/${sala_id}`, { method: "POST" });

        if (!respuesta.ok) throw new Error("Error al crear la sesión");

        PushNotify("Verificado", "Se ha creado la sesión correctamente");

    } catch (e) {
        console.error(e);
        pushNotifyError("Error", e.message);
    }
}

// crearSesion("10-11-2026", "18:00:00", 1, 2); este comando funciona hay que adaptar el menu de admin porfa