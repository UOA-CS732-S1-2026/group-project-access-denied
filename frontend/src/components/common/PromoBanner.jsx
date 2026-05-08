import { useState } from 'react';
import { Link } from 'react-router-dom';

// Key used in sessionStorage so dismiss state survives refreshes until the tab closes.
const STORAGE_KEY = 'apapparel_promo_10off_dismissed';

export default function PromoBanner() {

  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) !== '1';
    } catch {
      // sessionStorage can throw in private mode / blocked storage — default to showing.
      return true;
    }
  });

  // Event handler for the dismiss button.
  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // If storage fails, we still hide the banner in the UI.
    } finally {
      setVisible(false); // triggers re-render; early return below renders nothing.
    }
  };

  if (!visible) return null;

  return (
    <section
      className="w-full px-4 pt-24 pb-3"
      aria-label="Promotion"
    >
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl border border-outline-variant/25 bg-surface-container-low/95 backdrop-blur-md shadow-sm">
          <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-primary">
                10% off
              </span>
              <p className="text-sm text-on-surface leading-snug">
                Use code{' '}
                <span className="font-mono font-semibold text-primary">discount10%</span>
                {' '}at checkout.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-sm hover:bg-primary/90 transition-colors"
              >
                <span>Go to bag</span>
                <span className="material-symbols-outlined text-sm ml-2 align-middle">arrow_forward</span>
              </Link>
              <button
                type="button"
                onClick={dismiss}
                className="rounded-lg border border-outline/20 p-2 text-on-surface-variant hover:border-primary/40 hover:text-on-surface transition-colors"
                aria-label="Dismiss promotion"
              >
                <span className="material-symbols-outlined text-lg leading-none">close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}