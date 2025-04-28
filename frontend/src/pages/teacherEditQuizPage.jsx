import { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, MessageSquare, BarChart2, RefreshCw } from 'lucide-react';
import { TeacherNavbar } from '../components/teacherNavbar';
import { QuizEditView } from '../components/TeacherEditQuiz';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';

export const TeacherEditQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('totalMarks');
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const { teacherId } = useAuth(); // Get teacherId from AuthContext

  // Fetch quizzes from API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/Quizify/quizzes/teacher/${teacherId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }
        
        const data = await response.json();
        
        // Transform the API data to match our component's structure
        const formattedQuizzes = data.map(quiz => ({
          id: quiz.quiz_id,
          title: quiz.title,
          category: quiz.subject_name,
          questions: quiz.questions.length,
          totalMarks: quiz.marks,
          timeInMinutes: quiz.timelimit,
          level: quiz.level,
          description: quiz.description,
          subjectId: quiz.subject_id,
          questionsList: quiz.questions
        }));
        
        setQuizzes(formattedQuizzes);
        setFilteredQuizzes(formattedQuizzes);
        document.title = 'Quizify - Teacher Edit Quiz';
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        toast.error("Failed to load quizzes. Please try again.");
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchQuizzes();
    }
  }, [teacherId]);

  // Filter and sort quizzes
  useEffect(() => {
    let result = [...quizzes];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(quiz => 
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        quiz.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'totalMarks':
          return b.totalMarks - a.totalMarks;
        case 'questions':
          return b.questions - a.questions;
        case 'timeInMinutes':
          return b.timeInMinutes - a.timeInMinutes;
        default:
          return 0;
      }
    });
    
    setFilteredQuizzes(result);
  }, [quizzes, searchQuery, sortOption]);

  const initiateDeleteQuiz = (id) => {
    setQuizToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/Quizify/quizzes/${quizToDelete}/delete/${teacherId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete quiz');
      }
      toast.success("Quiz deleted successfully");
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizToDelete));
      setShowDeleteConfirm(false);
      setQuizToDelete(null);
      setLoading(false);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Could not delete quiz. Please try again.");
      setShowDeleteConfirm(false);
      setQuizToDelete(null);
      setLoading(false);
    }
  };

  const handleEditQuiz = (id) => {
    setSelectedQuizId(id);
  };

  const handleBackToList = () => {
    setSelectedQuizId(null);
    // Refresh the quiz list after editing
    if (teacherId) {
      fetchQuizzes();
    }
  };

  // Function to fetch quizzes (for refreshing after edit)
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/Quizify/quizzes/teacher/${teacherId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }
      
      const data = await response.json();
      
      // Transform the API data
      const formattedQuizzes = data.map(quiz => ({
        id: quiz.quiz_id,
        title: quiz.title,
        category: quiz.subject_name,
        questions: quiz.questions.length,
        totalMarks: quiz.marks,
        timeInMinutes: quiz.timelimit,
        level: quiz.level,
        description: quiz.description,
        subjectId: quiz.subject_id,
        questionsList: quiz.questions
      }));
      
      setQuizzes(formattedQuizzes);
      setFilteredQuizzes(formattedQuizzes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to load quizzes. Please try again.");
      setLoading(false);
    }
  };

  // Delete confirmation dialog
const DeleteConfirmation = () => {
  if (!showDeleteConfirm) return null;
  
  const selectedQuiz = quizzes.find(quiz => quiz.id === quizToDelete);
  
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="mb-6">Are you sure you want to delete "{selectedQuiz?.title}"? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            onClick={() => {
              setShowDeleteConfirm(false);
              setQuizToDelete(null);
            }}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={handleDeleteQuiz}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

  // If a quiz is selected for editing, show the QuizEditView
  if (selectedQuizId !== null) {
    const selectedQuiz = quizzes.find(quiz => quiz.id === selectedQuizId);
    return (
      <div className="min-w-screen max-h-screen">
        <TeacherNavbar />
        <QuizEditView quiz={selectedQuiz} teacherId={teacherId} onBack={handleBackToList} />
      </div>
    );
  }

  return (
    <div className="min-w-screen max-h-screen">
      <TeacherNavbar />
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="p-6 bg-gray-50 min-w-7/12 w-3/4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit Quizzes</h1>
            <p className="text-gray-600">Select a quiz to edit or modify its settings</p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="relative w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search quizzes..."
                className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">Sort by:</span>
              <select 
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="totalMarks">Total Marks</option>
                <option value="questions">Number of Questions</option>
                <option value="timeInMinutes">Time (minutes)</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-12">
              <RefreshCw size={32} className="animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuizzes.length > 0 ? (
                filteredQuizzes.map(quiz => (
                  <div key={quiz.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">{quiz.title}</h2>
                        <div className="flex items-center mt-2 text-sm text-gray-600 space-x-6">
                          <span className="bg-gray-100 px-2 py-1 rounded">{quiz.category}</span>
                          <span>{quiz.questions} questions</span>
                          <span>{quiz.totalMarks} marks</span>
                          <span>{quiz.timeInMinutes} minutes</span>
                          <span>{quiz.level} level</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                          onClick={() => handleEditQuiz(quiz.id)}
                        >
                          <Edit2 size={16} className="mr-1" />
                          Edit
                        </button>
                        <button
                          className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                          onClick={() => initiateDeleteQuiz(quiz.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                  <p className="text-gray-500">No quizzes found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <DeleteConfirmation />
    </div>
  );
};