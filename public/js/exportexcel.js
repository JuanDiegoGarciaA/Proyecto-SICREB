$(document).ready(function () {
    $('#tablaResultado').DataTable({
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
            aria: {
                sortAscending: ": active para ordenar la columna en orden ascendente",
                sortDescending: ": active para ordenar la columna en orden descendente"
            }
        },
        scrollY: 500,
        scrollX: 400,
        lengthMenu: [ [50, 100, 300 ], [50, 100, 300] ],
    })
});

const $btnExportar = document.querySelector("#btnExportar"),
$tabla = document.querySelector("#tablaResultado");

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

