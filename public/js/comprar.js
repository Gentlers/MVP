$('#btnDelivery').on('click', (e) => {
  e.preventDefault()
  var $this = $('#formCompra')
  $this.append('<input type="hidden" id="temp" name="entrega" value="delivery"/>')
  $.ajax({
    method: 'POST',
    url: '/venta',
    data: $('#formCompra').serializeArray()
  })
  .done((msg) => {
    fbq('track', 'Purchase')
    $('#temp').remove()
    alert('Gracias por Comprar! Un asesor se pondrá en contacto contigo!')
  })
})
$('#btnTienda').on('click', (e) => {
  e.preventDefault()
  var $this = $('#formCompra')
  $this.append('<input type="hidden" id="temp" name="entrega" value="tienda"/>')
  console.log($('#formCompra').serializeArray())
  $.ajax({
    method: 'POST',
    url: '/venta',
    data: $('#formCompra').serializeArray()
  })
  .done((msg) => {
    fbq('track', 'Purchase')
    $('#temp').remove()
    alert('Gracias por Comprar!')
  })
})
