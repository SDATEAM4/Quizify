// Same import section as your original code...
import { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { TeacherNavbar } from '../components/teacherNavbar';
import { QuizEditView } from '../components/TeacherEditQuiz';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';
import { Footer } from '../components/footer';

export const TeacherEditQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('totalMarks');
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const { teacherId } = useAuth();

  useEffect(() => {
    if (teacherId) {
      fetchQuizzes();
    }
  }, [teacherId]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/Quizify/quizzes/teacher/${teacherId}`);
      if (!response.ok) throw new Error('Failed to fetch quizzes');
      const data = await response.json();
      const formatted = data.map(quiz => ({
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
      setQuizzes(formatted);
      setFilteredQuizzes(formatted);
      document.title = 'Quizify - Teacher Edit Quiz';
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load quizzes.");
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...quizzes];
    if (searchQuery) {
      result = result.filter(quiz =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    result.sort((a, b) => {
      switch (sortOption) {
        case 'totalMarks': return b.totalMarks - a.totalMarks;
        case 'questions': return b.questions - a.questions;
        case 'timeInMinutes': return b.timeInMinutes - a.timeInMinutes;
        default: return 0;
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
      const res = await fetch(`http://localhost:8080/Quizify/quizzes/${quizToDelete}/delete/${teacherId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete quiz');
      toast.success("Quiz deleted successfully");
      setQuizzes(prev => prev.filter(q => q.id !== quizToDelete));
      setShowDeleteConfirm(false);
      setQuizToDelete(null);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Could not delete quiz.");
      setShowDeleteConfirm(false);
      setQuizToDelete(null);
      setLoading(false);
    }
  };

  const handleEditQuiz = (id) => setSelectedQuizId(id);
  const handleBackToList = () => {
    setSelectedQuizId(null);
    if (teacherId) fetchQuizzes();
  };

  const DeleteConfirmation = () => {
    if (!showDeleteConfirm) return null;
    const quiz = quizzes.find(q => q.id === quizToDelete);
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
          <p className="mb-6">Are you sure you want to delete "{quiz?.title}"?</p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              onClick={() => {
                setShowDeleteConfirm(false);
                setQuizToDelete(null);
              }}
            >Cancel</button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={handleDeleteQuiz}
            >Delete</button>
          </div>
        </div>
      </div>
    );
  };

  if (selectedQuizId !== null) {
    const selected = quizzes.find(q => q.id === selectedQuizId);
    return (
      <div className="min-w-screen max-h-screen">
        <TeacherNavbar />
        <QuizEditView quiz={selected} teacherId={teacherId} onBack={handleBackToList} />
      </div>
    );
  }

  return (
    <div className="min-w-screen max-h-screen">
      <TeacherNavbar />
      <div className="flex flex-col items-center justify-start py-6 px-4 md:px-0 min-h-screen">
        <div className="bg-gray-50 w-full md:w-3/4 xl:w-2/3 p-6 rounded-lg">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit Quizzes</h1>
            <p className="text-gray-600">Select a quiz to edit or modify its settings</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="relative w-full md:w-1/2">
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
              <span className="mr-2 text-gray-700 whitespace-nowrap">Sort by:</span>
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
                  <div key={quiz.id} className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">{quiz.title}</h2>
                        <div className="flex flex-wrap items-center mt-2 text-sm text-gray-600 gap-2">
                          <span className="bg-gray-100 px-2 py-1 rounded">{quiz.category}</span>
                          <span>{quiz.questions} questions</span>
                          <span>{quiz.totalMarks} marks</span>
                          <span>{Math.round(quiz.timeInMinutes / 60)} minutes</span>
                          <span>{quiz.level} level</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className="p-2 bg-white text-black border hover:cursor-pointer border-black rounded-md hover:bg-black hover:text-white flex items-center"
                          onClick={() => handleEditQuiz(quiz.id)}
                        >

                          <Edit2 size={16} className="mr-1" />
                          Edit
                        </button>
                        <button
                          className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center hover:cursor-pointer"
                          onClick={() => initiateDeleteQuiz(quiz.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
                  <p className="text-gray-500">No quizzes found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <DeleteConfirmation />
      <Footer />
    </div>
  );
};
