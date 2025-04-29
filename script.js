let ligas = JSON.parse(localStorage.getItem('ligas')) || [];
let ligaActualIndex = null;
let equipos = [];
let jugadores = [];

function verEquipos(index) {
    ligaActualIndex = index;
    equipos = ligas[index].equipos || [];
    mostrarEquipos();
    renderizarEquipos();
}

function guardarEquipo() {
    const nombreEquipo = document.getElementById("nombre-equipo").value;
    const logo = document.getElementById("logo-equipo").files[0];

    if (equipos.length >= 8) {
        alert("¡No se pueden agregar más de 8 equipos por liga!");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const equipo = {
            nombre: nombreEquipo,
            logo: reader.result,
            jugadores: []
        };
        equipos.push(equipo);
        ligas[ligaActualIndex].equipos = equipos;
        localStorage.setItem("ligas", JSON.stringify(ligas));
        renderizarEquipos();
        document.getElementById("form-equipo").style.display = "none";
    };

    if (logo) {
        reader.readAsDataURL(logo);
    } else {
        const equipo = {
            nombre: nombreEquipo,
            logo: 'https://via.placeholder.com/50',
            jugadores: []
        };
        equipos.push(equipo);
        ligas[ligaActualIndex].equipos = equipos;
        localStorage.setItem("ligas", JSON.stringify(ligas));
        renderizarEquipos();
        document.getElementById("form-equipo").style.display = "none";
    }
}


mostrarLigas();
