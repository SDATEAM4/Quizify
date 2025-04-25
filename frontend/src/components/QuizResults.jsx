import React, { useState } from 'react';
import { Save, Home } from 'lucide-react';
import AnswerKey from './AnswerKey';
import { useNavigate } from 'react-router-dom';
const QuizResults = ({ quizName, stats, dataSet, quizType,isCorrect }) => {
  const { percentage, correctCount, incorrectCount, totalQuestions, formattedTime } = stats;
  const [viewAnswerKey, setViewAnswerKey] = useState(false); 
  const handleSaveResults = () => {
    alert("Result saved!");
  };
  const navigate = useNavigate();


  return viewAnswerKey === false ? (
   
    <div className="bg-white rounded-xl p-10 shadow-lg text-center">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Quiz Completed!</h1>
      <p className="text-base text-slate-500 mb-10">Here's how you performed on {quizName}</p>

      <div className="w-[150px] h-[150px] rounded-full border-8 border-blue-500 mx-auto mb-10 flex flex-col justify-center items-center shadow-[0_0_0_8px_rgba(59,130,246,0.1)] animate-[fadeIn_0.6s_ease-out]">
        <div className="text-4xl font-bold text-slate-800 leading-none mb-1">{percentage}%</div>
        <div className="text-sm text-slate-500">Score</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-slate-50 p-5 rounded-lg">
          <div className="text-sm text-slate-500 mb-3">Total Questions</div>
          <div className="text-2xl font-bold text-slate-800">{totalQuestions}</div>
        </div>

        <div className="bg-slate-50 p-5 rounded-lg">
          <div className="text-sm text-slate-500 mb-3">Correct Answers</div>
          <div className="text-2xl font-bold text-emerald-500">{correctCount}</div>
        </div>

        <div className="bg-slate-50 p-5 rounded-lg">
          <div className="text-sm text-slate-500 mb-3">Incorrect Answers</div>
          <div className="text-2xl font-bold text-red-500">{incorrectCount}</div>
        </div>

        <div className="bg-slate-50 p-5 rounded-lg">
          <div className="text-sm text-slate-500 mb-3">Time Taken</div>
          <div className="text-2xl font-bold text-slate-800">{formattedTime}</div>
        </div>
      </div>

      <div className="flex justify-center gap-4 flex-wrap">
        {
          quizType === "NormalQuiz" ? (
            <button className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
              onClick={handleSaveResults}>
              <Save size={18} className="mr-2" />
              <span>Save Result</span>
            </button>
          ) : (
            <button className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
              onClick={() =>{ setViewAnswerKey(true);}}>
              <Save size={18} className="mr-2" />
              <span>View Answer Key</span>
            </button>
          )
        }

        <button className="flex items-center justify-center px-6 py-3 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors duration-200" onClick={() => navigate('/student/home')}>
          <Home size={18} className="mr-2" />
          <span>Return to Home</span>
        </button>
      </div>
    </div>
) : (
    
    //<div>hello bhai</div>
    <AnswerKey dataSet={dataSet} isCorrect={isCorrect} myfunction={setViewAnswerKey} />
  );
};

export default QuizResults;