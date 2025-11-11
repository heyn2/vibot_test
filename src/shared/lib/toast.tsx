'use client';

import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { create } from 'zustand';

type ToastVariant = 'default' | 'success' | 'warning' | 'error';

export interface ToastOptions {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  duration?: number;
  variant?: ToastVariant;
  action?: {
    label: string;
    onClick?: () => void;
  };
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastStore {
  toasts: ToastItem[];
  showToast: (toast: ToastOptions) => string;
  dismissToast: (id: string) => void;
}

const toastTimers = new Map<string, ReturnType<typeof setTimeout>>();

const clearToastTimer = (id: string) => {
  const timer = toastTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    toastTimers.delete(id);
  }
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  showToast: (toast) => {
    const id = toast.id ?? generateId();
    const nextToast: ToastItem = {
      id,
      duration: toast.duration ?? 4000,
      variant: toast.variant ?? 'default',
      title: toast.title,
      description: toast.description,
      action: toast.action,
    };

    set((state) => ({ toasts: [...state.toasts, nextToast] }));

    if (nextToast.duration && nextToast.duration > 0) {
      const timer = setTimeout(() => get().dismissToast(id), nextToast.duration);
      toastTimers.set(id, timer);
    }

    return id;
  },
  dismissToast: (id) => {
    clearToastTimer(id);
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
  },
}));

export function toast(options: ToastOptions) {
  return useToastStore.getState().showToast(options);
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  default: 'border-divider',
  success: 'border-[var(--color-success)]',
  warning: 'border-[var(--color-warning)]',
  error: 'border-[var(--color-error)]',
};

export function ToastViewport() {
  const { toasts, dismissToast } = useToastStore((state) => ({
    toasts: state.toasts,
    dismissToast: state.dismissToast,
  }));

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-3 px-4 sm:items-end sm:px-6">
      {toasts.map((toastItem) => (
        <div
          key={toastItem.id}
          className={[
            'pointer-events-auto w-full max-w-sm rounded-lg border bg-surface p-4 text-body shadow-xl',
            VARIANT_STYLES[toastItem.variant ?? 'default'],
          ]
            .filter(Boolean)
            .join(' ')}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              {toastItem.title && <p className="text-sm font-semibold">{toastItem.title}</p>}
              {toastItem.description && (
                <p className="text-sm text-muted">{toastItem.description}</p>
              )}
            </div>
            <button
              type="button"
              className="text-sm text-muted transition hover:text-body"
              onClick={() => dismissToast(toastItem.id)}
              aria-label="닫기"
            >
              ×
            </button>
          </div>
          {(toastItem.action || toastItem.variant === 'error') && (
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {toastItem.action && (
                <button
                  type="button"
                  className="font-medium text-body underline-offset-4 hover:underline"
                  onClick={() => {
                    toastItem.action?.onClick?.();
                    dismissToast(toastItem.id);
                  }}
                >
                  {toastItem.action.label}
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>,
    document.body,
  );
}
