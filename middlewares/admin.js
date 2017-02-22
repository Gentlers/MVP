var User = require('../models').User
module.exports = function (req, res, next) {
  if (!req.session.user_id) {
    res.redirect('/login')
  }
  else {
    User.findById(req.session.user_id, function(err, user) {
      if (err) {
        console.log(err)
        res.redirect('/login')
      }
      else if(user.email == "admin@gento.pe"){
        res.locals = { user: user }
        next()
      }
      else{
        res.redirect('/')
      }
    })
  }
}