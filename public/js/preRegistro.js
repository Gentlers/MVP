var working = false;
$('#botn').on('click', function(e) {
  e.preventDefault();
  setTimeout(function() {
    $.ajax({
    method: "POST",
    url: "/pre",
    data: $('#pronto-date-know').serializeArray()
    })
    .done(function( msg ) {
      alert('¡Gracias por pre-registrarte!\nPronto podrás ser parte de la experiencia GENTO.');
    });
  }, 3000);

});