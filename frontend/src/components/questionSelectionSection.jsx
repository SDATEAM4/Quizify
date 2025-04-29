import React, { useState } from 'react';
import { Search, Plus, Minus, CheckCircle } from 'lucide-react';

const QuestionSelectionSection = ({ 
  quizConfig, 
  selectedQuestions, 
  availableQuestions, 
  loading, 
  calculatedDifficulty,
  addQuestion,
  removeQuestion
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter questions based on search term
  const filteredQuestions = availableQuestions.filter(question => 
    question.statement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get difficulty label for individual questions
  const getDifficultyLabel = (level) => {
    if (level <= 1) return "Easy";
    if (level <= 2) return "Medium";
    return "Hard";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col gap-1 justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Select Questions</h2>
          <p className="text-gray-600">
            Select {quizConfig.questionCount} questions or use Auto Fill
            ({selectedQuestions.length}/{quizConfig.questionCount} selected)
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-600">Calculated Difficulty:</span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${calculatedDifficulty.score}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{calculatedDifficulty.label}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search questions..."
          className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Selected Questions Display */}
      {selectedQuestions.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Selected Questions</h3>
          <div className="space-y-2">
            {selectedQuestions.map(question => (
              <div 
                key={question.questionId}
                className="flex items-center justify-between bg-blue-50 p-3 rounded-md border border-blue-100"
              >
                <div className="flex-1">
                  <div className="font-medium">{question.statement}</div>
                  <div className="text-sm text-gray-600">
                    <span className="mr-3">Marks: {question.marks}</span>
                    <span className="mr-3">Level: {getDifficultyLabel(question.level)}</span>
                  </div>
                </div>
                <button 
                  className="text-red-500 hover:bg-red-50 p-1 rounded-full"
                  onClick={() => removeQuestion(question.questionId)}
                >
                  <Minus size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Questions Display */}
      <div>
        <h3 className="font-bold text-lg mb-2">Available Questions</h3>
        {loading ? (
          <div className="text-center py-10">Loading questions...</div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No questions found</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredQuestions.map(question => {
              const isSelected = selectedQuestions.some(q => q.questionId === question.questionId);
              return (
                <div 
                  key={question.questionId}
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    isSelected ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium">{question.statement}</div>
                    <div className="text-sm text-gray-600">
                      <span className="mr-3">Marks: {question.marks}</span>
                      <span className="mr-3">Level: {getDifficultyLabel(question.level)}</span>
                      <span>Correct: {question.correctOption}</span>
                    </div>
                  </div>
                  <button 
                    className={`p-1 rounded-full ${
                      isSelected 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-green-500 hover:bg-green-50'
                    }`}
                    onClick={() => !isSelected && addQuestion(question)}
                    disabled={isSelected}
                  >
                    {isSelected ? <CheckCircle size={20} /> : <Plus size={20} />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionSelectionSection;