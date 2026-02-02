import { Router } from 'express';
import { middlewareAutenticacao } from '../autenticacao/middlewareAutenticacao';
import { listar } from './controladorTags';

export const rotasTags = Router();

rotasTags.get('/tags', middlewareAutenticacao, listar);
