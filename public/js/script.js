//ESTE SCRIPT ES EXCLUSIVO PARA LA VALIDACION DE INPUTS DE TIPO CONTRASEÑA, PARA VALIDAR QUE LAS CONTRASEÑAS SEAN IGUALES Y CON UN MENSAJE DE CONFIRMACION DE COINCIDENCIAS
$(document).ready(function(){

    $('#pass2').keyup(function(){

        var pass = $('#pass').val();//Variable del input de la primera contraseña 
        var pass2 = $('#pass2').val();//Variable del input de la segunda contraseña

        if (pass == pass2) {//condicional si las contraseñas coinciden
            $('#error').text("Las Contraseñas Coinciden").css("color","green");//generacion del mensaje en la vista con una etiqueta span y con una configuracion de color en css 
        } else {//condicional si las contraseñas NO coinciden
            $('#error').text("Las Contraseñas NO Coinciden").css("color","red");
        }
        if (pass2 == "") {//condicional si el campo esta vacio
            $('#error').text("Esté campo es obligatorio").css("color","red");
        }
    });
});


