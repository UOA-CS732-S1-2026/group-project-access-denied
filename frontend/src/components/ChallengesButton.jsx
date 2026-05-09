import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HIDDEN_ROUTES = ['/login', '/register', '/challenges'];

const ChallengesButton = () => {
  const [unlocked, setUnlocked] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { setUnlocked(false); return; }
    if (localStorage.getItem(`ctf_unlocked_${user.id}`) === '1') setUnlocked(true);
    else setUnlocked(false);
  }, [pathname, user]);

  if (!unlocked || HIDDEN_ROUTES.includes(pathname)) return null;

  return (
    <button
      onClick={() => navigate('/challenges')}
      aria-label="Go to Challenges"
      className="fixed bottom-7 left-7 z-[1000] flex items-center gap-2 h-11 px-5 rounded-full bg-[#111] text-white text-[13px] font-semibold tracking-wide shadow-lg transition-all duration-200 hover:bg-[#222] hover:scale-105 active:scale-100"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <polyline points="4 17 10 11 4 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="19" x2="20" y2="19" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      Challenges
    </button>
  );
};

export default ChallengesButton;
