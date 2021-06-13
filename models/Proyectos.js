// Importo Sequelize
const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');

//defino modelo
const Proyectos = db.define('proyectos', {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
       // allowNull: false
    },  
    nombre : Sequelize.STRING(100),
    url : Sequelize.STRING(100)
}, {
    hooks: {
        beforeCreate(proyecto){
           const url = slug(proyecto.nombre).toLowerCase();
           //proyecto.url = url;
           proyecto.url = `${url}-${shortid.generate()}`
        }
    }
});

module.exports = Proyectos;