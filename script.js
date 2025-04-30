let ligas = JSON.parse(localStorage.getItem('ligas')) || [];
let ligaActualIndex = null;
let equipoActualIndex = null;
let jugadorActualIndex = null; // Para el seguimiento de los jugadores

// Función para agregar la liga
function guardarLiga() {
  const nombre = document.getElementById("nombre-liga").value;
  if (!nombre) return;

  ligas.push({
    nombre,
    equipos: [],
    tablaClasificacion: []  // Añadimos la tabla de clasificación vacía
  });
  localStorage.setItem("ligas", JSON.stringify(ligas));
  renderizarLigas();
  document.getElementById("formulario-liga").style.display = "none";
}

// Función para renderizar ligas
function renderizarLigas() {
  const lista = document.getElementById("lista-ligas");
  lista.innerHTML = "";

  ligas.forEach((liga, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${liga.nombre}</strong>
      <button onclick="verEquipos(${i})">Ver Equipos</button>
      <button onclick="eliminarLiga(${i})">🗑️</button>
      <button onclick="mostrarClasificacion(${i})">Ver Clasificación</button>  <!-- Añadimos un botón para mostrar clasificación -->
    `;
    lista.appendChild(div);
  });
}

// Función para mostrar la clasificación
function mostrarClasificacion(index) {
  ligaActualIndex = index;
  const liga = ligas[ligaActualIndex];
  let tablaHtml = "<h3>Tabla de Clasificación</h3><table><thead><tr><th>Puesto</th><th>Equipo</th><th>Victorias</th><th>Empates</th><th>Derrotas</th><th>GF</th><th>GC</th><th>Diferencia de Goles</th></tr></thead><tbody>";

  liga.tablaClasificacion.forEach((equipo, i) => {
    tablaHtml += `
      <tr>
        <td>${i + 1}</td>
        <td>${equipo.nombre}</td>
        <td>${equipo.victorias}</td>
        <td>${equipo.empates}</td>
        <td>${equipo.derrotas}</td>
        <td>${equipo.golesFavor}</td>
        <td>${equipo.golesContra}</td>
        <td>${equipo.diferenciaGoles}</td>
      </tr>
    `;
  });

  tablaHtml += "</tbody></table>";
  document.getElementById("lista-ligas").innerHTML = tablaHtml;
}

// Función para guardar equipo
function guardarEquipo() {
  const nombre = document.getElementById("nombre-equipo").value;
  const logoInput = document.getElementById("logo-equipo");
  const liga = ligas[ligaActualIndex];

  if (liga.equipos.length >= 8) {
    alert("Máximo 8 equipos por liga.");
    return;
  }

  const equipo = { nombre, logo: '', jugadores: [], victorias: 0, empates: 0, derrotas: 0, golesFavor: 0, golesContra: 0, diferenciaGoles: 0 };

  if (logoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      equipo.logo = reader.result;
      liga.equipos.push(equipo);
      liga.tablaClasificacion.push(equipo); // Añadimos el equipo a la tabla de clasificación
      guardarLigasYActualizarEquipos();
    };
    reader.readAsDataURL(logoInput.files[0]);
  } else {
    equipo.logo = "https://via.placeholder.com/50";
    liga.equipos.push(equipo);
    liga.tablaClasificacion.push(equipo); // Añadimos el equipo a la tabla de clasificación
    guardarLigasYActualizarEquipos();
  }
}

// Función para actualizar liga y equipos
function guardarLigasYActualizarEquipos() {
  localStorage.setItem("ligas", JSON.stringify(ligas));
  renderizarEquipos();
  document.getElementById("formulario-equipo").style.display = "none";
}

// Función para renderizar equipos
function renderizarEquipos() {
  const lista = document.getElementById("lista-equipos");
  lista.innerHTML = "";

  ligas[ligaActualIndex].equipos.forEach((equipo, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${equipo.logo}" width="50" height="50">
      <strong>${equipo.nombre}</strong>
      <button onclick="verJugadores(${i})">Ver Jugadores</button>
      <button onclick="eliminarEquipo(${i})">🗑️</button>
    `;
    lista.appendChild(div);
  });
}

// Función para guardar jugador
function guardarJugador() {
  const nombre = document.getElementById("nombre-jugador").value;
  const posicion = document.getElementById("posicion-jugador").value;
  const goles = parseInt(document.getElementById("goles").value) || 0;
  const asistencias = parseInt(document.getElementById("asistencias").value) || 0;
  const valor = goles * 10 + asistencias * 5;

  const equipo = ligas[ligaActualIndex].equipos[equipoActualIndex];

  if (equipo.jugadores.length >= 7) {
    alert("Máximo 7 jugadores por equipo.");
    return;
  }

  equipo.jugadores.push({ nombre, posicion, goles, asistencias, valor });
  equipo.golesFavor += goles; // Actualizamos los goles a favor
  equipo.golesContra += asistencias; // Actualizamos los goles en contra (esto es un ejemplo, se puede ajustar)
  equipo.diferenciaGoles = equipo.golesFavor - equipo.golesContra; // Actualizamos la diferencia de goles
  localStorage.setItem("ligas", JSON.stringify(ligas));
  renderizarJugadores();
  document.getElementById("formulario-jugador").style.display = "none";
}

// Función para renderizar jugadores
function renderizarJugadores() {
  const lista = document.getElementById("lista-jugadores");
  lista.innerHTML = "";

  const jugadores = ligas[ligaActualIndex].equipos[equipoActualIndex].jugadores;
  jugadores.forEach((j, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${j.nombre}</strong> (${j.posicion}) - Goles: ${j.goles}, Asistencias: ${j.asistencias}, Valor: ${j.valor}
      <button onclick="eliminarJugador(${index})">🗑️</button>
    `;
    lista.appendChild(div);
  });
}

function eliminarLiga(index) {
  if (confirm("¿Seguro que quieres eliminar esta liga?")) {
    ligas.splice(index, 1);
    localStorage.setItem("ligas", JSON.stringify(ligas));
    renderizarLigas();
  }
}

function eliminarEquipo(index) {
  if (confirm("¿Eliminar este equipo?")) {
    ligas[ligaActualIndex].equipos.splice(index, 1);
    ligas[ligaActualIndex].tablaClasificacion.splice(index, 1); // Eliminamos el equipo de la tabla de clasificación
    localStorage.setItem("ligas", JSON.stringify(ligas));
    renderizarEquipos();
  }
}

function eliminarJugador(index) {
  if (confirm("¿Eliminar este jugador?")) {
    ligas[ligaActualIndex].equipos[equipoActualIndex].jugadores.splice(index, 1);
    localStorage.setItem("ligas", JSON.stringify(ligas));
    renderizarJugadores();
  }
}

function transferirJugador(index) {
  jugadorActualIndex = index;
  const jugador = ligas[ligaActualIndex].equipos[equipoActualIndex].jugadores[index];

  const nuevaLiga = prompt("Ingrese el nombre de la liga a la que desea transferir el jugador:");

  const nuevaLigaIndex = ligas.findIndex(liga => liga.nombre.toLowerCase() === nuevaLiga.toLowerCase());
  if (nuevaLigaIndex === -1) {
    alert("Liga no encontrada.");
    return;
  }

  const nuevaLigaEquipos = ligas[nuevaLigaIndex].equipos;
  const equipoSeleccionado = prompt("Ingrese el nombre del equipo al que desea transferir el jugador:");
  
  const equipoDestino = nuevaLigaEquipos.find(equipo => equipo.nombre.toLowerCase() === equipoSeleccionado.toLowerCase());
  if (!equipoDestino) {
    alert("Equipo no encontrado.");
    return;
  }

  // Eliminar al jugador del equipo actual
  ligas[ligaActualIndex].equipos[equipoActualIndex].jugadores.splice(index, 1);
  equipoDestino.jugadores.push(jugador);

  localStorage.setItem("ligas", JSON.stringify(ligas));
  renderizarJugadores();
}

function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  [...document.querySelectorAll('.tab')].find(t => t.textContent.includes(id.charAt(0).toUpperCase())).classList.add('active');
}

renderizarLigas();
