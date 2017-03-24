// Modelos
var Prenda = require('../models').Prenda
var Marca = require('../models').Marca
var User = require('../models').User

// Dependencias
var nodemailer = require('nodemailer')
var requestify = require('requestify')
var express = require('express')

// Middlewares
var noSessionMiddleware = require('../middlewares/no-session')
var sessionMiddleware = require('../middlewares/session')

// Router
var router = express.Router()

var logged = require('../utils/isLogged')
var mailVenta = require('../utils/sendMail').venta
var mailPre = require('../utils/sendMail').pre
var gmailKey = require('../utils/keys').gmail

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

router.get('/perfil', sessionMiddleware, (req, res, next) => {
  res.render('perfil', { title: 'Dashboard', bol: logged(req.session) })
})

// Ruta para el Pre-Registro en la vista de /pronto
router.post('/pre', (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: gmailKey.mail,
      pass: gmailKey.password
    }
  })
  var mailOptions = mailPre(req)
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).send(error)
    else {
      res.status(200).jsonp(req.body)
    }
  })
})
// Ruta para el envio de mail para cada venta
router.post('/venta', (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: gmailKey.mail,
      pass: gmailKey.password
    }
  })
  var mailOptions = mailVenta(req)
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return res.status(500).send(err)
    else {
      console.log('Correo enviado papu')
      res.status(200).jsonp(req.body)
    }
  })
})

module.exports = router
