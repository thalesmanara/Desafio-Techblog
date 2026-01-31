import { Router } from 'express';
import { autenticarUsuario } from '../../middlewares/autenticarUsuario';
import { listar } from './controladorArtigos';

const rotasArtigos = Router();

// Home é privada
rotasArtigos.get('/', autenticarUsuario, (req, res) => {
  listar(req, res);
});

export default rotasArtigos;
