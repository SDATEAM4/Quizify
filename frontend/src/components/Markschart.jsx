import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const MarksChart = ({ quizDetails }) => {
  const chartData = [
    {
      name: 'Minimum',
      value: quizDetails.minMarks,
      fill: '#F59E0B'
    },
    {
      name: 'Maximum',
      value: quizDetails.maxMarks,
      fill: '#10B981'
    },
    {
      name: 'Average',
      value: quizDetails.averageMarks,
      fill: '#6366F1'
    },
    {
      name: 'Obtained',
      value: quizDetails.obtainedMarks,
      fill: '#3B82F6'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-sm font-medium text-gray-600">
            Marks: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#4B5563' }}
            tickLine={{ stroke: '#4B5563' }}
            axisLine={{ stroke: '#9CA3AF' }}
          />
          <YAxis
            tick={{ fill: '#4B5563' }}
            tickLine={{ stroke: '#4B5563' }}
            axisLine={{ stroke: '#9CA3AF' }}
            domain={[0, Math.ceil(quizDetails.totalMarks / 10) * 10]}
            label={{ value: 'Marks', angle: -90, position: 'insideLeft', offset: 0 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          {chartData.map((entry) => (
            <Bar
              key={entry.name}
              dataKey="value"
              name={entry.name}
              fill={entry.fill}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              maxBarSize={60}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarksChart;