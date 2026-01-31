export function Chip({
  texto,
  ativo,
  onClick
}: {
  texto: string;
  ativo?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full px-3 py-1 text-[11px]',
        ativo ? 'bg-verdeClaro text-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      ].join(' ')}
    >
      {texto}
    </button>
  );
}
