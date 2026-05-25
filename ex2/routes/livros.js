const express = require('express')
const router = express.Router()
const livrosController = require('../controllers/livros')

router.get('/', livrosController.listar)
router.post('/', livrosController.inserir)
router.put('/:id', livrosController.alterarEstado)
router.delete('/:id', livrosController.remover)

module.exports = router
