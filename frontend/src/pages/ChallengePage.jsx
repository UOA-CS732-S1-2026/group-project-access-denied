import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import ChallengeCard from '../components/challenges/ChallengeCard';
import SubmitModal from '../components/challenges/SubmitModal';
import { CATEGORY_LABELS } from '../components/challenges/challengeConstants';
import { getChallenges } from '../api/challenge.api';
import { useAuth } from '../context/AuthContext';

const ChallengePage = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [selected, setSelected]     = useState(null);
  const [filter, setFilter]         = useState('all');
  const [solvedIds, setSolvedIds]   = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    getChallenges()
      .then((res) => setChallenges(res.data))
      .catch(() => setError('Failed to load challenges. Make sure you are logged in.'))
      .finally(() => setLoading(false));

    if (user) {
      setSolvedIds(user.solvedChallenges || []);
      setTotalScore(user.totalScore || 0);
    }
  }, [user]);

  const handleSuccess = (challengeId, _pointsAwarded, newTotal) => {
    setSolvedIds((prev) => [...prev, challengeId]);
    setTotalScore(newTotal);
  };

  const categories = ['all', ...new Set(challenges.map((c) => c.category))];

  const filtered = filter === 'all'
    ? challenges
    : challenges.filter((c) => c.category === filter);

  const solved   = filtered.filter((c) =>  solvedIds.includes(c._id));
  const unsolved = filtered.filter((c) => !solvedIds.includes(c._id));

  const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);
  const progress    = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar activePage="challenges" />

      {/* pt-24 pushes content below the fixed navbar */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-1">Challenges</h1>
          <p className="text-gray-400">
            Find and exploit the vulnerabilities hidden in the ThreadVault store.
          </p>
        </div>

        {user && (
          <div className="mb-8 bg-gray-900 border border-gray-700 rounded-xl p-5">
            <div className="flex flex-wrap gap-6 items-center justify-between mb-3">
              <div className="flex gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-0.5">Your Score</p>
                  <p className="text-2xl font-bold text-indigo-400">{totalScore}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-0.5">Solved</p>
                  <p className="text-2xl font-bold text-green-400">{solvedIds.length} / {challenges.length}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-0.5">Total Available</p>
                  <p className="text-2xl font-bold text-gray-300">{totalPoints} pts</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">{progress}% complete</p>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All' : (CATEGORY_LABELS[cat] || cat)}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-lg bg-red-900/40 border border-red-700 px-5 py-4 text-red-300 mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-20 text-gray-500">Loading challenges…</div>
        )}

        {!loading && !error && (
          <>
            {unsolved.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                  Unsolved ({unsolved.length})
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {unsolved.map((c) => (
                    <ChallengeCard key={c._id} challenge={c} isSolved={false} onSelect={setSelected} />
                  ))}
                </div>
              </section>
            )}

            {solved.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                  Solved ({solved.length})
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {solved.map((c) => (
                    <ChallengeCard key={c._id} challenge={c} isSolved={true} onSelect={setSelected} />
                  ))}
                </div>
              </section>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                No challenges found for this category.
              </div>
            )}
          </>
        )}
      </main>

      {selected && (
        <SubmitModal
          challenge={selected}
          solvedIds={solvedIds}
          onClose={() => setSelected(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ChallengePage;