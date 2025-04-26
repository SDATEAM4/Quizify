import React, { useState, useEffect } from 'react';
import QuestionCard from '../components/QuestionCard';
import QuizHeader from '../components/QuizHeader';
import QuizNavigation from '../components/QuizNavigation';
import QuizProgress from '../components/QuizProgress';
import QuizResults from '../components/QuizResults';
import { useLocation } from 'react-router-dom';

export const QuizGenerator = () => {
  const location = useLocation();
  const { quiz_id,quizName, quizTopic, timeDuration, dataset, totalMarks, quizType } = location.state;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedcorrect_answers, setSelectedcorrect_answers] = useState(Array(dataset.length).fill(''));
  const [isCorrect, setIsCorrect] = useState(Array(dataset.length).fill(false));
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeDuration); // Convert minutes to seconds
  const [timeTaken, setTimeTaken] = useState(0);

  // Timer effect
  useEffect(() => {
    if (isQuizCompleted || quizType === "PracticeQuiz") return;

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
  }, [isQuizCompleted, quizType]);

  // Handle correct_answer selection
  const handleSelectcorrect_answer = (option) => {
    const newSelectedcorrect_answers = [...selectedcorrect_answers];
    newSelectedcorrect_answers[currentQuestionIndex] = option;
    setSelectedcorrect_answers(newSelectedcorrect_answers);

    // Check if correct_answer is correct
    const newIsCorrect = [...isCorrect];
    newIsCorrect[currentQuestionIndex] = option === dataset[currentQuestionIndex].correct_answer;
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
 // Calculate statistics
const calculateScore = () => {
  const correctCount = isCorrect.filter(Boolean).length;
  const obtainedMarks = dataset.reduce((total, question, index) => {
    return isCorrect[index] ? total + question.marks : total;
  }, 0);

  const basePoints = dataset.reduce((total, question, index) => {
    return isCorrect[index] ? total + question.level : total;
  }, 0);

  const timeBonus = Math.floor((correctCount / dataset.length) * timeRemaining);
  const points = basePoints + timeBonus;

  return {
    percentage: Math.round((correctCount / dataset.length) * 100),
    correctCount,
    incorrectCount: dataset.length - correctCount,
    totalQuestions: dataset.length,
    formattedTime: formatTime(timeTaken),
    obtainedMarks: obtainedMarks,
    totalMarks: totalMarks,
    points: points
  };
};


  // Format time (seconds) to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Convert remaining time to MM:SS format
  const formattedTimeRemaining = quizType === "PracticeQuiz" ? '∞' : formatTime(timeRemaining);

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
            quizType={quizType}
          />

          <QuestionCard
            question={dataset[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            selectedcorrect_answer={selectedcorrect_answers[currentQuestionIndex]}
            onSelectcorrect_answer={handleSelectcorrect_answer}
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
          dataSet={{ quizName, quizTopic, timeDuration, dataset }}
          quizType={quizType}
          isCorrect={isCorrect}
          quiz_id={quiz_id}
        />
      )}
    </div>
  );
};
