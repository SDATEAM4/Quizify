import { useState } from "react";
import { FaHome, FaPencilAlt, FaQuestionCircle, FaTrophy, FaChartBar, FaPlusCircle, FaEdit, FaCommentDots } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
export const TeacherNavbar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  const {user}=useAuth();
  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">Quizify</div>
        <nav className="hidden md:flex items-center space-x-8">
          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "home" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => {
              setActiveTab('home')
              navigate('/teacher/home')
            }}
          >
            <FaHome className="mr-2" /> Home
            {activeTab !== "home" && <span className="hover-underline-animation"></span>}
          </button>
          
          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "quiz" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => {
              setActiveTab('quizCreate')
              navigate('/teacher/createQuiz')
            }}
          >
            <FaPlusCircle className="mr-2" /> Create Quiz
            {activeTab !== "quiz" && <span className="hover-underline-animation"></span>}
          </button>
          
          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "queries" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => {
              setActiveTab('editQuiz')
              navigate('/teacher/editQuiz')
            }}
          >
            <FaEdit className="mr-2" /> Edit Quiz
            {activeTab !== "queries" && <span className="hover-underline-animation"></span>}
          </button>
          
          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "leaderboard" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => {
              setActiveTab('addQuestion')
              navigate('/teacher/addQuestion')
            }}
          >
            <FaQuestionCircle className="mr-2" /> Add Question
            {activeTab !== "leaderboard" && <span className="hover-underline-animation"></span>}
          </button>
          
          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "reports" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => {
              setActiveTab('queries')
              navigate('/teacher/queries')
            }}
          >
            <FaCommentDots className="mr-2" /> Student Queries
            {activeTab !== "reports" && <span className="hover-underline-animation"></span>}
          </button>

          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "reports" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => {
              setActiveTab('reports')
              navigate('/teacher/viewReports')
            }}
          >
            <FaChartBar className="mr-2" /> View Reports
            {activeTab !== "reports" && <span className="hover-underline-animation"></span>}
          </button>
        </nav>  
        
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={user.profileImageUrl || 'img/fallback.png'}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="hidden md:inline">{user.username}</span>
          <i className="fas fa-chevron-down text-xs"></i>
        </div>
        
        {/* Mobile menu button */}
        <button className="md:hidden text-white focus:outline-none">
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
    </header>
  );
};