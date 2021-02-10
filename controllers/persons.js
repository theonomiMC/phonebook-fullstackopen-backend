const personsRouter = require('express').Router()
const Person = require('../models/person')

//----GET All Persons ---
personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
//---Get Info about Persons ---
personsRouter.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        ${new Date()}
      `)
  })
})
//---GET person by ID ----

personsRouter.get('/:id', (request, response) => {
  Person.findById(request.params.id, (err, data) => {
    if (err) {
      console.log(err)
      response.status(404).end()
    } else {
      response.json(data)
    }
  })
})


//----POST = create new person -----
personsRouter.post('/', (request, response, next) => {
  const body = request.body

  if (body.name===undefined || body.number===undefined) {
    return response.status(400).json({ error: 'Missing name and/or number!' })
  }
  new Person({
    name: body.name,
    number: body.number
  })
    .save()
    .then(savedPerson => response
      .status(201)
      .json(savedPerson))
    .catch(error => next(error))
})
//---MODIFY existing Person----
personsRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
//----DELETE person----
personsRouter.delete('/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result =>  res.status(204).end())
    .catch(error => next(error))
})

module.exports = personsRouter