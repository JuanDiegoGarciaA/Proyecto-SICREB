//llamando el modulo de express
const express = require ('express');
//llamando el modulo de las variables de entorno 
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const app = express();

//seteando el motor de plantillas (ejs)
app.set('view engine','ejs');

//seteando la carpeta public para archivos estaticos
app.use(express.static('public'));

//configurando node para procesar datos de formularios
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//seteando las variables de entorno 
dotenv.config({path: './env/.env'});

//setenado las cookies
app.use(cookieParser())

//llamar al router
app.use('/',require('./routes/router'));

//para eliminar el cache y que no se pueda volver con el boton back del navegador luego de que hacemos un logout 
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

app.listen(3000, ()=>{
    console.log('SERVER CORRIENDO EN http://localhost:3000')
});