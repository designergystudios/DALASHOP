import React from 'react';
import { Coins } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Currency } from '../../types';

const CURRENCIES: { id: Currency; label: string; flag: string }[] = [
  { id: 'KES', label: 'KES (Kenya Shilling)', flag: '🇰🇪' },
  { id: 'USD', label: 'USD (US Dollar)', flag: '🌐' },
  { id: 'TZS', label: 'TZS (Tanzania Shilling)', flag: '🇹🇿' },
  { id: 'UGX', label: 'UGX (Uganda Shilling)', flag: '🇺🇬' },
  { id: 'RWF', label: 'RWF (Rwanda Franc)', flag: '🇷🇼' },
];

export const CurrencySwitcher: React.FC<{ compact?: boolean }> = ({ compact = true }) => {
  const { currency, setCurrency } = useAppStore();

  return (
    <div className="relative inline-flex items-center">
      <label htmlFor="currency-select" className="sr-only">Select Currency</label>
      <select
        id="currency-select"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="appearance-none bg-white border border-stone-200 text-stone-800 text-xs font-bold rounded-xl pl-2.5 pr-6 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer hover:bg-stone-50 transition shadow-xs"
      >
        {CURRENCIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.id} {c.flag}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2 flex items-center text-stone-400">
        <Coins className="w-3 h-3" />
      </div>
    </div>
  );
};
