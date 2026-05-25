const Jogo = require('../models/jogo')

// GET /jogos
module.exports.getAll = () => {
  return Jogo
    .find({}, { _id: 1, name: 1, year: 1, category: 1, minPlayers: 1 })
    .sort({ name: 1 })
    .exec()
}

// GET /jogos?editora=EEEE
module.exports.getByEditora = editora => {
  return Jogo
    .find(
      {
        $or: [
          { 'editoras.name': editora },
          { 'editoras.id': editora }
        ]
      },
      { _id: 1, name: 1, year: 1 }
    )
    .sort({ name: 1 })
    .exec()
}

// GET /jogos/:id
module.exports.getById = id => {
  return Jogo
    .findById(id)
    .exec()
}

// GET /autores
module.exports.getAutores = () => {
  return Jogo.aggregate([
    { $unwind: '$autores' },
    {
      $group: {
        _id: '$autores.name',
        jogos: {
          $addToSet: {
            _id: '$_id',
            nome: '$name'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        nome: '$_id',
        jogos: 1
      }
    },
    { $sort: { nome: 1 } }
  ])
}

// GET /categorias
module.exports.getCategorias = () => {
  return Jogo.aggregate([
    {
      $group: {
        _id: '$category',
        jogos: {
          $addToSet: {
            _id: '$_id',
            nome: '$name'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        categoria: '$_id',
        jogos: 1
      }
    },
    { $sort: { categoria: 1 } }
  ])
}

// POST /jogos
module.exports.insert = jogo => {
  const novo = new Jogo(jogo)
  return novo.save()
}

// PUT /jogos/:id
module.exports.update = (id, jogo) => {
  delete jogo._id

  return Jogo
    .findByIdAndUpdate(
      id,
      jogo,
      {
        new: true,
        runValidators: true
      }
    )
    .exec()
}

// DELETE /jogos/:id
module.exports.delete = id => {
  return Jogo
    .findByIdAndDelete(id)
    .exec()
}
