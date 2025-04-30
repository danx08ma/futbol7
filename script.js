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
    tablaClasificacion: [],
    partidos: [],
    goleadores: [],
    asistidores: [],
  });
  localStorage.setItem("ligas", JSON.stringify(ligas));
  renderizarLigas();
  document.getElementById("formulario-liga").style.display = "none";
}

// Función para renderizar todas las ligas
function renderizarLigas() {
  let ligasHtml = "<h3>Lista de Ligas</h3><ul>";
  ligas.forEach((liga, index) => {
    ligasHtml += `
      <li>
        ${liga.nombre}
        <button onclick="mostrarPartidos(${index})">Ver Partidos</button>
        <button onclick="mostrarClasificacion(${index})">Ver Clasificación</button>
      </li>
    `;
  });
  ligasHtml += "</ul>";
  document.getElementById("lista-ligas").innerHTML = ligasHtml;
}

// Función para mostrar partidos de la liga
function mostrarPartidos(index) {
  ligaActualIndex = index;
  const liga = ligas[ligaActualIndex];
  let partidosHtml = "<h3>Partidos de la Liga</h3><table><thead><tr><th>Equipo 1</th><th>Equipo 2</th><th>Resultado</th><th>Acciones</th></tr></thead><tbody>";

  liga.partidos.forEach((partido, i) => {
    partidosHtml += `
      <tr>
        <td>${partido.equipo1}</td>
        <td>${partido.equipo2}</td>
        <td>${partido.resultado || "Pendiente"}</td>
        <td><button onclick="generarResultado(${i})">Generar Resultado</button></td>
      </tr>
    `;
  });

  partidosHtml += "</tbody></table>";
  document.getElementById("lista-ligas").innerHTML = partidosHtml;
}

// Función para generar el resultado de un partido
function generarResultado(indice) {
  const partido = ligas[ligaActualIndex].partidos[indice];
  const golesEquipo1 = Math.floor(Math.random() * 5);
  const golesEquipo2 = Math.floor(Math.random() * 5);

  partido.resultado = `${golesEquipo1} - ${golesEquipo2}`;
  partido.golesEquipo1 = golesEquipo1;
  partido.golesEquipo2 = golesEquipo2;

  asignarEstadisticas(partido, golesEquipo1, golesEquipo2);
  
  localStorage.setItem("ligas", JSON.stringify(ligas));
  mostrarPartidos(ligaActualIndex);
}

// Función para asignar estadísticas y actualizar tablas de goleadores y asistidores
function asignarEstadisticas(partido, golesEquipo1, golesEquipo2) {
  const equipo1 = ligas[ligaActualIndex].equipos.find(equipo => equipo.nombre === partido.equipo1);
  const equipo2 = ligas[ligaActualIndex].equipos.find(equipo => equipo.nombre === partido.equipo2);

  const golesEquipo1Distribuidos = distribuirGoles(equipo1, golesEquipo1);
  const golesEquipo2Distribuidos = distribuirGoles(equipo2, golesEquipo2);

  actualizarMaximos(golesEquipo1Distribuidos, golesEquipo2Distribuidos);
  
  const mvpEquipo1 = equipo1.jugadores[Math.floor(Math.random() * equipo1.jugadores.length)];
  const mvpEquipo2 = equipo2.jugadores[Math.floor(Math.random() * equipo2.jugadores.length)];

  const mvp = golesEquipo1 > golesEquipo2 ? mvpEquipo1 : mvpEquipo2;
  partido.mvp = mvp.nombre;
}

// Función para distribuir los goles entre los jugadores de un equipo
function distribuirGoles(equipo, goles) {
  let golesDistribuidos = [];
  equipo.jugadores.forEach(jugador => {
    const golesJugador = Math.floor(Math.random() * goles);
    golesDistribuidos.push({ jugador: jugador.nombre, goles: golesJugador });
    jugador.goles += golesJugador;
    jugador.asistencias += Math.floor(Math.random() * golesJugador);
  });

  return golesDistribuidos;
}

// Función para actualizar los máximos goleadores y asistidores
function actualizarMaximos(golesEquipo1, golesEquipo2) {
  golesEquipo1.forEach(g => {
    const jugador = ligas[ligaActualIndex].equipos.find(e => e.jugadores.some(j => j.nombre === g.jugador)).jugadores.find(j => j.nombre === g.jugador);
    if (!jugador) return;
    jugador.valor += g.goles * 10;
  });

  golesEquipo2.forEach(g => {
    const jugador = ligas[ligaActualIndex].equipos.find(e => e.jugadores.some(j => j.nombre === g.jugador)).jugadores.find(j => j.nombre === g.jugador);
    if (!jugador) return;
    jugador.valor += g.goles * 10;
  });

  actualizarTablaGoleadores();
}

// Función para actualizar la tabla de máximos goleadores y asistidores
function actualizarTablaGoleadores() {
  const goleadores = [];
  const asistidores = [];

  ligas[ligaActualIndex].equipos.forEach(equipo => {
    equipo.jugadores.forEach(jugador => {
      goleadores.push({ nombre: jugador.nombre, goles: jugador.goles });
      asistidores.push({ nombre: jugador.nombre, asistencias: jugador.asistencias });
    });
  });

  goleadores.sort((a, b) => b.goles - a.goles);
  asistidores.sort((a, b) => b.asistencias - a.asistencias);

  let tablaGoleadoresHtml = "<h3>Máximos Goleadores</h3><table><thead><tr><th>Jugador</th><th>Goles</th></tr></thead><tbody>";
  goleadores.forEach(g => {
    tablaGoleadoresHtml += `<tr><td>${g.nombre}</td><td>${g.goles}</td></tr>`;
  });
  tablaGoleadoresHtml += "</tbody></table>";

  let tablaAsistidoresHtml = "<h3>Máximos Asistidores</h3><table><thead><tr><th>Jugador</th><th>Asistencias</th></tr></thead><tbody>";
  asistidores.forEach(a => {
    tablaAsistidoresHtml += `<tr><td>${a.nombre}</td><td>${a.asistencias}</td></tr>`;
  });
  tablaAsistidoresHtml += "</tbody></table>";

  document.getElementById("lista-ligas").innerHTML += tablaGoleadoresHtml + tablaAsistidoresHtml;
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

// Inicialización de la página (renderizar ligas al cargar)
renderizarLigas();
