import { type ButtonHTMLAttributes } from 'react';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: 'bg-pixel-green text-black border-black hover:brightness-110',
  secondary: 'bg-neutral-700 text-white border-neutral-500 hover:bg-neutral-600',
  danger: 'bg-pixel-red text-white border-black hover:brightness-110',
  ghost: 'bg-transparent text-inherit border-transparent hover:bg-white/10',
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

export function PixelButton({ variant = 'primary', size = 'md', className = '', children, ...props }: PixelButtonProps) {
  return (
    <button
      className={`border-2 rounded-none transition-all duration-75 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
