var workingRegistro = false
var workingLogin = false
$('.login').on('submit', e => {
  if (workingLogin) return
  workingLogin = true
  var $this = $('.login')
  var $state = $this.find('button > .state')
  $this.addClass('loading')
  $state.html('Iniciando Sesion...')
  setTimeout(() => {
    $this.addClass('ok')
    $state.html('!Bienvenido a Gento¡')
    $('.login').submit()
  }, 3000)
})

$('.registro').on('submit', e => {
  if (workingRegistro) return
  workingRegistro = true
  var $this = $('.registro')
  var $state = $this.find('button > .state')
  $this.addClass('loading')
  $state.html('Realizando Registro...')
  setTimeout(() => {
    $this.addClass('ok')
    $state.html('¡Bienvenido a Gento!')
    $('.registro').submit()
  }, 3000)
})

$('.fireLogin').on('click', e => {
  e.preventDefault()
  $('#formRegistro').css('display', 'none')
  $('#formLogin').css('display', 'block')
  $('.fireLogin').css('background', '#1AD245')
  $('.fireRegister').css('background', '#666')
})

$('.fireRegister').on('click', e => {
  e.preventDefault()
  $('#formLogin').css('display', 'none')
  $('#formRegistro').css('display', 'block')
  $('.fireLogin').css('background', '#666')
  $('.fireRegister').css('background', '#1AD245')
})
