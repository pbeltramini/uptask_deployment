const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
    //obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({where: { url: req.params.url }});

    //leer el valor del input
    const {tarea} = req.body;

    //estado 0= incompleto y ID del proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    //Insertar en la dB
    const resultado = await Tareas.create({tarea, estado, proyectoId});

    if(!resultado){
        return next();
    }

    //Redireccionar
    res.redirect(`/proyectos/${req.params.url }`);
}

exports.cambiarEstadoTarea = async (req, res) => {
    res.send('Todo ok..');

    const { id } = req.params; 
    const tarea = await Tareas.findOne({where: { id }});
    
    //cambiar el estado de la tarea
    let estado = 0;
    if (tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;

    const resultado = await tarea.save();
    
    if(!resultado) return next();

    res.status(200).send('Actualizado');
}

exports.eliminarTarea = async (req, res) => {
    const { id } = req.params;

    //Eliminar la tarea
    const resultado = await Tareas.destroy({where : { id }});

    if(!resultado) return next();

    res.status(200).send('Tarea eliminada correctamente');
}
