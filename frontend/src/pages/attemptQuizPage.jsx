import { useState, useEffect } from "react";
import { SubjectTabs } from "../components/subjectTabs";
import { QuizCard } from "../components/quizCard";
import { Footer } from "../components/footer";
import { NavBar } from "../components/navbar";
import {QuizDialog} from "../components/practiceQuizDialog"; 
//import{authContext} from "../context/authContext";

export const AttemptQuizPage = () => {
  //const {uId} = authContext();// get uid then get reponse as response from DB
  const response = [
    {
      quiz_id: 1,
      subject_id: 1,
      subject_name: "Mathematics",
      title: "Advanced Calculus",
      description: "Test your knowledge of derivatives, integrals, and limits",
      timelimit: 30, // minutes
      questions: 10,
      level: 1,
      user_id: 9,
      attemptedQuiz: false,
      username: "meowwww",
      marks: 40,
      type: "Automatic",
      student_id: 2

    },
    {
      quiz_id: 2,
      subject_id: 1,
      subject_name: "Mathematics",
      title: "Linear Algebra Fundamentals",
      description: "Master matrices, vectors, and linear transformations",
      timelimit: 25, // minutes
      questions: 8,
      level: 2,
      user_id: 9,
      attemptedQuiz: false,
      username: "meowwww",
      marks: 40,
      type: "Automatic",
      student_id: 2
   
    },
    {
      quiz_id: 3,
      subject_id: 1,
      subject_name: "Mathematics",
      title: "Probability & Statistics",
      description: "Explore statistical concepts and probability theory",
      timelimit: 35, // minutes
      questions: 12,
      level: 3,
      user_id: 9,
      attemptedQuiz: false,
      username: "meowwww",
      marks: 40,
      type: "Automatic",
      student_id: 2
    },
    {
      quiz_id: 4,
      subject_id: 1,
      subject_name: "Physics",
      title: "Classical Mechanics",
      description: "Understand Newton's laws and mechanical systems",
      timelimit: 40, // minutes
      questions: 15,
      level: "Intermediate",
      user_id: 9,
      attemptedQuiz: false,
      username: "meowwww",
      marks: 40,
      type: "Automatic",
      student_id: 2
     
    },
    {
      quiz_id: 5,
      subject_id: 1,
      subject_name: "Physics",
      title: "Electromagnetism",
      description: "Study electric and magnetic fields and their interactions",
      timelimit: 45, // minutes
      questions: 18,
      level: "Advanced",
      user_id: 9,
      attemptedQuiz: false,
      username: "meowwww",
      marks: 40,
      type: "Automatic",
      student_id: 2
     
    },
    {
      quiz_id: 6,
      subject_id: 1,
      subject_name: "Chemistry",
      title: "Organic Chemistry",
      description: "Learn about carbon compounds and their reactions",
      timelimit: 35, // minutes
      questions: 14,
      level: "Advanced",
      user_id: 9,
      attemptedQuiz: false,
      username: "meowwww",
      marks: 40,
      type: "Automatic",
      student_id: 2
      
    },
    {
      quiz_id: 7,
      subject_id: 1,
      subject_name: "Chemistry",
      title: "Periodic Table Elements",
      description: "Explore properties and patterns of chemical elements",
      timelimit: 20, // minutes
      questions: 10,
      level: "Beginner",
      user_id: 9,
      attemptedQuiz: false,
      username: "meowwww",
      marks: 40,
      type: "Automatic",
      student_id: 2
     
    },
    {
      quiz_id: 8,
      subject_id: 1,
      subject_name: "Biology",
      title: "Cell Biology",
      description: "Discover the fundamental unit of all living organisms",
      timelimit: 30, // minutes
      questions: 12,
      level: "Intermediate",
      user_id: 9,
      attemptedQuiz: false,
      username: "meowwww",
      marks: 40,
      type: "Automatic",
      student_id: 2
   
    },
    {
      quiz_id: 9,
      subject_id: 1,
      subject_name: "Biology",
      title: "Human Anatomy",
      description: "Study the structure and systems of the human body",
      timelimit: 50, // minutes
      questions: 20,
      level: "Advanced",
      user_id: 9,
      attemptedQuiz: false,
      username: "meowwww",
      marks: 40,
      type: "Automatic",
      student_id: 2
  
    },
  ];

  const [activePage, setActivePage] = useState("attemptQuiz");
  const [activesubject_name, setActivesubject_name] = useState("");

  useEffect(() => {
    const uniquesubject_names = [...new Set(response.map((q) => q.subject_name))];
    if (uniquesubject_names.length) {
      setActivesubject_name(uniquesubject_names[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      {activePage === "attemptQuiz" ? (
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

