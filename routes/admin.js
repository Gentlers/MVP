var express = require('express')
var User = require('../models').User
var Marca = require('../models').Marca
var Prenda = require('../models').Prenda

var router = express.Router()

var adminMiddleware = require('../middlewares/admin')

var logged = require('../utils/isLogged')
var createPrenda = require('../utils/createPrenda')
var createUserComplete = require('../utils/createUser').total

router.get('/registro', adminMiddleware, (req, res, next) => {
  res.render('registro', { title: 'Registro', bol: logged(req.session) })
})

router.post('/registro', (req, res, next) => {
  var newUser = createUserComplete(req)
  newUser.save((err, savedUser) => {
    if (err) return res.status(500).send(err)
    else {
      res.redirect('/perfil')
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
  var newPrenda = createPrenda(req)
  newPrenda.save((err, savedPrenda) => {
    if (err) return res.status(500).send(err)
    else {
      res.redirect('/explorar')
    }
  })
})

module.exports = router
