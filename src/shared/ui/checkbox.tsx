'use client';

import * as React from 'react';
import { cn } from './utils';

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  /**
   * Radix/shadcn 호환용. boolean만 주고받는 심플한 API
   * 사용처에서 onCheckedChange 또는 표준 onChange 둘 다 쓸 수 있게 지원.
   */
  onCheckedChange?: (checked: boolean) => void;
};

const CHECKMARK_CLASS =
  "after:absolute after:content-[''] after:hidden checked:after:block after:w-2 after:h-1.5 after:border-b-[2px] after:border-l-[2px] after:border-black after:-rotate-45 after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2";

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, checked, defaultChecked, disabled, ...rest }, ref) => {
    const checkboxClassName = cn(
      'relative inline-flex size-5 items-center justify-center rounded-md border border-[#D5D9E2] bg-white transition-all duration-150',
      'appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--focus-ring)]',
      'checked:border-[var(--color-primary)] checked:bg-[var(--color-primary)] checked:shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)]',
      CHECKMARK_CLASS,
      'disabled:cursor-not-allowed disabled:opacity-40',
      className,
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      if (onCheckedChange) onCheckedChange(e.target.checked);
    };

    return (
      <input
        ref={ref}
        type="checkbox"
        className={checkboxClassName}
        {...(checked !== undefined ? { checked } : {})}
        {...(defaultChecked !== undefined ? { defaultChecked } : {})}
        onChange={handleChange}
        disabled={disabled}
        {...rest}
      />
    );
  },
);

Checkbox.displayName = 'Checkbox';
