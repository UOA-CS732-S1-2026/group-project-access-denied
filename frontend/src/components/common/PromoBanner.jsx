import { useState } from 'react';

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-[64px] left-0 right-0 z-40 bg-[#1c1b1b] text-white">
      <div className="relative flex items-center justify-center px-12 py-2.5">
        <p className="text-xs sm:text-sm tracking-wide text-center">
          Winter Sale — Get 10% off with code{' '}
          <span className="font-bold tracking-wider">WINTERSALE10</span>
          {' '}· Limited time only
        </p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <span className="material-symbols-outlined text-base leading-none">close</span>
        </button>
      </div>
    </div>
  );
}
