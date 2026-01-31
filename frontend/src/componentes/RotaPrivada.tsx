import { Navigate } from 'react-router-dom';
import { estaAutenticado } from '../servicos/autenticacao';

export function RotaPrivada({ children }: { children: JSX.Element }) {
  if (!estaAutenticado()) return <Navigate to="/login" replace />;
  return children;
}
