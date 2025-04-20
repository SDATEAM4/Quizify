import React from "react";

export const QuizCard = ({ data, subject }) => {
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
              <button className="bg-primary border-2 text-black px-6 py-2 rounded-button hover:bg-black hover:text-white hover:cursor-pointer transition-colors whitespace-nowrap">
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

