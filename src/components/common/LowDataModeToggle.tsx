import React from 'react';
import { Zap, Signal } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const LowDataModeToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isLowDataMode, toggleLowDataMode } = useAppStore();

  if (compact) {
    return (
      <button
        onClick={toggleLowDataMode}
        title={isLowDataMode ? 'Low-Data Mode ON (Bandwidth Saver)' : 'Standard High-Fidelity Mode'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
          isLowDataMode
            ? 'bg-amber-100 border-amber-300 text-amber-900'
            : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
        }`}
      >
        <Zap className={`w-3.5 h-3.5 ${isLowDataMode ? 'text-amber-600 fill-amber-500' : 'text-stone-400'}`} />
        <span className="hidden sm:inline">{isLowDataMode ? 'Data Saver' : 'Lite Mode'}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className={`p-2 rounded-xl ${isLowDataMode ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'}`}>
          <Signal className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-stone-900">East Africa Low-Data Mode</p>
          <p className="text-[11px] text-stone-500">
            Saves mobile MBs by deferring heavy 3D stall assets and background media.
          </p>
        </div>
      </div>
      <button
        onClick={toggleLowDataMode}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          isLowDataMode ? 'bg-amber-500' : 'bg-stone-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isLowDataMode ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
