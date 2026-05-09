import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ChallengesButton = () => {
  const [unlocked, setUnlocked] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('ctf_unlocked') === '1') setUnlocked(true);
  }, [pathname]);

  if (!unlocked || pathname === '/challenges') return null;

  return (
    <button
      onClick={() => navigate('/challenges')}
      aria-label="Go to Challenges"
      style={{
        position: 'fixed',
        bottom: 28,
        left: 28,
        zIndex: 1000,
        border: 'none',
        cursor: 'pointer',
        background: '#111',
        color: '#fff',
        borderRadius: 999,
        padding: '0 18px',
        height: 44,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.04em',
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
        transition: 'transform 0.2s, background 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.background = '#222'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#111'; }}
    >
      {/* terminal icon */}
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <polyline points="4 17 10 11 4 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="19" x2="20" y2="19" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      Challenges
    </button>
  );
};

export default ChallengesButton;
