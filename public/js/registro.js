$(document).ready(function() {
   $('select').material_select();
   $('.carousel.carousel-slider').carousel({full_width: true, height:500});
   Materialize.updateTextFields();
   
   //SCRIPT FOR THE NAVBAR
   var sizeWidth = $(window).width();
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
