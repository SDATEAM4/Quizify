import React from 'react';

const QuizConfigSection = ({ quizConfig, subjects, handleConfigChange }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Create New Quiz</h2>
      <p className="text-gray-600 mb-6">Configure your quiz settings below</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              value={quizConfig.subject}
              onChange={(e) => handleConfigChange('subject', e.target.value)}
            >
              {subjects.map(subject => (
                <option key={subject.subject_id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={quizConfig.title}
              onChange={(e) => handleConfigChange('title', e.target.value)}
              placeholder="Enter quiz title..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              value={quizConfig.description}
              onChange={(e) => handleConfigChange('description', e.target.value)}
              rows={3}
              placeholder="Enter quiz description here..."
            />
          </div>
          
          {/* Only show difficulty selector in automatic mode */}
          {quizConfig.mode === "automatic" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Difficulty</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={quizConfig.difficulty}
                onChange={(e) => handleConfigChange('difficulty', e.target.value)}
              >
                <option value="easy">Beginner</option>
                <option value="medium">Intermediate</option>
                <option value="hard">Advanced</option>
              </select>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
            <div className="flex gap-3">
              {[5, 10, 15, 20].map(num => (
                <button
                  key={num}
                  className={`px-4 py-2 rounded-md ${
                    quizConfig.questionCount === num 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  onClick={() => handleConfigChange('questionCount', num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
            <div className="flex gap-3">
              <button
                className={`px-4 py-2 rounded-md flex-1 ${
                  quizConfig.mode === 'manual' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => handleConfigChange('mode', 'manual')}
              >
                Manual/Mixed
              </button>
              <button
                className={`px-4 py-2 rounded-md flex-1 ${
                  quizConfig.mode === 'automatic' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => handleConfigChange('mode', 'automatic')}
              >
                Automatic
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit</label>
            <div className="flex gap-2 items-center">
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={quizConfig.timeLimit / 60} // Convert seconds to minutes for display
                onChange={(e) => handleConfigChange('timeLimit', parseInt(e.target.value) * 60)}
                min={1}
              />
              <span className="text-gray-600">minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizConfigSection;