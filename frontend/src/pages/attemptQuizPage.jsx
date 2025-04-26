import { useState, useEffect } from "react";
import { SubjectTabs } from "../components/subjectTabs";
import { QuizCard } from "../components/quizCard";
import { Footer } from "../components/footer";
import { NavBar } from "../components/navbar";
import { QuizDialog } from "../components/practiceQuizDialog";
// import { authContext } from "../context/authContext";

export const AttemptQuizPage = () => {
  // const { uId } = authContext(); // get uid then get reponse as response from DB

  const [DATA, setDATA] = useState([]);
  const [response, setResponse] = useState([]);
  const [activePage, setActivePage] = useState("attemptQuiz");
  const [activesubject_name, setActivesubject_name] = useState("");
  const [loading, setLoading] = useState(false); // added loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // start loading
        const res = await fetch("http://localhost:8080/Quizify/quizzes/student/1");
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
        alert("Failed to load quizzes. Please try again."); // Optional
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-xl font-semibold">Loading...</div>
        </div>
      ) : activePage === "attemptQuiz" ? (
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
      )}
      <Footer />
    </div>
  );
};
