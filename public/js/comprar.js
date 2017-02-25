$('#btnDelivery').on('click', function(e) {
  e.preventDefault();
  var $this = $('#formCompra')
  $this.append("<input type=hidden' name='tipo_pedido' value='delivery'/>")
  $this.submit()
});
$('#btnTienda').on('click', function(e) {
  e.preventDefault();
  var $this = $('#formCompra')
  $this.append("<input type='hidden' name='tipo_pedido' value='tienda'/>"); 
  $this.submit()
});