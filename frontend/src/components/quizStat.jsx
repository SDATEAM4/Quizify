import React, { useEffect } from "react";

const QuizStatsSummary = ({ reportData }) => {
  // Check if we have valid report data
  if (!reportData || reportData.totalAttempts === 0) {
    return null;
  }
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Quiz Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Minimum Score</p>
          <p className="text-xl font-bold text-red-600">{reportData.minimumMarks || 0}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Maximum Score</p>
          <p className="text-xl font-bold text-green-600">{reportData.maximumMarks || 0}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Average Score</p>
          <p className="text-xl font-bold text-blue-600">{reportData.averageMarks || 0}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Total Participants</p>
          <p className="text-xl font-bold text-purple-600">{reportData.totalAttempts || 0}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Total Marks</p>
          <p className="text-xl font-bold text-yellow-600">{reportData.totalMarks || 0}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Time Limit</p>
          <p className="text-xl font-bold text-pink-600">
            {Math.round(reportData.timeLimit / 60) || 0} min
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizStatsSummary;
