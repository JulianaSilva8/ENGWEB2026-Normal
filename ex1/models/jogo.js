const mongoose = require('mongoose')

const entidadeSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    country: String,
    year: Number
  },
  {
    _id: false,
    strict: false
  }
)

const jogoSchema = new mongoose.Schema(
  {
    _id: String,
    name: { type: String, required: true },
    year: Number,
    category: String,
    minPlayers: Number,
    maxPlayers: Number,
    playingTimeMinutes: Number,
    descriptionEN: String,
    autores: [entidadeSchema],
    editoras: [entidadeSchema],
    mecanicas: [entidadeSchema],
    premios: [entidadeSchema]
  },
  {
    versionKey: false,
    strict: false
  }
)

module.exports = mongoose.model('Jogo', jogoSchema, 'jogos')
