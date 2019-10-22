const express = require('express');
const cron = require("node-cron");
const cors = require('cors');

const routes = require('./routes');
const DfePortalController = require('./controllers/DfePortalController');
const NfeFazendaController = require('./controllers/NfeFazendaController');
const EmailController = require('./controllers/EmailController');

const server = express();
const port = process.env.PORT || 3333;

// var http = require('http');
// http.createServer(function(req, res) {
//     res.writeHead(200, {
//         'Content-Type': 'text/plain'
//     });
//     res.end('Hello, world!');
// }).listen(process.env.PORT);

cron.schedule("*/1 * * * *", async () => { // */1 para n iniciar junto com projeto, somente no minuto 1
    console.log("Buscando artigos ...");
    DfePortalController.search();
    NfeFazendaController.search();
    EmailController.sendAlerts();
});


server.use(cors()); // permite recebimento de requisições
server.use(express.json()); // altera padrão de dados
server.use(routes); // adiciona modulo de rotas

server.listen(port); // adiciona porta de acesso http://localhost:3333