// TODO (Sprint 3): Replace this stub with the real challenges list UI.
// This page should fetch all challenges from GET /api/challenges and display them
// as cards grouped by category (SQL Injection, XSS, Auth Bypass, etc.).

const ChallengePage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold text-green-400 mb-2">Challenges</h1>
      <p className="text-gray-400 mb-8">Find and exploit the vulnerabilities hidden in this application.</p>
      <div className="text-gray-500 border border-gray-700 rounded-lg p-6 text-center">
        Challenges coming in Sprint 3 — check back soon.
      </div>
    </div>
  );
};

export default ChallengePage;
