import { useState } from 'react';
import PropTypes from 'prop-types';

const FlagFoundModal = ({
  flag,
  title = 'CTF Found!',
  message = 'Congratulations, you found a hidden flag.',
  onClose,
  primaryLabel = 'Close',
}) => {
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(flag);
    setCopied(true);
  };

  const handlePrimary = async () => {
    if (primaryAction) {
      primaryAction();
    } else {
      await handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[1px] animate-fade-in px-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-2xl border border-outline-variant/20 text-center">

        <h2 className="text-2xl font-extrabold text-on-surface mb-2">
          {title}
        </h2>

        <p className="text-sm text-on-surface-variant mb-5">
          {message}
        </p>

        <div className="rounded-lg bg-surface-container-low px-4 py-3 font-mono text-sm text-primary break-all mb-5">
          {flag}
        </div>

        <div className="flex gap-3">
          {/* LEFT = always copy */}
          <button
            onClick={handleCopy}
            className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            {copied ? 'Copied!' : 'Copy Flag'}
          </button>
          
          {/* RIGHT = configurable */}
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-outline/20 px-4 py-3 text-sm font-semibold hover:border-primary/40 transition-colors"
          >
            {primaryLabel || 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};

FlagFoundModal.propTypes = {
  flag: PropTypes.string.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func, // no longer required
  primaryLabel: PropTypes.string,
};

export default FlagFoundModal;