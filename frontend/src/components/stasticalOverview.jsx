import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

const StatisticalOverviewChart = ({ reportData }) => {
  // Check if we have valid report data
  if (!reportData || reportData.totalAttempts === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Statistical Overview</h3>
        <p className="text-gray-500">No data available for this quiz yet.</p>
      </div>
    );
  }

  // Format the data for the chart
  const scores = [
    {
      name: "Min",
      value: reportData.minimumMarks || 0,
      color: "#EF4444", // Red for minimum
    },
    {
      name: "Avg",
      value: reportData.averageMarks || 0,
      color: "#3B82F6", // Blue for average
    },
    {
      name: "Max",
      value: reportData.maximumMarks || 0,
      color: "#10B981", // Green for maximum
    },
  ];

  // Create another set of data for the comparison chart
  const quizData = [
    {
      name: "Statistics",
      minimum: reportData.minimumMarks || 0,
      average: reportData.averageMarks || 0,
      maximum: reportData.maximumMarks || 0,
    },
  ];

  // Calculate the highest value to set the domain for Y axis
  const maxValue = Math.max(
    reportData.maximumMarks || 0,
    reportData.totalMarks || 0
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Statistical Overview</h3>

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500">Minimum Score</p>
            <p className="text-xl font-bold">{reportData.minimumMarks || 0}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500">Maximum Score</p>
            <p className="text-xl font-bold">{reportData.maximumMarks || 0}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500">Average Score</p>
            <p className="text-xl font-bold">{reportData.averageMarks || 0}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500">Total Participants</p>
            <p className="text-xl font-bold">{reportData.totalAttempts || 0}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500">Total Marks</p>
            <p className="text-xl font-bold">{reportData.totalMarks || 0}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-500">Time Limit</p>
            <p className="text-xl font-bold">{(reportData.timeLimit)/60|| 0} min</p>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={scores}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, maxValue]} />
            <Tooltip />
            <Legend />
            <ReferenceLine
              y={reportData.totalMarks || 0}
              stroke="#FF8042"
              strokeDasharray="3 3"
              label={{
                value: "Total Marks",
                position: "top",
                offset: -20, // 🔥 Push it down a bit
                fill: "#FF8042",
                fontSize: 16,
              }}
            />

            <Bar dataKey="value" name="Score">
              {scores.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatisticalOverviewChart;
