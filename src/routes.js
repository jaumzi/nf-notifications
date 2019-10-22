const express = require('express');
const UserController = require('./controllers/UserController');
const DfePortalController = require('./controllers/DfePortalController');
const NfeFazendaController = require('./controllers/NfeFazendaController');
const EmailController = require('./controllers/EmailController');

const routes = express.Router();

// rota raiz recebe todas as requisições
routes.get('/', (req, res) => {
    return res.json({});
});

routes.get('/user/list', UserController.list);
routes.post('/user/save', UserController.save);
routes.delete('/user/delete', UserController.delete);

routes.get('/alert/dfe-portal/force-update', DfePortalController.searchForce);
routes.get('/alert/nfe-fazenda/force-update', NfeFazendaController.searchForce);

routes.get('/alert/dfe-portal/list', DfePortalController.list);
routes.get('/alert/nfe-fazenda/list', NfeFazendaController.list);

routes.get('/send-mail', EmailController.sendEmailForce);


module.exports = routes; // exporta rotas