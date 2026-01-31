import { Router } from 'express';
import { login } from './controladorAutenticacao';

const rotasAutenticacao = Router();

rotasAutenticacao.post('/login', (req, res) => {
  login(req, res);
});

export default rotasAutenticacao;
