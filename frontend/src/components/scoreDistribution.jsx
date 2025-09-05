import React, { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { scoreRangeColors } from "./reportDataUtil";

const ScoreDistributionChart = ({ data, totalAttempts }) => {

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Score Distribution
      </h2>
      {totalAttempts > 0 ? (
        <div className="h-64 mt-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="range"
                label={{
                  value: "Marks",
                  position: "insideBottom",
                  dy: 40,
                  dx: -20,
                  style: { fontSize: 14 },
                }}
              />
              <YAxis
                domain={[0, "auto"]}
                allowDecimals={false}
                label={{
                  value: "Students",
                  angle: -90,
                  position: "insideLeft",
                  dx: -10,
                  style: { fontSize: 14 },
                }}
              />
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
              <Bar dataKey="students" name="Students" fill="#2c3e50">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={scoreRangeColors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No attempts for this quiz yet</p>
        </div>
      )}
    </div>
  );
};

export default ScoreDistributionChart;
