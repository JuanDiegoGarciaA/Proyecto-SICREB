const express = require ('express');
const router = express.Router()
//llamando la carpeta controller
const authController =require('../controllers/authController');

//TODO: el enrutador sabes que las plantillas de vistas esta en la carpeta "views" por ende no se justifica toda la ruta.

//router para las vistas
router.get('/', authController.Authenticated, (req, res)=>{
    res.render('index')
});

router.get('/login', (req, res)=>{
    res.render('login',{alert:false})
});

router.get('/register', (req, res)=>{
    res.render('register')
});


//router para los metodos del controller
router.post('/register',authController.register);
router.post('/login',authController.login);
router.get('/logout',authController.logout);


//exportando el modulo router.js
module.exports = router