import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export const SelectCourses = ({ selectedCourses, setSelectedCourses, label, availableCourses}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Add a course to selected courses
  const addCourse = (course) => {
    // Check if course is already selected
    if (!selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses([...selectedCourses, course]);
    }
    setSearchTerm("");
  };

  // Remove a course from selected courses
  const removeCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter(course => course.id !== courseId));
  };

  // Filter courses based on search term
  const filteredCourses = availableCourses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedCourses.find(c => c.id === course.id)
  );

  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label || "Select Courses"}
      </label>
      
      {/* Search Input */}
      <div className="relative mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search courses..."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        
        {/* Dropdown results */}
        {searchTerm && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <div
                  key={`course-${course.id}`}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => addCourse(course)}
                >
                  {course.name}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">No courses found</div>
            )}
          </div>
        )}
      </div>
      
      {/* Selected courses */}
      <div className="flex flex-wrap gap-2">
        {selectedCourses.map(course => (
          <div 
            key={`selected-${course.id}`}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
          >
            <span>{course.name}</span>
            <button 
              type="button"
              onClick={() => removeCourse(course.id)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <FaTimes size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};