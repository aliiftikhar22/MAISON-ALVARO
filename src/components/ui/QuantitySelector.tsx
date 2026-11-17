'use client';

import { Minus, Plus } from 'lucide-react';

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: 'md' | 'sm';
  disabled?: boolean;
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
  label = 'Quantity',
  size = 'md',
  disabled,
}: Props) {
  const btn = size === 'md' ? 'h-12 w-12' : 'h-9 w-9';
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center border border-ivory/25"
    >
      <button
        type="button"
        className={`${btn} grid place-items-center text-ivory/80 transition-colors hover:text-gold disabled:opacity-30`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span
        className={`${size === 'md' ? 'w-12' : 'w-9'} text-center text-sm tabular-nums`}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={`${btn} grid place-items-center text-ivory/80 transition-colors hover:text-gold disabled:opacity-30`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
