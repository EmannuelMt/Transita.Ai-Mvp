// Separar criação do app (middlewares/rotas) em src/app.js para permitir testes
require('dotenv').config();

// inicializar firebase admin (opcionalmente logado dentro do módulo)
require('./config/firebase');

const { connectDB } = require('./config/database');
const app = require('./app');

// conectar ao MongoDB e iniciar servidor quando não em teste
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    }).catch(err => {
        console.error('Falha ao conectar ao MongoDB:', err.message);
        process.exit(1);
    });
}

module.exports = app;