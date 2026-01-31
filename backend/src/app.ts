import express from 'express';
import rotas from './rotas';

const app = express();

app.use((req, res, next) => {
  const origem = process.env.CORS_ORIGEM ?? 'http://localhost:5173';

  res.header('Access-Control-Allow-Origin', origem);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Para o browser liberar o preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());
app.use(rotas);

export default app;
