/*-----------habilitar el espacio del qr --------------*/ 

function mostrarqr(){
    document.getElementById('qr').style.display = 'block';
}

/* -----CODIGO DEL QR----- */
function onScanSuccess(qrCodeMessage) {
    document.getElementById('result').innerHTML = '<span class="result">'+qrCodeMessage+'</span>';
}
function onScanError(errorMessage) {
  //handle scan error
}
var html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess, onScanError);

