import React from 'react';

const SelectionControls = ({
    subjects,
    availableQuizzes,
    selectedSubject,
    selectedQuiz,
    onSubjectChange,
    onQuizChange,
    activeChart,
    onChartChange
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                </label>
                <div className="relative">
                    <select
                        id="subject"
                        value={selectedSubject}
                        onChange={onSubjectChange}
                        className="appearance-none block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Select Subject</option>
                        {subjects.map((subject, index) => (
                            <option key={index} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <label htmlFor="quiz" className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Title
                </label>
                <div className="relative">
                    <select
                        id="quiz"
                        value={selectedQuiz}
                        onChange={onQuizChange}
                        disabled={!selectedSubject}
                        className={`appearance-none block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!selectedSubject ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                        <option value="">Select Quiz</option>
                        {availableQuizzes.map((quiz) => (
                            <option key={quiz.quizId} value={quiz.quizId}>
                                {quiz.title}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 flex space-x-4 mt-2">
                <button
                    onClick={() => onChartChange('bar')}
                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${activeChart === 'bar'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    disabled={!selectedQuiz}
                >
                    Quiz
                </button>
                <button
                    onClick={() => onChartChange('pie')}
                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${activeChart === 'pie'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    disabled={!selectedQuiz}
                >
                    Charts
                </button>
            </div>
        </div>
    );
};

export default SelectionControls;