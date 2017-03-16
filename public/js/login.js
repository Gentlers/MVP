var workingRegistro = false;
var workingLogin = false;
$('#btnLogin').on('click', function(e) {
  e.preventDefault();
  if (workingLogin) return;
  workingLogin = true;
  var $this = $('.login'),
    $state = $this.find('button > .state');
  $this.addClass('loading');
  $state.html('Iniciando Sesion...');
  setTimeout(function() {
    $this.addClass('ok');
    $state.html('!Bienvenido a Gento¡');
    $('.login').submit()
  }, 3000);

});

$('#btnRegistro').on('click', function(e) {
  e.preventDefault();
  if (workingRegistro) return;
  workingRegistro = true;
  var $this = $('.registro'),
    $state = $this.find('button > .state');
  $this.addClass('loading');
  $state.html('Realizando Registro...');
  setTimeout(function() {
    $this.addClass('ok');
    $state.html('¡Bienvenido a Gento!');
    $('.registro').submit()
  }, 3000);

});

$('.cambio').on('click', function(e) {
  alert('hola')
  $('.login').css('display','none')
  $('.loginR').css('display','block')
})


$('.fireLogin').on('click', function(e) {
  e.preventDefault()
  $('#formRegistro').css('display','none')
  $('#formLogin').css('display','block')
})
$('.fireRegister').on('click', function(e) {
  e.preventDefault()
  $('#formLogin').css('display','none')
  $('#formRegistro').css('display','block')
})