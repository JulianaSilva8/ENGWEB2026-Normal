const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

const livrosRouter = require('./routes/livros')

const app = express()

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/leituras'

mongoose.connect(mongoUri)
  .then(() => console.log('Ligação ao MongoDB estabelecida com sucesso.'))
  .catch(erro => console.error('Erro na ligação ao MongoDB:', erro))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/livros', livrosRouter)

app.get('/', (req, res) => {
  res.json({ mensagem: 'API da Lista de Leituras' })
})

app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    erro: err.message
  })
})

module.exports = app
