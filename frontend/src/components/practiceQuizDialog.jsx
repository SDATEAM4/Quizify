import React, { useState, useMemo } from 'react';
import { Calculator, Settings, FlaskRound as Flask, Dna, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export const QuizDialog = ({ quizData, setPage }) => {
  const [selectedsubject_name, setSelectedsubject_name] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Beginner');

  const iconMap = {
    calculator: Calculator,
    settings: Settings,
    flask: Flask,
    dna: Dna
  };

  const difficultyColors = {
    Beginner: 'bg-green-500 text-white',
    Intermediate: 'bg-yellow-500 text-white',
    Advanced: 'bg-orange-500 text-white',
    Impossible: 'bg-red-500 text-white'
  };

  const uniquesubject_names = useMemo(() => {
    return [...new Set(quizData.map(quiz => quiz.subject_name))];
  }, [quizData]);

  const topicsForsubject_name = useMemo(() => {
    return quizData
      .filter(quiz => quiz.subject_name === selectedsubject_name)
      .map(quiz => ({ title: quiz.title, id: quiz.quiz_id }));
  }, [quizData, selectedsubject_name]);

  const handleQuestionCountChange = (e) => {
    const value = Math.min(Math.max(parseInt(e.target.value) || 5, 5), 20);
    setQuestionCount(value);
  };

  const handleBack = () => {
    setPage();
  };



 
  const transformDataset = (data) => {
    return data.map(({ question, answer, ...rest }) => ({
      ...rest,
      statement: question,
      correct_answer: answer,
    }));
  };
  
  
  
  
  const navigate = useNavigate();
  const handleclick = () => {
    //this body data will be passed to the api to get response
    const quizName = selectedsubject_name;
    const quizTopic = selectedTopic;
    const description='';
    const difficultyLevel = difficulty;
    const noOfquestion=questionCount;
      //dummy data-set
    const response = [
      {
        question: "What is the unit of force in the International System of Units (SI)?",
        options: {
          a: "Newton (N)",
          b: "Kilogram (kg)",
          c: "Meter (m)",
          d: "Second (s)"
        },
        answer: "a",
        explanation: "The Newton (N) is the SI unit of force."
      },
      {
        question: "Which of the following is a vector quantity in physics?",
        options: {
          a: "Mass",
          b: "Speed",
          c: "Velocity",
          d: "Temperature"
        },
        answer: "c",
        explanation: "Velocity is a vector quantity as it has both magnitude and direction."
      },
      {
        question: "What is the formula for calculating the work done by a force?",
        options: {
          a: "W = F * d",
          b: "W = F / d",
          c: "W = F + d",
          d: "W = F - d"
        },
        answer: "a",
        explanation: "Work (W) is calculated as the product of force (F) and displacement (d)."
      },
      {
        question: "Which of the following is a correct statement about friction?",
        options: {
          a: "Friction always opposes motion.",
          b: "Friction is always beneficial.",
          c: "Friction is always harmful.",
          d: "Friction is always constant."
        },
        answer: "a",
        explanation: "Friction always opposes motion."
      },
      {
        question: "What is the relationship between force and acceleration?",
        options: {
          a: "Force is directly proportional to acceleration.",
          b: "Force is inversely proportional to acceleration.",
          c: "Force is independent of acceleration.",
          d: "Force is directly proportional to the square of acceleration."
        },
        answer: "a",
        explanation: "Force is directly proportional to acceleration."
      },
      {
        question: "Which of the following is a correct statement about Newton's Third Law?",
        options: {
          a: "For every action, there is an equal and opposite reaction.",
          b: "For every action, there is an equal and opposite force.",
          c: "For every action, there is an equal and opposite reaction force.",
          d: "For every action, there is an equal and opposite force."
        },
        answer: "a",
        explanation: "For every action, there is an equal and opposite reaction."
      },
      {
        question: "What is the formula for calculating the kinetic energy of an object?",
        options: {
          a: "KE = 1/2 * m * v^2",
          b: "KE = m * v^2",
          c: "KE = m * v",
          d: "KE = 1/2 * m * v"
        },
        answer: "a",
        explanation: "Kinetic energy (KE) is calculated as 1/2 * mass (m) * velocity (v)^2."
      },
      {
        question: "Which of the following is a correct statement about the center of mass?",
        options: {
          a: "The center of mass is always at the center of the object.",
          b: "The center of mass is always at the center of the object's base.",
          c: "The center of mass is the point where the object's weight is evenly distributed.",
          d: "The center of mass is the point where the object's mass is evenly distributed."
        },
        answer: "d",
        explanation: "The center of mass is the point where the object's mass is evenly distributed."
      },
      {
        question: "What is the formula for calculating the work done by a force in a circular motion?",
        options: {
          a: "W = F * d",
          b: "W = F * θ",
          c: "W = F * r",
          d: "W = F * θ * r"
        },
        answer: "b",
        explanation: "Work (W) is calculated as force (F) times the angle (θ) in radians."
      },
      {
        question: "Which of the following is a correct statement about the relationship between force and motion?",
        options: {
          a: "Force is always required to change the motion of an object.",
          b: "Force is always required to maintain the motion of an object.",
          c: "Force is always required to change the direction of an object.",
          d: "Force is always required to maintain the direction of an object."
        },
        answer: "a",
        explanation: "Force is always required to change the motion of an object."
      }
    ]

    const dataset = transformDataset(response);
    // Navigate to the quiz page with the quiz data
    navigate("/quizGenerator", { state: { quizName, quizTopic, timeDuration:0,dataset,totalMarks:0, quizType: "PracticeQuiz" } }); // Pass quizState as state
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <h1 className="text-9xl font-bold text-white">Quizify</h1>
      </div>

      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative z-10">
        <button
          onClick={handleBack}
          className="absolute left-4 top-4 p-2 text-gray-600 hover:bg-gray-500 hover:text-gray-800 transition-colors duration-200 bg-white rounded-full shadow-md z-20 cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>


        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Quiz</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select subject_name
            </label>
            <select
              value={selectedsubject_name}
              onChange={(e) => {
                setSelectedsubject_name(e.target.value);
                setSelectedTopic('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="">Choose a subject_name</option>
              {uniquesubject_names.map(subject_name => (
                <option key={subject_name} value={subject_name}>{subject_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={!selectedsubject_name}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black disabled:bg-gray-300"
            >
              <option value="">Select a topic</option>
              {topicsForsubject_name.map(topic => (
                <option key={topic.id} value={topic.title}>{topic.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions (5-20)
            </label>
            <input
              type="number"
              min="5"
              max="20"
              value={questionCount}
              onChange={handleQuestionCountChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Beginner', 'Intermediate', 'Advanced', 'Impossible'].map((level) => (
                <label
                  key={level}
                  className={`
                    ${difficulty === level ? difficultyColors[level] : 'bg-gray-200'}
                    px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200
                    flex items-center justify-center text-gray-500 font-medium
                  `}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={level}
                    checked={difficulty === level}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="sr-only"
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>

          <button
            className="w-full bg-gray-100 text-black py-3 rounded-lg font-medium hover:bg-black hover:text-white transition-colors duration-200 border border-gray-500 shadow-sm hover:shadow-lg cursor-pointer " onClick={handleclick}
            disabled={!selectedsubject_name || !selectedTopic}
          >
            Generate Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

