window.onload = function(){
    window.datos = [];
}
function mostrarArreglo(){
    let dato = document.getElementById('texto').value;
    datos.push(dato);
    datoChimbo = '';


    let resultado = document.getElementById('resultado');
    resultado.innerHTML ='';

    for (const dato of datos) {
        let datoParrafo = document.createElement('p')
        datoParrafo.innerText = dato;

        resultado.appendChild(datoParrafo);
    }
}

function enviarTexto(){
    
var texto1= "'";  
        if (typeof texto1 === "'") { 
            for (let i = 0; i < datos.length; i++) {
                texto1 = datos[i]+"'";
        }
        document.getElementById("datoChimbo").value = texto1;
    } else {
        for (let i = 0; i < datos.length; i++) {
            texto1 = texto1.concat(", '", datos[i],"'");
        }
        document.getElementById("datoChimbo").value = texto1;
    }
}