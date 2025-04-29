import { useState, useEffect } from "react";
import { SubjectTabs } from "../components/subjectTabs";
import { QuizCard } from "../components/quizCard";
import { Footer } from "../components/footer";
import { NavBar } from "../components/navbar";
import { QuizDialog } from "../components/practiceQuizDialog";
import { useAuth } from '../context/authContext';

export const AttemptQuizPage = () => {

  const { user, studentId } = useAuth();
  console.log("Student ID:", studentId);
  const [DATA, setDATA] = useState([]);
  const [response, setResponse] = useState([]);
  const [activePage, setActivePage] = useState("attemptQuiz");
  const [activesubject_name, setActivesubject_name] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/Quizify/quizzes/student/${studentId}`);
        const json = await res.json();
        setDATA(json);

        const filtered = json.filter((quiz) => quiz.attemptedQuiz === false);
        setResponse(filtered);

        const uniquesubject_names = [...new Set(filtered.map((q) => q.subject_name))];
        if (uniquesubject_names.length) {
          setActivesubject_name(uniquesubject_names[0]);
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        alert("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    document.title = 'Quizify - Attempt Quiz';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 backdrop-blur-sm z-50">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <h1 className="text-9xl font-bold text-white">Quizify</h1>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-6 relative z-10">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
              <h2 className="text-2xl font-bold text-gray-800">Loading Quizzes...</h2>
            </div>
          </div>
        )}

        {!loading && response.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center w-full">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">No Quizzes Available</h2>
            <p className="text-lg text-gray-600 mb-6">
              There are currently no quizzes for you to attempt. Please check back later!
            </p>
          </div>
        ) : (
          activePage === "attemptQuiz" ? (
            <div className="container mx-auto px-4 py-8">
              <SubjectTabs
                data={response}
                activesubject_name={activesubject_name}
                onsubject_nameChange={setActivesubject_name}
                onPracticeMode={() => setActivePage("practiceMode")}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuizCard data={response} subject_name={activesubject_name} />
              </div>
            </div>
          ) : (
            <div className="container mx-auto px-4 py-8">
              <QuizDialog quizData={response} setPage={() => setActivePage("attemptQuiz")} />
            </div>
          )
        )}
      </main>

      <Footer />
    </div>
  );
};
