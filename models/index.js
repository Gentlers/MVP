var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  username: String,
  password: String,
  edad: Number,
  email: String,
  celular: Number,
  estilo: Array,
  tallas: Array,
  entalle: Array
  // medidas: Array
})
mongoose.model('user', UserSchema)
var User = mongoose.model('user')

var MarcaSchema = new Schema({
  nombre: String,
  descripcion: String,
  estilo: Array,
  tipos: Array
})
mongoose.model('marca', MarcaSchema)
var Marca = mongoose.model('marca')

var PrendaSchema = new Schema({
  nombre: String,
  colores: Array,
  tipo: String,
  descripcion: String,
  precio: Number,
  pventa: Number,
  estilo: Array,
  medidas: Array,
  entalle: String,
  tallas: Array,
  marca: {
    type: Schema.ObjectId,
    ref: 'marca'
  },
  mainImg: String,
  secondaryImg: Array
})
mongoose.model('prenda', PrendaSchema)
var Prenda = mongoose.model('prenda')

var VentaSchema = new Schema({
  comentario: String,
  puntaje: Number,
  user: {
    type: Schema.ObjectId,
    ref: 'user'
  },
  prenda: {
    type: Schema.ObjectId,
    ref: 'prenda'
  }
})
mongoose.model('venta', VentaSchema)
var Venta = mongoose.model('venta')

module.exports.User = User
module.exports.Marca = Marca
module.exports.Prenda = Prenda
module.exports.Venta = Venta
