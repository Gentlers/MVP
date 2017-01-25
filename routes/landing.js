var request = require('request');
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
  if(!req.session.user_id){
    res.render('explorar-no-session')
  }
  else {
    // res.render('explorar-session')
     Venta.find(function(err, ventas) {
      User.populate(ventas,  {path: 'user' }, function(err, ventas) {
        Prenda.populate(ventas, {path:'prenda'}, function(err, ventas) {
          res.render('explorar-session', { data: ventas })
        })
      })
    })
  }
});

router.get('/registro', no_session_middleware, function(req, res, next) {
  res.render('registro', { title: 'Registro' });
});

router.get('/consumo', function(req, res) {
  request({
      uri: 'https://ancient-hamlet-38493.herokuapp.com/users'
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(body);
        res.render('explorar-session', { prendas: body })
      } else {
        res.json(error);
      }
    })
  });

router.post('/registro', function(req, res, next) {
  var newUser = new User();
  newUser.username = req.body.nombre
  newUser.password = req.body.password
  newUser.edad = Number(req.body.edad)
  newUser.email = req.body.email
  newUser.password = req.body.password
  newUser.celular = Number(req.body.phone)
  newUser.estilo = []
  newUser.estilo.push(Number(req.body.estilo_formal))
  newUser.estilo.push(Number(req.body.estilo_urbano))
  newUser.estilo.push(Number(req.body.estilo_casual))
  newUser.estilo.push(Number(req.body.estilo_hipster))
  newUser.estilo.push(Number(req.body.estilo_tendencia))
  newUser.tallas = []
  newUser.tallas.push(req.body.talla_camisa)
  newUser.tallas.push(req.body.talla_polo)
  newUser.tallas.push(Number(req.body.talla_pantalon))
  newUser.tallas.push(Number(req.body.talla_zapato))
  newUser.entalle = []
  newUser.entalle.push(req.body.entalle_camisa)
  newUser.entalle.push(req.body.entalle_polo)
  newUser.entalle.push(req.body.entalle_pantalon)
  console.log(newUser)
  newUser.save(function(err, savedUser) {
    if(err) {
      console.log(err)
      return res.status(500).send()
    }
    else{
      req.session.user_id = savedUser._id
      res.redirect('/perfil')
    }
  })
  
})

router.get('/perfil', session_middleware, function(req, res, next) {
  res.render('perfil', { title: 'Dashboard'})
})

router.get('/login', no_session_middleware, function(req, res, next) {
  res.render('login', { title: 'Login' })
})

router.post('/logout', function(req, res, next) {
  req.session = null
  res.redirect('/')
})

router.post('/session', function(req, res) {
  // Puede ponerse un segundo parametro que son los campos que quieren ser devueltos.
  User.findOne({ email: req.body.email, password: req.body.password }, "", function(err, user) {
    if(err) {
      res.send(err)
    }
    else if(user!=null) {

      req.session.user_id = user._id
      res.redirect('/perfil')
    }
    else {
      res.send('Ingresa un usuario valido')
    }
  })
})

router.post('/validateEmail', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if(err)
      res.send(err)
    else if(user == null)
      res.send('OK')
    else
      res.send('El usuario ya existe')
  })
})

module.exports = router;
