//Importar Sequelize
const Sequelize = require('sequelize');
//Importar valores del archivo variables.env
require('dotenv').config({path: 'variables.env'})

//Configuro DB
const db = new Sequelize(
  process.env.BD_NOMBRE,
  process.env.BD_USER,
  process.env.BD_PASS,
  {
    //host: 'localhost',
    host: process.env.BD_HOST,
    dialect: 'mysql',
    port: process.env.BD_PORT,
    define:{
        timestamps: false
    },
    pool:{
        max: 5,
        min: 0,
        acquiere:30000,
        idle: 10000
    }
});

module.exports = db;