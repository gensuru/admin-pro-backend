const express = require('express');
require('dotenv').config();

const cors = require('cors')

const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Configurar Cors
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

console.log(process.env);

// Rutas
app.use('/api/usuarios', require('./routes/usuariosRoutes'));
app.use('/api/login', require('./routes/authRoutes'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});