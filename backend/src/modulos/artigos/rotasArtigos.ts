import { Router } from 'express';
import { autenticarUsuario } from '../../middlewares/autenticarUsuario';
import { detalhar, listar } from './controladorArtigos';

const rotasArtigos = Router();

// Home é privada
rotasArtigos.get('/', autenticarUsuario, (req, res) => {
  listar(req, res);
});

rotasArtigos.get('/:id', autenticarUsuario, (req, res) => {
  detalhar(req, res);
});

export default rotasArtigos;
