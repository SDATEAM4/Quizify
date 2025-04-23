import React, { useState, useEffect } from 'react';
import { AlertCircle, Search, Plus, Minus, Save, CheckCircle } from 'lucide-react';
import { TeacherNavbar } from '../components/teacherNavbar';

const TeacherAddQuiz = () => {
  // State for quiz configuration
  const [quizConfig, setQuizConfig] = useState({
    subject: "History",
    description: "",
    timeLimit: 3600, // in seconds, default 1 hour
    questionCount: 20,
    mode: "manual", // manual or automatic
    difficulty: "easy", // Only used in automatic mode
  });

  // State for questions
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [calculatedDifficulty, setCalculatedDifficulty] = useState({
    score: 0,
    label: "N/A"
  });
  // Add a state for quiz preview
  const [showPreview, setShowPreview] = useState(false);
  const [finalQuizData, setFinalQuizData] = useState(null);

  // Handle quiz configuration changes
  const handleConfigChange = (field, value) => {
    setQuizConfig({
      ...quizConfig,
      [field]: value
    });
  };

  // Fetch questions based on subject from API
  useEffect(() => {
    setAvailableQuestions(mockQuestions);
  }, [quizConfig.subject]);

  // Add question to selected list
  const addQuestion = (question) => {
    if (selectedQuestions.length < quizConfig.questionCount) {
      const newSelectedQuestions = [...selectedQuestions, question];
      setSelectedQuestions(newSelectedQuestions);
      // Recalculate difficulty score
      calculateDifficulty(newSelectedQuestions);
    }
  };

  // Remove question from selected list
  const removeQuestion = (questionId) => {
    const updatedQuestions = selectedQuestions.filter(q => q.question_id !== questionId);
    setSelectedQuestions(updatedQuestions);
    // Recalculate difficulty score
    calculateDifficulty(updatedQuestions);
  };

  // Calculate difficulty based on selected questions
  const calculateDifficulty = (questions) => {
    if (questions.length === 0) {
      setCalculatedDifficulty({
        score: 0,
        label: "N/A"
      });
      return;
    }
    
    const totalLevel = questions.reduce((sum, question) => sum + question.level, 0);
    const avgLevel = totalLevel / questions.length;
    // Normalize to 0-100 scale (assuming level is between 1-5)
    const score = (avgLevel / 5) * 100;
    
    // Determine difficulty label
    let label;
    if (score <= 20) label = "Very Easy";
    else if (score <= 40) label = "Easy";
    else if (score <= 60) label = "Medium";
    else if (score <= 80) label = "Hard";
    else label = "Very Hard";
    
    setCalculatedDifficulty({
      score,
      label
    });
  };

  // Auto-fill remaining question slots
  const autoFillQuestions = () => {
    if (selectedQuestions.length >= quizConfig.questionCount) return;
    
    const remainingCount = quizConfig.questionCount - selectedQuestions.length;
    const selectedIds = new Set(selectedQuestions.map(q => q.question_id));
    
    // In manual mode, try to maintain the calculated difficulty
    // In automatic mode, use the selected difficulty
    const targetDifficulty = quizConfig.mode === "automatic" 
      ? quizConfig.difficulty 
      : getDifficultyLevelFromScore(calculatedDifficulty.score);
    
    // Filter out already selected questions and sort by appropriate level
    const candidates = availableQuestions
      .filter(q => !selectedIds.has(q.question_id))
      .sort((a, b) => {
        // Sort logic based on difficulty
        if (targetDifficulty === "easy") return a.level - b.level;
        if (targetDifficulty === "hard") return b.level - a.level;
        return 0; // medium - mix of levels
      });
    
    const additionalQuestions = candidates.slice(0, remainingCount);
    const newSelectedQuestions = [...selectedQuestions, ...additionalQuestions];
    
    setSelectedQuestions(newSelectedQuestions);
    calculateDifficulty(newSelectedQuestions);
  };

  // Get difficulty level string from score
  const getDifficultyLevelFromScore = (score) => {
    if (score <= 40) return "easy";
    if (score >= 70) return "hard";
    return "medium";
  };

  // Filter questions based on search term
  const filteredQuestions = availableQuestions.filter(question => 
    question.statement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate final quiz
  const generateQuiz = () => {
    let finalQuestions = [...selectedQuestions];
    
    // Handle automatic mode
    if (quizConfig.mode === "automatic") {
      // Get questions based on selected difficulty
      const filteredByDifficulty = availableQuestions
        .sort((a, b) => {
          if (quizConfig.difficulty === "easy") return a.level - b.level;
          if (quizConfig.difficulty === "hard") return b.level - a.level;
          return 0; // medium - mix of levels
        })
        .slice(0, quizConfig.questionCount);
      
      finalQuestions = filteredByDifficulty;
      setSelectedQuestions(filteredByDifficulty);
      calculateDifficulty(filteredByDifficulty);
    } 
    // Handle manual mode with auto-fill
    else if (quizConfig.mode === "manual" && selectedQuestions.length < quizConfig.questionCount) {
      // In manual mode, auto-fill remaining if needed
      autoFillQuestions();
      // Since autoFillQuestions updates the state asynchronously, 
      // we need to calculate what the final questions will be
      const remainingCount = quizConfig.questionCount - selectedQuestions.length;
      const selectedIds = new Set(selectedQuestions.map(q => q.question_id));
      const targetDifficulty = getDifficultyLevelFromScore(calculatedDifficulty.score);
      
      const candidates = availableQuestions
        .filter(q => !selectedIds.has(q.question_id))
        .sort((a, b) => {
          if (targetDifficulty === "easy") return a.level - b.level;
          if (targetDifficulty === "hard") return b.level - a.level;
          return 0;
        });
      
      const additionalQuestions = candidates.slice(0, remainingCount);
      finalQuestions = [...selectedQuestions, ...additionalQuestions];
    }
    
    // Prepare quiz data for preview
    const quizData = {
      ...quizConfig,
      questions: finalQuestions,
      calculatedDifficulty: calculatedDifficulty.label
    };
    
    // Set the final quiz data for preview
    setFinalQuizData(quizData);
    setShowPreview(true);
  };

  // Submit final quiz after preview
  const submitQuiz = () => {
    if (finalQuizData) {
      console.log("Submitting quiz:", finalQuizData);
      // Actual API call would go here
      // After successful submission, you could redirect or show a success message
      alert("Quiz successfully created!");
      // Reset preview
      setShowPreview(false);
    }
  };

  // Cancel quiz preview
  const cancelPreview = () => {
    setShowPreview(false);
    setFinalQuizData(null);
  };

  // Get difficulty level display for individual questions
  const getDifficultyLabel = (level) => {
    if (level <= 1) return "Very Easy";
    if (level <= 2) return "Easy";
    if (level <= 3) return "Medium";
    if (level <= 4) return "Hard";
    return "Very Hard";
  };

  // Quiz Preview Component
  const QuizPreview = () => {
    if (!finalQuizData) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl max-h-screen overflow-y-auto">
          <h2 className="text-2xl font-bold mb-2">Quiz Preview</h2>
          <p className="text-gray-600 mb-6">Review your quiz before finalizing</p>
          
          <div className="mb-6">
            <h3 className="font-bold text-lg">Quiz Details</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-medium">{finalQuizData.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="font-medium">{finalQuizData.questions.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Limit</p>
                <p className="font-medium">{finalQuizData.timeLimit / 60} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="font-medium">{finalQuizData.calculatedDifficulty}</p>
              </div>
              {finalQuizData.description && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">{finalQuizData.description}</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-2">Questions ({finalQuizData.questions.length})</h3>
            <div className="space-y-4">
              {finalQuizData.questions.map((question, index) => (
                <div key={question.question_id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-lg">Q{index + 1}.</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded-md">
                        {getDifficultyLabel(question.level)}
                      </span>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded-md">
                        {question.marks} marks
                      </span>
                    </div>
                  </div>
                  <p className="mt-1">{question.statement}</p>
                  
                  {question.options && (
                    <div className="mt-3 pl-6">
                      <p className="text-sm text-gray-600 mb-1">Options:</p>
                      <ul className="space-y-1">
                        {question.options.map((option, i) => (
                          <li key={i} className={`${option === question.correct_option ? 'font-medium text-green-600' : ''}`}>
                            {option} {option === question.correct_option && '(Correct)'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {!question.options && (
                    <div className="mt-3 pl-6">
                      <p className="text-sm text-gray-600">Essay/Free response question</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button 
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800"
              onClick={cancelPreview}
            >
              Back to Edit
            </button>
            <button 
              className="px-4 py-2 rounded-md bg-black text-white"
              onClick={submitQuiz}
            >
              Confirm & Create Quiz
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-w-screen max-h-screen">
      <TeacherNavbar/>
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-6 p-6 bg-gray-50 max-w-1/2">
          {/* Quiz Configuration Section */}
          <div className="bg-white rounded-lg shadow p-6">
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
                    <option value="History">History</option>
                    <option value="Science">Science</option>
                    <option value="Math">Math</option>
                    <option value="Literature">Literature</option>
                    <option value="Geography">Geography</option>
                  </select>
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
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
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

          {/* Questions Selection Section - Only show in manual mode */}
          {quizConfig.mode === "manual" && (
            <div className="bg-white rounded-lg shadow p-6">
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
                        key={question.question_id}
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
                          onClick={() => removeQuestion(question.question_id)}
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
                      const isSelected = selectedQuestions.some(q => q.question_id === question.question_id);
                      return (
                        <div 
                          key={question.question_id}
                          className={`flex items-center justify-between p-3 rounded-md border ${
                            isSelected ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="font-medium">{question.statement}</div>
                            <div className="text-sm text-gray-600">
                              <span className="mr-3">Marks: {question.marks}</span>
                              <span className="mr-3">Level: {getDifficultyLabel(question.level)}</span>
                              <span>Type: {question.options ? 'Multiple Choice' : 'Essay'}</span>
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
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button 
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-800"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            {quizConfig.mode === 'manual' && selectedQuestions.length > 0 && selectedQuestions.length < quizConfig.questionCount && (
              <button 
                className="px-4 py-2 rounded-md bg-blue-600 text-white"
                onClick={autoFillQuestions}
              >
                Auto Fill Remaining
              </button>
            )}
            <button 
              className="px-4 py-2 rounded-md bg-black text-white"
              onClick={generateQuiz}
            >
              Generate Quiz
            </button>
          </div>
        </div>
      </div>
      
      {/* Preview Modal */}
      {showPreview && <QuizPreview />}
    </div>
  );
};

// Simplified mock data for testing
const mockQuestions = [
  {
    question_id: 1,
    statement: "What is the capital of France?",
    points: 10,
    marks: 10,
    level: 1,
    subject_id: 1,
    correct_option: "Paris",
    options: ["London", "Paris", "Berlin", "Madrid"]
  },
  {
    question_id: 2,
    statement: "Who wrote 'Romeo and Juliet'?",
    points: 15,
    marks: 15,
    level: 2,
    subject_id: 3,
    correct_option: "William Shakespeare",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"]
  },
  {
    question_id: 3,
    statement: "Explain the process of photosynthesis and its importance to life on Earth.",
    points: 25,
    marks: 25,
    level: 4,
    subject_id: 2,
    correct_option: null,
    options: null
  },
  {
    question_id: 4,
    statement: "What is the Pythagorean theorem?",
    points: 15,
    marks: 15,
    level: 3,
    subject_id: 4,
    correct_option: null,
    options: null
  },
  {
    question_id: 5,
    statement: "Name the largest ocean on Earth.",
    points: 10,
    marks: 10,
    level: 1,
    subject_id: 5,
    correct_option: "Pacific Ocean",
    options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"]
  }
];

export default TeacherAddQuiz;