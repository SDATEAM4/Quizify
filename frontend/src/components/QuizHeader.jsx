import React from 'react';
import { Clock } from 'lucide-react';

const QuizHeader = ({ quizName, quizTopic, timeRemaining, quizType }) => {
  return (
    <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 m-0">{quizName}</h1>
        <p className="text-base text-slate-500 mt-1 m-0">{quizTopic}</p>
      </div>
      <div className="flex items-center bg-slate-100 px-4 py-2 rounded-full font-semibold text-slate-700">
        <Clock size={20} className="mr-2 text-blue-500" />
        <span className="text-lg tabular-nums">{timeRemaining}</span>
      </div>
    </div>
  );
};

export default QuizHeader;