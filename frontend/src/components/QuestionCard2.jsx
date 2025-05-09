import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export const QuestionCard2 = ({ questionNumber, question, isCorrect }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="font-semibold text-slate-600">Question {questionNumber}</div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm ${
          isCorrect 
            ? 'bg-green-50 text-green-600' 
            : 'bg-red-50 text-red-600'
        }`}>
          {isCorrect ? (
            <CheckCircle size={20} className="stroke-[2.5px]" />
          ) : (
            <XCircle size={20} className="stroke-[2.5px]" />
          )}
          <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
        </div>
      </div>
      
      <div className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
        {question.statement}
      </div>
      
      <div className="space-y-3 mb-6">
        {Object.entries(question.options).map(([key, value]) => (
          <div 
            key={key} 
            className={`flex items-center p-4 rounded-lg border ${
              key === question.correct_answer 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <span className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold mr-3 ${
              key === question.correct_answer 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}>
              {key.toUpperCase()}
            </span>
            <span className="flex-1">{value}</span>
            {key === question.correct_answer && (
              <CheckCircle size={16} className="text-green-600 ml-2" />
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
        <h4 className="text-blue-600 font-medium mb-2">Explanation:</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{question.explanation}</p>
      </div>
    </div>
  );
};

