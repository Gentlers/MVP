var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
   res.render('index', { title: "Inicio" });
});

router.get('/explorar', function(req, res, next) {
  res.render('explorar', { title: 'Selecciones' });
});

router.get('/registro', function(req, res, next) {
  res.render('registro', { title: 'Registro' });
});

module.exports = router;
