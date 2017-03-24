module.exports.venta = (req) => {
  var mensaje = 'Cliente: ' + req.body.cliente + '\nCorreo: ' + req.body.correo + '\nTelefono: ' + req.body.phone + '\nPrenda: ' + req.body.prenda + '\nMarca: ' + req.body.marca + '\nPrecio Venta:' + req.body.pv + '\nPrecio Normal: ' + req.body.pc + '\nEntrega: ' + req.body.entrega + '\nTallas: ' + req.body.tallas
  var mailOptions = {
    from: 'GENTO',
    to: 'hola@gento.pe',
    subject: 'Venta Realizada',
    text: mensaje
  }
  return mailOptions
}

module.exports.pre = (req) => {
  var mensaje = 'Usuario: ' + req.body.nombre + '\nTelefono: ' + req.body.telefono + '\nEmail: ' + req.body.email
  var mailOptions = {
    from: 'GENTO',
    to: 'hola@gento.pe',
    subject: 'Pre-registro',
    text: mensaje
  }
  return mailOptions
}
