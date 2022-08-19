/* aqui se va a crear los procedimientos para manejar toda la logica en tanto al registro login y autentificacion */
//modulo de jwt
const jwt = require('jsonwebtoken');
//modulo de encriptacion 
const bcryptjs = require('bcryptjs');
//llamando la conexion de la bd
const conexion = require('../database/db');
//utilizando comunicacion asincrona (prom esas)
const {promisify} = require('util');

//procedimiento para registro
exports.register = async (req,res)=>{
    try {
        const nombre = req.body.nombre
        const apellido = req.body.apellido
        const user = req.body.user
        const pass = req.body.pass
        const afl = req.body.afl
        let passHash = await bcryptjs.hash(pass, 8) //encriptando contraseña
        conexion.query('INSERT INTO usuarios SET ?',{nombre_usuario:nombre, apellido_usuario:apellido, correo_usuario:user, constrasenia_usuario:passHash, afiliacion_institucional:afl},(err, results)=>{
            if(err){
                console.log('OCURRIO UN ERROR EN EL REGISTRO'+err)
            }
            res.redirect('/login')
        })
    } catch (error) {
        console.log(error)
    }
}

//procedimiento para el login 

exports.login = async (req,res)=>{
    try {
        const user = req.body.user
        const pass= req.body.pass
        
        if (!user || !pass) { //TODO: este condicional es para visualizar una alerta si los campos estan vacios 
            res.render('login',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y contraseña",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            });
        }else{
            conexion.query('SELECT * FROM usuarios WHERE correo_usuario = ?',[user], async (err,results)=>{
                if( results.length == 0 || !(await bcryptjs.compare(pass, results[0].constrasenia_usuario)) ){
                    res.render('login',{
                        alert:true,
                        alertTitle: "Error",
                        alertMessage: "usuario y/o contraseña Incorrectas",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                }else{
                    //inicio de sesion OK
                    const id = results[0].id_usuario
                    const token = jwt.sign({id_usuario:id},process.env.JWT_SECRETO,{
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    });
                    console.log('TOKEN: '+token+' para el USUARIO: '+user)

                    //opciones de cookies
                    const cookiesOption ={
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES *24 *60 *60 *1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOption)
                    res.render('login',{
                        alert:true,
                        alertTitle: "Conexión Exitosa",
                        alertMessage: "¡ LOGIN CORRECTO !",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                    })
                }
            });
        }
    } catch (error) {
        console.log('ERROR EN EL CATCH DEL LOGIN '+error)
    };
};

//procedimiento para ver si el usuario esta Autenticado

exports.Authenticated = async (req,res, next)=>{
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            //verificamos que el usuario este en la BD
            conexion.query('SELECT * FROM usuarios WHERE id = ?',[decodificada.id], (error, results)=>{
                if (!results) {
                    return next();
                }
                req.user = results[0];
                return next();
            });
        } catch (error) {
            console.log('ESTE ES EL ERROR DE AUTENTICACIÓN: =>'+error);
            return next();
        }
    }else{
        res.redirect('/login')
    }
}

exports.logout = (req, res)=>{
    res.clearCookie('jwt');
    return res.redirect('/')
}