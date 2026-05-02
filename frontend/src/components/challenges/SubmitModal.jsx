import { useState } from 'react';
import PropTypes from 'prop-types';
import { submitFlag, useHint as unlockHint } from '../../api/challenge.api';
import { CATEGORY_LABELS, CATEGORY_COLORS, DIFFICULTY_COLORS, POINTS_COLOR } from './challengeConstants';

const SubmitModal = ({ challenge, solvedIds, onClose, onSuccess, onHintUsed }) => {
  const [flag, setFlag]             = useState('');
  const [status, setStatus]         = useState(null); // null | 'loading' | 'correct' | 'wrong' | 'error'
  const [message, setMessage]       = useState('');
  const [shownHints, setShownHints] = useState([]);
  const [unlockedHints, setUnlockedHints] = useState({}); // idx → hint text (from API)

  const alreadySolved = solvedIds.includes(challenge._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flag.trim()) return;
    setStatus('loading');
    setMessage('');
    try {
      const res = await submitFlag({ challengeId: challenge._id, flag: flag.trim() });
      if (res.data.correct) {
        setStatus('correct');
        setMessage(res.data.message);
        onSuccess(challenge._id, res.data.pointsAwarded, res.data.totalScore);
      } else {
        setStatus('wrong');
        setMessage(res.data.message || 'Incorrect flag, try again!');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const toggleHint = async (idx) => {
    const hint = challenge.hints[idx];
    const isShown = shownHints.includes(idx);

    if (isShown) {
      setShownHints((prev) => prev.filter((i) => i !== idx));
      return;
    }

    // Free hints: reveal immediately, no API call needed
    if (!hint.cost || hint.cost === 0) {
      setShownHints((prev) => [...prev, idx]);
      return;
    }

    // Paid hint: call API on first reveal to deduct points
    if (idx in unlockedHints) {
      setShownHints((prev) => [...prev, idx]);
      return;
    }

    try {
      const res = await unlockHint(challenge._id, idx);
      setUnlockedHints((prev) => ({ ...prev, [idx]: res.data.text }));
      onHintUsed(res.data.totalScore);
      setShownHints((prev) => [...prev, idx]);
    } catch {
      // silently fail — hint stays hidden
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${CATEGORY_COLORS[challenge.category] || CATEGORY_COLORS.other}`}>
                {CATEGORY_LABELS[challenge.category] || challenge.category}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${DIFFICULTY_COLORS[challenge.difficulty]}`}>
                {challenge.difficulty}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">{challenge.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none ml-4">×</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed">{challenge.description}</p>

          {/* Points + solve count */}
          <div className="flex items-center gap-4 text-sm">
            <span className={`font-bold text-xl ${POINTS_COLOR[challenge.points] || 'text-white'}`}>
              {challenge.points} pts
            </span>
            {challenge.solveCount > 0 && (
              <span className="text-gray-500">
                {challenge.solveCount} solve{challenge.solveCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Hints */}
          {challenge.hints?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Hints</p>
              {challenge.hints.map((hint, idx) => (
                <div key={idx} className="rounded-lg border border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleHint(idx)}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    <span>Hint {idx + 1}{hint.cost > 0 ? ` (-${hint.cost} pts)` : ' (free)'}</span>
                    <span>{shownHints.includes(idx) ? '▲' : '▼'}</span>
                  </button>
                  {shownHints.includes(idx) && (
                    <div className="px-4 py-3 bg-gray-800/50 text-gray-300 text-sm border-t border-gray-700">
                      {unlockedHints[idx] ?? hint.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Already solved banner */}
          {alreadySolved && status !== 'correct' ? (
            <div className="rounded-lg bg-green-900/30 border border-green-700 px-4 py-3 text-green-300 text-sm font-medium">
              ✓ You&apos;ve already solved this challenge!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-1">
                  Submit Flag
                </label>
                <input
                  type="text"
                  value={flag}
                  onChange={(e) => { setFlag(e.target.value); setStatus(null); }}
                  placeholder="CTF{...}"
                  disabled={status === 'loading' || status === 'correct'}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                />
              </div>

              {status === 'correct' && (
                <div className="rounded-lg bg-green-900/40 border border-green-700 px-4 py-3 text-green-300 text-sm font-medium">
                  🎉 {message}
                </div>
              )}
              {status === 'wrong' && (
                <div className="rounded-lg bg-red-900/40 border border-red-700 px-4 py-3 text-red-300 text-sm">
                  ✗ {message}
                </div>
              )}
              {status === 'error' && (
                <div className="rounded-lg bg-yellow-900/40 border border-yellow-700 px-4 py-3 text-yellow-300 text-sm">
                  ⚠ {message}
                </div>
              )}

              {status !== 'correct' && (
                <button
                  type="submit"
                  disabled={status === 'loading' || !flag.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                  {status === 'loading' ? 'Checking…' : 'Submit Flag'}
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

SubmitModal.propTypes = {
  challenge:   PropTypes.object.isRequired,
  solvedIds:   PropTypes.array.isRequired,
  onClose:     PropTypes.func.isRequired,
  onSuccess:   PropTypes.func.isRequired,
  onHintUsed:  PropTypes.func.isRequired,
};

export default SubmitModal;