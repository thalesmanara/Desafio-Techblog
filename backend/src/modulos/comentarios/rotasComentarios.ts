import { Router } from 'express';
import { autenticarUsuario } from '../../middlewares/autenticarUsuario';
import { criar, listar, responder } from './controladorComentarios';

const rotasComentarios = Router();

// Comentários são privados (home privada)
rotasComentarios.get('/api/artigos/:artigoId/comentarios', autenticarUsuario, (req, res) => {
  listar(req, res);
});

rotasComentarios.post('/api/artigos/:artigoId/comentarios', autenticarUsuario, (req, res) => {
  criar(req, res);
});

// 1 nível de resposta
rotasComentarios.post('/api/artigos/:artigoId/comentarios/:comentarioId/respostas', autenticarUsuario, (req, res) => {
  responder(req, res);
});

export default rotasComentarios;
