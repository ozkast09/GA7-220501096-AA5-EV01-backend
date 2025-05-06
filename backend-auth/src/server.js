const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
console.log('Valor de process.env.PORT:', process.env.PORT); // Agrega esta línea
const authRoutes = require('./routes/authRoutes');
const dbPromise = require('./db');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000', methods: ['POST'] }));
app.use('/', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor!');
});

dbPromise.then(() => {
  app.listen(port, () => {
    console.log(`servidor backend escuchado en http://localhost:${port}`);
  });
}).catch((error) => {
  console.error('NO se pudo iniciar el servidor debido a un error en la conexion a la base de datos:', error);
});