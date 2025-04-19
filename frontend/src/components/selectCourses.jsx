import React from 'react';

export const SelectCourses = ({
  selectedCourses,
  setSelectedCourses,
  label = "Select Courses",
  availableCourses = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'History', 'Geography', 'Literature', 'Computer Science',
    'Art', 'Music', 'Physical Education', 'Economics'
  ]
}) => {
  const toggleCourse = (course) => {
    if (selectedCourses.includes(course)) {
      setSelectedCourses(selectedCourses.filter(item => item !== course));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {availableCourses.map((course) => (
          <div key={course} className="flex items-center">
            <input
              type="checkbox"
              id={`course-${course}`}
              checked={selectedCourses.includes(course)}
              onChange={() => toggleCourse(course)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
            />
            <label htmlFor={`course-${course}`} className="text-gray-700">
              {course}
            </label>
          </div>
        ))}
      </div>
      {/* Selected Courses Tags */}
      {selectedCourses.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Selected courses:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCourses.map((course) => (
              <span key={`tag-${course}`} className="bg-blue-100 text-blue-800 text-sm py-1 px-3 rounded-full flex items-center">
                {course}
                <button
                  type="button"
                  onClick={() => toggleCourse(course)}
                  className="ml-2 text-blue-800 hover:text-blue-900 focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};