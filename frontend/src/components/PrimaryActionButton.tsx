'use client';

import type { ReactNode } from 'react';

interface PrimaryActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
}

export default function PrimaryActionButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  icon,
  className = '',
}: PrimaryActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white px-5 py-3 rounded-xl font-medium shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}