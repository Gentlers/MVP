module.exports = (session) => {
  var band = {
    valor: 0
  }
  if (session.user_id != null) band.valor = 1
  return band
}
