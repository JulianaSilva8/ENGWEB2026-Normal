var express = require('express')
var router = express.Router()
var Jogos = require('../controllers/jogos')

// GET /jogos
// GET /jogos?editora=EEEE
router.get('/jogos', function(req, res, next) {
  const { editora } = req.query

  if (editora) {
    Jogos.getByEditora(editora)
      .then(data => res.status(200).jsonp(data))
      .catch(error => res.status(500).jsonp(error))
  } else {
    Jogos.getAll()
      .then(data => res.status(200).jsonp(data))
      .catch(error => res.status(500).jsonp(error))
  }
})

// GET /jogos/:id
router.get('/jogos/:id', function(req, res, next) {
  Jogos.getById(req.params.id)
    .then(data => {
      if (data) {
        res.status(200).jsonp(data)
      } else {
        res.status(404).jsonp({ error: 'Jogo não encontrado' })
      }
    })
    .catch(error => res.status(500).jsonp(error))
})

// GET /autores
router.get('/autores', function(req, res, next) {
  Jogos.getAutores()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
})

// GET /categorias
router.get('/categorias', function(req, res, next) {
  Jogos.getCategorias()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
})

// POST /jogos
router.post('/jogos', function(req, res, next) {
  Jogos.insert(req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(error => res.status(500).jsonp(error))
})

// PUT /jogos/:id
router.put('/jogos/:id', function(req, res, next) {
  Jogos.update(req.params.id, req.body)
    .then(data => {
      if (data) {
        res.status(200).jsonp(data)
      } else {
        res.status(404).jsonp({ error: 'Jogo não encontrado para atualização' })
      }
    })
    .catch(error => res.status(500).jsonp(error))
})
// DELETE /jogos/:id
router.delete('/jogos/:id', function(req, res, next) {
  Jogos.delete(req.params.id)
    .then(data => {
      if (data) {
        res.status(200).jsonp(data)
      } else {
        res.status(404).jsonp({ error: 'Jogo não encontrado para remoção' })
      }
    })
    .catch(error => res.status(500).jsonp(error))
})

module.exports = router
