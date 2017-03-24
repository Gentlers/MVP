// Dependencias
var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cookieSession = require('cookie-session')
var mongoose = require('mongoose')
var cors = require('cors')

// Routers
var app = express()
var landing = require('./routes/landing')
var api = require('./routes/api')
var auth = require('./routes/auth')
var admin = require('./routes/admin')

// Middlewares
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cookieSession({name: 'session', keys: ['llave-1', 'llave-2']}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

// Motor de Vistas
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// Rutas
app.use('/', landing)
app.use('/api', api)
app.use('/auth', auth)
app.use('/admin', admin)

// Manejador del 404 y render del error.jade
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Conexion a Mongo
mongoose.connect('mongodb://admin:admin@ds153677.mlab.com:53677/heroku_31qdstg5')
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

// Manejador en Entorno de Desarrollo
// will print stacktrace
if (app.get('env') === 'development') {
  console.log('Entorno de Desarrollo')
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// Manejador en Entorno de Produccion
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
