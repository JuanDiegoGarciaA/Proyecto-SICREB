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