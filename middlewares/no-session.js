var User = require('../models').User
module.exports = (req, res, next) => {
  if (!req.session.user_id) {
    next()
  } else {
    User.findById(req.session.user_id, (err, user) => {
      if (err) {
        console.log(err)
        res.redirect('/login')
      } else {
        res.locals = { user: user }
        res.redirect('/perfil')
      }
    })
  }
}
