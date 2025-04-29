import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PercentageBarChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);

  useEffect(() => {
    if (!data) return;

    const transformedData = [
      { name: '0-25%', value: data.a || 0 },
      { name: '26-50%', value: data.b || 0 },
      { name: '51-75%', value: data.c || 0 },
      { name: '76-100%', value: data.d || 0 }
    ];

    setChartData(transformedData);
  }, [data]);

  const baseColor = '#3b82f6';
  const hoverColor = '#2563eb';

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded border border-gray-200">
          <p className="font-medium">{`No of quizzes: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Percentage Range Report</h2>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              tickLine={true}
              axisLine={true}
              domain={[0, 'dataMax']}
              ticks={[0, 1, 2, 3, 4, 5]}
            />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={true}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              animationDuration={800}
              onMouseEnter={(data, index) => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={hoveredBar === index ? hoverColor : baseColor}
                  className="transition-colors duration-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          Loading chart data...
        </div>
      )}
    </div>
  );
};

export default PercentageBarChart;