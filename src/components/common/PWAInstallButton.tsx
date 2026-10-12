import React, { useState } from 'react';
import { Download, Share2, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 4000);
    }
  };

  if (justInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Dala Installed</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'full') {
      return (
        <button
          onClick={handleInstallClick}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-sm shadow-md transition-all active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          <span>Install Dala App (Offline Enabled)</span>
        </button>
      );
    }

    return (
      <button
        onClick={handleInstallClick}
        aria-label="Install Dala App"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-xs transition active:scale-95"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white border border-stone-200 p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-extrabold text-sm">
                    D
                  </div>
                  <h3 className="text-base font-bold text-stone-900">Install Dala on iOS</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-stone-600 leading-relaxed">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <p>
                    Tap the <strong>Share</strong> button (box with upward arrow) in your Safari toolbar.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <p>
                    Scroll down the share sheet and tap <strong>Add to Home Screen</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <p>
                    Confirm <strong>Add</strong>. Launch Dala directly from your phone screen with offline caching!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-2xl bg-stone-900 py-2.5 text-xs font-bold text-white hover:bg-stone-800 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
