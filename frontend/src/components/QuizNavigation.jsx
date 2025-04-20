import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const QuizNavigation = ({ onPrevious, onNext, onEndQuiz, hasPrevious, hasNext }) => {
  return (
    <div className="flex justify-between mb-6">
      <button 
        className={`flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
          ${hasPrevious 
            ? 'bg-blue-500 text-white hover:bg-blue-600 min-w-[110px]' 
            : 'bg-blue-500/50 text-white cursor-not-allowed min-w-[110px]'}`}
        onClick={onPrevious}
        disabled={!hasPrevious}
      >
        <ChevronLeft size={18} className="mr-1.5" />
        <span>Previous</span>
      </button>
      
      <button 
        className="bg-red-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors duration-200"
        onClick={onEndQuiz}
      >
        End Quiz
      </button>
      
      <button 
        className={`flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
          ${hasNext 
            ? 'bg-blue-500 text-white hover:bg-blue-600 min-w-[110px]' 
            : 'bg-blue-500/50 text-white cursor-not-allowed min-w-[110px]'}`}
        onClick={onNext}
        disabled={!hasNext}
      >
        <span>Next</span>
        <ChevronRight size={18} className="ml-1.5" />
      </button>
    </div>
  );
};

export default QuizNavigation;