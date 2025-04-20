import React from "react";
import { useNavigate } from "react-router-dom";

export const QuizCard = ({ data, subject }) => {
  const navigate = useNavigate(); // Move useNavigate to the top level of the component

  const filteredQuizzes = data.filter((quiz) => quiz.subject === subject);

  const getDifficultyColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Dummy quiz data
  const quizState = {
    quizName: "Physics Fundamentals",
    quizTopic: "Classical Mechanics & Electromagnetism",
    timeDuration: 10,
    dataset: [
      {
        question: "What is Newton's first law of motion also known as?",
        options: {
          a: "The Law of Acceleration",
          b: "The Law of Inertia",
          c: "The Law of Friction",
          d: "The Law of Momentum",
        },
        answer: "b",
      },
      {
        question: "Which phenomenon is described by the equation P = F/A?",
        options: {
          a: "work",
          b: "energy",
          c: "pressure",
          d: "power",
        },
        answer: "c",
      },
      {
        question: "The unit of electrical resistance is the ohm. Which of the following is a way to measure resistance?",
        options: {
          a: "voltmeter",
          b: "ammeter",
          c: "ohmmeter",
          d: "capacitance meter",
        },
        answer: "c",
      },
      {
        question: "What does the speed of light in a vacuum have an approximate value of?",
        options: {
          a: "300,000 km/s",
          b: "3,000 km/s",
          c: "300 km/s",
          d: "30 km/s",
        },
        answer: "a",
      },
      {
        question: "Which principle explains why a neutron star can have such a strong gravitational pull?",
        options: {
          a: "Newton's third law of motion",
          b: "Einstein's theory of relativity",
          c: "Gravitation from mass",
          d: "The Pauli exclusion principle",
        },
        answer: "c",
      },
    ],
  };

  const handleclick = () => {
    // Navigate to the quiz page with the quiz data
    navigate("/quizGenerator", { state: quizState }); // Pass quizState as state
  };

  return (
    <>
      {filteredQuizzes.map((quiz) => (
        <div key={quiz.id} className="quiz-card bg-white rounded-xl shadow-md overflow-hidden">
          <div
            className="w-full h-48 bg-cover bg-center"
            style={{ backgroundImage: `url(${quiz.image})` }}
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
            <p className="text-gray-600 mb-4">{quiz.description}</p>

            <div className="flex items-center justify-between mb-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <i className="ri-time-line"></i>
                <span>{quiz.duration} minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-question-line"></i>
                <span>{quiz.questionCount} Questions</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(quiz.difficulty)}`}>
                {quiz.difficulty}
              </span>
              <button
                className="bg-primary border-2 text-black px-6 py-2 rounded-button hover:bg-black hover:text-white hover:cursor-pointer transition-colors whitespace-nowrap"
                onClick={handleclick}
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

