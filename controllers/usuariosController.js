const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res ) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en Uptask'
    })
}

exports.formIniciarSesion = (req, res ) => {
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar sesion en Uptask',
        error : error
    })
}
exports.crearCuenta = async (req, res ) => {
   //Leer los datos
    const { email, password} = req.body;

    try {
        //Crear el usuario
        await Usuarios.create ({
            email,
            password
        });
        //Crear una URL para confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //Crear el objeto de usuario
        const usuario = {
            email
        }
        //Enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask', 
            confirmarUrl, 
            archivo : 'confirmar-cuenta'
        });

        //Redirigir al usuario
        req.flash('correcto', 'Te enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error){
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en Uptask',
            email,
            password
        })
    }
}
exports.formRestablecerPassword = (req, res) => {
    res.render('restablecer', {
        nombrePagina: 'Restablecer tu Contraseña'
    })
}
//Cambiar el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });
    //Si el usuario no existe
    if(!usuario) {
        req.flash('error', 'Correo no valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}