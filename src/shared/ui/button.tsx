type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean };
export default function Button({ pending, className = '', children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={
        'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ' +
        'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 ' +
        className
      }
      aria-busy={pending ? 'true' : 'false'}
    >
      {pending ? '처리 중…' : children}
    </button>
  );
}
