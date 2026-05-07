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
      className="fixed top-16 left-0 right-0 z-40 border-b border-primary/20 bg-primary/10 backdrop-blur-md px-4 py-2.5 text-on-surface"
      aria-label="Promotion"
    >
      {/* max-w-7xl mx-auto — centered content, same max width as other store pages. */}
      {/* flex-col on small screens; sm:flex-row and sm:justify-between from sm breakpoint up. */}
      <div className="max-w-7xl mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-sm text-center sm:text-left">
          <span className="font-semibold text-primary">10% off</span>
          {/* {' '} — explicit space between JSX elements (newline would also work inside text). */}
          {' '}
          this week — add something you love and use the code at checkout.
        </p>
        <div className="flex items-center justify-center gap-3 shrink-0">
          {/* to="/cart" — client-side route; same as <a href> but for React Router. */}
          <Link
            to="/cart"
            className="text-xs font-bold uppercase tracking-widest text-primary hover:opacity-80"
          >
            Go to bag
          </Link>
          {/* type="button" — avoids submitting a parent <form> if this were nested in one. */}
          {/* onClick={dismiss} — pass function reference (not dismiss() — that would run immediately). */}
          <button
            type="button"
            onClick={dismiss}
            className="rounded-md p-1 text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface"
            aria-label="Dismiss promotion"
          >
            {/* Icon font class from Material Symbols (loaded globally in index.html or similar). */}
            <span className="material-symbols-outlined text-lg leading-none">close</span>
          </button>
        </div>
      </div>
    </section>
  );
}