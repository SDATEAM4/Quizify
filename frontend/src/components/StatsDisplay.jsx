import React from 'react';

const StatsDisplay = ({ quizDetails }) => {
  const stats = [
    { label: 'Minimum', value: quizDetails.minMarks, color: 'text-amber-600' },
    { label: 'Maximum', value: quizDetails.maxMarks, color: 'text-emerald-600' },
    { label: 'Average', value: quizDetails.averageMarks.toFixed(0), color: 'text-indigo-600' },
    { label: 'Total', value: quizDetails.totalMarks, color: 'text-gray-800' },
    { label: 'Obtained', value: quizDetails.obtainedMarks, color: 'text-blue-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">{stat.label}</p>
          <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsDisplay;