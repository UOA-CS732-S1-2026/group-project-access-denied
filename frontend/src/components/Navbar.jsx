import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-green-400 font-bold text-xl tracking-widest">
        ACCESS<span className="text-white">DENIED</span>
      </Link>
      <div className="flex items-center gap-6 text-sm text-gray-300">
        {user ? (
          <>
            <Link to="/challenges" className="hover:text-green-400 transition-colors">Challenges</Link>
            <Link to="/scoreboard" className="hover:text-green-400 transition-colors">Scoreboard</Link>
            <span className="text-green-400 font-mono">{user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-green-400 transition-colors">Login</Link>
            <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
