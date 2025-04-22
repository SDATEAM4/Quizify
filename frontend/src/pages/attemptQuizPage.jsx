import { useState, useEffect } from "react";
import { SubjectTabs } from "../components/subjectTabs";
import { QuizCard } from "../components/quizCard";
import { Footer } from "../components/footer";
import { NavBar } from "../components/navbar";
import {QuizDialog} from "../components/practiceQuizDialog"; 

export const AttemptQuizPage = () => {
  const quizData = [
    {
      id: 1,
      subject: "Mathematics",
      title: "Advanced Calculus",
      description: "Test your knowledge of derivatives, integrals, and limits",
      duration: 30, // minutes
      questionCount: 10,
      difficulty: "Advanced",
      image: "/images/math-calculus-background.jpg",
      icon: "calculator", // For the subject icon
    },
    {
      id: 2,
      subject: "Mathematics",
      title: "Linear Algebra Fundamentals",
      description: "Master matrices, vectors, and linear transformations",
      duration: 25, // minutes
      questionCount: 8,
      difficulty: "Intermediate",
      image: "/images/linear-algebra-background.jpg",
      icon: "calculator",
    },
    {
      id: 3,
      subject: "Mathematics",
      title: "Probability & Statistics",
      description: "Explore statistical concepts and probability theory",
      duration: 35, // minutes
      questionCount: 12,
      difficulty: "Advanced",
      image: "/images/probability-stats-background.jpg",
      icon: "calculator",
    },
    {
      id: 4,
      subject: "Physics",
      title: "Classical Mechanics",
      description: "Understand Newton's laws and mechanical systems",
      duration: 40, // minutes
      questionCount: 15,
      difficulty: "Intermediate",
      image: "/images/physics-mechanics-background.jpg",
      icon: "settings",
    },
    {
      id: 5,
      subject: "Physics",
      title: "Electromagnetism",
      description: "Study electric and magnetic fields and their interactions",
      duration: 45, // minutes
      questionCount: 18,
      difficulty: "Advanced",
      image: "/images/physics-em-background.jpg",
      icon: "settings",
    },
    {
      id: 6,
      subject: "Chemistry",
      title: "Organic Chemistry",
      description: "Learn about carbon compounds and their reactions",
      duration: 35, // minutes
      questionCount: 14,
      difficulty: "Advanced",
      image: "/images/organic-chemistry-background.jpg",
      icon: "flask",
    },
    {
      id: 7,
      subject: "Chemistry",
      title: "Periodic Table Elements",
      description: "Explore properties and patterns of chemical elements",
      duration: 20, // minutes
      questionCount: 10,
      difficulty: "Beginner",
      image: "/images/periodic-table-background.jpg",
      icon: "flask",
    },
    {
      id: 8,
      subject: "Biology",
      title: "Cell Biology",
      description: "Discover the fundamental unit of all living organisms",
      duration: 30, // minutes
      questionCount: 12,
      difficulty: "Intermediate",
      image: "/images/cell-biology-background.jpg",
      icon: "dna",
    },
    {
      id: 9,
      subject: "Biology",
      title: "Human Anatomy",
      description: "Study the structure and systems of the human body",
      duration: 50, // minutes
      questionCount: 20,
      difficulty: "Advanced",
      image: "/images/human-anatomy-background.jpg",
      icon: "dna",
    },
  ];

  const [activePage, setActivePage] = useState("attemptQuiz");
  const [activeSubject, setActiveSubject] = useState("");

  useEffect(() => {
    const uniqueSubjects = [...new Set(quizData.map((q) => q.subject))];
    if (uniqueSubjects.length) {
      setActiveSubject(uniqueSubjects[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      {activePage === "attemptQuiz" ? (
        <div className="container mx-auto px-4 py-8">
          <SubjectTabs
            data={quizData}
            activeSubject={activeSubject}
            onSubjectChange={setActiveSubject}
            onPracticeMode={() => setActivePage("practiceMode")}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuizCard data={quizData} subject={activeSubject} />
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <QuizDialog quizData={quizData} setPage={() => setActivePage("attemptQuiz")} />
        </div>
      )}
      <Footer />
    </div>
  );
};

