import React from 'react';
import PercentageBarChart from './PercentageBarChart';

const ChartReport = ({ dataset }) => {
  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-md">      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <PercentageBarChart data={dataset} />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(dataset || {}).map(([key, value]) => {
          const ranges = {
            a: '0-25%',
            b: '26-50%',
            c: '51-75%',
            d: '76-100%'
          };

          return (
            <div key={key} className="bg-white p-4 rounded-lg shadow-sm text-center sm:text-left">
              <h3 className="text-sm font-medium text-gray-500">{ranges[key]}</h3>
              <p className="text-2xl font-bold text-blue-600">{value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartReport;
