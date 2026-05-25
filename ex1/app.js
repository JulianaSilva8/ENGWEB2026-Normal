var express = require('express')
var mongoose = require('mongoose')
var morgan = require('morgan')
var cors = require('cors')
var swaggerUi = require('swagger-ui-express')

var indexRouter = require('./routes/index')
var swaggerDocument = require('./swagger.json')

var app = express()

var mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jogostabuleiro'

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Ligação ao MongoDB realizada com sucesso.')
  })
  .catch(error => {
    console.log('Erro na ligação ao MongoDB: ' + error)
  })

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/', indexRouter)

app.use(function(req, res, next) {
  res.status(404).jsonp({
    error: 'Rota não encontrada'
  })
})

module.exports = app
