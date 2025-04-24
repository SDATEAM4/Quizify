import React, { useState, useEffect } from 'react';
import QuestionCard from '../components/QuestionCard';
import QuizHeader from '../components/QuizHeader';
import QuizNavigation from '../components/QuizNavigation';
import QuizProgress from '../components/QuizProgress';
import QuizResults from '../components/QuizResults';
import { useLocation } from 'react-router-dom';

export const QuizGenerator = () => {
    const location = useLocation();
    const {quizState,quizType} = location.state;
  const { quizName, quizTopic, timeDuration, dataset } = quizState;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(dataset.length).fill(''));
  const [isCorrect, setIsCorrect] = useState(Array(dataset.length).fill(false));
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeDuration * 60); // Convert minutes to seconds
  const [timeTaken, setTimeTaken] = useState(0);
  
  // Timer effect
  useEffect(() => {
    if (isQuizCompleted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleEndQuiz();
          return 0;
        }
        return prev - 1;
      });
      
      setTimeTaken((prev) => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isQuizCompleted]);
  
  // Handle answer selection
  const handleSelectAnswer = (option) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(newSelectedAnswers);
    
    // Check if answer is correct
    const newIsCorrect = [...isCorrect];
    newIsCorrect[currentQuestionIndex] = option === dataset[currentQuestionIndex].answer;
    setIsCorrect(newIsCorrect);
  };
  
  // Navigation handlers
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < dataset.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handleEndQuiz = () => {
    setIsQuizCompleted(true);
  };
  
  // Calculate statistics
  const calculateScore = () => {
    const correctCount = isCorrect.filter(Boolean).length;
    return {
      percentage: Math.round((correctCount / dataset.length) * 100),
      correctCount,
      incorrectCount: dataset.length - correctCount,
      totalQuestions: dataset.length,
      formattedTime: formatTime(timeTaken)
    };
  };
  
  // Format time (seconds) to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  // Convert remaining time to MM:SS format
  const formattedTimeRemaining = formatTime(timeRemaining);
  
  // Calculate progress percentage
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / dataset.length) * 100);
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 font-sans">
      {!isQuizCompleted ? (
        <>
          <QuizHeader
            quizName={quizName}
            quizTopic={quizTopic}
            timeRemaining={formattedTimeRemaining}
          />
          
          <QuestionCard
            question={dataset[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            selectedAnswer={selectedAnswers[currentQuestionIndex]}
            onSelectAnswer={handleSelectAnswer}
          />
          
          <QuizNavigation
            onPrevious={handlePrevious}
            onNext={handleNext}
            onEndQuiz={handleEndQuiz}
            hasPrevious={currentQuestionIndex > 0}
            hasNext={currentQuestionIndex < dataset.length - 1}
          />
          
          <QuizProgress
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={dataset.length}
            progressPercentage={progressPercentage}
          />
        </>
      ) : (
        <QuizResults
          quizName={quizName}
          stats={calculateScore()}
          dataSet={quizState}
          quizType={quizType}
          isCorrect={isCorrect}
        />
      )}
    </div>
  );
};

