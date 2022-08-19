//llamando el modulo de mysql para la conexion 
const mysql = require('mysql');

//creando la conexion a la base de datos 
const conexion = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE
});

conexion.connect((error)=>{
    if (error) {
        console.log('EL ERROR DE CONEXION ES: '+error);
        return
    }
    console.log('Conectado a la base de datos MySQL instituto')
});

module.exports = conexion;