import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from './utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  helperText?: string;
  errorText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, helperText, errorText, ...rest },
  ref,
) {
  const inputClassName = cn('input-base', errorText && 'input-error', className);

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
