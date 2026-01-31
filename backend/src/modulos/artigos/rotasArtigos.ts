import { Router } from 'express';
import { autenticarUsuario } from '../../middlewares/autenticarUsuario';
import { criar, detalhar, editar, listar } from './controladorArtigos';

const rotasArtigos = Router();

// Home é privada
rotasArtigos.get('/', autenticarUsuario, (req, res) => {
  listar(req, res);
});

rotasArtigos.post('/', autenticarUsuario, (req, res) => {
  criar(req, res);
});

rotasArtigos.put('/:id', autenticarUsuario, (req, res) => {
  editar(req, res);
});

rotasArtigos.get('/:id', autenticarUsuario, (req, res) => {
  detalhar(req, res);
});

export default rotasArtigos;
