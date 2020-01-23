const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes')

mongoose.connect('mongodb+srv://eduardoffelipe:eduardo..@cluster0-kwg0k.mongodb.net/test?retryWrites=true&w=majority', {
useCreateIndex: true,  
useNewUrlParser: true,
  useUnifiedTopology: true,
})

const app = express();

app.use(express.json())
app.use(routes);

// Métodos HTTP: GET, POST, PUT, DELETE

//Tipos de parâmetros: 
//Query Params: req.query (Filtros, ordenação, paginação, ...) - GET
//Route Params:resquest.params (Identificar umn recurso na alteracao ou remocao)
//Body: request.body (Dados para a criação ou alteração de um registro)

// MongoDB (Não-relacional)



app.listen(3334);