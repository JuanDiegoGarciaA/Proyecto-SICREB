//llamando el modulo de mysql para la conexion el cual fue previamente instalado
const mysql = require('mysql');

//creando la conexion a la base de datos y llamando los datos desde la carpeta "env/.env"
const conexion = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE
});

//validando la conexion a la base de datos 
conexion.connect((error)=>{
    if (error) {
        //mensaje de error de la conexion
        console.log('EL ERROR DE CONEXION ES: '+error);
        return
    }
    //mensaje de conexion exitosa
    console.log('Conectado a la base de datos MySQL instituto')
});

//exportando el modulo de conexion para poder utilizarlo en el controlador
module.exports = conexion;