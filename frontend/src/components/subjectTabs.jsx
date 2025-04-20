// SubjectTabs.jsx
import React from "react";


export const SubjectTabs = ({ data, activeSubject, onSubjectChange }) => {
    const iconMap = {
        calculator: "ri-file-list-3-line",
        settings: "ri-settings-line",
        flask: "ri-flask-line",
        dna: "ri-heart-pulse-line",
      };
      
  const uniqueSubjects = Array.from(new Set(data.map((quiz) => quiz.subject)));

  const getIconClass = (subject) => {
    const found = data.find((q) => q.subject === subject);
    return found ? iconMap[found.icon] || "ri-book-line" : "ri-book-line";
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {uniqueSubjects.map((subject) => (
        <button
          key={subject}
          className={`tab-button flex items-center justify-center px-6 py-3 rounded-lg transition-all hover:cursor-pointer hover:bg-black hover:text-white ${
            subject === activeSubject
              ? "bg-black text-white"
              : "bg-white text-gray-700 shadow-sm"
          }`}
          onClick={() => onSubjectChange(subject)}
        >
          {/* <div className="w-6 h-6 flex items-center justify-center mr-2">
            <i className={getIconClass(subject)}></i>
          </div> */}
          {subject}
        </button>
      ))}
    </div>
  );
};


