import React, { useState, useMemo } from 'react';
import { Calculator, Settings, FlaskRound as Flask, Dna, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export const QuizDialog = ({ quizData,setPage }) => {
    const [selectedSubject, setSelectedSubject] = useState('');
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
        Aura: 'bg-red-500 text-white',
        Impossible: 'bg-purple-500 text-white'
    };

    const uniqueSubjects = useMemo(() => {
        return [...new Set(quizData.map(quiz => quiz.subject))];
    }, [quizData]);

    const topicsForSubject = useMemo(() => {
        return quizData
            .filter(quiz => quiz.subject === selectedSubject)
            .map(quiz => ({ title: quiz.title, id: quiz.id }));
    }, [quizData, selectedSubject]);

    const handleQuestionCountChange = (e) => {
        const value = Math.min(Math.max(parseInt(e.target.value) || 5, 5), 15);
        setQuestionCount(value);
    };

    const handleBack = () => {
        setPage();
    };
    //dummy data-set
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
      const navigate=useNavigate();
      const handleclick = () => {
        // Navigate to the quiz page with the quiz data
        navigate("/quizGenerator", { state: quizState }); // Pass quizState as state
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
                            Select Subject
                        </label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => {
                                setSelectedSubject(e.target.value);
                                setSelectedTopic('');
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                        >
                            <option value="">Choose a subject</option>
                            {uniqueSubjects.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
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
                            disabled={!selectedSubject}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black disabled:bg-gray-300"
                        >
                            <option value="">Select a topic</option>
                            {topicsForSubject.map(topic => (
                                <option key={topic.id} value={topic.id}>{topic.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Questions (5-15)
                        </label>
                        <input
                            type="number"
                            min="5"
                            max="15"
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
                            {['Beginner', 'Intermediate', 'Advanced', 'Aura', 'Impossible'].map((level) => (
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
                        disabled={!selectedSubject || !selectedTopic}
                    >
                        Generate Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

