import { useState } from "react";
import { FaSave, FaTimesCircle, FaPlus } from "react-icons/fa";
import axios from "axios";
import { AdminNavBar } from "../components/adminNavbar";

const AddSubjectPage = () => {
  const [subjectData, setSubjectData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectData({
      ...subjectData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!subjectData.name.trim()) {
      setMessage({ type: "error", text: "Subject name is required" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      // Create FormData object to match the expected format
      const formData = new FormData();
      formData.append("name", subjectData.name);
      formData.append("description", subjectData.description);
      // Add an empty file field to satisfy the API but not actually send an image
      formData.append("subjectImage", new Blob([''], { type: 'application/octet-stream' }), '');
      
      console.log("Sending data:", Object.fromEntries(formData));
      
      const response = await axios.post(
        "http://localhost:8080/Quizify/admin/subjects",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessage({
        type: "success",
        text: "Subject added successfully!",
      });
      
      // Reset form
      setSubjectData({ name: "", description: "" });
      
    } catch (error) {
      console.error("Error adding subject:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to add subject. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setSubjectData({ name: "", description: "" });
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="min-w-screen min-h-screen">
      <AdminNavBar/>
    
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="container mx-auto px-4 py-8 max-w-1/3 shadow-md rounded-md">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Add New Subject</h1>
            <p className="text-gray-600 mt-2">
              Create a new subject for quizzes and assignments
            </p>
          </div>

          {/* Message display */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "error"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Add Subject Form */}
          <div className="bg-white">
            <form onSubmit={handleSubmit}>
              {/* Subject Name */}
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={subjectData.name}
                  onChange={handleInputChange}
                  placeholder="Enter subject name"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Subject Description */}
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={subjectData.description}
                  onChange={handleInputChange}
                  placeholder="Enter subject description"
                  rows="4"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Form Actions */}
              <div className="mt-6 pt-4 border-t flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="cursor-pointer p-2 flex items-center relative group shadow-sm rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100"
                  disabled={isSubmitting}
                >
                  <FaTimesCircle className="mr-2" /> Reset
                  <span className="bg-gray-700 hover-underline-animation"></span>
                </button>
                <button
                  type="submit"
                  className="cursor-pointer p-2 flex items-center relative group shadow-sm rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <FaPlus className="mr-2" /> Add Subject
                      <span className="bg-green-700 hover-underline-animation"></span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubjectPage;