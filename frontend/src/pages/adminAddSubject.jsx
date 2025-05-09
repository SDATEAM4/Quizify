import { useState, useEffect } from "react";
import { FaSave, FaTimesCircle, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { AdminNavBar } from "../components/adminNavbar";
import BackgroundTypography from "../components/backgroundTypography";
import toast from "react-hot-toast";
const AddSubjectPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // For add/edit form
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [subjectData, setSubjectData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch all subjects when component mounts
  useEffect(() => {
    document.title = 'Quizify - Teacher Add Subject'
    fetchSubjects();
  }, []);

  // Fetch all subjects from API
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/Quizify/admin/subjects");
      setSubjects(response.data);
      toast.success("Subjects fetched successfully")
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setError("Failed to load subjects. Please try again.");
      toast.error("Failed to fetch subjects")
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectData({
      ...subjectData,
      [name]: value,
    });
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!subjectData.name.trim()) {
      setMessage({ type: "error", text: "Subject name is required" });
      toast.error("Please provide all fields")
      return;
    }
    
    // Check if name contains only letters (allowing spaces too, if needed)
    const nameRegex = /^[A-Za-z\s]+$/;
    
    if (!nameRegex.test(subjectData.name)) {
      setMessage({ type: "error", text: "Subject name must contain only letters" });
      toast.error("Subject name must contain only letters")
    return;
  }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("name", subjectData.name);
      formData.append("description", subjectData.description || "");
      // Add empty file field for image
      formData.append("subjectImage", new Blob([''], { type: 'application/octet-stream' }), '');
      
      let response;
      
      if (formMode === "add") {
        // Add new subject
        response = await axios.post(
          "http://localhost:8080/Quizify/admin/subjects",
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success("Subjects added successfully")
        setMessage({
          type: "success",
          text: "Subject added successfully!",
        });
      } else {
        // Update existing subject
        response = await axios.put(
          `http://localhost:8080/Quizify/admin/subjects/${editingSubjectId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success("Subjects updated successfully")
        setMessage({
          type: "success",
          text: "Subject updated successfully!",
        });
      }
      
      // Reset form and refresh subject list
      resetForm();
      fetchSubjects();
      
    } catch (error) {
      console.error("Error saving subject:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to save subject. Please try again.",
      });
      toast.error("Failed to save subjects")
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete subject
  const handleDelete = async (subjectId) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:8080/Quizify/admin/subjects/${subjectId}`);
      toast.success("Subjects deleted successfully")
      
      // Refresh the subject list
      fetchSubjects();
      setMessage({
        type: "success",
        text: "Subject deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting subject:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to delete subject. Please try again.",
      });
      toast.error("Failed to delete subjects")
    }
  };
  
  // Handle edit subject (prep form for editing)
  const handleEdit = (subject) => {
    setFormMode("edit");
    setEditingSubjectId(subject.subject_id);
    setSubjectData({
      name: subject.name,
      description: subject.description || "",
    });
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset form to add mode
  const resetForm = () => {
    setFormMode("add");
    setEditingSubjectId(null);
    setSubjectData({ name: "", description: "" });
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavBar />
      <BackgroundTypography />
  
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {formMode === "add" ? "Add New Subject" : "Edit Subject"}
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              {formMode === "add"
                ? "Create a new subject for quizzes and assignments"
                : "Update existing subject information"}
            </p>
          </div>
  
          {/* Message display */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg text-sm sm:text-base ${
                message.type === "error"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message.text}
            </div>
          )}
  
          {/* Add/Edit Subject Form */}
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
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              ></textarea>
            </div>
  
            {/* Form Actions */}
            <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="p-2 flex items-center justify-center rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 text-sm sm:text-base"
                disabled={isSubmitting}
              >
                <FaTimesCircle className="mr-2" /> {formMode === "edit" ? "Cancel" : "Reset"}
              </button>
              <button
                type="submit"
                className={`p-2 flex items-center justify-center rounded-lg text-sm sm:text-base ${
                  formMode === "add"
                    ? "bg-green-50 text-green-700 hover:bg-green-100"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    {formMode === "add" ? (
                      <>
                        <FaPlus className="mr-2" /> Add Subject
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" /> Update Subject
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
  
        {/* Subject List Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Manage Subjects</h2>
  
          {loading ? (
            <div className="text-center py-8">Loading subjects...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left border-b">ID</th>
                    <th className="py-3 px-4 text-left border-b">Name</th>
                    <th className="py-3 px-4 text-left border-b">Description</th>
                    <th className="py-3 px-4 text-center border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-gray-500">
                        No subjects found. Add your first subject above.
                      </td>
                    </tr>
                  ) : (
                    subjects.map((subject) => (
                      <tr key={subject.subject_id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border-b">{subject.subject_id}</td>
                        <td className="py-3 px-4 border-b">{subject.name}</td>
                        <td className="py-3 px-4 border-b">{subject.description || "-"}</td>
                        <td className="py-3 px-4 border-b text-center">
                          <div className="flex justify-center flex-wrap gap-2">
                            <button
                              onClick={() => handleEdit(subject)}
                              className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(subject.subject_id)}
                              className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default AddSubjectPage;