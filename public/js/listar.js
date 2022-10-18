window.onload = function(){
    window.datos = [];
}
function mostrarArreglo(){
    let dato = document.getElementById('texto').value;
    datos.push(dato);
    datoBusqueda = '';
    datoBusqueda2 = '';


    let resultado = document.getElementById('resultado');
    resultado.innerHTML ='';

    for (const dato of datos) {
        let datoParrafo = document.createElement('p')
        datoParrafo.innerText = dato;

        resultado.appendChild(datoParrafo);
    }
}

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

