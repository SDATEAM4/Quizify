import React, { useState, useEffect } from 'react';
import PodiumDisplay from '../components/PodiumDisplay';
import LeaderboardTable from '../components/LeaderboardTable';
import { Trophy } from 'lucide-react';
import { Footer } from "../components/footer";
import { NavBar } from "../components/navbar";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('http://localhost:8080/Quizify/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const sortedData = [...leaderboardData].sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position;
    return b.points - a.points;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBar />

      <main className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 backdrop-blur-sm z-50">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none px-4 text-center">
              <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold text-white">Quizify</h1>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center space-y-6 relative z-10 w-11/12 sm:w-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Loading Leaderboard...</h2>
            </div>
          </div>
        )}

        {!loading && (
          <div className="container mx-auto px-4 py-8">
            <header className="mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
                Leaderboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                See who's leading the pack in our quiz competition
              </p>
            </header>

            <PodiumDisplay topUsers={sortedData.slice(0, 3)} />
            <LeaderboardTable users={sortedData} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
