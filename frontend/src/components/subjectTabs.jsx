// subject_nameTabs.jsx
import React from "react";


export const SubjectTabs = ({ data, activesubject_name, onsubject_nameChange, onPracticeMode }) => {
  const iconMap = {
    calculator: "ri-file-list-3-line",
    settings: "ri-settings-line",
    flask: "ri-flask-line",
    dna: "ri-heart-pulse-line",
  };

  const uniquesubject_names = Array.from(new Set(data.map((quiz) => quiz.subject_name)));

  const getIconClass = (subject_name) => {
    const found = data.find((q) => q.subject_name === subject_name);
    return found ? iconMap[found.icon] || "ri-book-line" : "ri-book-line";
  };

  return (
    <div className="display flex justify-between w-full">
      <div className="flex flex-wrap gap-4 mb-8">
        {uniquesubject_names.map((subject_name) => (
          <button
            key={subject_name}
            className={`tab-button flex items-center justify-center px-6 py-3 rounded-lg transition-all hover:cursor-pointer hover:bg-black hover:text-white ${subject_name === activesubject_name
              ? "bg-black text-white"
              : "bg-white text-gray-700 shadow-sm"
              }`}
            onClick={() => onsubject_nameChange(subject_name)}
          >
            {/* <div className="w-6 h-6 flex items-center justify-center mr-2">
            <i className={getIconClass(subject_name)}></i>
          </div> */}
            {subject_name}
          </button>
        ))}
      </div>
      <button className="tab-button flex items-center justify-center px-6 py-3 rounded-lg transition-all border border-gray-300 hover:cursor-pointer hover:bg-black hover:text-white flex-wrap gap-4 mb-8 bg-white text-gray-700 shadow-sm" onClick={onPracticeMode}>
        Practice-Mode
      </button>

    </div>
  );
};


