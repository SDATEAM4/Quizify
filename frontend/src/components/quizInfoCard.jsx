import React from "react";

const QuizInfoCard = ({ reportData, quizInfo }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            {reportData?.quizName || quizInfo.title}
          </h3>
          <p className="text-gray-500 mt-1">
            Subject: {reportData?.subjectName || quizInfo.subject} | Quiz ID: {quizInfo.quizId}
          </p>
          {reportData?.description && (
            <p className="text-gray-600 mt-2 max-w-2xl">
              {reportData.description}
            </p>
          )}
        </div>
        <div className="px-4 py-2 bg-gray-200 rounded-md">
          <p className="font-medium">
            {reportData?.type || "Unknown Type"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizInfoCard;