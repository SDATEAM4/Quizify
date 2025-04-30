import React from 'react';

const PodiumDisplay = ({ topUsers }) => {
  const podiumUsers = topUsers.slice(0, 3);
  while (podiumUsers.length < 3) podiumUsers.push(null);

  const displayOrder = [
    { user: podiumUsers[1], position: 2, height: 'h-28 sm:h-40' },
    { user: podiumUsers[0], position: 1, height: 'h-36 sm:h-56' },
    { user: podiumUsers[2], position: 3, height: 'h-24 sm:h-32' }
  ];

  return (
    <div className="flex justify-center items-end mb-10 mt-8 px-4 gap-4 sm:gap-6">
      {displayOrder.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className={`relative ${item.user ? '' : 'opacity-50'}`}>
            <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 text-lg sm:text-2xl font-bold">
              #{item.position}
            </div>
            <div className={`w-20 sm:w-28 ${item.height} bg-black rounded-t-lg flex flex-col justify-center items-center p-2 sm:p-4 transition-all hover:shadow-lg`}>
              {item.user ? (
                <>
                  <h3 className="text-white text-center font-medium text-xs sm:text-sm">
                    {item.user.name.split(' ')[0]}
                  </h3>
                  <h3 className="text-white text-center font-medium text-xs sm:text-sm mb-1 sm:mb-2">
                    {item.user.name.split(' ')[1] || ''}
                  </h3>
                  <p className="text-white text-[10px] sm:text-xs opacity-80">
                    {item.user.points} pts
                  </p>
                </>
              ) : (
                <p className="text-white text-xs text-center">Empty</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PodiumDisplay;
