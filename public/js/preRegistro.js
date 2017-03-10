var working = false;
$('#botn').on('click', function(e) {
  e.preventDefault();
  $.ajax({
  method: "POST",
  url: "/pre",
  data: $('#pronto-date-know').serializeArray()
  })
  .done(function( msg ) {
    fbq('track', 'CompleteRegistration');
    alert('¡Gracias por pre-registrarte!\nPronto podrás ser parte de la experiencia GENTO.');
  });
});