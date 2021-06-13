import axios from "axios";
import Swal from 'sweetalert2';
import {actualizarAvance} from "../funciones/avance";

const tareas = document.querySelector ('.listado-pendientes');

if(tareas){

    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            console.log(idTarea);

            //request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            console.log(url);

            
            axios.patch(url, { idTarea })
                .then(function(respuesta){
                    console.log (respuesta);
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                })
        }
        if(e.target.classList.contains('fa-trash')){
            //console.log('Eliminar..');
            const tareaHTML = e.target.parentElement.parentElement,
                  idTarea = tareaHTML.dataset.tarea;

                  Swal.fire({
                    title: 'Deseas borrar esta Tarea?',
                    text: "Si eliminas la Tarea no se podrá recuperar!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'SI, Borrar!',
                    cancelButtonText: 'NO, Cancelar'
                }).then((result) => {
                    if (result.value) {

                        //eviar eñ delete por medio de axios
                        axios.delete(url, { params: {idTarea}})
                            .then(function(respuesta){
                                if(respuesta.status === 200){
                                    //Eliminar el nodo de la app
                                    tareaHTML.parentElement.removeChild(tareaHTML);

                                    //Mensaje de alerta
                                    Swal.fire(
                                        'Tarea eliminada',
                                        respuesta.data,
                                        'success'
                                        )

                                        actualizarAvance();
                                }
                            });
                    }
                })
        }
    });

}

export default tareas;