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
    const resepuesta = await fetch("http://localhost:8080/api/tipos_salas/");
    if (!resepuesta.ok) {
        throw new Error("Error " + resepuesta.status);
    }
    const salas = await resepuesta.json();
    const listaSalas = document.querySelector(".lista-salas"); 

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
        alert(nombre);
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
        alert(await respuesta.text());
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