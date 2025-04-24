import React from 'react';
import { Trophy, FileQuestion } from 'lucide-react';

export const AnswerKeyHeader = ({ quizName, quizTopic, score, correctAnswers, totalQuestions }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 text-white shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{quizName}</h1>
        <h2 className="text-base text-gray-400">{quizTopic}</h2>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-24 h-24 rounded-full ${getScoreColor(score)} font-bold text-2xl`}>
            {score}%
          </div>
          <span className="text-sm text-gray-400">Your Score</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Trophy size={20} />
            <span>{correctAnswers}/{totalQuestions} correct</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileQuestion size={20} />
            <span>{totalQuestions} questions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

