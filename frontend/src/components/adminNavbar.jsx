import { useState } from "react";
import { FaChartBar, FaSignOutAlt, FaUserCog, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const AdminNavBar = () => {
  const [activeTab, setActiveTab] = useState("addUser");
  const navigate = useNavigate();  
  // This would be your navigation handler with useNavigate
  

  return (
    <header className="bg-black text-white min-h-[50px] shadow-md min-w-screen z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">Quizify Admin</div>
        <nav className="hidden md:flex items-center space-x-8">
          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "home" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => {
              setActiveTab('addUser')
              navigate('/admin/addUser')
            }}
          >
            <FaUserPlus className="mr-2" /> Add User
            {activeTab !== "home" && <span className="hover-underline-animation"></span>}
          </button>
          
          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "quiz" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => {
              setActiveTab('manageUser')
              navigate('/admin/manageUser')
            }}
          >
            <FaUserCog className="mr-2" /> Manage User
            {activeTab !== "quiz" && <span className="hover-underline-animation"></span>}
          </button>


          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "subject" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => {
              setActiveTab('subject')
              navigate('/admin/addSubject')
            }}
          >
            <FaUserCog className="mr-2" /> Add Subject
            {activeTab !== "quiz" && <span className="hover-underline-animation"></span>}
          </button>
          
          <button
            className={`cursor-pointer py-2 flex items-center relative group ${
              activeTab === "queries" ? "border-b-2 border-white" : ""
            }`}
            onClick={() => {
              setActiveTab('viewReports')
              navigate('/admin/viewReports')
            }}
          >
            <FaChartBar className="mr-2" /> View Reports
            {activeTab !== "queries" && <span className="hover-underline-animation"></span>}
          </button>
          
          
        </nav>
        
        <div className="flex flexro items-center space-x-3">  
          <button
            className="bg-red-600 p-2 rounded-md hover:bg-white hover:text-red-500 transition-all duration-300 flex flex-row items-center gap-1"
          >
            <FaSignOutAlt/>Log out
          </button>
        </div>
        
        {/* Mobile menu button */}
        <button className="md:hidden text-white focus:outline-none">
          
        </button>
      </div>
    </header>
  );
};