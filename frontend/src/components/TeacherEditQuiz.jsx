import { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, Plus, Trash2, Filter, Check, RefreshCw } from 'lucide-react';

export const QuizEditView = ({ quizId, onBack }) => {
  const [quiz, setQuiz] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [removedQuestions, setRemovedQuestions] = useState([]);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [loadingAutomatic, setLoadingAutomatic] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch quiz details
    const fetchQuizDetails = async () => {
      try {
        setLoading(true);
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock quiz data - in a real app, you'd fetch this from your API
        const mockQuiz = {
          id: quizId,
          title: "Mathematics Quiz: Algebra",
          category: "Mathematics",
          questions: 10,
          totalMarks: 50,
          timeInMinutes: 45,
          questionsList: [
            { id: 101, statement: "Solve for x: 2x + 5 = 15", points: 5, difficulty: "Easy", correctOption: "A" },
            { id: 102, statement: "Factor the expression: x² - 9", points: 5, difficulty: "Medium", correctOption: "C" },
            { id: 103, statement: "What is the slope of the line 3x + 2y = 6?", points: 5, difficulty: "Medium", correctOption: "B" },
            { id: 104, statement: "Simplify: (2x³)/(4x)", points: 5, difficulty: "Medium", correctOption: "D" },
            { id: 105, statement: "Solve the system: 2x + y = 7, x - y = 1", points: 5, difficulty: "Hard", correctOption: "A" },
            { id: 106, statement: "Find the domain of f(x) = √(x - 3)", points: 5, difficulty: "Medium", correctOption: "C" },
            { id: 107, statement: "If f(x) = 3x² + 2 and g(x) = x - 1, find f(g(2))", points: 5, difficulty: "Hard", correctOption: "B" },
            { id: 108, statement: "Solve: |2x - 4| = 6", points: 5, difficulty: "Medium", correctOption: "D" },
            { id: 109, statement: "Find the value of x if log₃(x) = 2", points: 5, difficulty: "Hard", correctOption: "A" },
            { id: 110, statement: "Simplify: (3x² - 6x) ÷ 3x", points: 5, difficulty: "Medium", correctOption: "C" }
          ]
        };
        
        setQuiz(mockQuiz);
        
        // Simulate fetching available questions
        const mockAvailableQuestions = [
          { id: 201, statement: "Factor completely: x³ - 8", points: 5, difficulty: "Hard", correctOption: "B" },
          { id: 202, statement: "Simplify: (x²y)³/(xy²)²", points: 5, difficulty: "Medium", correctOption: "A" },
          { id: 203, statement: "Determine the equation of a line with slope 2 passing through (3, 1)", points: 5, difficulty: "Medium", correctOption: "D" },
          { id: 204, statement: "Find the derivative of f(x) = x²sin(x)", points: 5, difficulty: "Hard", correctOption: "C" },
          { id: 205, statement: "Find the x-intercepts of the function f(x) = x² - 4x - 5", points: 5, difficulty: "Medium", correctOption: "A" },
          { id: 206, statement: "Evaluate the limit: lim (x²-1)/(x-1) as x→1", points: 5, difficulty: "Hard", correctOption: "B" }
        ];
        
        setAvailableQuestions(mockAvailableQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz details:", error);
        setError("Failed to load quiz details. Please try again.");
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuizDetails();
    }
  }, [quizId]);

  const removeQuestion = (questionId) => {
    const questionToRemove = quiz.questionsList.find(q => q.id === questionId);
    setQuiz({
      ...quiz,
      questionsList: quiz.questionsList.filter(q => q.id !== questionId)
    });
    setRemovedQuestions([...removedQuestions, questionToRemove]);
  };

  const addQuestion = (questionId) => {
    if (quiz.questionsList.length >= quiz.questions) {
      setError("Cannot add more questions. The quiz has reached its maximum question count.");
      return;
    }

    const questionToAdd = availableQuestions.find(q => q.id === questionId);
    setQuiz({
      ...quiz,
      questionsList: [...quiz.questionsList, questionToAdd]
    });
    setAvailableQuestions(availableQuestions.filter(q => q.id !== questionId));
    setShowAddQuestionModal(false);
  };

  const handleAutomaticQuestionFill = () => {
    if (quiz.questionsList.length >= quiz.questions) {
      setError("The quiz already has the required number of questions.");
      return;
    }

    setLoadingAutomatic(true);
    // Simulate API call to get automatic questions
    setTimeout(() => {
      const questionsNeeded = quiz.questions - quiz.questionsList.length;
      const automaticQuestions = availableQuestions.slice(0, questionsNeeded);
      
      setQuiz({
        ...quiz,
        questionsList: [...quiz.questionsList, ...automaticQuestions]
      });
      
      setAvailableQuestions(availableQuestions.filter(
        q => !automaticQuestions.find(aq => aq.id === q.id)
      ));
      
      setLoadingAutomatic(false);
    }, 1000);
  };

  const validateQuizQuestions = () => {
    if (!quiz) return false;
    
    if (quiz.questionsList.length < quiz.questions) {
      setError(`This quiz requires exactly ${quiz.questions} questions. Please add ${quiz.questions - quiz.questionsList.length} more questions.`);
      return false;
    }
    setError("");
    return true;
  };

  const saveQuiz = async () => {
    if (validateQuizQuestions()) {
      try {
        // Simulate API call to save quiz
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        alert("Quiz saved successfully!");
        onBack(); // Navigate back to quiz list
      } catch (error) {
        setError("Failed to save quiz. Please try again.");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (quiz) {
      validateQuizQuestions();
    }
  }, [quiz?.questionsList]);

  if (loading && !quiz) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={32} className="animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Error loading quiz</h2>
          <p>The quiz could not be found or there was an error loading it.</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={onBack}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <button className="flex items-center text-blue-600 mr-4" onClick={onBack}>
            <ArrowLeft size={18} className="mr-1" />
            Back to Quizzes
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Edit: {quiz.title}</h1>
        </div>
        <div className="flex items-center text-sm text-gray-600 space-x-6">
          <span className="bg-gray-100 px-2 py-1 rounded">{quiz.category}</span>
          <span>Required Questions: {quiz.questions}</span>
          <span>Total Marks: {quiz.totalMarks}</span>
          <span>Time: {quiz.timeInMinutes} minutes</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
          <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Questions ({quiz.questionsList.length}/{quiz.questions})
        </h2>
        <div className="flex space-x-3">
          <button 
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            onClick={() => setShowAddQuestionModal(true)}
            disabled={quiz.questionsList.length >= quiz.questions}
          >
            <Plus size={16} className="mr-1" />
            Add Manually
          </button>
          <button 
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            onClick={handleAutomaticQuestionFill}
            disabled={quiz.questionsList.length >= quiz.questions || loadingAutomatic}
          >
            {loadingAutomatic ? (
              <RefreshCw size={16} className="mr-1 animate-spin" />
            ) : (
              <RefreshCw size={16} className="mr-1" />
            )}
            Auto Fill
          </button>
          <button 
            className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={saveQuiz}
          >
            Save Quiz
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct Option</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quiz.questionsList.map((question, index) => (
              <tr key={question.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm text-gray-900">{question.statement}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{question.points}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {question.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Option {question.correctOption}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {quiz.questionsList.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No questions in this quiz. Add questions to continue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for adding questions manually */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-3/4 max-h-3/4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Questions to Add</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddQuestionModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 flex items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="ml-2 p-2 border rounded-md hover:bg-gray-50">
                <Filter size={16} />
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Add</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {availableQuestions.map((question, index) => (
                    <tr key={question.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-normal">
                        <div className="text-sm text-gray-900">{question.statement}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{question.points}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {question.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button 
                          className="bg-blue-50 text-blue-600 p-1 rounded-full hover:bg-blue-100"
                          onClick={() => addQuestion(question.id)}
                          disabled={quiz.questionsList.length >= quiz.questions}
                        >
                          <Plus size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {availableQuestions.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No available questions to add.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end">
              <button 
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 mr-2"
                onClick={() => setShowAddQuestionModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};