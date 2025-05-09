import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, RefreshCw } from 'lucide-react';
import axios from 'axios';

export const QuizEditView = ({ quiz, teacherId, onBack }) => {
  const [title, setTitle] = useState(quiz?.title || '');
  const [description, setDescription] = useState(quiz?.description || '');
  const [timeLimit, setTimeLimit] = useState(quiz?.timeInMinutes || 30);
  const [level, setLevel] = useState(quiz?.level || '1');
  const [questions, setQuestions] = useState(quiz?.questionsList || []);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  // The count of questions needed for this quiz
  const requiredQuestionCount = quiz?.questionsList?.length || 10;
  
  const transformQuestion = (apiQuestion) => {
    const optionLabels = ["a", "b", "c", "d"];
    const correctIndex = apiQuestion.options.indexOf(apiQuestion.correctOption);
  
    return {
      question_id: apiQuestion.questionId,
      statement: apiQuestion.statement,
      marks: apiQuestion.marks,
      level: apiQuestion.level.toString(),
      options: {
        a: apiQuestion.options[0],
        b: apiQuestion.options[1],
        c: apiQuestion.options[2],
        d: apiQuestion.options[3]
      },
      correct_answer: optionLabels[correctIndex] ?? null, // null if not found
    };
  };
  
  
  // Fetch available questions from the subject
  useEffect(() => {
    const fetchAvailableQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/Quizify/questions/subject/${quiz.subjectId}`);
        
        // Transform the data format
        const transformedQuestions = response.data.map(transformQuestion);
        
        // Filter out questions already in the quiz
        const currentQuestionIds = new Set(questions.map(q => q.question_id));
        const filteredQuestions = transformedQuestions.filter(q => !currentQuestionIds.has(q.question_id));
        
        setAvailableQuestions(filteredQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions. Please try again.");
        setLoading(false);
      }
    };

    if (quiz?.subjectId) {
      fetchAvailableQuestions();
    }
  }, [quiz?.subjectId, questions]);

  // Filter available questions based on search and level
  const filteredAvailableQuestions = availableQuestions.filter(question => {
    const matchesSearch = searchQuery === '' || 
      question.statement.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = filterLevel === 'all' || 
      parseInt(question.level) === parseInt(filterLevel);
    
    return matchesSearch && matchesLevel;
  });

  // Handle adding a question to the quiz
  const handleAddQuestion = (question) => {
    if (questions.length >= requiredQuestionCount) {
      setError(`You can only have ${requiredQuestionCount} questions. Remove a question before adding a new one.`);
      return;
    }
    
    setQuestions([...questions, question]);
    setAvailableQuestions(availableQuestions.filter(q => q.question_id !== question.question_id));
    setError('');
  };

  // Handle removing a question from the quiz
  const handleRemoveQuestion = (questionId) => {
    const questionToRemove = questions.find(q => q.question_id === questionId);
    
    setQuestions(questions.filter(q => q.question_id !== questionId));
    
    if (questionToRemove) {
      setAvailableQuestions([...availableQuestions, questionToRemove]);
    }
  };

  // Calculate total marks
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  // Handle saving the quiz
  const handleSaveQuiz = async () => {
    if (questions.length !== requiredQuestionCount) {
      setError(`You must have exactly ${requiredQuestionCount} questions.`);
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        count: requiredQuestionCount,
        questionIds: questions.map(q => q.question_id),
        subjectId: quiz.subjectId,
        teacherId: teacherId,
        title: title,
        description: description,
        timeLimit: parseInt(timeLimit),
        level: level
      };
      
      const response = await axios.post(`http://localhost:8080/Quizify/quizzes/${quiz.id}/edit/manual`, payload);
      
      setSuccess('Quiz saved successfully!');
      setLoading(false);
      
      // Redirect after a brief delay
      setTimeout(() => {
        onBack();
      }, 1500);
      
    } catch (error) {
      console.error("Error saving quiz:", error);
      setError("Failed to save quiz. Please try again.");
      setLoading(false);
    }
  };

  // Auto-fill questions if needed
  const handleAutoFill = async () => {
    try {
      setLoading(true);
      
      if (questions.length >= requiredQuestionCount) {
        setError(`You already have ${requiredQuestionCount} questions.`);
        setLoading(false);
        return;
      }
      
      const neededQuestions = requiredQuestionCount - questions.length;
      
      // For auto-fill, we'll take questions from available questions that match the level
      const matchingLevelQuestions = availableQuestions.filter(q => 
        parseInt(q.level) === parseInt(level)
      );
      
      // If we don't have enough questions of the right level, we'll take any available questions
      if (matchingLevelQuestions.length < neededQuestions) {
        // Take as many questions as we can, up to the needed amount
        const additionalQuestions = matchingLevelQuestions.slice(0, neededQuestions);
        setQuestions([...questions, ...additionalQuestions]);
        
        const remainingNeeded = neededQuestions - additionalQuestions.length;
        
        if (remainingNeeded > 0) {
          // Take random questions from any level if we still need more
          const randomQuestions = availableQuestions
            .filter(q => !matchingLevelQuestions.includes(q))
            .slice(0, remainingNeeded);
            
          setQuestions([...questions, ...additionalQuestions, ...randomQuestions]);
        }
      } else {
        // If we have enough questions of the right level, take what we need
        const additionalQuestions = matchingLevelQuestions.slice(0, neededQuestions);
        setQuestions([...questions, ...additionalQuestions]);
      }
      
      // Remove added questions from available questions
      const addedQuestionIds = new Set([...questions].map(q => q.question_id));
      setAvailableQuestions(availableQuestions.filter(q => !addedQuestionIds.has(q.question_id)));
      
      setLoading(false);
    } catch (error) {
      console.error("Error auto-filling questions:", error);
      setError("Failed to auto-fill questions. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Quizzes
          </button>
          
          <div className='flex flex-row gap-2 '>

          {questions.length < requiredQuestionCount && (
            <div className="">
              <button
                onClick={handleAutoFill}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                <RefreshCw size={16} className="mr-2" />
                Auto-fill Remaining Questions
              </button>
            </div>
          )}

          <button
            onClick={handleSaveQuiz}
            disabled={loading || questions.length !== requiredQuestionCount}
            className={`flex items-center px-4 py-2 rounded-md ${
              loading || questions.length !== requiredQuestionCount
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {loading ? (
              <RefreshCw size={18} className="mr-2 animate-spin" />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            Save Quiz
          </button>
        </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md mb-4">
            {success}
          </div>
        )}
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Quiz</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              min="1"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Easy</option>
              <option value="2">Medium</option>
              <option value="3">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={quiz?.category || ''}
              disabled
              className="w-full p-2 border rounded-md bg-gray-50"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl pt-3 pb-4 font-bold text-gray-800">
              Selected Questions ({questions.length}/{requiredQuestionCount})
            </h2>
            <div className="text-sm text-gray-600">
              Total Marks: {totalMarks}
            </div>
          </div>
          
          {questions.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {questions.map((question, index) => (
                <div key={question.question_id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex justify-between">
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <span className="font-medium">{index + 1}. {question.statement}</span>
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {question.marks} marks
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div className={`p-1 rounded ${question.correct_answer === 'a' ? 'bg-green-100' : ''}`}>
                          A: {question.options.a}
                        </div>
                        <div className={`p-1 rounded ${question.correct_answer === 'b' ? 'bg-green-100' : ''}`}>
                          B: {question.options.b}
                        </div>
                        <div className={`p-1 rounded ${question.correct_answer === 'c' ? 'bg-green-100' : ''}`}>
                          C: {question.options.c}
                        </div>
                        <div className={`p-1 rounded ${question.correct_answer === 'd' ? 'bg-green-100' : ''}`}>
                          D: {question.options.d}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveQuestion(question.question_id)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-md text-center">
              <p className="text-gray-500">No questions selected yet.</p>
            </div>
          )}
          
          
        </div>
        
        <div>
          <h2 className="py-3 text-2xl font-bold text-gray-800 mb-2">Available Questions</h2>
          
          <div className="flex mb-4 space-x-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="1">Easy</option>
                <option value="2">Medium</option>
                <option value="3">Hard</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <RefreshCw size={32} className="animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredAvailableQuestions.length > 0 ? (
                filteredAvailableQuestions.map((question) => (
                  <div key={question.question_id} className="bg-white p-3 rounded-md border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between">
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <span className="font-medium">{question.statement}</span>
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {question.marks} marks
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div className={`p-1 rounded ${question.correct_answer === 'a' ? 'bg-green-100' : ''}`}>
                            A: {question.options.a}
                          </div>
                          <div className={`p-1 rounded ${question.correct_answer === 'b' ? 'bg-green-100' : ''}`}>
                            B: {question.options.b}
                          </div>
                          <div className={`p-1 rounded ${question.correct_answer === 'c' ? 'bg-green-100' : ''}`}>
                            C: {question.options.c}
                          </div>
                          <div className={`p-1 rounded ${question.correct_answer === 'd' ? 'bg-green-100' : ''}`}>
                            D: {question.options.d}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddQuestion(question)}
                        disabled={questions.length >= requiredQuestionCount}
                        className={`ml-2 ${
                          questions.length >= requiredQuestionCount
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-4 rounded-md border border-gray-200 text-center">
                  <p className="text-gray-500">No matching questions found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};