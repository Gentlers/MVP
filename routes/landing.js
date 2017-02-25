var nodemailer = require('nodemailer');
var requestify = require('requestify');
var request = require('request');
var express = require('express');
var router = express.Router();
var Venta = require('../models').Venta
var Prenda = require('../models').Prenda
var Marca = require('../models').Marca
var User = require('../models').User
var no_session_middleware = require('../middlewares/no-session')
var session_middleware = require('../middlewares/session')
var admin_middleware = require('../middlewares/admin')

router.get('/', function(req, res, next) {
  var band = {
    valor: 0
  }
  if(req.session.user_id != null) band.valor = 1
  res.render('index', { title: "Inicio", bol: band });
});
router.get('/ganadores', function(req, res) {
  res.render('ganadores', { title: "Ganadores del Sorteo" })
})
router.get('/pronto', no_session_middleware, function(req, res, next) {
  var band = {
    valor: 0
  }
  if(req.session.user_id != null) band.valor = 1
  res.render('pronto', { title: 'GENTO Muy Pronto', bol: band })
})

router.get('/gracias', no_session_middleware, function(req, res) {
  var band = {
    valor: 0
  }
  if(req.session.user_id != null) band.valor = 1
  res.render('gracias', { bol: band })
})

router.get('/registro', no_session_middleware, function(req, res) {
  res.redirect('/pronto')
})
router.get('/explorar', session_middleware, function(req, res, next) {
  var band = {
    valor: 0
  }
  if(req.session.user_id != null) band.valor = 1
    
  if(!req.session.user_id){
    res.render('explorar-no-session', { bol: band })
  }
  else {
    
    User.findOne({ _id: req.session.user_id }, function(err, user) {
      var url = 'https://fierce-atoll-99852.herokuapp.com/api_clothes/?style=['
      var style = user.estilo
      url = url + style + ']'
      requestify.get(url).then(function(response) {
        console.log(response.getBody());
        var recos = []
        recos = recos.concat(response.getBody().pantalon)
        recos = recos.concat(response.getBody().casaca)
        recos = recos.concat(response.getBody().polo)
        recos = recos.concat(response.getBody().camisa)
        console.log(recos)
        var resultados = []
        for (var i = 0 ; i < recos.length; i++) {
          console.log('ID '+i+': ' + recos[i])
          if(i!=recos.length -1){
            Prenda.findOne({ _id: recos[i] }, function(err, prendas) {
              Marca.populate(prendas, {path: "marca"}, function(err, prendas){
                resultados = resultados.concat(prendas)
                console.log(resultados)
                })
            })  
          }
          else{
            Prenda.findOne({ _id: recos[i] }, function(err, prendas) {
              Marca.populate(prendas, {path: "marca"}, function(err, prendas){
                resultados = resultados.concat(prendas)
                res.render('explorar-session', {data:resultados,bol:band})
                console.log(resultados)
                })
            })
          }
        }
        
      });
    })
    
  }
});

router.get('/comprar/:id', session_middleware, function(req, res) {
  var band = {
    valor: 0
  }
  if(req.session.user_id != null) band.valor = 1
  Prenda.find({_id: req.params.id}, function(err, prenda) {
    Marca.populate(prenda, {path: "marca"}, function(err, prenda){
      Prenda.find(function(err, todasprendas) {
        res.render('comprar', { data: prenda, bol: band, otros: todasprendas })  
      })
    })
  })
  // Prenda.find({_id: req.params.id}, function(err, prenda) {
  //   Prenda.find(function(err, todasprendas) {
  //     res.render('comprar', { data: prenda, bol: band, otros: todasprendas })  
  //   })
    
  // })
})

router.get('/v-registro', admin_middleware, function(req, res, next) {
  var band = {
    valor: 0
  }
  if(req.session.user_id != null) band.valor = 1
  res.render('registro', { title: 'Registro', bol: band });
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

router.post('/update', session_middleware, function(req, res) {
  User.findOne({_id: req.session.user_id}, function(err, newUser) {
    newUser.tallas = []
    newUser.tallas.push(req.body.talla_camisa)
    newUser.tallas.push(req.body.talla_polo)
    newUser.tallas.push(Number(req.body.talla_pantalon))
    newUser.tallas.push(Number(req.body.talla_zapato))
    newUser.estilo = []
    newUser.estilo.push(Number(req.body.estilo_formal))
    newUser.estilo.push(Number(req.body.estilo_urbano))
    newUser.estilo.push(Number(req.body.estilo_casual))
    newUser.estilo.push(Number(req.body.estilo_hipster))
    newUser.estilo.push(Number(req.body.estilo_tendencia))

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
        res.redirect('/explorar')
      }
    })
  })
})

router.get('/perfil', session_middleware, function(req, res, next) {
  var band = {
    valor: 0
  }
  if(req.session.user_id != null) band.valor = 1
  res.render('perfil', { title: 'Dashboard', bol: band })
})

router.get('/login', no_session_middleware, function(req, res, next) {
  res.render('login', { title: 'Login' })
})

router.post('/logout', function(req, res, next) {
  req.session = null
  res.redirect('/')
})

router.post('/session', function(req, res) {
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

router.post('/pre', function(req, res) {
  console.log(req)
  var mensaje = "Usuario: " + req.body.nombre + "\nTelefono: " + req.body.telefono + "\nEmail: " + req.body.email
  console.log(mensaje)
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
       user: 'gentoapp@gmail.com',
       pass: 'gentoapp!'
    }
  })
  var mailOptions = {
    from: 'GENTO',
    to: 'hola@gento.pe',
    subject: 'Pre-registro',
    text: mensaje
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error){
      console.log(error);
      res.send(500, err.message);
    } else {
      console.log("Correo enviado papu");
      res.status(200).jsonp(req.body);
    }
  });
})

router.post('/venta', function(req, res) {
  console.log(req)
  var mensaje = "Cliente: " + req.body.cliente + "\nCorreo: " + req.body.correo + "\nTelefono: "+req.body.phone + "\nPrenda: " + req.body.prenda + "\nMarca: " + req.body.marca + "\nPrecio Venta:" + req.body.pv + "\nPrecio Normal: " + req.body.pc + "\nEntrega: " + req.body.tipo_pedido
  console.log(mensaje)
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
       user: 'gentoapp@gmail.com',
       pass: 'gentoapp!'
    }
  })
  var mailOptions = {
    from: 'GENTO',
    to: 'hola@gento.pe',
    subject: 'Venta Realizada',
    text: mensaje
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error){
      console.log(error);
      res.send(500, err.message);
    } else {
      console.log("Correo enviado papu");
      res.status(200).jsonp(req.body);
    }
  });
})

router.post('/test', function(req, res) {
  console.log(req.body)
  res.send(req.body)
})

module.exports = router;


