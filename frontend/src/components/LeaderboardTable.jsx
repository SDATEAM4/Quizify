import React from 'react';

const LeaderboardTable = ({ users }) => {
  const tableUsers = users.filter(user => user.position > 3);

  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-sm">
      <table className="min-w-full bg-white text-sm">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-3 px-4 sm:px-6 text-left font-semibold text-gray-700">Rank</th>
            <th className="py-3 px-4 sm:px-6 text-left font-semibold text-gray-700">Student Name</th>
            <th className="py-3 px-4 sm:px-6 text-right font-semibold text-gray-700 hidden md:table-cell">Username</th>
            <th className="py-3 px-4 sm:px-6 text-right font-semibold text-gray-700 hidden md:table-cell">Quizzes</th>
            <th className="py-3 px-4 sm:px-6 text-right font-semibold text-gray-700">Points</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {tableUsers.map((user, index) => (
            <tr 
              key={user.userId} 
              className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <td className="py-3 px-4 sm:px-6 font-medium text-gray-900">{user.position}</td>
              <td className="py-3 px-4 sm:px-6 text-gray-900 font-medium">{user.name}</td>
              <td className="py-3 px-4 sm:px-6 text-gray-500 text-right hidden md:table-cell">@{user.username}</td>
              <td className="py-3 px-4 sm:px-6 text-gray-500 text-right hidden md:table-cell">{user.attemptedQuizCount}</td>
              <td className="py-3 px-4 sm:px-6 font-medium text-right">
                <span className={`px-2 py-1 rounded-full ${user.points > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {user.points} pts
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
