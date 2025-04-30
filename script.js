let ligas = JSON.parse(localStorage.getItem('ligas')) || [];
let ligaActualIndex = null;

// Guardar nueva liga
function guardarLiga() {
  const nombre = document.getElementById("nombre-liga").value.trim();
  if (!nombre) return;

  ligas.push({
    nombre,
    equipos: [],
    partidos: [],
    tablaClasificacion: [],
  });

  localStorage.setItem("ligas", JSON.stringify(ligas));
  renderizarLigas();
  document.getElementById("formulario-liga").style.display = "none";
}

// Mostrar lista de ligas
function renderizarLigas() {
  let html = "<h3>Lista de Ligas</h3><ul>";
  ligas.forEach((liga, i) => {
    html += `
      <li>
        ${liga.nombre}
        <button onclick="mostrarPartidos(${i})">Partidos</button>
        <button onclick="mostrarClasificacion(${i})">Clasificación</button>
      </li>
    `;
  });
  html += "</ul>";
  document.getElementById("lista-ligas").innerHTML = html;
}

// Mostrar partidos
function mostrarPartidos(index) {
  ligaActualIndex = index;
  const liga = ligas[index];

  let html = "<h3>Partidos</h3><table><thead><tr><th>Equipo 1</th><th>Equipo 2</th><th>Resultado</th><th>Acción</th></tr></thead><tbody>";
  liga.partidos.forEach((p, i) => {
    html += `
      <tr>
        <td>${p.equipo1}</td>
        <td>${p.equipo2}</td>
        <td>${p.resultado || 'Pendiente'}</td>
        <td><button onclick="generarResultado(${i})">Generar Resultado</button></td>
      </tr>
    `;
  });
  html += "</tbody></table>";

  document.getElementById("lista-ligas").innerHTML = html;
}

// Generar resultado aleatorio
function generarResultado(indice) {
  const liga = ligas[ligaActualIndex];
  const partido = liga.partidos[indice];

  const goles1 = Math.floor(Math.random() * 5);
  const goles2 = Math.floor(Math.random() * 5);

  partido.resultado = `${goles1} - ${goles2}`;
  partido.golesEquipo1 = goles1;
  partido.golesEquipo2 = goles2;

  actualizarClasificacion(partido.equipo1, partido.equipo2, goles1, goles2);

  localStorage.setItem("ligas", JSON.stringify(ligas));
  mostrarPartidos(ligaActualIndex);
}

// Actualizar clasificación
function actualizarClasificacion(equipo1, equipo2, goles1, goles2) {
  const liga = ligas[ligaActualIndex];

  function obtenerRegistro(nombre) {
    let reg = liga.tablaClasificacion.find(e => e.nombre === nombre);
    if (!reg) {
      reg = {
        nombre,
        victorias: 0,
        empates: 0,
        derrotas: 0,
        golesFavor: 0,
        golesContra: 0,
        diferenciaGoles: 0,
      };
      liga.tablaClasificacion.push(reg);
    }
    return reg;
  }

  const reg1 = obtenerRegistro(equipo1);
  const reg2 = obtenerRegistro(equipo2);

  reg1.golesFavor += goles1;
  reg1.golesContra += goles2;
  reg1.diferenciaGoles = reg1.golesFavor - reg1.golesContra;

  reg2.golesFavor += goles2;
  reg2.golesContra += goles1;
  reg2.diferenciaGoles = reg2.golesFavor - reg2.golesContra;

  if (goles1 > goles2) {
    reg1.victorias++;
    reg2.derrotas++;
  } else if (goles2 > goles1) {
    reg2.victorias++;
    reg1.derrotas++;
  } else {
    reg1.empates++;
    reg2.empates++;
  }

  liga.tablaClasificacion.sort((a, b) => {
    const puntosA = a.victorias * 3 + a.empates;
    const puntosB = b.victorias * 3 + b.empates;
    if (puntosB !== puntosA) return puntosB - puntosA;
    return b.diferenciaGoles - a.diferenciaGoles;
  });
}

// Mostrar clasificación
function mostrarClasificacion(index) {
  ligaActualIndex = index;
  const tabla = ligas[index].tablaClasificacion;

  let html = "<h3>Clasificación</h3><table><thead><tr><th>#</th><th>Equipo</th><th>V</th><th>E</th><th>D</th><th>GF</th><th>GC</th><th>DG</th></tr></thead><tbody>";
  tabla.forEach((e, i) => {
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${e.nombre}</td>
        <td>${e.victorias}</td>
        <td>${e.empates}</td>
        <td>${e.derrotas}</td>
        <td>${e.golesFavor}</td>
        <td>${e.golesContra}</td>
        <td>${e.diferenciaGoles}</td>
      </tr>
    `;
  });
  html += "</tbody></table>";
  document.getElementById("lista-ligas").innerHTML = html;
}

// Al cargar
renderizarLigas();
