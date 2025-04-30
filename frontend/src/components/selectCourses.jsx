import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export const SelectCourses = ({ selectedCourses, setSelectedCourses, label }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8080/Quizify/admin/subjects");
        const data = await response.json();
        const filteredData = data.map(course => ({
          subject_id: course.subject_id,
          name: course.name
        }));
        setAvailableCourses(filteredData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const addCourse = (course) => {
    if (!selectedCourses.find(c => c.id === course.subject_id)) {
      setSelectedCourses([...selectedCourses, { id: course.subject_id, name: course.name }]);
    }
    setSearchTerm("");
  };

  const removeCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter(course => course.id !== courseId));
  };

  const filteredCourses = availableCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedCourses.find(c => c.id === course.subject_id)
  );

  return (
    <div className="mb-6 bg-gray-50 p-4 w-full rounded-lg shadow-md">
      <p className="text-sm text-gray-500 mb-2">Subjects</p>
      <label className="block text-gray-500 text-sm mb-2">
        {label || "Select Courses"}
      </label>

      {/* Search Input */}
      <div className="relative mb-3 w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search courses..."
          className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        {/* Dropdown results */}
        {searchTerm && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <div
                  key={`course-${course.subject_id}`}
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
      <div className="flex flex-wrap gap-2 overflow-x-auto">
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
