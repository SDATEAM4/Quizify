import React from "react";
import { useNavigate } from "react-router-dom";
export const QuizCard = ({ data, subject_name }) => {
  const navigate = useNavigate(); 
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

  // Dummy quiz data
  

  const handleclick = (quiz_id) => {

    //setting api call here
    console.log(`Quiz quiz_id: ${quiz_id}`); // Log the quiz quiz_id for debugging
    
    //=========================================================================
    const response = {
      subject_name: "Physics Fundamentals",
      title: "Classical Mechanics & Electromagnetism",
      timelimit: 2714,// in seconds
      questions: [
        {
          level: 2,
          statement: "What is Newton's first law of motion also known as?",
          options: {
            a: "The Law of Acceleration",
            b: "The Law of Inertia",
            c: "The Law of Friction",
            d: "The Law of Momentum",
          },
          correct_answer: "b",
          marks: 7,
          question_id: 3

        },
        {
          
          level: 2,
          statement: "Which phenomenon is described by the equation P = F/A?",
          options: {
            a: "work",
            b: "energy",
            c: "pressure",
            d: "power",
          },
          correct_answer: "c",
          marks: 7,
          question_id: 3
        },
        {
          
          level: 2,
          statement: "The unit of electrical resistance is the ohm. Which of the following is a way to measure resistance?",
          options: {
            a: "voltmeter",
            b: "ammeter",
            c: "ohmmeter",
            d: "capacitance meter",
          },
          correct_answer: "c",
          marks: 7,
          question_id: 3
        },
        {
          
          level: 2,
          statement: "What does the speed of light in a vacuum have an approximate value of?",
          options: {
            a: "300,000 km/s",
            b: "3,000 km/s",
            c: "300 km/s",
            d: "30 km/s",
          },
          correct_answer: "a",
          marks: 7,
          question_id: 3
        },
        {
          
          level: 2,
          statement: "Which principle explains why a neutron star can have such a strong gravitational pull?",
          options: {
            a: "Newton's third law of motion",
            b: "Einstein's theory of relativity",
            c: "Gravitation from mass",
            d: "The Pauli exclusion principle",
          },
          correct_answer: "c",
        },
      ],
    };
    const quizName = response.subject_name; // Extract the quiz name from the response
    const quizTopic = response.title; // Extract the quiz topic from the response
    const timeDuration = response.timelimit; // Extract the time duration from the response
    const dataset = response.questions; // Extract the dataset from the response
    // Navigate to the quiz page with the quiz data
    navigate("/quizGenerator", { state:{ quizName, quizTopic, timeDuration, dataset, quizType:"NormalQuiz"} }); // Pass response as state
    //==========================================================================
  };

  return (
    <>
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
                <span>{quiz.timelimit} minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-question-line"></i>
                <span>{quiz.questions.length} Questions</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm ${getlevelColor(quiz.level==1?"Beginner":quiz.level==2?"Intermediate":"Advanced")}`}>
                {quiz.level==1?"Beginner":quiz.level==2?"Intermediate":"Advanced"}
              </span>
              <button
                className="bg-primary border-2 text-black px-6 py-2 rounded-button hover:bg-black hover:text-white hover:cursor-pointer transition-colors whitespace-nowrap"
                onClick={() =>  handleclick(quiz.quiz_id)} // Pass the quiz quiz_id to the handleclick function
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

