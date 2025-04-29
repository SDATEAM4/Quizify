import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaQuestionCircle, FaChartBar, FaPlusCircle, FaEdit, FaCommentDots } from "react-icons/fa";
import { useAuth } from "../context/authContext";

export const TeacherNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (location.pathname.includes("/teacher/home")) setActiveTab("home");
    else if (location.pathname.includes("/teacher/createQuiz")) setActiveTab("quizCreate");
    else if (location.pathname.includes("/teacher/editQuiz")) setActiveTab("editQuiz");
    else if (location.pathname.includes("/teacher/addQuestion")) setActiveTab("addQuestion");
    else if (location.pathname.includes("/teacher/queries")) setActiveTab("queries");
    else if (location.pathname.includes("/teacher/viewReports")) setActiveTab("reports");
    else setActiveTab("");
  }, [location.pathname]);

  const navButton = (label, icon, tab, path) => (
    <button
      className={`cursor-pointer py-2 flex items-center relative group ${activeTab === tab ? "border-b-2 border-white" : ""}`}
      onClick={() => navigate(path)}
    >
      {icon}
      <span className="ml-2">{label}</span>
      {activeTab !== tab && (
        <span className="hover-underline-animation absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
      )}
    </button>
  );

  return (
    <header className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">Quizify</div>

        <nav className="hidden md:flex items-center space-x-8">
          {navButton("Home", <FaHome />, "home", "/teacher/home")}
          {navButton("Create Quiz", <FaPlusCircle />, "quizCreate", "/teacher/createQuiz")}
          {navButton("Edit Quiz", <FaEdit />, "editQuiz", "/teacher/editQuiz")}
          {navButton("Add Question", <FaQuestionCircle />, "addQuestion", "/teacher/addQuestion")}
          {navButton("Student Queries", <FaCommentDots />, "queries", "/teacher/queries")}
          {navButton("View Reports", <FaChartBar />, "reports", "/teacher/viewReports")}
        </nav>

        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={user.profileImageUrl || "img/fallback.png"}
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
