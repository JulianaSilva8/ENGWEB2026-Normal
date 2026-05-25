# ENGWEB2026-Normal
## Identificação

**Nome:** Juliana Sofia Vaz da Silva  
**Número de Aluno:** 105572  

---

## Persistência de Dados
A persistência é feita em MongoDB.

### EX 1

- Base de dados: `jogostabuleiro`
- Coleção: `jogos`
- Dataset: `dataset.json`

O ficheiro original `jogos.json` foi transformado para `dataset.json` pelo script `corrigir_dataset.py`.
Nesta transformação, o campo `id` de cada jogo foi convertido para `_id`, permitindo usar o identificador original do jogo como identificador principal do documento em MongoDB. Os campos também foram normalizados e é feita a verificação de que todos os ids são únicos.

A importação é feita automaticamente pelo serviço `mongo-seed` definido no `docker-compose.yml`.

### EX 2

- Base de dados: `leituras`
- Coleção: `livros`
- Dataset: `ex2/dataset/livros.json`

A importação é feita automaticamente pelo serviço `mongo_livros_seed` definido no `docker-compose.yml`.

## Queries do EX 1
As queries pedidas no enunciado estão também no ficheiro `ex1/queries.txt`

### 1. Quantos jogos estão registados na base de dados?
```
db.jogos.countDocuments()
```
### 2. Quantos jogos pertencem à categoria "Family"?
```
db.jogos.countDocuments({ category: "Family" })
```
### 3. Qual a lista de autores (ordenada alfabeticamente e sem repetições)?
```
db.jogos.distinct("autores.name").sort()
```
### 4. Qual a distribuição de jogos por ano de lançamento (quantos jogos foram lançados em cada ano)?
```
db.jogos.aggregate([
  { $group: { _id: "$year", total: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])
```
### 5. Qual a distribuição de jogos por editora (quantos jogos cada editora tem registados)?
```
db.jogos.aggregate([
  { $unwind: "$editoras" },
  { $group: { _id: "$editoras.name", total: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])
```

## Como executar
Para executar todos os serviços, correr na raiz do projeto:

```bash
docker compose up --build
```

Para parar os serviços:

```bash
docker compose down
```

## EX 1
### API
A API do exercício 1 fica disponível na porta `17000`.

```
http://localhost:17000
```

Rotas disponíveis:

```
GET    /jogos
GET    /jogos/:id
GET    /jogos?editora=EEEE
GET    /autores
GET    /categorias
POST   /jogos
PUT    /jogos/:id
DELETE /jogos/:id
```

### Swagger
A documentação Swagger está disponível em:

```
http://localhost:17000/api-docs
```

## EX 2
### API
A API do exercício 2 fica disponível na porta `19020`.

```
http://localhost:19020/api/livros
```

Rotas disponíveis:

```
GET    /api/livros
GET    /api/livros?search=X
POST   /api/livros
PUT    /api/livros/:id
DELETE /api/livros/:id
```

### Interface Web
A interface `index.html` fica disponível na porta `19021`.

```
http://localhost:19021
```

A interface comunica com a API através de:

```
http://localhost:19020/api/livros
```