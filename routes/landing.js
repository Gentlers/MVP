// Modelos
var Prenda = require('../models').Prenda
var Marca = require('../models').Marca
var User = require('../models').User

// Dependencias
var nodemailer = require('nodemailer')
var requestify = require('requestify')

// Middlewares
var noSessionMiddleware = require('../middlewares/no-session')
var sessionMiddleware = require('../middlewares/session')
var adminMiddleware = require('../middlewares/admin')

// Express
var express = require('express')
var router = express.Router()

// Utilitarios
var logged = (session) => {
  var band = {
    valor: 0
  }
  if (session.user_id != null) band.valor = 1
  return band
}

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Inicio', bol: logged(req.session) })
})

router.get('/registro', noSessionMiddleware, (req, res) => {
  res.render('pronto', { title: 'Entrar en GENTO', bol: logged(req.session) })
})

router.get('/pronto', noSessionMiddleware, (req, res, next) => {
  res.redirect('/registro')
})

router.get('/ganadores', (req, res) => {
  res.render('ganadores', { title: 'Ganadores del Sorteo' })
})

router.get('/explorar', sessionMiddleware, (req, res, next) => {
  User.findOne({ _id: req.session.user_id }, (err, user) => {
    if (err) throw err
    var style = user.estilo
    var url = 'https://fierce-atoll-99852.herokuapp.com/api_clothes/?style=[' + style + ']&type=list'
    requestify.get(url).then((response) => {
      // Creación del JSON de IDs en bruto a partir del response del API en categorias
      var recos = []
      recos = recos.concat(response.getBody().clothes)
      // Creacion del JSON de prendas completo buscando por IDs
      var resultados = []
      if (recos.length === 0) {
        res.render('explorar-session', { data: resultados, bol: logged(req.session) })
      } else {
        console.log('Entramos porque length = ' + recos.length)
        for (var i = 0; i < recos.length; i++) {
          // Logica cuando estamos recorriendo todos menos el ultimo
          if (i !== recos.length - 1) {
            Prenda.findOne({ _id: recos[i] }, (err, prendas) => {
              if (err) return res.status(500).send(err)
              Marca.populate(prendas, {path: 'marca'}, (err, prendas) => {
                if (err) return res.status(500).send(err)
                resultados = resultados.concat(prendas)
              })
            })
          } else {
            // Logica para la ultima prenda, por asincronía se usa esta forma
            Prenda.findOne({ _id: recos[i] }, (err, prendas) => {
              if (err) return res.status(500).send(err)
              Marca.populate(prendas, {path: 'marca'}, (err, prendas) => {
                if (err) return res.status(500).send(err)
                resultados = resultados.concat(prendas)
                res.render('explorar-session', { data: resultados, bol: logged(req.session) })
              })
            })
          }
        }
      }
    })
  })
})

router.get('/comprar/:id', sessionMiddleware, (req, res) => {
  Prenda.find({_id: req.params.id}, (err, prenda) => {
    if (err) return res.status(500).send(err)
    Marca.populate(prenda, {path: 'marca'}, (err, prenda) => {
      if (err) return res.status(500).send(err)
      Prenda.find((err, todasprendas) => {
        if (err) return res.status(500).send(err)
        res.render('comprar', { data: prenda, bol: logged(req.session), otros: todasprendas })
      })
    })
  })
})

router.get('/v-registro', adminMiddleware, (req, res, next) => {
  res.render('registro', { title: 'Registro', bol: logged(req.session) })
})

// Registro de Nuevo Usuario
router.post('/register', (req, res, next) => {
  // Validacion
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).send(err)
    if (user) {
      return res.send('El usuario ya existe')
    } else {
      var newUser = new User()
      newUser.username = req.body.nombre
      newUser.password = req.body.password
      newUser.email = req.body.email
      newUser.celular = req.body.phone
      newUser.estilo = [
        Number(req.body.estilo_formal),
        Number(req.body.estilo_casual),
        Number(req.body.estilo_urbano),
        Number(req.body.estilo_hipster),
        Number(req.body.estilo_tendencia)
      ]
      newUser.tallas = []
      newUser.entalle = []
      newUser.save((err, savedUser) => {
        if (err) {
          console.log(err)
          return res.status(500).send()
        } else {
          req.session.user_id = savedUser._id
          res.redirect('/perfil')
        }
      })
    }
  })
})
router.post('/registro', (req, res, next) => {
  var newUser = new User()
  newUser.username = req.body.nombre
  newUser.password = req.body.password
  newUser.edad = Number(req.body.edad)
  newUser.email = req.body.email
  newUser.password = req.body.password
  newUser.celular = Number(req.body.phone)
  newUser.estilo = [
    Number(req.body.estilo_formal),
    Number(req.body.estilo_casual),
    Number(req.body.estilo_urbano),
    Number(req.body.estilo_hipster),
    Number(req.body.estilo_tendencia)
  ]
  newUser.tallas = [
    req.body.talla_camisa,
    Number(req.body.talla_pantalon),
    req.body.talla_polo,
    Number(req.body.talla_zapato)
  ]
  newUser.entalle = [
    req.body.entalle_camisa,
    req.body.entalle_pantalon,
    req.body.entalle_polo
  ]
  newUser.save((err, savedUser) => {
    if (err) return res.status(500).send(err)
    else {
      res.redirect('/perfil')
    }
  })
})

// Actualizacion de Usuario
router.post('/update', sessionMiddleware, (req, res) => {
  User.findById(req.session.user_id, (err, user) => {
    if (err) return res.status(500).send(err)
    user.tallas = [
      req.body.talla_camisa,
      Number(req.body.talla_pantalon),
      req.body.talla_polo,
      Number(req.body.talla_zapato)
    ]
    user.estilo = [
      Number(req.body.estilo_formal),
      Number(req.body.estilo_casual),
      Number(req.body.estilo_urbano),
      Number(req.body.estilo_hipster),
      Number(req.body.estilo_tendencia)
    ]
    user.entalle = [
      req.body.entalle_camisa,
      req.body.entalle_pantalon,
      req.body.entalle_polo
    ]
    user.save((err, savedUser) => {
      if (err) {
        console.log(err)
        return res.status(500).send()
      } else {
        req.session.user_id = savedUser._id
        res.redirect('/explorar')
      }
    })
  })
})

router.get('/perfil', sessionMiddleware, (req, res, next) => {
  res.render('perfil', { title: 'Dashboard', bol: logged(req.session) })
})

router.get('/login', noSessionMiddleware, (req, res, next) => {
  res.render('login', { title: 'Login' })
})

router.post('/logout', (req, res, next) => {
  req.session = null
  res.redirect('/')
})

// Ruta para la creacion de la Cookie Session
router.post('/session', (req, res) => {
  User.findOne({ email: req.body.email, password: req.body.password }, '', (err, user) => {
    if (err) return res.status(500).send(err)
    else if (user != null) {
      req.session.user_id = user._id
      res.redirect('/perfil')
    } else {
      res.send('Ingresa un usuario valido')
    }
  })
})

// Ruta para el Pre-Registro en la vista de /pronto
router.post('/pre', (req, res) => {
  var mensaje = 'Usuario: ' + req.body.nombre + '\nTelefono: ' + req.body.telefono + '\nEmail: ' + req.body.email
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
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).send(error)
    else {
      res.status(200).jsonp(req.body)
    }
  })
})
 // Ruta para el envio de mail para cada venta
router.post('/venta', (req, res) => {
  var mensaje = 'Cliente: ' + req.body.cliente + '\nCorreo: ' + req.body.correo + '\nTelefono: ' + req.body.phone + '\nPrenda: ' + req.body.prenda + '\nMarca: ' + req.body.marca + '\nPrecio Venta:' + req.body.pventa + '\nPrecio Normal: ' + req.body.precio + '\nEntrega: ' + req.body.tipo_pedido + '\nTallas: ' + req.body.tallas
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
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return res.status(500).send(err)
    else {
      console.log('Correo enviado papu')
      res.status(200).jsonp(req.body)
    }
  })
})

router.get('/prenda', adminMiddleware, (req, res) => {
  Marca.find((err, marcas) => {
    if (err) return res.status(500).send(err)
    res.render('newPrenda', { data: marcas })
  })
})

router.post('/prenda', adminMiddleware, (req, res) => {
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
  newPrenda.save((err, savedPrenda) => {
    if (err) return res.status(500).send(err)
    else {
      res.redirect('/explorar')
    }
  })
})

module.exports = router
