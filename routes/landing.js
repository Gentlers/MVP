// Modelos
var Prenda = require('../models').Prenda
var Marca = require('../models').Marca
var User = require('../models').User
// Dependencias
var nodemailer = require('nodemailer')
var requestify = require('requestify')
//Middlewares
var no_session_middleware = require('../middlewares/no-session')
var session_middleware = require('../middlewares/session')
var admin_middleware = require('../middlewares/admin')
//Express
var express = require('express')
var router = express.Router()

// Utilitarios
var logged = function(session) {
  var band = {
    valor: 0
  }
  if(session.user_id != null) band.valor = 1
  return band
}

router.get('/', function(req, res, next) {
  res.render('index', { title: "Inicio", bol: logged(req.session) })
})

router.get('/registro', no_session_middleware, function(req, res) {
  res.redirect('/pronto')
})

router.get('/pronto', no_session_middleware, function(req, res, next) {  
  res.render('pronto', { title: 'GENTO Muy Pronto', bol: logged(req.session) })
})

router.get('/ganadores', function(req, res) {
  res.render('ganadores', { title: "Ganadores del Sorteo" })
})

router.get('/explorar', session_middleware, function(req, res, next) {    
  User.findOne({ _id: req.session.user_id }, function(err, user) {
    var style = user.estilo
    var url = 'https://fierce-atoll-99852.herokuapp.com/api_clothes/?style=[' + style + ']'
    requestify.get(url).then(function(response) {
      // Creación del JSON de IDs en bruto a partir del response del API en categorias
      var recos = []
      recos = recos.concat(response.getBody().pantalon)
      recos = recos.concat(response.getBody().casaca)
      recos = recos.concat(response.getBody().polo)
      recos = recos.concat(response.getBody().camisa)
      // Creacion del JSON de prendas completo buscando por IDs
      var resultados = []
      if(recos.length==0) res.render('explorar-session', {data:resultados, bol: logged(req.session) })
      else {
        for (var i = 0 ; i < recos.length; i++) {
          // Logica cuando estamos recorriendo todos menos el ultimo
          if(i!=recos.length -1){
            Prenda.findOne({ _id: recos[i] }, function(err, prendas) {
              Marca.populate(prendas, {path: "marca"}, function(err, prendas){
                resultados = resultados.concat(prendas)
                })
            })  
          }
          // Logica para la ultima prenda, por asincronía se usa esta forma
          else {
            Prenda.findOne({ _id: recos[i] }, function(err, prendas) {
              Marca.populate(prendas, {path: "marca"}, function(err, prendas){
                resultados = resultados.concat(prendas)
                res.render('explorar-session', {data:resultados, bol: logged(req.session) })
              })
            })
          }
        }
      }
    })
  })
})

router.get('/comprar/:id', session_middleware, function(req, res) {
  Prenda.find({_id: req.params.id}, function(err, prenda) {
    Marca.populate(prenda, {path: "marca"}, function(err, prenda){
      Prenda.find(function(err, todasprendas) {
        res.render('comprar', { data: prenda, bol: logged(req.session), otros: todasprendas })  
      })
    })
  })
})

router.get('/v-registro', admin_middleware, function(req, res, next) {
  res.render('registro', { title: 'Registro', bol: logged(req.session) })
})

// Registro de Nuevo Usuario
router.post('/registro', function(req, res, next) {
  var newUser = new User()
  newUser.username = req.body.nombre
  newUser.password = req.body.password
  newUser.edad = Number(req.body.edad)
  newUser.email = req.body.email
  newUser.password = req.body.password
  newUser.celular = Number(req.body.phone)
  newUser.estilo = [
    Number(req.body.estilo_formal), 
    Number(req.body.estilo_urbano), 
    Number(req.body.estilo_casual), 
    Number(req.body.estilo_hipster), 
    Number(req.body.estilo_tendencia)
  ]
  newUser.tallas = [
    req.body.talla_camisa, 
    req.body.talla_polo, 
    Number(req.body.talla_pantalon), 
    Number(req.body.talla_zapato)
  ]
  newUser.entalle = [
    req.body.entalle_camisa, 
    req.body.entalle_polo, 
    req.body.entalle_pantalon
  ]
  newUser.save(function(err, savedUser) {
    if(err) {
      console.log(err)
      return res.status(500).send()
    }
    else{
      res.redirect('/perfil')
    }
  })
})

// Actualizacion de Usuario
router.post('/update', session_middleware, function(req, res) {
  User.findById(req.session.user_id, function(err, user) {
    user.tallas = [
      req.body.talla_camisa,
      req.body.talla_polo,
      Number(req.body.talla_pantalon),
      Number(req.body.talla_zapato)
      ]
    user.estilo = [
      Number(req.body.estilo_formal),
      Number(req.body.estilo_urbano),
      Number(req.body.estilo_casual),
      Number(req.body.estilo_hipster),
      Number(req.body.estilo_tendencia)
    ]
    user.entalle = [
      req.body.entalle_camisa,
      req.body.entalle_polo,
      req.body.entalle_pantalon
    ]
    user.save(function(err, savedUser) {
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
  res.render('perfil', { title: 'Dashboard', bol: logged(req.session) })
})

router.get('/login', no_session_middleware, function(req, res, next) {
  res.render('login', { title: 'Login' })
})

router.post('/logout', function(req, res, next) {
  req.session = null
  res.redirect('/')
})

// Ruta para la creacion de la Cookie Session
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

// Ruta para el Pre-Registro en la vista de /pronto
router.post('/pre', function(req, res) {
  var mensaje = "Usuario: " + req.body.nombre + "\nTelefono: " + req.body.telefono + "\nEmail: " + req.body.email
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
  }
  transporter.sendMail(mailOptions, function(error, info){
    if (error){
      console.log(error)
      res.send(500, err.message)
    } else {
      res.status(200).jsonp(req.body)
    }
  })
})
 // Ruta para el envio de mail para cada venta
router.post('/venta', function(req, res) {
  var mensaje = "Cliente: " + req.body.cliente + "\nCorreo: " + req.body.correo + "\nTelefono: "+req.body.phone + "\nPrenda: " + req.body.prenda + "\nMarca: " + req.body.marca + "\nPrecio Venta:" + req.body.pv + "\nPrecio Normal: " + req.body.pc + "\nEntrega: " + req.body.tipo_pedido
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
  }
  transporter.sendMail(mailOptions, function(error, info){
    if (error){
      console.log(error)
      res.send(500, err.message)
    } else {
      console.log("Correo enviado papu")
      res.status(200).jsonp(req.body)
    }
  });
})

router.get('/prenda', admin_middleware, function(req, res) {
  Marca.find(function(err,marcas) {
    res.render('newPrenda', { data: marcas })
  })
})

router.post('/prenda', admin_middleware, function(req, res) {
  var newPrenda = new Prenda()
  newPrenda.nombre = req.body.nombre
  newPrenda.colores = [req.body.colores]
  newPrenda.tipo = req.body.tipo
  newPrenda.descripcion = req.body.descripcion
  newPrenda.precio = req.body.precio
  newPrenda.pventa = req.body.pventa
  newPrenda.estilo = [
    Number(req.body.estilo_formal), 
    Number(req.body.estilo_urbano), 
    Number(req.body.estilo_casual), 
    Number(req.body.estilo_hipster), 
    Number(req.body.estilo_tendencia)
  ]
  newPrenda.mainImg = req.body.mainImg
  newPrenda.secondaryImg = [
    req.body.secondaryImg1,
    req.body.secondaryImg2
  ]
  newPrenda.medidas = []
  newPrenda.entalle = req.body.entalle
  newPrenda.tallas = [
    req.body.talla_1,
    req.body.talla_2,
    req.body.talla_3,
    req.body.talla_4,
    req.body.talla_5
  ]
  newPrenda.marca = req.body.marca
  console.log('LO QUE LLEGO:')
  console.log(req.body)
  console.log('LO QUE VAMOS A GUARDAR:')
  console.log(newPrenda)
  newPrenda.save(function(err, savedPrenda) {
    if(err) {
      console.log(err)
      return res.status(500).send()
    }
    else{
      res.redirect('/explorar')
    }
  })
})

module.exports = router;