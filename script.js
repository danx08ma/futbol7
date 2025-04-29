let ligas = JSON.parse(localStorage.getItem('ligas')) || [];

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
        ligas.push(liga);
        localStorage.setItem("ligas", JSON.stringify(ligas));
        renderizarLigas();
        document.getElementById("form-liga").style.display = "none";
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
            <button onclick="verLiga(${index})">Gestionar Liga</button>
            <button onclick="eliminarLiga(${index})">Eliminar Liga</button>
        `;
        contenedorLigas.appendChild(ligaDiv);
    });
}

function verLiga(index) {
    const liga = ligas[index];
    document.getElementById("nombre-liga-seleccionada").innerText = liga.nombre;
    document.getElementById("gestion-equipos").style.display = "block";
    const contenedorEquipos = document.getElementById("equipos");
    contenedorEquipos.innerHTML = "";
    liga.equipos.forEach((equipo, equipoIndex) => {
        contenedorEquipos.innerHTML += `
            <h4>${equipo.nombre}</h4>
            <button onclick="eliminarEquipo(${index}, ${equipoIndex})">Eliminar Equipo</button>
            <button onclick="verEquipo(${index}, ${equipoIndex})">Gestionar Jugadores</button>
        `;
    });
}

function agregarEquipo() {
    const nombreEquipo = prompt("Ingrese el nombre del equipo");
    const equipo = {
        nombre: nombreEquipo,
        jugadores: []
    };
    ligas[ligas.length - 1].equipos.push(equipo);
    localStorage.setItem("ligas", JSON.stringify(ligas));
    verLiga(ligas.length - 1);
}

function eliminarLiga(index) {
    if (confirm("¿Estás seguro de que quieres eliminar esta liga?")) {
        ligas.splice(index, 1);
        localStorage.setItem("ligas", JSON.stringify(ligas));
        renderizarLigas();
    }
}

function eliminarEquipo(ligaIndex, equipoIndex) {
    if (confirm("¿Estás seguro de que quieres eliminar este equipo?")) {
        ligas[ligaIndex].equipos.splice(equipoIndex, 1);
        localStorage.setItem("ligas", JSON.stringify(ligas));
        verLiga(ligaIndex);
    }
}

function verEquipo(ligaIndex, equipoIndex) {
    const equipo = ligas[ligaIndex].equipos[equipoIndex];
    let jugadoresHtml = "";
    equipo.jugadores.forEach((jugador, jugadorIndex) => {
        jugadoresHtml += `
            <h5>${jugador.nombre}</h5>
            <p>Posición: ${jugador.posicion}</p>
            <p>Valor: ${jugador.valor} millones</p>
            <button onclick="eliminarJugador(${ligaIndex}, ${equipoIndex}, ${jugadorIndex})">Eliminar Jugador</button>
        `;
    });
    document.getElementById("form-equipo").style.display = "block";
    document.getElementById("form-equipo").innerHTML = `
        <h3>Agregar Jugador</h3>
        <input type="text" id="nombre-jugador" placeholder="Nombre del Jugador">
        <select id="posicion-jugador">
            <option value="Portero">Portero</option>
            <option value="Defensa">Defensa</option>
            <option value="Pivote">Pivote</option>
            <option value="Delantero">Delantero</option>
        </select>
        <input type="number" id="goles-jugador" placeholder="Goles" value="0">
        <input type="number" id="asistencias-jugador" placeholder="Asistencias" value="0">
        <button onclick="agregarJugador(${ligaIndex}, ${equipoIndex})">Agregar Jugador</button>
        <h4>Jugadores:</h4>
        ${jugadoresHtml}
    `;
}

function agregarJugador(ligaIndex, equipoIndex) {
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

    ligas[ligaIndex].equipos[equipoIndex].jugadores.push(jugador);
    localStorage.setItem("ligas", JSON.stringify(ligas));
    verEquipo(ligaIndex, equipoIndex);
}

function eliminarJugador(ligaIndex, equipoIndex, jugadorIndex) {
    if (confirm("¿Estás seguro de que quieres eliminar este jugador?")) {
        ligas[ligaIndex].equipos[equipoIndex].jugadores.splice(jugadorIndex, 1);
        localStorage.setItem("ligas", JSON.stringify(ligas));
        verEquipo(ligaIndex, equipoIndex);
    }
}

renderizarLigas();
