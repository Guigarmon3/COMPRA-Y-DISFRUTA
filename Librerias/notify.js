function PushNotify(titulo, texto) {
    new Notify({
        status: "success",
        title: titulo,
        text: texto,
        effect: "fade",
        speed: 300,
        autoclose: true,
        autotimeout: 3000,
        position: "right top"
    });
}

function pushNotifyError(titulo, texto) {
    new Notify({
        status: "error",
        title: titulo,
        text: texto,
        effect: "fade",
        speed: 300,
        autoclose: true,
        autotimeout: 3000,
        position: "right top"
    });
}