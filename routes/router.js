const express = require ('express');
const router = express.Router()
//llamando la carpeta controller
const authController =require('../controllers/authController');

//TODO: el enrutador sabe que las plantillas de vistas esta en la carpeta "views" por ende no se justifica toda la ruta.

//router para las vistas y designaciones de URL
router.get('/', authController.Authenticated, (req, res)=>{
    res.render('index')
});

router.get('/login', (req, res)=>{
    res.render('login',{alert:false}) //si la ruta cuenta con esta caracteristica:{alert:false} se hace para inicializar la alerta, asi que si se desea colocar alertas en otras rutas es sumamente necesario que cuente con este parametro.
});

router.get('/register', (req, res)=>{
    res.render('register')
});

router.get('/aviso', (req, res)=>{
    res.render('aviso')
});

router.get('/olvido', (req, res)=>{
    res.render('olvido',{alert:false})
});

router.get('/restaurar', (req, res)=>{
    res.render('restaurar',{alert:false})
});

router.get('/consulta', (req, res)=>{
    res.render('consulta')
});

router.get('/inventario', (req, res)=>{
    res.render('inventario')
});

router.get('/buscar', (req, res)=>{
    res.render('buscar')
})

router.get('/resultado', (req, res)=>{
    res.render('resultado')
})


//router para los metodos del controller
router.post('/register',authController.register);
router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.post('/olvido',authController.olvido);
router.post('/restaurar',authController.restaurar);
router.post('/buscar',authController.listar);
router.post('/consulta',authController.especie);


//exportando el modulo router.js
module.exports = router