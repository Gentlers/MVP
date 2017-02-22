var working = false;
$('#botn').on('click', function(e) {
  e.preventDefault();
  if (working) return;
  working = true;
  var $this = $('.login'),
    $state = $this.find('button > .state');
  $this.addClass('loading');
  $state.html('Iniciando Sesion');
  setTimeout(function() {
    $this.addClass('ok');
    $state.html('Bienvenido a Gento');
    $('.login').submit()
  }, 3000);

});