$(document).ready(() => {
  $('.button-collapse').sideNav()
  $('.slider').slider({full_width: true, height: 500, indicators: false})
  $('.parallax').parallax()
  $('.scrollspy').scrollSpy()
  $('.carousel.carousel-slider').carousel({full_width: true})
  $('.carousel-sell').carousel()
  // SCRIPT FOR THE NAVBAR
  var sizeWidth = $(window).width()
  $('.button-collapse').sideNav({menuWidth: sizeWidth, draggable: false})
  $(() => {
    // grab an element
    var header = document.getElementById('header-web-gento')
    // construct an instance of Headroom, passing the element
    var headroom = new Headroom(header, {
      'offset': 260,
      'tolerance': 5,
      'classes': {
        'initial': 'animated',
        'pinned': 'slideDown',
        'unpinned': 'slideUp'
      }
    })
    headroom.init()
  })
  $(() => {
    // jQuery methods go here...
    var btnMenu = $('.button-collapse.icono-button')
    var iconMenu = $('.material-icons.icono')
    btnMenu.on('click', e => {
      if (iconMenu.text() === 'menu') {
        $(iconMenu).text('close')
      } else {
        $(iconMenu).text('menu')
      }
    })
  })
})
