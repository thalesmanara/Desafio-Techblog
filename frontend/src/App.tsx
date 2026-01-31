import { Navigate, Route, Routes } from 'react-router-dom';
import { RotaPrivada } from './componentes/RotaPrivada';
import { PaginaLanding } from './app/PaginaLanding';
import { PaginaLogin } from './app/PaginaLogin';
import { PaginaHome } from './app/PaginaHome';
import { PaginaDetalheArtigo } from './app/PaginaDetalheArtigo';
import { PaginaNovoArtigo } from './app/PaginaNovoArtigo';
import { PaginaEditarArtigo } from './app/PaginaEditarArtigo';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaLanding />} />
      <Route path="/login" element={<PaginaLogin />} />

      <Route path="/home" element={<RotaPrivada><PaginaHome /></RotaPrivada>} />
      <Route path="/artigos/:id" element={<RotaPrivada><PaginaDetalheArtigo /></RotaPrivada>} />
      <Route path="/artigos/novo" element={<RotaPrivada><PaginaNovoArtigo /></RotaPrivada>} />
      <Route path="/artigos/:id/editar" element={<RotaPrivada><PaginaEditarArtigo /></RotaPrivada>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
