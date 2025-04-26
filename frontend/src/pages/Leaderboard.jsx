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

  // Sort based on position, then points if positions are same
  const sortedData = [...leaderboardData].sort((a, b) => {
    if (a.position !== b.position) {
      return a.position - b.position;
    }
    return b.points - a.points;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBar />

      <main className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-600 text-lg">Loading Leaderboard...</div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <header className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <Trophy className="h-8 w-8 text-yellow-500" />
                Leaderboard
              </h1>
              <p className="text-gray-600 mt-2">
                See who's leading the pack in our quiz competition
              </p>
            </header>

            {/* Podium for top 3 performers */}
            <PodiumDisplay topUsers={sortedData.slice(0, 3)} />

            {/* Table for all participants */}
            <LeaderboardTable users={sortedData} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
