const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al Modelo donde se autentica
const Usuarios = require('../models/Usuarios');

//Local strategy - Login con credenciales propios (usuario y password)
passport.use(
    new LocalStrategy(
        //por defecto passport espera un usuario y un password
        {
            usernameField: 'email',
            passwordField : 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email: email,
                        activo: 1
                    }
                });
       
                //El usuario existe, pero password es incorrecto
                if(!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message : 'El password es incorrecto'
                    })
                } 
                //El email existe y el password es correcto
                return done(null, usuario);
            } catch (error) {
                //Ese usuario no existe
                return done(null, false, {
                    message : 'Esa cuenta no existe'
                })
            }
        }
    )
);

//Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

//Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

//Exportar
module.exports = passport;