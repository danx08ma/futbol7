let ligas = JSON.parse(localStorage.getItem('ligas')) || [];
let ligaActualIndex = null;
let equipoActualIndex = null;

function guardarLiga() {
  const nombre = document.getElementById("nombre-liga").value;
  if (!nombre) return;

  ligas.push({ nombre, equipos: [] });
  localStorage.setItem("ligas", JSON.stringify(ligas));
  renderizarLigas();
  document.getElementById("formulario-liga").style.display = "none";
}

function renderizarLigas() {
  const lista = document.getElementById("lista-ligas");
  lista.innerHTML = "";

  ligas.forEach((liga, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${liga.nombre}</strong>
      <button onclick="verEquipos(${i})">Ver Equipos</button>
    `;
    lista.appendChild(div);
  });
}

function mostrarFormularioLiga() {
  document.getElementById("formulario-liga").style.display = "block";
}

function mostrarFormularioEquipo() {
  document.getElementById("formulario-equipo").style.display = "block";
}

function mostrarFormularioJugador() {
  document.getElementById("formulario-jugador").style.display = "block";
}

function verEquipos(index) {
  ligaActualIndex = index;
  document.getElementById("ligas").style.display = "none";
  document.getElementById("equipos").style.display = "block";
  renderizarEquipos();
}

function volverALigas() {
  document.getElementById("ligas").style.display = "block";
  document.getElementById("equipos").style.display = "none";
}

function volverAEquipos() {
  document.getElementById("equipos").style.display = "block";
  document.getElementById("jugadores").style.display = "none";
}

function guardarEquipo() {
  const nombre = document.getElementById("nombre-equipo").value;
  const logoInput = document.getElementById("logo-equipo");
  const liga = ligas[ligaActualIndex];

  if (liga.equipos.length >= 8) {
    alert("Máximo 8 equipos por liga.");
    return;
  }

  const equipo = { nombre, logo: '', jugadores: [] };

  if (logoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      equipo.logo = reader.result;
      liga.equipos.push(equipo);
      guardarLigasYActualizarEquipos();
    };
    reader.readAsDataURL(logoInput.files[0]);
  } else {
    equipo.logo = "https://via.placeholder.com/50";
    liga.equipos.push(equipo);
    guardarLigasYActualizarEquipos();
  }
}

function guardarLigasYActualizarEquipos() {
  localStorage.setItem("ligas", JSON.stringify(ligas));
  renderizarEquipos();
  document.getElementById("formulario-equipo").style.display = "none";
}

function renderizarEquipos() {
  const lista = document.getElementById("lista-equipos");
  lista.innerHTML = "";

  ligas[ligaActualIndex].equipos.forEach((equipo, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${equipo.logo}" width="50" height="50">
      <strong>${equipo.nombre}</strong>
      <button onclick="verJugadores(${i})">Ver Jugadores</button>
    `;
    lista.appendChild(div);
  });
}

function verJugadores(index) {
  equipoActualIndex = index;
  document.getElementById("equipos").style.display = "none";
  document.getElementById("jugadores").style.display = "block";
  renderizarJugadores();
}

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
  localStorage.setItem("ligas", JSON.stringify(ligas));
  renderizarJugadores();
  document.getElementById("formulario-jugador").style.display = "none";
}

function renderizarJugadores() {
  const lista = document.getElementById("lista-jugadores");
  lista.innerHTML = "";

  const jugadores = ligas[ligaActualIndex].equipos[equipoActualIndex].jugadores;
  jugadores.forEach(j => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${j.nombre}</strong> (${j.posicion}) - Goles: ${j.goles}, Asistencias: ${j.asistencias}, Valor: ${j.valor}
    `;
    lista.appendChild(div);
  });
}

// Inicial
renderizarLigas();
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
