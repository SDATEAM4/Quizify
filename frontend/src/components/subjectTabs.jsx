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
    <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
      
      {/* Mobile Dropdown */}
      <div className="sm:hidden w-full">
        <select
          value={activesubject_name}
          onChange={(e) => onsubject_nameChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white"
        >
          <option value="" disabled>Select Subject</option>
          {uniquesubject_names.map((subject_name) => (
            <option key={subject_name} value={subject_name}>
              {subject_name}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:flex flex-wrap gap-4">
        {uniquesubject_names.map((subject_name) => (
          <button
            key={subject_name}
            className={`tab-button flex items-center justify-center px-6 py-3 rounded-lg transition-all hover:cursor-pointer hover:bg-black hover:text-white ${
              subject_name === activesubject_name
                ? "bg-black text-white"
                : "bg-white text-gray-700 shadow-sm"
            }`}
            onClick={() => onsubject_nameChange(subject_name)}
          >
            {subject_name}
          </button>
        ))}
      </div>

      {/* Practice Mode Button */}
      <div className="w-full sm:w-auto">
        <button
          className="tab-button w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-lg transition-all border border-gray-300 hover:cursor-pointer hover:bg-black hover:text-white bg-white text-gray-700 shadow-sm"
          onClick={onPracticeMode}
        >
          Practice-Mode
        </button>
      </div>
    </div>
  );
};
