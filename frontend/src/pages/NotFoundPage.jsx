import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
    <h1 className="text-6xl font-bold text-green-400">404</h1>
    <p className="text-gray-400 mt-4">Page not found — or maybe it&apos;s hidden on purpose?</p>
    <Link to="/" className="mt-6 text-green-400 hover:underline">Go Home</Link>
  </div>
);

export default NotFoundPage;
