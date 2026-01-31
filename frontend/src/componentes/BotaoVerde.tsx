export function BotaoVerde(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={[
        'rounded-md bg-verde px-4 py-2 text-xs font-semibold text-white hover:bg-verdeEscuro disabled:opacity-60',
        className ?? ''
      ].join(' ')}
    />
  );
}
