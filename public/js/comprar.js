$('#btnDelivery').on('click', function(e) {
  e.preventDefault();
  var $this = $('#formCompra')
  $this.append("<input type='hidden' name='tipo_pedido' value='delivery'/>"); 
  console.log($('#formCompra').serializeArray())
  $.ajax({
    method: "POST",
    url: "/venta",
    data: $('#formCompra').serializeArray()
  })
  .done(function( msg ) {
    alert("Gracias por Comprar!");
  });
})
$('#btnTienda').on('click', function(e) {
  e.preventDefault();
  var $this = $('#formCompra')
  $this.append("<input type='hidden' name='tipo_pedido' value='tienda'/>"); 
  console.log($('#formCompra').serializeArray())
  $.ajax({
    method: "POST",
    url: "/venta",
    data: $('#formCompra').serializeArray()
  })
  .done(function( msg ) {
    alert("Gracias por Comprar!");
  });
});

