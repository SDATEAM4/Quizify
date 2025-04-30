import React, { useState, useEffect } from 'react';
import SelectionControls from '../components/SelectionControls';
import MarksChart from '../components/Markschart';
import PieChart from '../components/PieChart';
import StatsDisplay from '../components/StatsDisplay';
import ChartReport from '../components/ChartReport';
import { Footer } from "../components/footer";
import { NavBar } from "../components/navbar";
import { useAuth } from '../context/authContext';

const StudentViewReport = () => {
    const { user } = useAuth();
    const userId = user?.Uid || null;
    const [quizData, setQuizData] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedQuiz, setSelectedQuiz] = useState('');
    const [quizDetails, setQuizDetails] = useState(null);
    const [availableQuizzes, setAvailableQuizzes] = useState([]);
    const [activeChart, setActiveChart] = useState('bar');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('quiz-wise'); // NEW
    const subjects = [...new Set(quizData.map(quiz => quiz.subjectName))];

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/Quizify/reports/student/${userId}`);
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

    const [data, setData] = useState([]); // NEW for distribution API
    useEffect(() => {
        const fetchDistributionData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/Quizify/reports/student/distribution/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch distribution data');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching distribution data:', error);
            }
        };

        if (userId) {
            fetchDistributionData();
        }
    }, [userId]);
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

            {/* NEW Buttons Section */}
            <div className="flex justify-center space-x-6 mt-6 mb-8">
                <button
                    onClick={() => setViewMode('quiz-wise')}
                    className={` hover:cursor-pointer px-8 py-3 rounded border font-semibold text-lg transition-all duration-300 ${viewMode === 'quiz-wise' ? 'bg-black text-white border-white' : 'bg-gray-200 text-gray-700 border-gray-400'}`}
                >
                    Quiz-Wise
                </button>
                <button
                    onClick={() => setViewMode('overall')}
                    className={`hover:cursor-pointer px-8 py-3 rounded border font-semibold text-lg transition-all duration-300 ${viewMode === 'overall' ? 'bg-black text-white border-white' : 'bg-gray-200 text-gray-700 border-gray-400'}`}
                >
                    Overall
                </button>
            </div>


            <main className="flex-1 relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 backdrop-blur-sm z-50 px-4">
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white text-center">Quizify</h1>
                        </div>
                        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md flex flex-col items-center space-y-4 sm:space-y-6 relative z-10">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center">Loading Report...</h2>
                        </div>
                    </div>
                )}


                {!loading && (
                    <>
                        {viewMode === 'quiz-wise' ? (
                            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                                <h1 className="text-2xl font-bold text-gray-800 mb-6">Student Quiz Report</h1>

                                {quizData.length === 1 && quizData[0]?.message ? (
                                    <div className="flex items-center justify-center h-64 text-black text-2xl">
                                        {quizData[0].message}
                                    </div>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                {data?.message ? (
                                    <div className="flex items-center justify-center h-64 text-black text-2xl">
                                        {data.message}
                                    </div>
                                ) : (
                                    <ChartReport dataset={data} />
                                )}
                            </>
                        )}

                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default StudentViewReport;
