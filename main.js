// Definir constantes y variables

const fecha = document.querySelector('#fecha');
const lista = document.querySelector('#lista');
const input = document.querySelector('#input');
const botonAgregar = document.querySelector('#botonAgregar');

let tareas = JSON.parse(localStorage.getItem('TODO') || '[]');

fecha.textContent = new Date().toLocaleDateString('es-MX', {
  weekday: 'long',
  month: 'short',
  day: 'numeric'
});

// Definir funciones

function guardarTareas() {
  localStorage.setItem('TODO', JSON.stringify(tareas));
}

function actualizarIndicadores() {
  const activas = tareas.filter(tarea => !tarea.eliminar);
  const completadas = activas.filter(tarea => tarea.hecho);
  const pendientes = activas.length - completadas.length;

  const productividad = activas.length > 0
    ? Math.round((completadas.length / activas.length) * 100)
    : 0;

  document.querySelector('#totalPendientes').textContent = pendientes;
  document.querySelector('#totalCompletadas').textContent = completadas.length;
  document.querySelector('#tasaExito').textContent = `${productividad}%`;
}

function renderizarTareas() {
  lista.innerHTML = '';

  tareas.filter(tarea => !tarea.eliminar).forEach(tarea => {
    const li = document.createElement('li');

    const marcar = document.createElement('i');
    marcar.className = `bi ${tarea.hecho ? 'bi-record-circle' : 'bi-circle'}`;
    marcar.setAttribute('role', 'button');
    marcar.setAttribute('aria-label', 'Cambiar estado de tarea');
    marcar.tabIndex = 0;

    const texto = document.createElement('p');
    texto.className = `tarea-lista text ${tarea.hecho ? 'tachado' : ''}`;
    texto.textContent = tarea.nombre;

    const eliminar = document.createElement('i');
    eliminar.className = 'bi bi-x';
    eliminar.setAttribute('role', 'button');
    eliminar.setAttribute('aria-label', 'Eliminar tarea');
    eliminar.tabIndex = 0;

    function completarTarea() {
      tarea.hecho = !tarea.hecho;
      guardarTareas();
      renderizarTareas();
    }

    function eliminarTarea() {
      tarea.eliminar = true;
      guardarTareas();
      renderizarTareas();
    }

    marcar.addEventListener('click', completarTarea);
    eliminar.addEventListener('click', eliminarTarea);

    marcar.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        completarTarea();
      }
    });

    eliminar.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        eliminarTarea();
      }
    });

    li.append(marcar, texto, eliminar);
    lista.appendChild(li);
  });

  actualizarIndicadores();
}

function agregarTarea() {
  const nombre = input.value.trim();
  if (!nombre) return;

  tareas.push({
    nombre,
    id: Date.now(),
    hecho: false,
    eliminar: false
  });

  guardarTareas();
  input.value = '';
  renderizarTareas();
}

botonAgregar.addEventListener('click', agregarTarea);

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') agregarTarea();
});

renderizarTareas();
