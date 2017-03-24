var User = require('../models').User

module.exports.total = (req) => {
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
  return newUser
}

module.exports.partial = (req) => {
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
  return newUser
}

module.exports.update = (user, req) => {
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
  return user
}
