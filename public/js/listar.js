window.onload = function(){
    window.datos = [];//se establecen las variables globales con esta line a de codigo
}
//esta funcion permite generar un arreglo con cada dato que ingresa el usuario en la vista buscar.ejs
function mostrarArreglo(){
    let dato = document.getElementById('texto').value;//se obtiene el valor dado 
    datos.push(dato);//con el push permite colocar un dato nuevo dentro del objeto

    let resultado = document.getElementById('resultado');//se obtiene en una variable el valor que tiene el campo "resultado" establecido en la vista buscar.ejs
    resultado.innerHTML ='';//se plasma la informacion para el usuario en HTML para la visualizacion de la lista

    //este ciclo for permite escribir los datos en la lista de manera que se recora tantas veces como el usuario necesite ingresar la informacion
    for (const dato of datos) {
        let datoParrafo = document.createElement('p')//aqui la informacion se va a plasmar dentro de una etiqueta <p> PARRAFO dentro del HTML
        datoParrafo.innerText = dato;//aqui es donde se le coloca la la info en la etiqueta 
        resultado.appendChild(datoParrafo);
    }
}
/*---------Los siguientes ciclos for se realizan para generar la correcta sentencia SQL para la ejecucion de la busqueda que se hace en el Authcontroller en el modulo de listar-------------- */
//datoNombre = es el dato que se trae desde el DOM cuando el usuario elige la opcion nombre de especie y cada dato que ingresa 
//datoNumero = es el dato que se trae desde el DOM cuando el usuario elige la opcion numero de catalogo y cada dato que ingresa
//las variables texto1 y texto2 son auxiliares para saber el estado del input para evitar errores de especios vacios en la consulta SQL 

function enviarTexto(){
    var texto2= "";  
    if (typeof texto2 === "'") { 
        for (let i = 0; i < datos.length; i++) {
            texto2 = datos[i]+"'";
    }
    document.getElementById("datoNombre").value = texto2;
} else {
    for (let i = 0; i < datos.length; i++) {
        if(i == 0){
            texto2 = texto2.concat("'%",datos[i],"'");
        }
        else {
            texto2 = texto2.concat("OR scientificName LIKE '%",datos[i],"'");
        }
    }
    document.getElementById("datoNombre").value = texto2; 
}

    
var texto1= "'";  
        if (typeof texto1 === "'") { 
            for (let i = 0; i < datos.length; i++) {
                texto1 = datos[i]+"'";
        }
        document.getElementById("datoNumero").value = texto1;
    } else {
        for (let i = 0; i < datos.length; i++) {
            texto1 = texto1.concat(", '", datos[i],"'");
        }
        document.getElementById("datoNumero").value = texto1;
    }
}

