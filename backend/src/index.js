const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes')
const cors = require('cors')
const http = require('http')
const { setupWebsocket } = require('./websocket')

const app = express();
const server = http.Server(app);

setupWebsocket(server)

mongoose.connect('mongodb+srv://eduardoffelipe:eduardo..@cluster0-kwg0k.mongodb.net/test?retryWrites=true&w=majority', {
useCreateIndex: true,  
useNewUrlParser: true,
  useUnifiedTopology: true,
})



app.use(cors())
app.use(express.json())
app.use(routes);

// Métodos HTTP: GET, POST, PUT, DELETE

//Tipos de parâmetros: 
//Query Params: req.query (Filtros, ordenação, paginação, ...) - GET
//Route Params:resquest.params (Identificar umn recurso na alteracao ou remocao)
//Body: request.body (Dados para a criação ou alteração de um registro)

// MongoDB (Não-relacional)



server.listen(3334);