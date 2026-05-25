const Livro = require('../models/livro')

module.exports.listar = async (req, res) => {
  try {
    const search = req.query.search
    const filtro = {}

    if (search && search.trim() !== '') {
      filtro.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { autor: { $regex: search, $options: 'i' } }
      ]
    }

    const livros = await Livro.find(filtro).sort({ titulo: 1 })
    res.status(200).json(livros)
  } catch (erro) {
    res.status(500).json({ erro: erro.message })
  }
}

module.exports.inserir = async (req, res) => {
  try {
    const novoLivro = {
      titulo: req.body.titulo,
      autor: req.body.autor,
      paginas: req.body.paginas,
      genero: req.body.genero,
      lido: req.body.lido || false
    }

    const livro = await Livro.create(novoLivro)
    res.status(201).json(livro)
  } catch (erro) {
    res.status(400).json({ erro: erro.message })
  }
}

module.exports.alterarEstado = async (req, res) => {
  try {
    const livro = await Livro.findByIdAndUpdate(
      req.params.id,
      { lido: req.body.lido },
      { new: true, runValidators: true }
    )

    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado' })
    }

    res.status(200).json(livro)
  } catch (erro) {
    res.status(400).json({ erro: erro.message })
  }
}

module.exports.remover = async (req, res) => {
  try {
    const livro = await Livro.findByIdAndDelete(req.params.id)

    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado' })
    }

    res.status(200).json(livro)
  } catch (erro) {
    res.status(400).json({ erro: erro.message })
  }
}
