

async function GetCategoriatests() {
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
    const email = document.getElementById("").value
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