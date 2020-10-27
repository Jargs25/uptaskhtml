//Lista de Proyectos.
var listaProyectos = document.querySelector('ul#proyectos');

eventListeners();

function eventListeners() {
    document.querySelector('.boton.menu').addEventListener('click', openMenu);
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
    if (document.querySelector('.avance')) {
        //Document Ready
        document.addEventListener('DOMContentLoaded', function() {
            actualizarProgreso();
        });
        document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
        document.querySelector('.acciones-proyecto .acciones').addEventListener('click', accionesProyecto);
        //Delegation
        document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
    }
}

function openMenu(e) {
    if (e.target.classList.contains("open")) {
        e.target.classList.remove("open");
        document.querySelector('.contenedor-proyectos').classList.remove("open");
    } else {
        e.target.classList.add("open");
        document.querySelector('.contenedor-proyectos').classList.add("open");
    }

}

function nuevoProyecto(e) {
    e.preventDefault();
    if (e.target.classList.contains("disabled")) {
        e.target.classList.remove("disabled");
        document.querySelector("#btnText").textContent = "Nuevo Proyecto";
        document.querySelector("#nuevo-proyecto").parentNode.remove();
        return false;
    }
    var newProyect = document.createElement('li');
    newProyect.innerHTML = `<div class="new-proyect">
                                <input type="text" id="nuevo-proyecto">
                                <div class="boton">
                                    <i class="far fa-plus-square"></i>
                                </div>
                            </div>`;
    listaProyectos.appendChild(newProyect);

    var inputNewProyect = document.querySelector("#nuevo-proyecto");
    var id = e.target.id;
    inputNewProyect.focus();
    inputNewProyect.addEventListener('keypress', function(e) {
        var tecla = e.which || e.keycode;
        if (tecla === 13) {
            if (inputNewProyect.value.length > 4) {
                saveProyectDB(inputNewProyect.value, id);
                listaProyectos.removeChild(newProyect);
                document.querySelector("#btnText").parentNode.classList.remove("disabled");
                document.querySelector("#btnText").textContent = "Nuevo Proyecto";
            } else {
                swal({
                    type: 'warning',
                    title: '¡Atención!',
                    text: `Ingrese un nombre válido`,
                });
            }
        }
    });
    document.querySelector(".new-proyect .boton").addEventListener('click', function() {
        if (inputNewProyect.value.length > 4) {
            saveProyectDB(inputNewProyect.value, id);
            listaProyectos.removeChild(newProyect);
        } else {
            swal({
                type: 'warning',
                title: '¡Atención!',
                text: `Ingrese un nombre válido`,
            });
            inputNewProyect.focus();
        }
    });
    e.target.classList.add("disabled");
    document.querySelector("#btnText").textContent = "Cancelar";
}

function saveProyectDB(name, userId) {
    var newProyect = document.createElement('li');
    newProyect.innerHTML = `
            <a href="index.html">
                ${name}
            </a>
        `;
    listaProyectos.appendChild(newProyect);

    swal({
        type: 'success',
        title: '¡Proyecto Creado!',
        text: `El proyecto ${name} se creó correctamente.`,
    })
}

function agregarTarea(e) {
    e.preventDefault();
    // console.log('Enviar');
    var nombre = document.querySelector('.nombre-tarea').value;
    if (nombre === '') {
        swal({
            type: 'error',
            title: 'Error!',
            text: 'La tarea no puede estar sin nombre',
        })
    } else {
        var listaVacia = document.querySelectorAll('.lista-vacia');
        if (listaVacia.length > 0) {
            document.querySelector('.lista-vacia').remove();
        }

        var newTask = document.createElement('li');

        newTask.id = 'tarea:';
        newTask.classList.add('tarea');
        newTask.innerHTML = `
            <p>${nombre}</p>
            <div class="acciones">
                <i class="far fa-check-circle"></i>
                <i class="fas fa-trash"></i>
            </div>
        `;
        var listadoTareas = document.querySelector(".listado-pendientes ul");
        listadoTareas.appendChild(newTask);

        //Resetear el Form
        document.querySelector(".agregar-tarea").reset();
        //Actualiza la barra de avance.
        actualizarProgreso();
        swal({
            type: 'success',
            title: 'Tarea Creada!',
            text: `La tarea "${nombre}" se creó correctamente.`,
        });
    }
}

// Cambia el estado de las tareas o las elimina.
function accionesTareas(e) {
    e.preventDefault();
    //Delegation.
    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstado(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstado(e.target, 1);
        }
    }
    if (e.target.classList.contains('fa-trash')) {
        swal({
            type: 'warning',
            title: '¿Desea Continuar?',
            text: 'Esta acción no se puede deshacer',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, continuar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                var taskDelete = e.target.parentElement.parentElement;
                //Borrar de DOM
                taskDelete.remove();
                elimiarTarea(taskDelete);

                swal({
                    type: 'success',
                    title: '¡Eliminado!',
                    text: 'Tarea eliminada correctamente',
                })
            }
        })
    }
}

//Cambia el estado
function cambiarEstado(tarea, estado) {
    var id = tarea.parentElement.parentElement.id.split(':');
    // console.log(id);

    var datos = new FormData();
    datos.append('id', id[1]);
    datos.append('action', 'actualizar');
    datos.append('estado', estado);

    actualizarProgreso();
}
//Elimina de la BD
function elimiarTarea(tarea) {
    var listaTareas = document.querySelectorAll('li.tarea');
    if (listaTareas.length === 0) {
        document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas agregadas.</p>";
    }
    actualizarProgreso();
}
//Actualiza el avance del proyecto.
function actualizarProgreso() {

    //Obtener tareas
    const tareas = document.querySelectorAll('li.tarea');
    //Completadas.
    const completadas = document.querySelectorAll('i.completo');
    const avance = Math.round((completadas.length / tareas.length) * 100);
    //Asignación.
    const fondo = document.querySelector("#fondo");
    fondo.style.width = avance + '%';
    const porcentaje = document.querySelector("#porcentaje");
    porcentaje.textContent = (avance >= 0 ? avance : 0) + '%';
    // console.log(avance + '%');

    //Mostrar alerta
    if (avance === 100) {
        swal({
            type: 'success',
            title: 'Proyecto Terminado',
            text: 'No quedan tareas pendientes',
        });
    }
}

function accionesProyecto(e) {
    e.preventDefault();

    if (e.target.classList.contains('fa-edit')) {
        editarProyecto();
    }
    if (e.target.classList.contains('fa-trash')) {
        swal({
            type: 'warning',
            title: '¿Desea Continuar?',
            text: 'Esta acción elimina el proyecto y no se puede deshacer',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, continuar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                var taskDelete = e.target.parentElement.parentElement;

                eliminarProyecto(taskDelete);

                //Borrar de DOM
                taskDelete.remove();
                swal({
                    type: 'success',
                    title: '¡Eliminado!',
                    text: 'El proyecto ha sido eliminado',
                }).then(result => {
                    if (result.value) {
                        window.location.href = 'index.html';
                    }
                })
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            }
        })
    }
}

function editarProyecto() {
    var nombre = document.querySelector(".acciones-proyecto input").value;
    var id = document.querySelector("#idProyecto").value;

    swal({
        type: 'success',
        title: '¡Actualizado!',
        text: 'El proyecto ha sido renombrado',
    });

    document.querySelector(".contenido-principal span").textContent = nombre;

    var proyectos = document.querySelector("#proyectos").children;

    for (proyecto of proyectos) {
        // console.log(proyecto.children[0].id);
        if (proyecto.children[0].id === `proyecto:${id}`) {
            proyecto.children[0].innerText = nombre;
        }
    }
}

function eliminarProyecto() {
    var id = document.querySelector("#idProyecto").value;

    var proyectos = document.querySelector("#proyectos").children;

    for (proyecto of proyectos) {
        if (proyecto.children[0].id === `proyecto:${id}`) {
            proyecto.remove();
        }
    }
}