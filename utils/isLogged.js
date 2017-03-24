// Verificamos con un band si hay login
// Esto se puede manejar con boolean, o usando directamente el req.session
module.exports = (session) => {
  var band = {
    valor: 0
  }
  if (session.user_id != null) band.valor = 1
  return band
}
