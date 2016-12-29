var express = require('express');
var router = express.Router();
var Venta = require('../models').Venta
var Prenda = require('../models').Prenda
var User = require('../models').User

router.get('/', function(req, res, next) {
   res.render('index', { title: "Inicio" });
});

router.get('/explorar', function(req, res, next) {
  Venta.find(function(err, ventas) {
    User.populate(ventas,  {path: 'user' }, function(err, ventas) {
      Prenda.populate(ventas, {path:'prenda'}, function(err, ventas) {
        res.render('explorar', { title: 'Selecciones', sales: ventas})
      })
    })
  })
});

router.get('/registro', function(req, res, next) {
  res.render('registro', { title: 'Registro' });
});

module.exports = router;
