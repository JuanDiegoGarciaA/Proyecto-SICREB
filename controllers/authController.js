/* ---------------aqui se va a crear los procedimientos para manejar toda la logica en tanto al registro login y autentificacion y procesos dentro de las vistas como las consultas a la BD etc--------------- */
//modulo de jwt
const jwt = require('jsonwebtoken');
//modulo de encriptacion 
const bcryptjs = require('bcryptjs');
//llamando la conexion de la bd
const conexion = require('../database/db');
//utilizando comunicacion asincrona (prom esas)
const {promisify} = require('util');
const { send } = require('process');
var id = null //variable global para obtener el ID del usuario
var resultadoConsulta = []
var especie = "" //inicializacion de la variable global la cual sera utilizada para identificar que codigo buscar en la base de datos


/*------procedimiento para registro------*/
//se exporta el modulo el cual va a ser utilizado en la ruta
exports.register = async (req,res)=>{
    try {
        /* con req.body."name" se trae desde la vista el dato exacto que ingresa el usuario NOTA hay que tener en cuenta que estos datos se traen con la etiqueta name dentro de la vista EJS es decir que para poder utilizar el req.body."name" se debe contar con un atributo name dentro de la etiqueta HTML*/
    const nombre = req.body.nombre 
    const apellido = req.body.apellido
    const user = req.body.user
    const pass = req.body.pass
    const afl = req.body.afl
    let passHash = await bcryptjs.hash(pass, 8) //encriptando contraseña
        conexion.query('INSERT INTO usuarios SET ?',{nombre_usuario:nombre, apellido_usuario:apellido, correo_usuario:user, constrasenia_usuario:passHash, afiliacion_institucional:afl},(err, results)=>{ //realizando insersion a la base de datos del registro
            if(err){
                res.redirect('/aviso')
                console.log('OCURRIO UN ERROR EN EL REGISTRO=> '+err)//aviso por consola del error que surgio al insertar los datos
            }else{
            res.redirect('/login')// se redirecciona al login cuando el registro fue exitoso. 
            }
        })
    } catch (error) {
        console.log(error)//notificacion del error en el catch 
    }
}

/*------procedimiento para el login------*/
//se exporta el modulo el cual va a ser utilizado en la ruta
exports.login = async (req,res)=>{
    try {
        const user = req.body.user
        const pass= req.body.pass
        //este condicional valida si los campos de la vista esta vacio o no. 
        if (!user || !pass) {
            res.render('login',{
                //TODO: este condicional es para visualizar una alerta si los campos estan vacios, la alerta tiene una estrutura HTML dentro de la vista, sin esta estructura no se visualizara la alerta       
                //estructura de la alerta
                alert:true,//estado de la alerta deja de ser false.
                alertTitle: "Advertencia", //aqui se coloca el titulo que se desea en la alerta. 
                alertMessage: "Ingrese un usuario y contraseña",//mensaje de la alerta. 
                alertIcon: 'info',//icono para identificar la alerta, NOTA la palabra info es reservada y tiene su propio icono.
                showConfirmButton: true,//permite generar un boton el cual permite confirmar la acción.
                timer: false,//indica que no tiene tiempo de finalizacion, la accion se termina al dar click en el boton o fuera de la alerta.
                ruta: 'login'//ruta a la cual sera dirigido el usuario despues de la aparicion de la alerta.
            });
        }else{
            //si los campos no estan vacios, hace una consulta a la base de datos 
            conexion.query('SELECT * FROM usuarios WHERE correo_usuario = ?',[user], async (err,results)=>{
                //la contraseña al estar encriptada se debe desencriptar para poder realizar la comparacion con la peticion que hace el usuario
                if( results.length == 0 || !(await bcryptjs.compare(pass, results[0].constrasenia_usuario)) ){
                    //si al validar los datos no se encuantran en la base de datos se arroja una alerta de error
                    res.render('login',{
                        alert:true,
                        alertTitle: "Error",
                        alertMessage: "usuario y/o contraseña Incorrectas",
                        alertIcon: 'error', //icono de error la palabra error es reservada para el icono que contiene la alerta
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                }else{
                    /* --al validar la informacion y encontarla en la BD se hace la conexion y se le da al usuario un token y una cookie la cual expira segun lo establecido en la carpeta env/.env-- */
                    //inicio de sesion OK
                    const id = results[0].id_usuario
                    //aqui es donde se le asigna un token al usuario
                    const token = jwt.sign({id_usuario:id},process.env.JWT_SECRETO,{
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    });
                    console.log('TOKEN: '+token+' para el USUARIO: '+user)//se valida por consola el token que se le da al usuario

                    //opciones de cookies y proceso de cofiguracion de la cookie
                    const cookiesOption ={
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES *24 *60 *60 *1000),
                        httpOnly: true
                    }
                    //alerta para informar al usuario que el login fue correcto y podra acceder al sistema
                    res.cookie('jwt', token, cookiesOption)
                    res.render('login',{
                        alert:true,
                        alertTitle: "Conexión Exitosa",
                        alertMessage: "¡ LOGIN CORRECTO !",
                        alertIcon: 'success',// la palabra success es reservada y tiene un icono especifico dentro de la alerta.
                        showConfirmButton: false,
                        timer: 800,//tiempo en milisegundos para la visualizacion de la alerta.
                        ruta: ''//la ruta a la cual sera dirigido despues de realizar el login de manera correcta sera a la del index.
                    })
                }
            });
        }
    } catch (error) {
        console.log('ERROR EN EL CATCH DEL LOGIN '+error)//notificacion del error del catch por si ocurre algun error dentro de la vista del login. 
    };
};

//procedimiento para ver si el usuario esta Autenticado
//TODO: el modulo Authenticated verifica que el usuario tenga un jwt y una cookie con la cual podra hacer ingreso a la pagina, si no tiene ninguno de estas 2 no se podra acceder a ningun apartado del sistema.   
exports.Authenticated = async (req,res, next)=>{
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            //se verifica que el usuario esta en la BD
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
//el modulo logout esta configurado especificamente para el boton de cerrar sesion con el cua lse borra las cookies y el JWT designado para el usuario
exports.logout = (req, res)=>{
    res.clearCookie('jwt');
    return res.redirect('/')
}

//en este modulo se encuentra la busqueda en la BD del usuario que olvido la contraseña.
exports.olvido = (req, res) =>{
    //se obtiene el dato del usuario el cual quiere cambiar la contraseña (user)
    const user = req.body.user;
    conexion.query('SELECT * FROM usuarios WHERE correo_usuario = ?',[user], async (err,results)=>{
        //este condicional permite validar los campos ingresados por el usuario, si el usuario ingresa un correo electronico que no se encuentra en la BD no podra acceder a el modulo de cambiar contraseña
        if (results.length == 0) {
            res.render('olvido',{
                alert:true,
                alertTitle: "Error",
                alertMessage: "El usuario no se encuentra en la Base de Datos del sistema",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'olvido'
            });
        } else {
            //si los datos ingresados por el usuario son correctos la consulta sera exitosa y accedera al modulo de restarurar
            id = results[0].id_usuario//variable para obtener la ID del usuario que solicita el cambio de la pass
            res.render('olvido',{
                alert:true,
                alertTitle: "Conexión Exitosa",
                alertMessage: "¡ USUARIO ENCONTRADO !",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 800,
                ruta: 'restaurar'
            });
        }
    });
}
//este modulo permite la actualizacion de datos si el proceso de verificacion del correo electronico fue correcta
exports.restaurar = async (req, res)=>{
    // pass y pass2 son las contraseñas escritas por el usuario
    const pass = req.body.pass;
    const pass2 = req.body.pass2;
    let passHash = await bcryptjs.hash(pass, 8) //encriptando contraseña
    //este condicional permite verificar que las contraseñas ingresadas por el usuario sean las mismas en los 2 input
    if (pass != pass2) {
        res.render('restaurar',{
            alert:true,
            alertTitle: "Error",
            alertMessage: "Las contraseñas ingresadas son diferentes",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'restaurar'
        });
    } else {
        //si las contraseñas coinciden se realiza la actualizacion de la contraseña en la base de datos NOTA la contraseña actualizada tambien sera encriptada dentro de la BD
        conexion.query('UPDATE `instituto`.`usuarios` SET `constrasenia_usuario` = ? WHERE `id_usuario` = ?',[passHash, id], async (err,results)=>{
            res.render('restaurar',{
                alert:true,
                alertTitle: "Acción Exitosa",
                alertMessage: "La Contraseña ha sido Cambiada.",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: 'login'
            });
            })
    }
}
//el modulo de especie permite almacenar en una variable global el tipo de especie al cual ingreso el usuario el nombre de esa variable es "especie"
exports.especie = (req,res)=>{
    especie = req.body.especie
    res.render('consulta')//despues de tener el valor de la especie del usuario se envia a la vista consulta.
}

//este modulo es el que se encarga de buscar la lista de datos que consulta el usuario dependiendo si es por nombre de especie o numero de catalago
exports.listar = (req,res)=>{
    //la variable "estado" permite identificar cual campo selecciono el usuario en el checkbox "num= numero de catalogo, nom= nombre de especie"
    var estado = req.body.estado
    num = "num"
    //condicional para la consulta por numero de catalogo
    if(estado === num){
        var datos = req.body.datoNumero;//la variable datos es extraida del script llamado "listar" que se encuentra en la carpeta public/js, "datoNumero es la variable que almacena toda la informacion escrita por el usuario"
        /*----- CONSULTA BD ----- */
        var consulta ="select * from dwc_iavh where Numero_de_catalogo IN ('";
        consulta = consulta.concat(datos);//aqui se concatena todo lo que escribe el usuario y la estructura sql (separacion por comas) esta dentro del script listar
        consulta = consulta.concat(")");//se concatena la finalizacion de los datos 
        consulta = consulta.concat("AND code IN ('");//se concatena una sentencia AND 
        consulta = consulta.concat(especie);//la variable especie trae un dato dependiendo la seleccion de la especie que esta consultando, este dato esta dentro de la base de datos (para visualizar el dato hacer un console.log(especie))
        consulta = consulta.concat("')");//se finaliza la consulta 
        console.log(consulta)//console para visualizar la estructura de la consulta NOTA: BORRAR
        conexion.query(consulta, async (err,resultadoConsulta)=>{
            res.locals.resultadoConsulta = resultadoConsulta //resultado consulta se utiliza para plasmar cada dato en una tabla desde la vista resultado.ejs 
            res.render('resultado') 
        })
    }else{
        var datos = req.body.datoNombre;
        var consulta = 'select * from dwc_iavh where scientificName LIKE'
        consulta = consulta.concat(datos);//aqui se concatena todo lo que escribe el usuario y la estructura sql (separacion por comas signos etc) esta dentro del script listar
        consulta = consulta.concat("AND code IN ('");
        consulta = consulta.concat(especie);
        consulta = consulta.concat("')");
        console.log(consulta)
        conexion.query(consulta, async (err,resultadoConsulta)=>{
            res.locals.resultadoConsulta = resultadoConsulta //resultado consulta se utiliza para plasmar cada dato en una tabla desde la vista resultado.ejs 
            res.render('resultado') 
        })
    }
}


