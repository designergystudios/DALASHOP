import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-white font-heading">District Plot Not Found</h1>
      <p className="text-xs text-slate-400 leading-relaxed">
        You seem to have navigated beyond Dala's surveyed virtual city grid boundaries.
      </p>
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-lg shadow-orange-950/40 transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to City Grid</span>
        </Link>
      </div>
    </div>
  );
};
