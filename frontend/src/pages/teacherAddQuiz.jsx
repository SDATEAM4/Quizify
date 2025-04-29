import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { TeacherNavbar } from '../components/teacherNavbar';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import QuizConfigSection from '../components/quizConfigSection';
import QuestionSelectionSection from '../components/questionSelectionSection';
import QuizCreationStatus from '../components/quizCreationStatus';
import toast from 'react-hot-toast';
import BackgroundTypography from "../components/backgroundTypography"
const TeacherAddQuiz = () => {
  const { teacherId } = useAuth();
  // State for quiz configuration
  const [quizConfig, setQuizConfig] = useState({
    subject: "", 
    subjectId: 0,
    title: "",
    description: "",
    timeLimit: 3600, // in seconds, default 1 hour
    questionCount: 10,
    mode: "automatic", // Default to automatic mode
    difficulty: "easy", // Default to beginner/easy
  });

  // State for subjects and questions
  const [subjects, setSubjects] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizCreationStatus, setQuizCreationStatus] = useState({
    loading: false,
    success: false,
    error: null,
    warning: null,
    quizId: null
  });

  // Calculated difficulty based on selected questions
  const [calculatedDifficulty, setCalculatedDifficulty] = useState({
    score: 0,
    label: "N/A"
  });

  useEffect(() => {
    document.title = 'Quizify - Teacher Add Quiz';
    // Fetch subjects on component mount
    fetchSubjects();
  }, []);

  // Fetch subjects from API
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/Quizify/admin/subjects');
      setSubjects(response.data);
      
      // Set default subject if subjects are available
      if (response.data.length > 0) {
        setQuizConfig(prev => ({
          ...prev,
          subject: response.data[0].name,
          subjectId: response.data[0].subject_id
        }));
        
        // Load questions for the default subject
        fetchQuestions(response.data[0].subject_id);

      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch subjects. Please try again later.');
      setLoading(false);
      toast.success("Error fetching subjects");
      console.error('Error fetching subjects:', err);
    }
  };

  // Fetch questions for a specific subject
  const fetchQuestions = async (subjectId) => {
    try {
      setQuestionsLoading(true);
      const response = await axios.get(`http://localhost:8080/Quizify/questions/subject/${subjectId}`);
      setAvailableQuestions(response.data);
      toast.success("subjects fetched successfully")
      setQuestionsLoading(false);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setQuestionsLoading(false);
    }
  };

  // Handle quiz configuration changes
  const handleConfigChange = (field, value) => {
    setQuizConfig({
      ...quizConfig,
      [field]: value
    });

    // If subject changed, update subjectId and fetch questions
    if (field === 'subject') {
      const selectedSubject = subjects.find(subject => subject.name === value);
      if (selectedSubject) {
        setQuizConfig(prev => ({
          ...prev,
          subjectId: selectedSubject.subject_id
        }));
        fetchQuestions(selectedSubject.subject_id);
        // Reset selected questions when subject changes
        setSelectedQuestions([]);
      }
    }
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
    // Normalize to 0-100 scale (assuming level is between 1-3)
    const score = (avgLevel / 3) * 100;
    
    // Determine difficulty label
    let label;
    if (score <= 33) label = "Easy";
    else if (score <= 66) label = "Medium";
    else label = "Hard";
    
    setCalculatedDifficulty({
      score,
      label
    });
  };

  // Map difficulty level to API level
  const mapDifficultyToLevel = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      default: return 1;
    }
  };

  // Generate quiz
  const generateQuiz = async () => {
    if (quizConfig.mode === "automatic") {
      await generateAutomaticQuiz();
    } else {
      // Generate manual quiz if enough questions are selected
      if (selectedQuestions.length > 0) {
        await generateManualQuiz();
      } else {
        alert("Please select at least one question for manual quiz generation");
      }
    }
  };

  // Generate automatic quiz
  const generateAutomaticQuiz = async () => {
    try {
      setQuizCreationStatus({
        loading: true,
        success: false,
        error: null,
        warning: null,
        quizId: null
      });

      // Prepare request payload
      const payload = {
        count: quizConfig.questionCount,
        subjectId: quizConfig.subjectId,
        teacherId: teacherId,
        level: mapDifficultyToLevel(quizConfig.difficulty),
        title: quizConfig.title || `${quizConfig.difficulty} ${quizConfig.subject} Quiz`,
        description: quizConfig.description || `Automatically generated ${quizConfig.difficulty} quiz for ${quizConfig.subject}`,
        timeLimit: quizConfig.timeLimit / 60 // Convert seconds to minutes
      };

      console.log(payload)
      // Send request to create automatic quiz
      const response = await axios.post('http://localhost:8080/Quizify/quizzes/create/auto', payload);
      
      // Handle response
      if (response.data.quiz_id) {
        setQuizCreationStatus({
          loading: false,
          success: true,
          error: null,
          warning: response.data.warning || null,
          quizId: response.data.quiz_id
        });
        
        // Show success message
toast.success(
  response.data.warning
    ? `Quiz created with ${response.data.actual_questions} questions instead of ${response.data.requested_questions}. ${response.data.warning}`
    : `Quiz created successfully with ${response.data.actual_questions} questions!`
);
      }
    } catch (err) {
      setQuizCreationStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to create quiz. Please try again.',
        warning: null,
        quizId: null
      });
      console.error('Error creating quiz:', err);
    }
  };

  // Generate manual quiz
  const generateManualQuiz = async () => {
    try {
      setQuizCreationStatus({
        loading: true,
        success: false,
        error: null,
        warning: null,
        quizId: null
      });

      // Get question IDs from selected questions
      const questionIds = selectedQuestions.map(q => q.questionId);

      // Prepare request payload
      const payload = {
        count: quizConfig.questionCount,
        questionIds: questionIds,
        subjectId: quizConfig.subjectId,
        teacherId: teacherId,
        title: quizConfig.title || `Custom ${quizConfig.subject} Quiz`,
        description: quizConfig.description || `Manually created quiz for ${quizConfig.subject}`,
        timeLimit: quizConfig.timeLimit / 60, // Convert seconds to minutes
        level: calculatedDifficulty.label.toLowerCase() === "medium" ? "2" : 
               calculatedDifficulty.label.toLowerCase() === "hard" ? "3" : '1'
      };


      console.log(payload)
      // Send request to create manual quiz
      const response = await axios.post('http://localhost:8080/Quizify/quizzes/create/manual', payload);
      
      // Handle response
      if (response.data.quiz_id) {
        setQuizCreationStatus({
          loading: false,
          success: true,
          error: null,
          warning: response.data.warning || null,
          quizId: response.data.quiz_id
        });
        
        toast.success(
          response.data.warning
            ? `Quiz created with ${response.data.actual_questions} questions (${response.data.requested_questions} selected + ${response.data.actual_questions - response.data.requested_questions} auto-filled). ${response.data.warning}`
            : `Quiz created successfully with ${response.data.actual_questions} questions!`
        );
      }
    } catch (err) {
      setQuizCreationStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to create manual quiz. Please try again.',
        warning: null,
        quizId: null
      });
      toast.error("Error creating manual quiz:" ,err);
      console.error('Error creating manual quiz:', err);
    }
  };

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
    const updatedQuestions = selectedQuestions.filter(q => q.questionId !== questionId);
    setSelectedQuestions(updatedQuestions);
    // Recalculate difficulty score
    calculateDifficulty(updatedQuestions);
  };

  // Auto-fill remaining question slots
  const autoFillQuestions = () => {
    if (selectedQuestions.length >= quizConfig.questionCount) return;
    
    const remainingCount = quizConfig.questionCount - selectedQuestions.length;
    const selectedIds = new Set(selectedQuestions.map(q => q.questionId));
    
    // Get target difficulty level
    const targetLevel = calculatedDifficulty.label.toLowerCase() === "n/a" 
      ? quizConfig.difficulty.toLowerCase() 
      : calculatedDifficulty.label.toLowerCase();
    
    // Map difficulty label to numeric level
    const getNumericLevel = (label) => {
      switch (label) {
        case 'easy': return 1;
        case 'medium': return 2;
        case 'hard': return 3;
        default: return 2;
      }
    };
    
    // Filter out already selected questions
    const candidateQuestions = availableQuestions.filter(q => !selectedIds.has(q.questionId));
    
    // Sort questions by level proximity to target level
    const targetNumericLevel = getNumericLevel(targetLevel);
    candidateQuestions.sort((a, b) => {
      const aDiff = Math.abs(a.level - targetNumericLevel);
      const bDiff = Math.abs(b.level - targetNumericLevel);
      return aDiff - bDiff;
    });
    
    // Select additional questions
    const additionalQuestions = candidateQuestions.slice(0, remainingCount);
    const newSelectedQuestions = [...selectedQuestions, ...additionalQuestions];
    
    setSelectedQuestions(newSelectedQuestions);
    calculateDifficulty(newSelectedQuestions);
  };

  // Show loading state while fetching subjects
  if (loading && subjects.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <TeacherNavbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center p-6">
            <p className="text-lg">Loading subjects...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if subjects fetch failed
  if (error && subjects.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <TeacherNavbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={40} />
            <p className="text-lg font-semibold text-red-700">Error</p>
            <p className="mt-2">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-black text-white rounded-md"
              onClick={fetchSubjects}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TeacherNavbar/>
      <BackgroundTypography/>
      <div className="flex-1 flex justify-center items-center z-20">
        <div className="w-full max-w-4xl p-6">
          {/* Quiz Configuration Section */}
          <QuizConfigSection 
            quizConfig={quizConfig}
            subjects={subjects}
            handleConfigChange={handleConfigChange}
          />

          {/* Quiz Creation Status */}
          <QuizCreationStatus status={quizCreationStatus} />

          {/* Questions Selection Section - Only show in manual mode */}
          {quizConfig.mode === "manual" && (
            <QuestionSelectionSection
              quizConfig={quizConfig}
              selectedQuestions={selectedQuestions}
              availableQuestions={availableQuestions}
              loading={questionsLoading}
              calculatedDifficulty={calculatedDifficulty}
              addQuestion={addQuestion}
              removeQuestion={removeQuestion}
            />
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button 
              className="cursor-pointer p-2 flex items-center relative group shadow-sm rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
              onClick={() => window.history.back()}
            >
              Cancel
              <span className="bg-gray-800 hover-underline-animation"></span>
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
              className="cursor-pointer p-2 flex items-center relative group shadow-sm rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
              onClick={generateQuiz}
              disabled={quizCreationStatus.loading}
            >
              {quizCreationStatus.loading ? 'Generating...' : 'Generate Quiz'}
              <span className="bg-green-700 hover-underline-animation"></span>
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default TeacherAddQuiz;