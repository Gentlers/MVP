var Prenda = require('../models').Prenda

module.exports = (req) => {
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
  return newPrenda
}
