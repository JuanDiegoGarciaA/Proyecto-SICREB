/* Este escript es con el fin de traducir la libreria utilizada para la generacion de la tabla y la exportacion de excel */
//se prepara la funcion a traves del documento
$(document).ready(function () {
    $('#tablaResultado').DataTable({ // se hace llamado del id con la que se identifica la tabla
        /*------------------Todo lo que esta en el bloque de language es la traduccion de cada parametro que se ven en la tabla---------------------------- */
        language: {
            processing: "Tratamiento en curso...",
            search: "Buscar&nbsp;:",
            lengthMenu: "Agrupar de _MENU_ items",
            info: "Mostrando del item _START_ al _END_ de un total de _TOTAL_ items",
            infoEmpty: "No existen datos.",
            infoFiltered: "(filtrado de _MAX_ elementos en total)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron datos con tu busqueda",
            emptyTable: "No hay datos disponibles en la tabla.",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Ultimo"
            },
            /*------aria establece orden en la tabla-------- */
            aria: {
                sortAscending: ": active para ordenar la columna en orden ascendente",
                sortDescending: ": active para ordenar la columna en orden descendente"
            }
        },
        scrollY: 500,//tamaño del scroll en Y
        scrollX: 400,// tamaño del scroll en X
        lengthMenu: [ [50, 100, 300 ], [50, 100, 300] ],//aqui se establecen los parametros de vista de la tabla el primer vector es los datos visuales para el usuario y el segundo vector es el cual se encarga de limitar las busquedas segun esos numeros.
    })
});

/*-------------------EXPORTAR EXCEL-------------------------------- */
const $btnExportar = document.querySelector("#btnExportar"), // se define en una constante el estado del boton de la vista
$tabla = document.querySelector("#tablaResultado"); //se define la varianle que tiene el resultado de la tabla

//Se crea la funcion la cual permite exportar en formato xls
$btnExportar.addEventListener("click", function() {
let tableExport = new TableExport($tabla, {
exportButtons: false, // No queremos botones
filename: "Consulta SICREB", //Nombre del archivo de Excel
sheetname: "Consulta SICREB", //Título de la hoja
});
let datos = tableExport.getExportData();
let preferenciasDocumento = datos.tablaResultado.xlsx;
tableExport.export2file(preferenciasDocumento.data, preferenciasDocumento.mimeType, preferenciasDocumento.filename, preferenciasDocumento.fileExtension, preferenciasDocumento.merges, preferenciasDocumento.RTL, preferenciasDocumento.sheetname);
});

