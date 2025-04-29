import React from "react";

const ReportNavigation = ({ totalQuizzes, currentIndex, onPrevious, onNext }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">Quiz Reports</h2>
      <div className="flex items-center space-x-4">
        <p className="text-gray-500">
          {totalQuizzes > 0
            ? `${currentIndex + 1} of ${totalQuizzes}`
            : "No reports"}
        </p>
        <div className="flex space-x-2">
          <button
            className="bg-gray-200 p-2 rounded-full disabled:opacity-50"
            onClick={onPrevious}
            disabled={currentIndex === 0 || totalQuizzes === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            className="bg-gray-200 p-2 rounded-full disabled:opacity-50"
            onClick={onNext}
            disabled={currentIndex === totalQuizzes - 1 || totalQuizzes === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportNavigation;