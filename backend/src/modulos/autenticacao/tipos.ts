export type UsuarioAutenticado = {
  id: number;
  nome: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}
