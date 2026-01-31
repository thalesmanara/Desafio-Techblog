import { Link } from 'react-router-dom';

export function PaginaLanding() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold leading-tight md:text-5xl">TechBlog</h1>
        <p className="mt-4 max-w-xl text-zinc-300">
          Um MVP simples para leitura e gestão de artigos, com autenticação e CRUD completo.
        </p>
        <Link to="/login" className="mt-8 inline-flex items-center justify-center rounded-md bg-yellow-400 px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-yellow-300">
          Entrar
        </Link>
      </div>
    </main>
  );
}
