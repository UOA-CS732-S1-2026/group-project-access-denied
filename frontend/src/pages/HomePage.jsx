const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-green-400 tracking-widest mb-4">ACCESS DENIED</h1>
      <p className="text-gray-400 text-lg max-w-xl mb-8">
        A hands-on CTF lab where the entire site is the challenge.
        Explore, exploit, and capture the flags hidden within.
      </p>
      <a
        href="/challenges"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Start Hacking →
      </a>
    </div>
  );
};

export default HomePage;
