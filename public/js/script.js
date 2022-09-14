$(document).ready(function(){

    $('#pass2').keyup(function(){

        var pass = $('#pass').val();
        var pass2 = $('#pass2').val();

        if (pass == pass2) {
            $('#error').text("Las Contraseñas Coinciden").css("color","green");
        } else {
            $('#error').text("Las Contraseñas NO Coinciden").css("color","red");
        }
        if (pass2 == "") {
            $('#error').text("Esté campo es obligatorio").css("color","red");
        }
    });
});


