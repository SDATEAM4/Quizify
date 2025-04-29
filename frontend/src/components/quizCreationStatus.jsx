import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const QuizCreationStatus = ({ status }) => {
  if (!status.loading && !status.success && !status.error) {
    return null;
  }

  return (
    <div className="mt-4 mb-6">
      {status.loading && (
        <div className="p-4 bg-blue-50 rounded-md">
          <p className="text-blue-700">Creating quiz... Please wait.</p>
        </div>
      )}
      
      {status.success && (
        <div className="p-4 bg-green-50 rounded-md">
          <div className="flex items-start">
            <CheckCircle className="text-green-500 mr-2 mt-1" size={20} />
            <div>
              <p className="text-green-700 font-medium">Quiz created successfully!</p>
              <p className="text-green-600 mt-1">Quiz ID: {status.quizId}</p>
              {status.warning && (
                <p className="text-yellow-600 mt-1">{status.warning}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {status.error && (
        <div className="p-4 bg-red-50 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="text-red-500 mr-2 mt-1" size={20} />
            <div>
              <p className="text-red-700 font-medium">Error creating quiz</p>
              <p className="text-red-600 mt-1">{status.error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCreationStatus;