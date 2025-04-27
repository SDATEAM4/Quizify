import { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, MessageSquare, BarChart2, RefreshCw } from 'lucide-react';
import { TeacherNavbar } from '../components/teacherNavbar';
import { QuizEditView } from '../components/TeacherEditQuiz';
export const TeacherEditQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('totalMarks');
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Simulate API call to fetch quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data - in a real app, you'd fetch this from your API
        const mockQuizzes = [
          {
            id: 1,
            title: "Mathematics Quiz: Algebra",
            category: "Mathematics",
            questions: 10,
            totalMarks: 50,
            timeInMinutes: 45
          },
          {
            id: 2,
            title: "Science Quiz: Physics Basics",
            category: "Science",
            questions: 15,
            totalMarks: 75,
            timeInMinutes: 60
          },
          {
            id: 3,
            title: "History Quiz: World War II",
            category: "History",
            questions: 20,
            totalMarks: 100,
            timeInMinutes: 90
          },
          {
            id: 4,
            title: "English Quiz: Literary Analysis",
            category: "English",
            questions: 12,
            totalMarks: 60,
            timeInMinutes: 75
          }
        ];
        
        setQuizzes(mockQuizzes);
        setFilteredQuizzes(mockQuizzes);
        document.title = 'Quizify - Teacher Edit Quiz'
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError("Failed to load quizzes. Please try again.");
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

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

  const handleDeleteQuiz = async (id) => {
    try {
      // Simulate API call to delete quiz
      await new Promise(resolve => setTimeout(resolve, 500));
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
    } catch (error) {
      console.error("Error deleting quiz:", error);
      setError("Failed to delete quiz. Please try again.");
    }
  };

  const handleEditQuiz = (id) => {
    setSelectedQuizId(id);
  };

  const handleBackToList = () => {
    setSelectedQuizId(null);
  };

  // If a quiz is selected for editing, show the QuizEditView
  if (selectedQuizId !== null) {
    return (
      <div className="min-w-screen max-h-screen">
        <TeacherNavbar />
        <QuizEditView quizId={selectedQuizId} onBack={handleBackToList} />
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

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <p>{error}</p>
            </div>
          )}

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
                          className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          onClick={() => handleDeleteQuiz(quiz.id)}
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
    </div>
  );
};