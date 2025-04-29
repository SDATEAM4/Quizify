import React from 'react';
import { PieChart as RechartsePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PieChart = ({ quizDetails }) => {
  const correctPercentage = (quizDetails.obtainedMarks / quizDetails.totalMarks) * 100;
  const incorrectPercentage = 100 - correctPercentage;

  const data = [
    { name: 'Correct', value: correctPercentage, color: '#10B981' },
    { name: 'Incorrect', value: incorrectPercentage, color: '#EF4444' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
          <p className="text-sm font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-sm font-medium text-gray-600">
            {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={140}
            paddingAngle={2}
            dataKey="value"
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} />
        </RechartsePieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;