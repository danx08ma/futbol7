let ligas = JSON.parse(localStorage.getItem('ligas')) || [];
let equipos = [];
let jugadores = [];

function mostrarLigas() {
    document.getElementById("ligas-section").style.display = "block";
    document.getElementById("equipos-section").style.display = "none";
    document.getElementById("jugadores-section").style.display = "none";
    renderizarLigas();
}

function mostrarEquipos() {
    document.getElementById("ligas-section").style.display = "none";
    document.getElementById("equipos-section").style.display = "block";
    document.getElementById("jugadores-section").style.display = "none";
    renderizarEquipos();
}

function mostrarJugadores() {
    document.getElementById("ligas-section").style.display = "none";
    document.getElementById("equipos-section").style.display = "none";
    document.getElementById("jugadores-section").style.display = "block";
    renderizarJugadores();
}

function mostrarFormularioLiga() {
    document.getElementById("form-liga").style.display = "block";
}

function guardarLiga() {
    const nombre = document.getElementById("nombre-liga").value;
    const logo = document.getElementById("logo-liga").files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const liga = {
            nombre: nombre,
            logo: reader.result,
            equipos: []
        };

        if (ligas.length < 8) {
            ligas.push(liga);
            localStorage.setItem("ligas", JSON.stringify(ligas));
            renderizarLigas();
            document.getElementById("form-liga").style.display = "none";
        } else {
            alert("¡No se pueden agregar más de 8 ligas!");
        }
    };

    if (logo) reader.readAsDataURL(logo);
    else {
        const liga = {
            nombre: nombre,
            logo: 'https://via.placeholder.com/50',
            equipos: []
        };
        ligas.push(liga);
        localStorage.setItem("ligas", JSON.stringify(ligas));
        renderizarLigas();
        document.getElementById("form-liga").style.display = "none";
    }
}

function renderizarLigas() {
    const contenedorLigas = document.getElementById("lista-ligas");
    contenedorLigas.innerHTML = "";
    ligas.forEach((liga, index) => {
        const ligaDiv = document.createElement("div");
        ligaDiv.classList.add("liga");
        ligaDiv.innerHTML = `
            <img src="${liga.logo}" class="liga-logo" />
            <h3>${liga.nombre}</h3>
            <button onclick="verEquipos(${index})">Gestionar Equipos</button>
        `;
        contenedorLigas.appendChild(ligaDiv);
    });
}

function verEquipos(index) {
    equipos = ligas[index].equipos;
    mostrarEquipos();
}

function renderizarEquipos() {
    const contenedorEquipos = document.getElementById("equipos-lista");
    contenedorEquipos.innerHTML = "";
    equipos.forEach((equipo, equipoIndex) => {
        contenedorEquipos.innerHTML += `
            <div class="equipo">
                <h4>${equipo.nombre}</h4>
                <button onclick="verJugadores(${equipoIndex})">Gestionar Jugadores</button>
            </div>
        `;
    });
}

function verJugadores(equipoIndex) {
    jugadores = equipos[equipoIndex].jugadores || [];
    mostrarJugadores();
}

function renderizarJugadores() {
    const contenedorJugadores = document.getElementById("jugadores-lista");
    contenedorJugadores.innerHTML = "";
    jugadores.forEach(jugador => {
        contenedorJugadores.innerHTML += `
            <div class="jugador">
                <h5>${jugador.nombre}</h5>
                <p>Posición: ${jugador.posicion}</p>
                <p>Valor: ${jugador.valor} millones</p>
            </div>
        `;
    });
}

function guardarJugador() {
    const nombre = document.getElementById("nombre-jugador").value;
    const posicion = document.getElementById("posicion-jugador").value;
    const goles = parseInt(document.getElementById("goles-jugador").value);
    const asistencias = parseInt(document.getElementById("asistencias-jugador").value);

    const valorJugador = (goles * 10) + (asistencias * 5);
    const jugador = {
        nombre: nombre,
        posicion: posicion,
        valor: valorJugador
    };

    if (jugadores.length < 7) {
        jugadores.push(jugador);
        localStorage.setItem("jugadores", JSON.stringify(jugadores));
        renderizarJugadores();
        document.getElementById("form-jugador").style.display = "none";
    } else {
        alert("¡Un equipo no puede tener más de 7 jugadores!");
    }
}

mostrarLigas();
