var express = require('express');
var router = express.Router();
var Venta = require('../models').Venta
var Prenda = require('../models').Prenda
var User = require('../models').User
var no_session_middleware = require('../middlewares/no-session')
var session_middleware = require('../middlewares/session')

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

router.get('/registro', no_session_middleware, function(req, res, next) {
  res.render('registro', { title: 'Registro' });
});

router.get('/app', session_middleware, function(req, res, next) {
  res.render('app', { title: 'Dashboard'})
})

router.get('/login', no_session_middleware, function(req, res, next) {
  res.render('login', { title: 'Login' })
})

// router.post('logout', no_session_middleware, function(req, res, next) {
//   req.session.user_id = null
//   res.redirect('/')
// })

router.post('/session', function(req, res) {
  // Puede ponerse un segundo parametro que son los campos que quieren ser devueltos.
  User.findOne({ email: req.body.email, password: req.body.password }, "", function(err, user) {
    if(err) {
      res.send(err)
    }
    else if(user!=null) {

      req.session.user_id = user._id
      res.redirect('/app')
    }
    else {
      res.send('Ingresa un usuario valido')
    }
  })
})

module.exports = router;
