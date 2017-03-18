var workingRegistro = false;
var workingLogin = false;
$('#btnLogin').on('click', e => {
  e.preventDefault();
  if (workingLogin) return;
  var email = $('#formLogin input[name="email"')[0].value
  var password = $('#formLogin input[name="password"')[0].value
  if(email == "" || password == "") {
    alert('Ingresa todos los datos requeridos')
    break
  }
  workingLogin = true;
  var $this = $('.login'),
  $state = $this.find('button > .state');
  $this.addClass('loading');
  $state.html('Iniciando Sesion...');
  setTimeout(() => {
    $this.addClass('ok');
    $state.html('!Bienvenido a Gento¡');
    $('.login').submit()
  }, 3000);

});

$('#btnRegistro').on('click', e => {
  e.preventDefault();
  if (workingRegistro) return;
  var email = $('#formRegistro input[name="email"')[0].value
  var nombre = $('#formRegistro input[name="nombre"')[0].value
  var phone = $('#formRegistro input[name="phone"')[0].value
  var password = $('#formRegistro input[name="password"')[0].value
  if( email == "" || nombre == "" || phone == "" || password == "") {
    alert('Ingresa todos los datos requeridos')
    break
  }
  workingRegistro = true;
  var $this = $('.registro'),
  $state = $this.find('button > .state');
  $this.addClass('loading');
  $state.html('Realizando Registro...');
  setTimeout(() => {
    $this.addClass('ok');
    $state.html('¡Bienvenido a Gento!');
    $('.registro').submit()
  }, 3000);

})

$('.fireLogin').on('click', e => {
  e.preventDefault()
  $('#formRegistro').css('display','none')
  $('#formLogin').css('display','block')
  $('.fireLogin').css('background','#1AD245')
  $('.fireRegister').css('background','#666')
})

$('.fireRegister').on('click', e => {
  e.preventDefault()
  $('#formLogin').css('display','none')
  $('#formRegistro').css('display','block')
  $('.fireLogin').css('background','#666')
  $('.fireRegister').css('background','#1AD245')
})