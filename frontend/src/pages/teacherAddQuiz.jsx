import React, { useState, useEffect,useCallback } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { TeacherNavbar } from '../components/teacherNavbar';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import QuizConfigSection from '../components/quizConfigSection';
import QuestionSelectionSection from '../components/questionSelectionSection';
import QuizCreationStatus from '../components/quizCreationStatus';
import toast from 'react-hot-toast';
import BackgroundTypography from "../components/backgroundTypography"
import { Footer } from '../components/footer';

const TeacherAddQuiz = () => {
  const { teacherId, taughtSubjects } = useAuth();
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

  // State for taughtSubjects and questions
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

  // 1) Memoize fetchQuestions so we can reference it safely in effects
  const fetchQuestions = useCallback(async (subjectId) => {
    try {
      setQuestionsLoading(true);
      const { data } = await axios.get(
        `http://localhost:8080/Quizify/questions/subject/${subjectId}`
      );
      setAvailableQuestions(data);
    } catch (err) {
      console.error('Error fetching questions:', err);
      toast.error("Failed to load questions");
       setAvailableQuestions([]);
    } finally {
      setQuestionsLoading(false);
    }
  }, []);

  // 2) Auto-select and fetch on first subject arrival
  useEffect(() => {
    // If we only teach one subject, pick it
    if (taughtSubjects.length === 1) {
      const only = taughtSubjects[0];
      setQuizConfig(q => ({
        ...q,
        subject: only.name,
        subjectId: only.id
      }));
    }
    // If multiple, you might choose to default to the first:
    else if (taughtSubjects.length > 1 && quizConfig.subject === "") {
      const first = taughtSubjects[0];
      setQuizConfig(q => ({
        ...q,
        subject: first.name,
        subjectId: first.id
      }));
    }
  }, [taughtSubjects]);

  // 3) Whenever subjectId changes to a real value, always fetch questions
  useEffect(() => {
    if (quizConfig.subjectId) {
      fetchQuestions(quizConfig.subjectId);
    }
  }, [quizConfig.subjectId, fetchQuestions]);

  useEffect(() => {
    const selectedSubject = taughtSubjects.find(subject => subject.name === quizConfig.subject);
    if (selectedSubject) {
      setQuizConfig(prev => ({ ...prev, subjectId: selectedSubject.id }));
      if (quizConfig.mode === 'manual') {
        fetchQuestions(selectedSubject.id);
      }
      setSelectedQuestions([]);
    }
  }, [quizConfig.subject]);
  
  useEffect(() => {
    if (quizConfig.mode === 'manual' && quizConfig.subjectId !== 0) {
      fetchQuestions(quizConfig.subjectId);
    }
  }, [quizConfig.mode]);
  

  // Calculated difficulty based on selected questions
  const [calculatedDifficulty, setCalculatedDifficulty] = useState({
    score: 0,
    label: "N/A"
  });

  useEffect(() => {
    document.title = 'Quizify - Teacher Add Quiz';
    
    // Auto-select the first subject if only one is available
    if (taughtSubjects && taughtSubjects.length === 1) {
      const singleSubject = taughtSubjects[0];
      setQuizConfig(prev => ({
        ...prev,
        subject: singleSubject.name,
        subjectId: singleSubject.id
      }));
    }
  }, [taughtSubjects]);

  

  const handleConfigChange = (field, value) => {
    setQuizConfig(prev => ({
      ...prev,
      [field]: value
    }));
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
        timeLimit: quizConfig.timeLimit// Convert seconds to minutes
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
            : `Quiz created successfully !`
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
        timeLimit: quizConfig.timeLimit, // Convert seconds to minutes
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
            : `Quiz created successfully`
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
      toast.error("Error creating manual quiz:", err);
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

  // Show loading state while fetching taughtSubjects
  if (loading && taughtSubjects.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <TeacherNavbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center p-6">
            <p className="text-lg">Loading taughtSubjects...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if taughtSubjects fetch failed
  if (error && taughtSubjects.length === 0) {
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
            taughtSubjects={taughtSubjects}
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
      <Footer/>
    </div>
  );
};

export default TeacherAddQuiz;