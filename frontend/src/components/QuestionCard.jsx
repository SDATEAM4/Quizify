import React from 'react';

const QuestionCard = ({ question, questionNumber, selectedAnswer, onSelectAnswer }) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm mb-6 transition-all duration-300">
      <div className="text-sm font-semibold text-blue-500 mb-2 uppercase tracking-wider">Question {questionNumber}</div>
      <h2 className="text-xl font-semibold text-slate-800 mb-6 leading-relaxed">{question.question}</h2>
      
      <div className="flex flex-col gap-3">
        {Object.entries(question.options).map(([key, value]) => (
          <label key={key} className="flex items-start p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors duration-200">
            <input
              type="radio"
              name={`question-${questionNumber}`}
              value={key}
              checked={selectedAnswer === key}
              onChange={() => onSelectAnswer(key)}
              className="mt-1 mr-3 cursor-pointer"
            />
            <span className="text-base text-slate-700 leading-relaxed">
              <span className="font-semibold text-blue-500 mr-1">{key}:</span> {value}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;