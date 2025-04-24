import React from 'react';
import { QuestionCard2 } from './QuestionCard2';
import { AnswerKeyHeader } from './AnswerKeyHeader';
import { ArrowLeft } from "lucide-react";

const AnswerKey = ({ dataSet, isCorrect ,myfunction}) => {
    

    const correctAnswers = isCorrect.filter(answer => answer === true).length;
    const totalQuestions = dataSet.dataset.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6 font-sans">
            <button
                onClick={() => myfunction(false)}
                className="flex items-center space-x-2 text-sm text-gray-700 bg-gray-100 cursor-pointer rounded-lg px-4 py-2 transition duration-200 ease-in-out hover:bg-black hover:text-white"
            >
                <ArrowLeft size={18} />
                
            </button>

            <AnswerKeyHeader
                quizName={dataSet.quizName}
                quizTopic={dataSet.quizTopic}
                score={score}
                correctAnswers={correctAnswers}
                totalQuestions={totalQuestions}
            />
            <div className="space-y-6">
                {dataSet.dataset.map((question, index) => (
                    <QuestionCard2
                        key={index}
                        questionNumber={index + 1}
                        question={question}
                        isCorrect={isCorrect[index]}
                    />
                ))}
            </div>
        </div>
    );
};
export default AnswerKey;
