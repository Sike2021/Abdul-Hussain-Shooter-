import React, { useState } from 'react';
import { Download, Smartphone, Check, X, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showAndroidApkModal, setShowAndroidApkModal] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
        <Check className="w-3.5 h-3.5" />
        <span>APK / PWA INSTALLED</span>
      </div>
    );
  }

  return (
    <>
      <button
        id="pwa-install-app-btn"
        onClick={() => {
          if (isInstallable) {
            install();
          } else if (isIOS) {
            setShowIOSGuide(true);
          } else {
            // Provide Android PWA APK installation helper
            setShowAndroidApkModal(true);
          }
        }}
        className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-black tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer ${
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-xs sm:text-sm'
        }`}
      >
        <Smartphone className="w-4 h-4" />
        <span>{isInstallable ? 'Install Android App' : 'Install APK / PWA'}</span>
      </button>

      {/* Android / Chrome APK info dialog */}
      {showAndroidApkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 p-6 text-zinc-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm tracking-wide">Install on Android / Chrome</h3>
              </div>
              <button
                onClick={() => setShowAndroidApkModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Offline WebAPK Verified</span>
                </div>
                <p className="text-zinc-400">
                  Abdul Hussain Shooter includes offline caching and Web App Manifest ready for direct installation on Android, Chrome, and Vercel hosting.
                </p>
              </div>

              <div className="space-y-1 text-zinc-400 font-mono text-[11px]">
                <div>1. Tap Chrome&apos;s menu (three dots <strong className="text-white">⋮</strong>)</div>
                <div>2. Select <strong className="text-white">&ldquo;Add to Home screen&rdquo;</strong> or <strong className="text-white">&ldquo;Install App&rdquo;</strong></div>
                <div>3. The game will run full-screen offline like an APK!</div>
              </div>
            </div>

            <button
              onClick={() => setShowAndroidApkModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* iOS Guide */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 p-6 text-zinc-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Install on iPhone / iPad</h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              1. Tap the <strong className="text-cyan-400">Share</strong> icon at the bottom of Safari.<br />
              2. Scroll down and choose <strong className="text-cyan-400">Add to Home Screen</strong>.<br />
              3. Launch &ldquo;AHShooter&rdquo; from your home screen for full-screen offline gameplay!
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
