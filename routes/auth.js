// Dependencias
var express = require('express')

// Modelos
var User = require('../models').User

// Middlewares
var noSessionMiddleware = require('../middlewares/no-session')
var sessionMiddleware = require('../middlewares/session')

// Utils
var createUserPartial = require('../utils/createUser').partial
var updateUser = require('../utils/createUser').update

router.get('/', noSessionMiddleware, (req, res, next) => {
  res.render('login', { title: 'Login' })
})

var router = express.Router()

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

// Ruta de Cierre de Sesion
router.post('/logout', (req, res, next) => {
  req.session = null
  res.redirect('/')
})

// Registro de Nuevo Usuario
router.post('/register', (req, res, next) => {
  // Validacion
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).send(err)
    if (user) {
      return res.send('El usuario ya existe')
    } else {
      var newUser = createUserPartial(req)
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

// Actualizacion de Usuario
router.post('/update', sessionMiddleware, (req, res) => {
  User.findById(req.session.user_id, (err, user) => {
    if (err) return res.status(500).send(err)
    user = updateUser(user, req)
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

module.exports = router
