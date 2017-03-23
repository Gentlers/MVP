var express = require('express')
var router = express.Router()
var User = require('../models').User
var Marca = require('../models').Marca
var Prenda = require('../models').Prenda
var Venta = require('../models').Venta

// Ruta para mostrar el Requirement obtenido
router.post('/test', (req, res) => {
  console.log(req.body)
  res.send(req.body)
})

// Usuarios
router.get('/users', (req, res, next) => {
  console.log('Hola mundo')
  User.find((err, users) => {
    if (err) return res.status(500).send(err)
    res.send(users)
  })
})

// GET Unitario
router.get('/user/:mail', (req, res, next) => {
  User.find({ email: req.params.mail }, (err, user) => {
    if (err) return res.status(500).send(err)
    res.send(user)
  })
})

// router.post('/user/', (req, res, next) => {
//  var newuser = new User()
//  newuser.username = req.body.username
//  newuser.password = req.body.password
//  newuser.edad = req.body.edad
//  newuser.email = req.body.email
//  newuser.celular = req.body.celular
//  newuser.estilo = req.body.estilo
//  newuser.tallas = req.body.tallas
//  newuser.entalle = req.body.entalle
//  newuser.save((err, savedUser) => {
//    if (err) {
//      console.log(err)
//      return res.status(500).send()
//    }
//    return res.status(200).send()
//  })
// })

// Marcas
router.get('/marcas', (req, res, next) => {
  Marca.find((err, marcas) => {
    if (err) return res.status(500).send(err)
    res.send(marcas)
  })
})

router.post('/marca/', (req, res, next) => {
  var newmarca = new Marca()
  newmarca.nombre = req.body.nombre
  newmarca.descripcion = req.body.descripcion
  newmarca.estilo = req.body.estilo
  newmarca.tipos = req.body.tipos
  newmarca.save((err, savedMarca) => {
    if (err) {
      console.log(err)
      return res.status(500).send()
    }
    return res.status(200).send()
  })
})

// Prendas
router.get('/prendas', (req, res, next) => {
  Prenda.find((err, prendas) => {
    if (err) return res.status(500).send(err)
    Marca.populate(prendas, { path: 'marca' }, (err, prendas) => {
      if (err) return res.status(500).send(err)
      res.send(prendas)
    })
  })
})

router.post('/prenda/', (req, res, next) => {
  var newprenda = new Prenda()
  newprenda.nombre = req.body.nombre
  newprenda.colores = req.body.colores
  newprenda.tipo = req.body.tipo
  newprenda.descripcion = req.body.descripcion
  newprenda.precio = req.body.precio
  newprenda.pventa = req.body.pventa
  newprenda.estilo = req.body.estilo
  newprenda.medidas = req.body.medidas
  newprenda.entalle = req.body.entalle
  newprenda.tallas = req.body.tallas
  newprenda.marca = req.body.marca
  newprenda.mainImg = req.body.mainImg
  newprenda.secondaryImg = req.body.secondaryImg
  newprenda.save((err, savedPrenda) => {
    if (err) {
      console.log(err)
      return res.status(500).send(err)
    }
    return res.status(200).send()
  })
})

// DELETE
router.delete('/prenda/:id', (req, res, next) => {
  Prenda.findById(req.params.id, (err, prend) => {
    if (err) return res.status(500).send(err)
    prend.remove((err) => {
      if (err) return res.send(500, err.message)
      res.json({ message: 'Successfully deleted' })
    })
  })
})

// Ventas
router.get('/ventas', (req, res, next) => {
  Venta.find((err, ventas) => {
    if (err) return res.status(500).send(err)
    User.populate(ventas, { path: 'user' }, (err, ventas) => {
      if (err) return res.status(500).send(err)
      Prenda.populate(ventas, { path: 'prenda' }, (err, ventas) => {
        if (err) return res.status(500).send(err)
        res.send(ventas)
      })
    })
  })
})

// router.post('/venta/', (req, res, next) => {
//  var newventa = new Venta()
//  newventa.comentario = req.body.comentario
//  newventa.puntaje = req.body.puntaje
//  newventa.user = req.body.user
//  newventa.prenda = req.body.prenda
//  newventa.save((err, savedVenta) => {
//    if (err) {
//      console.log(err)
//      return res.status(500).send()
//    }
//    return res.status(200).send()
//  })
// })

module.exports = router
