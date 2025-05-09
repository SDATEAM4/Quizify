import React from 'react';

const QuizProgress = ({ currentQuestion, totalQuestions, progressPercentage }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-slate-500 mb-2">
        <span>Question {currentQuestion} of {totalQuestions}</span>
        <span className="font-semibold">{progressPercentage}% Complete</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuizProgress;