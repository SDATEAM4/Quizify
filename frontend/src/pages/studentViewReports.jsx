import React, { useState, useEffect } from 'react';
import SelectionControls from '../components/SelectionControls';
import MarksChart from '../components/MarksChart';
import PieChart from '../components/PieChart';
import StatsDisplay from '../components/StatsDisplay';
import { Footer } from "../components/footer";
import { NavBar } from "../components/navbar";

const StudentViewReport = () => {
    const [quizData, setQuizData] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedQuiz, setSelectedQuiz] = useState('');
    const [quizDetails, setQuizDetails] = useState(null);
    const [availableQuizzes, setAvailableQuizzes] = useState([]);
    const [activeChart, setActiveChart] = useState('bar');
    const [loading, setLoading] = useState(true);

    const subjects = [...new Set(quizData.map(quiz => quiz.subjectName))];

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await fetch('http://localhost:8080/Quizify/reports/student/3');
                if (!response.ok) {
                    throw new Error('Failed to fetch quiz data');
                }
                const data = await response.json();
                setQuizData(data);
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizData();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            const filteredQuizzes = quizData.filter(quiz =>
                quiz.subjectName.toLowerCase() === selectedSubject.toLowerCase()
            );
            setAvailableQuizzes(filteredQuizzes);
            setSelectedQuiz('');
            setQuizDetails(null);
        } else {
            setAvailableQuizzes([]);
            setSelectedQuiz('');
            setQuizDetails(null);
        }
    }, [selectedSubject, quizData]);

    useEffect(() => {
        if (selectedQuiz) {
            const selectedQuizDetails = quizData.find(quiz =>
                quiz.quizId === parseInt(selectedQuiz)
            );
            setQuizDetails(selectedQuizDetails);
        } else {
            setQuizDetails(null);
        }
    }, [selectedQuiz, quizData]);

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };

    const handleQuizChange = (e) => {
        setSelectedQuiz(e.target.value);
    };

    const handleChartChange = (chartType) => {
        setActiveChart(chartType);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />

            <main className="flex-1 ">
                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-gray-600 text-lg">Loading Report...</div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Student Quiz Report</h1>

                        <SelectionControls
                            subjects={subjects}
                            availableQuizzes={availableQuizzes}
                            selectedSubject={selectedSubject}
                            selectedQuiz={selectedQuiz}
                            onSubjectChange={handleSubjectChange}
                            onQuizChange={handleQuizChange}
                            activeChart={activeChart}
                            onChartChange={handleChartChange}
                        />

                        {quizDetails && (
                            <div className="mt-8 transition-all duration-300 ease-in-out">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                    {quizDetails.title} - {quizDetails.subjectName}
                                </h2>

                                <StatsDisplay quizDetails={quizDetails} />

                                <div className="mt-8">
                                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                                        {activeChart === 'bar' ? 'Marks Distribution' : 'Performance Analysis'}
                                    </h3>
                                    {activeChart === 'bar' ? (
                                        <MarksChart quizDetails={quizDetails} />
                                    ) : (
                                        <PieChart quizDetails={quizDetails} />
                                    )}
                                </div>
                            </div>
                        )}

                        {!quizDetails && selectedSubject && (
                            <div className="mt-8 p-4 text-center bg-gray-50 rounded-lg">
                                <p className="text-gray-600">Please select a quiz to view report</p>
                            </div>
                        )}

                        {!selectedSubject && (
                            <div className="mt-8 p-4 text-center bg-gray-50 rounded-lg">
                                <p className="text-gray-600">Please select a subject to get started</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default StudentViewReport;
