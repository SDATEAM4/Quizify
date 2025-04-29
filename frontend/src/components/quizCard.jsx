import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const QuizCard = ({ data, subject_name }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // added loading state

  const filteredQuizzes = data.filter((quiz) => quiz.subject_name === subject_name); // it filters the quizzes based on the subject_name passed as a prop

  const getlevelColor = (level) => {
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

  const handleclick = async (quiz_id) => {
    try {
      setLoading(true); // start loading
      console.log(`Quiz quiz_id: ${quiz_id}`);

      const res = await fetch(`http://localhost:8080/Quizify/quizzes/${quiz_id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch quiz data");
      }
      const response = await res.json();

      const quizName = response.subject_name;
      const quizTopic = response.title;
      const timeDuration = response.timelimit;
      const dataset = response.questions;
      const totalMarks = response.marks;

      navigate("/quizGenerator", {
        state: {quiz_id, quizName, quizTopic, timeDuration, dataset, totalMarks, quizType: "NormalQuiz" } 
      });
    } catch (error) {
      console.error("Error fetching quiz:", error);
      alert("Failed to load quiz. Please try again."); // Optional: user-friendly error
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="text-xl font-semibold">Loading...</div>
        </div>
      )}
      {filteredQuizzes.map((quiz) => (
        <div key={quiz.quiz_id} className="quiz-card bg-white rounded-xl shadow-md overflow-hidden">
          <div
            className="w-full h-48 bg-cover bg-center"
            style={{ backgroundImage: `url()` }}
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
            <p className="text-gray-600 mb-4">{quiz.description}</p>

            <div className="flex items-center justify-between mb-4 text-gray-600">
              <div className="flex items-center space-x-2">
                <i className="ri-time-line"></i>
                <span>{quiz.timelimit} Seconds</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-question-line"></i>
                <span>{quiz.questions.length} Questions</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm ${getlevelColor(quiz.level == 1 ? "Beginner" : quiz.level == 2 ? "Intermediate" : "Advanced")}`}>
                {quiz.level == 1 ? "Beginner" : quiz.level == 2 ? "Intermediate" : "Advanced"}
              </span>
              <button
                className="bg-primary border-2 text-black px-6 py-2 rounded-button hover:bg-black hover:text-white hover:cursor-pointer transition-colors whitespace-nowrap"
                onClick={() => handleclick(quiz.quiz_id)}
                disabled={loading} // disable button while loading
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
