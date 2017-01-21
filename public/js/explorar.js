$(document).ready(function(){
  $(".button-collapse").sideNav();
  $('.slider').slider({full_width: true, height:500, indicators:false});
  $('.parallax').parallax();
  $('.scrollspy').scrollSpy();
  $('.carousel.carousel-slider').carousel({full_width: true});
  $('.carousel-sell').carousel();
  $("#content-slider").lightSlider({
    auto: true,
    item: 3,
    loop: true,
    controls: true,
    speed: 600,
    pause: 3000,
    keyPress: true,
    mode: 'slide',
    responsive: [{
      breakpoint: 992,
      settings: {
        item: 2,
        slideMove: 1,
        slideMargin: 6,
      }
    }, {
      breakpoint: 600,
      settings: {
        item: 1,
        slideMove: 1
      }
    }]
  });
  $(".lSPrev").html("<i>chevron_left</i>");
  $(".lSNext").html("<i>chevron_right</i>");
  $(".lSPrev i:first").addClass("medium material-icons hide-on-small-only");
  $(".lSNext i:first").addClass("medium material-icons hide-on-small-only");

  //SCRIPT DE NAVBAR
  var sizeWidth = $(document).height();
  $(".button-collapse").sideNav({menuWidth: sizeWidth, draggable: false});

  $(function() {
    // grab an element
    var header = document.getElementById('header-web-gento');
    // construct an instance of Headroom, passing the element
    var headroom  = new Headroom(header,{
      "offset": 260,
      "tolerance": 5,
      "classes": {
        "initial": "animated",
        "pinned": "slideDown",
        "unpinned": "slideUp"
      }

    });
    // initialise
    headroom.init();
  });
  $(function(){
    // jQuery methods go here...
    var btnMenu = $('.button-collapse.icono-button'),
    iconMenu = $('.material-icons.icono');

    btnMenu.on('click', function (e) {
      if (iconMenu.text() === "menu") {
        $(iconMenu).text("close");
      }
      else{
        $(iconMenu).text("menu");
      }
    })
  });

});
