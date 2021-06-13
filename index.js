const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require ('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//Importar las variables
require('dotenv').config({path: '../variables.env'})

//Importar helpers con algunas funciones
const helpers = require('./helpers');

//Crear la conexión a la BD
const db = require('./config/db');

//Importar los modelos de proyectos y tareas
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync ()
    .then(() => console.log('Conección al Servidor correcta'))
    .catch(error => console.log(error)); 

//Crear una app de express
const app = express();

//Donde cargar los archivos estáticos
app.use(express.static('public'));

//Habilitar Pug
app.set('view engine', 'pug');

//Habilitar bodyParser para leer datos del formulario
//app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true }));

//Agregamos express validator a toda la aplicación
//app.use(expressValidator());

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//Agregar flash messenger
app.use(flash());

app.use(cookieParser());

// Sessiones nos permiten navegar en distintas pag. sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto', 
    resave: false, 
    saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar var dump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use('/', routes());

//Asigno servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () =>{
    console.log('El servidor funciona OK');
})

require('./handlers/email');