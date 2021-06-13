const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op= Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/iniciar-sesion',
    failureFlash : true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//Función para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {

    //Si el usuario esta autenticado, continuar
    if(req.isAuthenticated()) {
        return next();
    }
    //Si no esta autenticado, redirigir al inicio
    return res.redirect('/iniciar-sesion');
}
//Función para cerrar sesión
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}
//Generar un token si el usuario es válido
exports.enviarToken = async (req, res) => {
    //verificar que el usuario exista
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: { email }});

    //Si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/restablecer');
    }
    //Si el usuario ya existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    //Genero expiración por 1 hs
    usuario.expiracion = Date.now() + 3600000;

    //Guardo los datos en la BD
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;

    //Enviar el correo con el Token
    await enviarEmail.enviar({
        usuario: usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecer-password'
    });
    //Terminar la restauracion del password
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}
exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });
    
    //Si no encuentra el usuario
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/restablecer');
    }
    //Formulario para regenera el password
    res.render('resetPassword', {
        nombrePagina : 'Restablecer Contraseña'
    });
}

//Cambiar el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
    //Verifica que el token sea válido y la fecha de expiración
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });
    //Verificamos si el usuario existe
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/restablecer');
    }
    //Hashear el password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.toke = null;
    usuario.expiracion = null;

    //Guardo el nuevo password
    await usuario.save();

    req.flash('correcto','Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

}