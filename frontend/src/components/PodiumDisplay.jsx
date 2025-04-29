import React from 'react';

const PodiumDisplay = ({ topUsers }) => {
  // Ensure we have exactly 3 users for the podium
  const podiumUsers = topUsers.slice(0, 3);
  
  // If less than 3 users, fill the array with null values
  while (podiumUsers.length < 3) {
    podiumUsers.push(null);
  }
  
  // Order for visual display: 2nd, 1st, 3rd
  const displayOrder = [
    { user: podiumUsers[1], position: 2, height: 'h-40' },
    { user: podiumUsers[0], position: 1, height: 'h-56' },
    { user: podiumUsers[2], position: 3, height: 'h-32' }
  ];

  return (
    <div className="flex justify-center items-end mb-12 mt-8 px-4">
      {displayOrder.map((item, index) => (
        <div key={index} className="flex flex-col items-center mx-3">
          <div className={`relative ${item.user ? '' : 'opacity-50'}`}>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl font-bold">
              #{item.position}
            </div>
            <div className={`w-28 ${item.height} bg-black rounded-t-lg flex flex-col justify-center items-center p-4 transition-all hover:shadow-lg`}>
              {item.user ? (
                <>
                  <h3 className="text-white text-center font-medium text-sm">
                    {item.user.name.split(' ')[0]}
                  </h3>
                  <h3 className="text-white text-center font-medium text-sm mb-2">
                    {item.user.name.split(' ')[1]}
                  </h3>
                  <p className="text-white text-xs opacity-80">
                    {item.user.points} pts
                  </p>
                </>
              ) : (
                <p className="text-white text-center">Empty</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PodiumDisplay;