import PropTypes from 'prop-types';
import { CATEGORY_LABELS, CATEGORY_COLORS, DIFFICULTY_COLORS, POINTS_COLOR } from './challengeConstants';

const ChallengeCard = ({ challenge, isSolved, onSelect }) => {
  const catColor  = CATEGORY_COLORS[challenge.category]   || CATEGORY_COLORS.other;
  const diffColor = DIFFICULTY_COLORS[challenge.difficulty] || 'text-gray-400';
  const ptsColor  = POINTS_COLOR[challenge.points]          || 'text-white';

  return (
    <button
      onClick={() => onSelect(challenge)}
      className={`w-full text-left rounded-xl border p-5 transition-all duration-200 group cursor-pointer
        ${isSolved
          ? 'border-green-700 bg-green-900/20 opacity-70 hover:opacity-100 hover:border-green-500'
          : 'border-gray-700 bg-gray-900 hover:border-indigo-500 hover:bg-gray-800'
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${catColor}`}>
              {CATEGORY_LABELS[challenge.category] || challenge.category}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${diffColor}`}>
              {challenge.difficulty}
            </span>
          </div>
          <h3 className={`font-semibold text-base leading-snug mb-1 ${isSolved ? 'text-green-300' : 'text-white group-hover:text-indigo-300'}`}>
            {isSolved && <span className="mr-2">✓</span>}
            {challenge.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2">{challenge.description}</p>
        </div>
        <div className={`text-2xl font-bold ${ptsColor} shrink-0`}>
          {challenge.points}
          <span className="text-xs font-normal text-gray-500 block text-right">pts</span>
        </div>
      </div>
      {challenge.hints?.length > 0 && (
        <p className="mt-3 text-xs text-gray-500">
          {challenge.hints.length} hint{challenge.hints.length !== 1 ? 's' : ''} available
        </p>
      )}
    </button>
  );
};

ChallengeCard.propTypes = {
  challenge: PropTypes.object.isRequired,
  isSolved:  PropTypes.bool.isRequired,
  onSelect:  PropTypes.func.isRequired,
};

export default ChallengeCard;