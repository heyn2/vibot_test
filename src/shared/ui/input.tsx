import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from './utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  helperText?: string;
  errorText?: string;
}

const baseStyles =
  'w-full rounded-full border border-transparent bg-[#f5f6fb] px-4 py-3 text-sm text-[var(--color-text-primary)] shadow-[inset_0_2px_4px_rgba(15,23,42,0.04)] transition-all placeholder:text-[var(--color-text-placeholder)] hover:bg-white hover:border-[rgba(255,232,18,0.45)] focus-visible:bg-white focus-visible:border-[var(--color-primary)] focus-visible:shadow-[0_0_0_3px_rgba(255,232,18,0.3)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-80 disabled:bg-[#eff1f6]';

const errorStyles = 'border-[var(--color-error)] bg-white shadow-[0_0_0_3px_rgba(239,68,68,0.18)]';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, helperText, errorText, ...rest },
  ref,
) {
  const inputClassName = cn(baseStyles, errorText && errorStyles, className);

  return (
    <div className="space-y-1">
      <input
        ref={ref}
        className={inputClassName}
        aria-invalid={errorText ? 'true' : undefined}
        {...rest}
      />
      {helperText && !errorText && <p className="text-xs text-muted">{helperText}</p>}
      {errorText && (
        <p className="text-xs text-error" role="alert">
          {errorText}
        </p>
      )}
    </div>
  );
});
