'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

// ✅ 여기서 바로 export 붙여줌
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-tight transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--focus-ring)]",
  {
    variants: {
      variant: {
        default:
          'bg-[#FFE812] text-[#111826] border border-transparent shadow-[0_12px_30px_rgba(255,232,18,0.35)] hover:-translate-y-0.5 hover:bg-[#FFD60A] hover:shadow-[0_18px_34px_rgba(255,232,18,0.45)] active:translate-y-0 active:shadow-[0_8px_18px_rgba(255,232,18,0.25)]',
        primary:
          'bg-[#FFE812] text-[#111826] border border-transparent shadow-[0_12px_30px_rgba(255,232,18,0.35)] hover:-translate-y-0.5 hover:bg-[#FFD60A] hover:shadow-[0_18px_34px_rgba(255,232,18,0.45)] active:translate-y-0 active:shadow-[0_8px_18px_rgba(255,232,18,0.25)]',
        secondary:
          'bg-white text-[#111826] border border-[#E5E7EB] shadow-sm hover:-translate-y-0.5 hover:bg-[#F9FAFB]',
        outline: 'border border-[#D1D5DB] bg-transparent text-[#111826] hover:bg-[#F9FAFB]',
        ghost: 'bg-transparent text-[#111826] border border-transparent hover:bg-[#F5F6F8]',
        destructive:
          'bg-[#FF5555] text-white border border-transparent shadow-[0_12px_24px_rgba(255,85,85,0.35)] hover:bg-[#fb3c3c]',
        accent:
          'bg-[#1E67FF] text-white border border-transparent shadow-[0_14px_28px_rgba(30,103,255,0.35)] hover:bg-[#144FD8]',
        gradientPrimary:
          'text-[#111826] border border-transparent shadow-[0_18px_34px_rgba(255,232,18,0.45)] bg-[linear-gradient(135deg,#FFE812,#FFD60A)] hover:opacity-90',
        gradientAccent:
          'text-white border border-transparent shadow-[0_14px_32px_rgba(37,99,235,0.45)] bg-[linear-gradient(135deg,#3B82F6,#2563EB)] hover:opacity-90',
        link: 'text-[var(--color-accent)] underline-offset-4 hover:underline px-0 bg-transparent border-none shadow-none',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        default: 'h-11 px-5 text-base',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      loading: {
        true: 'relative aria-busy:opacity-90',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
      loading: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  fullWidth,
  isLoading,
  loading,
  asChild = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  const showLoading = isLoading ?? loading ?? false;

  return (
    <Comp
      data-slot="button"
      aria-busy={showLoading || undefined}
      disabled={disabled || showLoading}
      className={cn(buttonVariants({ variant, size, fullWidth, loading: showLoading, className }))}
      {...props}
    >
      {showLoading && (
        <span
          aria-hidden="true"
          className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </Comp>
  );
}
